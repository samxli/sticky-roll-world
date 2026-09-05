export type BiomeType = 'snow' | 'city' | 'forest' | 'desert' | 'beach';
export type ObjectCategory = 'animal' | 'person' | 'object';

export interface ObjectDefinition {
  id: string;
  name: string;
  biome: BiomeType;
  category?: ObjectCategory;
  baseRadius: number; // approximate size threshold in meters to roll up
  collisionRadius?: number; // physical ground footprint radius for solid obstacles
  height?: number;
  width?: number;
  depth?: number;
  color: string;
  points: number;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface PlacedObject {
  id: string;
  defId: string;
  name: string;
  biome: BiomeType;
  category?: ObjectCategory;
  radius: number;
  collisionRadius: number;
  worldPos: { x: number; y: number; z: number };
  normal: { x: number; y: number; z: number };
  isStuck: boolean;
  meshIndex?: number;
  // Dynamic properties for moving animals and people
  isDynamic?: boolean;
  speed?: number;
  heading?: { x: number; y: number; z: number }; // unit tangent direction
  animPhase?: number;
  isScared?: boolean;
  scaredTimer?: number;
}

export interface StuckObjectInfo {
  name: string;
  biome: BiomeType;
  radius: number;
  timestamp: number;
}

export interface GameStats {
  level: number;
  score: number;
  ballRadius: number; // in meters
  ballDiameter: number; // 2 * radius
  timeRemaining: number; // in seconds
  totalObjectsCount: number;
  collectedCount: number;
  stuckObjects: StuckObjectInfo[];
  currentBiome: BiomeType;
  highScoreDiameter: number; // record diameter to beat
  isGameOver: boolean;
  isPaused: boolean;
  isVictory: boolean;
}

export interface LevelConfig {
  levelNumber: number;
  planetRadius: number;
  timeLimitSeconds: number;
  targetDiameter: number;
  seed: number;
}
