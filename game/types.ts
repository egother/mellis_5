
export enum GameState {
  MENU = 'MENU',
  CHARACTER_SELECT = 'CHARACTER_SELECT',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  LEADERBOARD = 'LEADERBOARD'
}

export interface Character {
  id: string;
  name: string;
  image: string;
  imageActive: string;
  imageGame: string;
  color: string;
}

export interface ScoreEntry {
  name: string;
  score: number;
  character: string;
  date: string;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  type: 'rock' | 'cactus' | 'robot';
  image?: string; // Optional image path
}

export interface ObstacleDefinition {
  width: number;
  height: number;
  type: 'rock' | 'cactus' | 'robot';
  image: string;
}

export interface Collectible {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  imageIndex: number; // 0-6 corresponding to 1-7 stars
}
