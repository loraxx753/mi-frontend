import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { ChartFormData, chartFormSchema } from '@/lib/schemas/chart';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ThirdParty/ShadCn/Card';
import { StarIcon } from 'lucide-react';

import { PageComponentType } from '@/lib/types';
import useCelestialPositions from '@/lib/hooks/useCelestialPositions';
import { useReverseGeocode } from '@/lib/hooks/useReverseGeocode';
import { useLatLongFromLocation } from '@/lib/hooks/useLatLongFromLocation';
import { toDMS } from '@/lib/services/calculate/astrology';

import { DateTime } from 'luxon';
import QRCode from './ChartQRCode';
import PlanetaryPositions from './PlanetaryPositions';
import HousePlacements from './HousePlacements';
import AspectPatterns from './AspectPatterns';
import Angles from './Angles';

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ThirdParty/ShadCn/Collapsible";



// import NatalChart, { type NatalChartData } from './NatalChart';

function parseQuery(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

function queryToChartFormData(query: Record<string, string>): ChartFormData | null {
  const data: Partial<ChartFormData> = {};
  data.pageFormData = {
    name: query.name,
    gender: (query.gender === "" || query.gender === "male" || query.gender === "female" || query.gender === "other" || query.gender === "prefer-not-to-say") ? query.gender : undefined,
    date: query.date,
    time: query.time,
    timeKnown: query.time !== undefined && query.time !== '', // Add this line
    houseSystem: (['placidus', 'koch', 'equal', 'whole-sign', 'campanus', 'regiomontanus'].includes(query.houseSystem)
      ? query.houseSystem
      : 'placidus') as ChartFormData['pageFormData']['houseSystem'],
    notes: query.notes || undefined,
    location: {
      city: query.city || '',
      country: query.country || '',
      region: query.region || undefined,
      latitude: query.lat ? parseFloat(query.lat) : undefined,
      longitude: query.long ? parseFloat(query.long) : undefined,
      knowsCoordinates: query.lat && query.long ? true : false,
      timezone: query.timezone || undefined,
    },
  };
  try {
    return chartFormSchema.parse(data);
  } catch {
    return null;
  }
}

const ChartPage: PageComponentType = () => {
  const location = useLocation();
  const query = useMemo(() => parseQuery(location.search), [location.search]);
  const chartData = useMemo(() => queryToChartFormData(query), [query]);
  const hasCityRegionCountry = useMemo(() => Boolean(query.city && query.country), [query.city, query.country]);
  
  const shouldFetchLatLong = query.lat === undefined && query.long === undefined && hasCityRegionCountry;
  // const { latLong, loading: latLongLoading, error: latLongError } = useLatLongFromLocation(
  const { latLong } = useLatLongFromLocation(
    shouldFetchLatLong ? query.city : undefined,
    shouldFetchLatLong ? query.country : undefined,
    shouldFetchLatLong ? query.region : undefined
  );
  
  const effectiveLat = query.lat ?? latLong?.latitude;
  const effectiveLong = query.long ?? latLong?.longitude;
  
  // Prepare celestial input for API
  const lat = effectiveLat ? parseFloat(effectiveLat) : undefined;
  const long = effectiveLong ? parseFloat(effectiveLong) : undefined;
  const date = query.date || '';
  const time = query.time || '';
  const hasCelestialInput = date && time && lat !== undefined && long !== undefined;
  const celestialInput = hasCelestialInput ? {
    date,
    time,
    latitude: lat as number,
    longitude: long as number,
  } : undefined;

  const { reading, loading: celestialLoading, error: celestialError } = useCelestialPositions(celestialInput);
  const planetaryPositions = reading?.positions;
  const { location: reverseLocation } = useReverseGeocode(lat, long);

  if(!celestialLoading && !celestialError) console.log(reading);

  if (!chartData) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <StarIcon className="w-5 h-5" /> Invalid Chart Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Could not parse chart data from URL. Please check your link or try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // const { name, date: birthDate, time: birthTime, location: loc, houseSystem, notes } = chartData.pageFormData;
  const { name, date: birthDate, time: birthTime } = chartData.pageFormData;



  return (
    <div className="min-h-screen" style={{ width: '100vw' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6" style={{ margin: '0 auto' }}>
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 sm:p-6 lg:p-8 mb-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <StarIcon className="w-16 h-16 text-purple-500 animate-pulse" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-2">
              {name}
            </h1>
            {birthDate && (
              <div className="text-2xl text-gray-700 mb-1">
                {DateTime.fromISO(birthDate).toLocaleString(DateTime.DATE_FULL)}
                <span className="text-gray-500"> {DateTime.fromFormat(birthTime, 'HH:mm').toLocaleString(DateTime.TIME_SIMPLE)}</span>
              </div>
            )}
            {(reverseLocation || (query.city && query.country)) && (
              <div className="text-xl text-gray-700 mb-1">
                {reverseLocation
                  ? `${reverseLocation.city ? reverseLocation.city + ', ' : ''}${reverseLocation.state ? reverseLocation.state + ', ' : ''}${reverseLocation.country}`
                  : `${query.city}${query.region ? ', ' + query.region : ''}, ${query.country}`}
              </div>
            )}
            {effectiveLat !== undefined && effectiveLong !== undefined && (
              <div className="text-md text-gray-500 mb-2">
                {toDMS(effectiveLat as unknown as number, 'lat')} {toDMS(effectiveLong as unknown as number, 'long')}
              </div>
            )}
          </div>
          {/* 2x2 Grid for all 4 cards */}
          <div className="grid md:grid-cols-1 gap-4 mb-8">
            {/* Planetary Positions */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader className="pb-1">
                <CardTitle className="text-lg text-purple-800">Planets</CardTitle>
              </CardHeader>
              <CardContent>
                {!celestialLoading && !celestialError && (!planetaryPositions || planetaryPositions.length === 0) && (
                  <p className="text-sm text-purple-700">Initializing planetary positions...</p>
                )}
                {celestialLoading && <p className="text-sm text-purple-700">Loading planetary positions...</p>}
                {celestialError && <p className="text-sm text-red-600">Error loading positions.</p>}
                {!celestialLoading && !celestialError && reading && reading.positions.length > 0 && (
                  <PlanetaryPositions reading={reading} type="planets" />
                )}
              </CardContent>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-purple-800">Asteroids</CardTitle>
              </CardHeader>
              <CardContent>
                {!celestialLoading && !celestialError && (!planetaryPositions || planetaryPositions.length === 0) && (
                  <p className="text-sm text-purple-700">Initializing asteroid positions...</p>
                )}
                {celestialLoading && <p className="text-sm text-purple-700">Loading asteroid positions...</p>}
                {celestialError && <p className="text-sm text-red-600">Error loading positions.</p>}
                {!celestialLoading && !celestialError && reading && reading.positions.length > 0 && (
                  <PlanetaryPositions reading={reading} type="asteroids" />
                )}
              </CardContent>

            </Card>

            {/* House Placements */}
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-indigo-800">House Placements</CardTitle>
              </CardHeader>
              <CardContent>
                {celestialLoading && <p className="text-sm text-indigo-700">Loading house cusps...</p>}
                {celestialError && <p className="text-sm text-red-600">Error loading houses.</p>}
                {!celestialLoading && !celestialError && reading && reading.houses && (
                  <HousePlacements reading={reading} />
                )}
                {!celestialLoading && !celestialError && (!reading || !reading.houses) && (
                  <p className="text-sm text-indigo-700">Initializing house data...</p>
                )}
              </CardContent>
            </Card>
            {/* Angles */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-purple-800">Angles</CardTitle>
              </CardHeader>
              <CardContent>
                {celestialLoading && <p className="text-sm text-purple-700">Loading angles...</p>}
                {celestialError && <p className="text-sm text-red-600">Error loading angles.</p>}
                {!celestialLoading && !celestialError && reading && reading.angles && (
                  <Angles angles={reading.angles} />
                )}
                {!celestialLoading && !celestialError && (!reading || !reading.angles) && (
                  <p className="text-sm text-purple-700">Initializing angle data...</p>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="grid md:grid-cols-1 gap-4 mb-8">
            {/* Aspect Patterns */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-800">Aspect Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                {celestialLoading && <p className="text-sm text-blue-700">Loading aspects...</p>}
                {celestialError && <p className="text-sm text-red-600">Error loading aspects.</p>}
                {!celestialLoading && !celestialError && reading && reading.aspects && reading.aspects.length > 0 && (
                    <AspectPatterns aspects={reading.aspects} />
                )}
                {!celestialLoading && !celestialError && (!reading || !reading.aspects || reading.aspects.length === 0) && (
                  <p className="text-sm text-blue-700">Initializing aspect data...</p>
                )}
              </CardContent>
            </Card>
          </div>
          {/* QR Code for sharing this chart */}
          <div className='block text-center mb-8'>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Share this page</h2>
            <QRCode url={window.location.origin + window.location.pathname + location.search} />
          </div>
          <div className='block text-center mb-8'>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Support Shimmering Stars</h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-lime-50 border-green-200 shadow-md flex flex-col items-center p-6 w-64">
                <CardHeader className="pb-0 w-full text-center">
                  <CardTitle className="text-green-800 flex flex-col items-center p-0 m-0">
                    <object className="inline mb-2" data="venmo-logo.svg" type="image/svg+xml">
                      Venmo
                    </object>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <QRCode url="venmo://paycharge?txn=pay&recipients=Simran-Gill-11&amount=10.00&note=Thanks%20for%20the%20Shimmering%20Stars%20Reading!" />
                </CardContent>
                <CardFooter>
                  <a className='text-sm font-normal underline italic' href='https://venmo.com/code?user_id=1809702287572992420&created=1767644874' target='_blank'>
                    Visit site
                  </a>
                </CardFooter>
              </Card>
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-md flex flex-col items-center p-6 w-64">
                <CardHeader className="pb-0 w-full text-center">
                  <CardTitle className="text-blue-800 flex flex-col items-center p-0 m-0">
                      <object className="inline mb-2" data="paypal-logo.svg" type="image/svg+xml">
                        PayPal
                      </object>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <QRCode url="https://www.paypal.com/paypalme/loraxx753" />
                </CardContent>
                <CardFooter>
                  <a className='text-sm font-normal underline italic' href='https://www.paypal.com/paypalme/loraxx753' target='_blank'>
                    Visit site
                  </a>
                </CardFooter>

              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ChartPage.path = '/chart';

export default ChartPage;
