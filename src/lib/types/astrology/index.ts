export type ZodiacSign = {
  degree: number;
  minutes: number;
  seconds: number;
  sign: string;
};

export type Planet = { 
  name: string;
  longitude: number;
  latitude: number;
  ra: number;
  dec: number;
  dateStr: string;
  sign: number;
  northNodeLongitude?: number;
  southNodeLongitude?: number;
  house: number;
};

export type HouseCusps = { [key: number]: number };

export type Angles = {
  ascendant: number;
  midheaven: number;
  descendant: number;
  imumCoeli: number;
};

export type Aspect = {
    planetA: string;
    planetB: string;
    aspect: string;
    glyph: string;
    index: number;
    orb: {
      degree: number;
      minutes: number;
      seconds: number;
      float: number;
    }
  }

export type Reading = {
  positions: Planet[];
  aspects?: Array<Aspect>;
  angles?: Angles;
  northNode?: number;
  southNode?: number;
  houses?: {
    cusps: HouseCusps;
    system: string;
  };
};
