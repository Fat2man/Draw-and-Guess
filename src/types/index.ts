export interface Player {
  id: string;
  name: string;
  score: number;
  avatar: string;
}

export interface Message {
  id: string;
  userId: string;
  text: string;
  type: 'user' | 'system';
  timestamp: string;
  isCorrect: boolean;
}

export type GameState = 'waiting' | 'playing' | 'roundEnd' | 'finished';

export interface Point {
  x: number;
  y: number;
}

export interface DrawData {
  points: Point[];
  color: string;
  width: number;
}