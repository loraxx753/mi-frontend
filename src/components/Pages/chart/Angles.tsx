import React from 'react';
import type { Angles } from '@/lib/types/astrology';
import { bodySymbols, signEmojis } from '@/lib/data/constants'; // Make sure this path and export exist
import { convertToZodiac } from '@/lib/services/calculate/astrology';

const Angles: React.FC<{ angles: Angles }> = ({ angles }) => {
    const convertedAngles = Object.fromEntries(Object.entries(angles).map(([key, value]) => [key, convertToZodiac(value)]));
    return (
        <ul className="text-sm text-purple-700 space-y-1">
        {convertedAngles.ascendant && <li className="flex items-center gap-2">
            <span className="text-lg" title='Ascendant'>{bodySymbols['Ascendant']}</span>
            <strong >Ascendant:</strong>
            <a href={`https://masteringthezodiac.com/${convertedAngles.ascendant.sign.toLowerCase()}-in-astrology`} target="_blank" rel="noopener noreferrer">
                <span className="text-lg" title={convertedAngles.ascendant.sign}>{signEmojis[convertedAngles.ascendant.sign || '']}</span> <span className="text-sm text-gray-500 ml-1 ">{convertedAngles.ascendant.sign}</span> {convertedAngles.ascendant.degree}° {convertedAngles.ascendant.minutes}' {convertedAngles.ascendant.seconds}
            </a>
        </li>}
        {convertedAngles.descendant && <li className="flex items-center gap-2">
            <span className="text-lg" title='Descendant'>{bodySymbols['Descendant']}</span>
            <strong >Descendant:</strong>
            <a href={`https://masteringthezodiac.com/${convertedAngles.descendant.sign.toLowerCase()}-in-astrology`} target="_blank" rel="noopener noreferrer">  
                <span className="text-lg" title={convertedAngles.descendant.sign}>{signEmojis[convertedAngles.descendant.sign || '']}</span> <span className="text-sm text-gray-500 ml-1 ">{convertedAngles.descendant.sign}</span> {convertedAngles.descendant.degree}° {convertedAngles.descendant.minutes}' {convertedAngles.descendant.seconds}
            </a>
        </li>}
        {convertedAngles.midheaven && <li className="flex items-center gap-2">
            <span className="text-lg" title='Midheaven'>{bodySymbols['Midheaven']}</span>
            <strong >Midheaven (MC):</strong>
            <a href={`https://masteringthezodiac.com/${convertedAngles.midheaven.sign.toLowerCase()}-in-astrology`} target="_blank" rel="noopener noreferrer">
            <span className="text-lg" title={convertedAngles.midheaven.sign}>{signEmojis[convertedAngles.midheaven.sign || '']}</span> <span className="text-sm text-gray-500 ml-1 ">{convertedAngles.midheaven.sign}</span> {convertedAngles.midheaven.degree}° {convertedAngles.midheaven.minutes}' {convertedAngles.midheaven.seconds}
            </a>
        </li>}
        {convertedAngles.imumCoeli && <li className="flex items-center gap-2">
            <span className="text-lg" title='Imum Coeli'>{bodySymbols['ImumCoeli']}</span>
            <strong >Imum Coeli (IC):</strong>
            <a href={`https://masteringthezodiac.com/${convertedAngles.imumCoeli.sign.toLowerCase()}-in-astrology`} target="_blank" rel="noopener noreferrer">
                <span className="text-lg" title={convertedAngles.imumCoeli.sign}>{signEmojis[convertedAngles.imumCoeli.sign || '']}</span> <span className="text-sm text-gray-500 ml-1 ">{convertedAngles.imumCoeli.sign}</span> {convertedAngles.imumCoeli.degree}° {convertedAngles.imumCoeli.minutes}' {convertedAngles.imumCoeli.seconds}
            </a>
        </li>}
        </ul>
    );
};

export default Angles;