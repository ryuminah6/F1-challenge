export type GameState = 'IDLE' | 'COUNTDOWN' | 'PLAYING' | 'FINISHED';

export type PitStage = 1 | 2 | 3 | 4;

export type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

export interface TireCompound {
  name: string;
  code: string;
  color: string;
  border: string;
  bgBadge: string;
  labelKo: string;
}

export interface F1Team {
  id: string;
  name: string;
  driver: string;
  carColor: string;
  accentColor: string;
  number: number;
}

export interface PitRecord {
  carNumber: number;
  team: F1Team;
  fromTire: TireCompound;
  toTire: TireCompound;
  duration: number; // in seconds, e.g. 1.95
  isWorldRecord: boolean; // < 1.82s
  isPurple: boolean; // < 2.2s
  isPerfect: boolean;
  penalties: number;
  pointsEarned: number;
}

export interface HighScoreRecord {
  date: string;
  carsServiced: number;
  fastestStop: number;
  accuracy: number;
  playerRank: string;
  totalScore: number;
}
