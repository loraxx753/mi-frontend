import React from 'react';
import { Reading } from '@/lib/types/astrology';
import { bodySymbols } from '@/lib/data/constants';


const AspectPatterns: React.FC<{reading: Reading}> = ({ reading }) => {
    return (
        <ul className="text-sm text-blue-700 space-y-1">
        {reading.aspects?.map((aspect, idx) => {
            const symbolA = bodySymbols[aspect.planetA] || '';
            const symbolB = bodySymbols[aspect.planetB] || '';
            const orb = aspect.orb;
            const orbStr = `${orb.degree}°${orb.minutes.toString().padStart(2, '0')}'${orb.seconds.toString().padStart(2, '0')}`;
            return (
            <li key={idx} className="flex items-center gap-2">
                <strong >{aspect.planetA}</strong>
                <span className="text-lg" title={aspect.planetA}>{symbolA}</span>
                <span className="text-xs text-gray-500" title={aspect.aspect}>{aspect.index}</span>
                <span className="font-semibold text-blue-800 ">{aspect.aspect}</span>
                
                <span className="text-lg" title={aspect.planetB}>{symbolB}</span>
                <strong >{aspect.planetB}</strong>
                <span className="text-xs text-gray-500">(orb: {orbStr})</span>
            </li>
            );
        })}
        </ul>
    );
};

export default AspectPatterns;