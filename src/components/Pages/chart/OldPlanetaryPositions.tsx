import React from 'react';
import { Reading } from '@/lib/types/astrology';
import { bodySymbols, signEmojis } from '@/lib/data/constants';
import { convertToZodiac } from '@/lib/services/calculate/astrology';

const PlanetaryPositions: React.FC<{ reading: Reading }> = ({ reading }) => {

    return (
        <ul className="text-sm text-purple-700 space-y-1">
        {reading.positions.map((planet) => {
            const sign = convertToZodiac(planet.sign);
            const planetSymbol = bodySymbols[planet.name] || '';
            const signEmoji = signEmojis[sign.sign] || '';
            return (
            <li key={planet.name} className="flex items-center gap-2">
                <span className="text-lg" title={planet.name}>{planetSymbol}</span>
                <strong >{planet.name}:</strong>
                <span className="text-lg" title={sign.sign}>{signEmoji}</span> <span className="text-sm text-gray-500 ml-1 ">{sign.sign}</span> {sign.degree}° {sign.minutes}' {sign.seconds}
            </li>
            );
        })}
        </ul>
    );
};

export default PlanetaryPositions;