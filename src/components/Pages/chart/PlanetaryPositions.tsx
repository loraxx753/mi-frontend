import React from 'react';
import { Reading } from '@/lib/types/astrology';
import { bodySymbols, signEmojis } from '@/lib/data/constants';
import { convertToZodiac } from '@/lib/services/calculate/astrology';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ThirdParty/ShadCn/Card/component';
import { ordinal } from '@/lib/utils';
import { bodyTypes as types } from '@/lib/utils';

const PlanetaryPositions: React.FC<{ reading: Reading, type: string }> = ({ reading, type }) => {

    return (
        <div className='grid md:grid-cols-4 gap-4 mb-8 text-sm text-purple-700 space-y-1'>
        {reading.positions.map((planet) => {
            if (!types[type as keyof typeof types].includes(planet.name)) return null;
            const sign = convertToZodiac(planet.sign);
            const planetSymbol = bodySymbols[planet.name] || '';
            const signEmoji = signEmojis[sign.sign] || '';
            return (
            <Card key={planet.name} className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
                <CardHeader className="pb-2 pt-1 text-center">
                    <CardTitle className="text-lg text-purple-800" title={planet.name}>
                        <a href={`https://masteringthezodiac.com/${planet.name.toLowerCase()}-in-astrology`} target="_blank" rel="noopener noreferrer">{planetSymbol} {planet.name}</a>
                    </CardTitle>
                </CardHeader>
                <CardContent className='text-center'>
                    <a href={`https://masteringthezodiac.com/${planet.name.toLowerCase()}-in-${sign.sign.toLowerCase()}`} target="_blank" rel="noopener noreferrer">
                        <p className="text-lg" title={sign.sign}>{signEmoji} {sign.sign}</p>
                        <p>{sign.degree}° {sign.minutes}' {sign.seconds}</p>
                    </a>
                </CardContent>
                <CardFooter className='p-0 justify-center text-center font-thin text-lg'>
                    <a href={`https://masteringthezodiac.com/${planet.name.toLowerCase()}-in-${ordinal(planet.house)}-house`} target="_blank" rel="noopener noreferrer">
                        {ordinal(planet.house)} House
                    </a>
                </CardFooter>
            </Card>
            );
        })}
        </div>
    );
};

export default PlanetaryPositions;