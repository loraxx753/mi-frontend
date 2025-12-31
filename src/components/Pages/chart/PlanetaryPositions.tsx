import React from 'react';
import { Reading } from '@/lib/types/astrology';
import { bodySymbols, signEmojis } from '@/lib/data/constants';
import { convertToZodiac } from '@/lib/services/calculate/astrology';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ThirdParty/ShadCn/Card/component';
import { ordinal } from '@/lib/utils';

const PlanetaryPositions: React.FC<{ reading: Reading }> = ({ reading }) => {

    return (
        <div className='grid md:grid-cols-4 gap-4 mb-8 text-sm text-purple-700 space-y-1'>
        {reading.positions.map((planet) => {
            const sign = convertToZodiac(planet.sign);
            const planetSymbol = bodySymbols[planet.name] || '';
            const signEmoji = signEmojis[sign.sign] || '';
            return (
            <Card key={planet.name} className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                <CardHeader className="pb-2 pt-1 text-center">
                    <CardTitle className="text-lg text-purple-800" title={planet.name}>{planetSymbol} {planet.name}</CardTitle>
                </CardHeader>
                <CardContent className='text-center'>
                    <p className="text-lg" title={sign.sign}>{signEmoji} {sign.sign}</p>
                    <p>{sign.degree}° {sign.minutes}' {sign.seconds}</p>
                </CardContent>
                <CardFooter className='p-0 justify-center text-center font-thin text-lg'>
                    {ordinal(planet.house)} House
                </CardFooter>
            </Card>
            );
        })}
        </div>
    );
};

export default PlanetaryPositions;