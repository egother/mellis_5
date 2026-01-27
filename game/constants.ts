
import { Character, ObstacleDefinition } from './types';

export const GRAVITY = 0.6;
export const JUMP_FORCE = -15;
export const GROUND_HEIGHT = 100;
export const INITIAL_SPEED = 8;
export const SPEED_INCREMENT = 0.002;

export const CHARACTERS: Character[] = [
  {
    id: 'otto',
    name: 'OTTO',
    image: '/img/otto_normal.png', 
    imageActive: '/img/otto_active.png',
    imageGame: '/img/otto_standing.png',
    color: '#ff9900' 
  },
  {
    id: 'venu',
    name: 'VENU',
    image: '/img/venu_normal.png', 
    imageActive: '/img/venu_active.png',
    imageGame: '/img/venu_standing.png',
    color: '#d600ff' 
  }
];

export const BACKGROUND_IMAGE = '/img/background.png';

export const DRAGON_BALL_IMAGES = [
  '/img/esfera_1.png',
  '/img/esfera_2.png',
  '/img/esfera_3.png',
  '/img/esfera_4.png',
  '/img/esfera_5.png',
  '/img/esfera_6.png',
  '/img/esfera_7.png',
];

export const OBSTACLE_TYPES: ObstacleDefinition[] = [
  { width: 60, height: 60, type: 'rock', image: '/img/obstaculo_1.png' },
  { width: 50, height: 80, type: 'cactus', image: '/img/obstaculo_2.png' },
  { width: 70, height: 70, type: 'robot', image: '/img/obstaculo_3.png' }
];

export const COLORS = {
  skyTop: '#7c5ba1',
  skyBottom: '#d4a1c5',
  moon: '#f0f0f0',
  mountainFar: '#4a7c3a',
  mountainNear: '#b68a5c',
  grass: '#68b64e',
  grassDark: '#4e8b3a',
  ui: '#ffffff',
  accent: '#f1c40f'
};
