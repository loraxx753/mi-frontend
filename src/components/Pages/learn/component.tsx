import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import BirthLocationSection from '@/components/Organisms/BirthLocation';
import useCelestialPositions  from '../../../lib/hooks/useCelestialPositions';
import { PageComponentType } from '@/lib/types';
import type { BirthChartData } from '@/lib/schemas/birthChart';

const LearnPage: PageComponentType = () => {
  const methods = useForm<BirthChartData>({ mode: 'onChange' });
  const [submitted, setSubmitted] = useState(false);

  // Fetch planetary positions using the same hook as /reading
  // const bodies = [
  //   'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'
  //   // Add more as needed
  // ];
  const birthDate = methods.watch('birthDate');
  const birthTime = methods.watch('birthTime');
  const latitude = methods.watch('birthLocation.latitude');
  const longitude = methods.watch('birthLocation.longitude');
  const hasValidCoords = typeof latitude === 'number' && typeof longitude === 'number';

  const { reading: celestialPositions, loading, error } = useCelestialPositions(
    submitted && birthDate && birthTime && hasValidCoords
      ? {
          date: birthDate,
          time: birthTime,
          latitude: latitude as number,
          longitude: longitude as number,
        }
      : undefined
  );

  const handleSubmit = (data: BirthChartData) => {
    setSubmitted(true);
    return data;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Learn Astrology: Step-by-Step</h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4 bg-white p-4 rounded shadow">
          {/* Date & Time Inputs */}
          <div>
            <label className="block font-semibold">Date</label>
            <input type="date" {...methods.register('birthDate')} className="border p-2 rounded w-full" required />
          </div>
          <div>
            <label className="block font-semibold">Time</label>
            <input type="time" {...methods.register('birthTime')} className="border p-2 rounded w-full" required />
          </div>
          {/* Styled Birth Location Section */}
          <BirthLocationSection />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Start Learning</button>
        </form>
      </FormProvider>
      {loading && <div className="mt-6">Loading planetary positions...</div>}
      {error && <div className="mt-6 text-red-600">Error fetching data.</div>}
      {celestialPositions && submitted && (
        <div className="mt-8">
          {/* Step-by-step walkthrough UI will go here */}
          <h2 className="text-2xl font-bold mb-4">Step-by-Step Walkthrough</h2>
          <p className="mb-4">We will walk through the math, geometry, and symbolism for each planet and sign.</p>
          {/* Placeholder for walkthrough content */}
        </div>
      )}
    </div>
  );
};

export default LearnPage;

LearnPage.path = '/learn';
