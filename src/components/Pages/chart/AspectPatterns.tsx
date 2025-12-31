    import React from 'react';
    import { bodySymbols } from '@/lib/data/constants';
    import type { Aspect } from '@/lib/types/astrology';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ThirdParty/ShadCn/Card';


    const AspectPatterns: React.FC<{aspects: Aspect[] }> = ({ aspects }) => {
        const byIndex = {
            'Conjunction' : aspects?.filter((a: Aspect) => a.index === 1) || [],
            'Opposition' : aspects?.filter((a: Aspect) => a.index === 2) || [],
            'Trine' : aspects?.filter((a: Aspect) => a.index === 3) || [],
            'Square' : aspects?.filter((a: Aspect) => a.index === 4) || [],
            'Quintile' : aspects?.filter((a: Aspect) => a.index === 5) || [],
            'Sextile' : aspects?.filter((a: Aspect) => a.index === 6) || [],
            'Septile' : aspects?.filter((a: Aspect) => a.index === 7) || [],
            'Octile' : aspects?.filter((a: Aspect) => a.index === 8) || [],
            'Nonile' : aspects?.filter((a: Aspect) => a.index === 9) || [],
            'Decile' : aspects?.filter((a: Aspect) => a.index === 10) || [],
            'Undecile' : aspects?.filter((a: Aspect) => a.index === 11) || [],
        }
        return (
            <div className="grid md:grid-cols-3 gap-4 mb-8">
                {Object.entries(byIndex).map(([key, list]) => {
                    if(list.length === 0) return null;
                    return (
                        <Card key={key} className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg text-blue-800">{key}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    {list.map((aspect, idx) => {
                                        const symbolA = bodySymbols[aspect.planetA] || '';
                                        const symbolB = bodySymbols[aspect.planetB] || '';
                                        const orb = aspect.orb;
                                        const orbStr = `${orb.degree}°${orb.minutes.toString().padStart(2, '0')}'${orb.seconds.toString().padStart(2, '0')}`;

                                        return (
                                        <li key={idx.toString() + '-item'} className="flex items-center gap-2" title={`orb: ${orbStr}`  }>
                                            <strong >{aspect.planetA}</strong>
                                            <span className="text-lg" title={aspect.planetA}>{symbolA}</span>
                                            <span className="text-xs text-gray-500" title={aspect.aspect}>{aspect.glyph}</span>                                            
                                            <span className="text-lg" title={aspect.planetB}>{symbolB}</span>
                                            <strong >{aspect.planetB}</strong>
                                        </li>
                                        )
                                    })}
                                </ul>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        );
};

export default AspectPatterns;