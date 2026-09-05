import * as THREE from 'three';
import { BiomeType, ObjectCategory, ObjectDefinition } from '../types';

/**
 * Registry of all item definitions in the game across biomes
 */
export const OBJECT_DEFINITIONS: ObjectDefinition[] = [
  // --- SNOW WORLD ---
  { id: 'ice_cube', name: 'Ice Cube', biome: 'snow', category: 'object', baseRadius: 0.28, collisionRadius: 0.28, color: '#93c5fd', points: 10, rarity: 'common' },
  { id: 'snowball', name: 'Snowball', biome: 'snow', category: 'object', baseRadius: 0.35, collisionRadius: 0.35, color: '#f8fafc', points: 15, rarity: 'common' },
  { id: 'snow_penguin', name: 'Emperor Penguin', biome: 'snow', category: 'animal', baseRadius: 0.45, collisionRadius: 0.35, color: '#0f172a', points: 40, rarity: 'common' },
  { id: 'glacier_spike', name: 'Glacier Crystal', biome: 'snow', category: 'object', baseRadius: 0.75, collisionRadius: 0.45, height: 1.8, color: '#60a5fa', points: 45, rarity: 'uncommon' },
  { id: 'snow_skier', name: 'Alpine Skier', biome: 'snow', category: 'person', baseRadius: 0.65, collisionRadius: 0.45, color: '#ef4444', points: 60, rarity: 'uncommon' },
  { id: 'mountain_goat', name: 'Mountain Goat', biome: 'snow', category: 'animal', baseRadius: 0.85, collisionRadius: 0.65, color: '#f1f5f9', points: 70, rarity: 'uncommon' },
  { id: 'polar_bear', name: 'Polar Bear', biome: 'snow', category: 'animal', baseRadius: 1.7, collisionRadius: 1.3, color: '#f8fafc', points: 180, rarity: 'rare' },
  { id: 'yeti', name: 'Playful Yeti', biome: 'snow', category: 'animal', baseRadius: 1.8, collisionRadius: 1.35, color: '#e2e8f0', points: 220, rarity: 'rare' },
  { id: 'snow_pine', name: 'Snow Pine', biome: 'snow', category: 'object', baseRadius: 1.4, collisionRadius: 0.75, height: 3.5, color: '#334155', points: 120, rarity: 'uncommon' },
  { id: 'igloo', name: 'Igloo', biome: 'snow', category: 'object', baseRadius: 2.1, collisionRadius: 1.7, color: '#e2e8f0', points: 260, rarity: 'rare' },
  { id: 'ski_gondola', name: 'Ski Gondola', biome: 'snow', category: 'object', baseRadius: 2.8, collisionRadius: 1.35, color: '#ef4444', points: 450, rarity: 'rare' },
  { id: 'snow_lodge', name: 'Alpine Lodge', biome: 'snow', category: 'object', baseRadius: 4.5, collisionRadius: 2.3, height: 6.0, color: '#78350f', points: 950, rarity: 'epic' },

  // --- CITY WORLD ---
  { id: 'rubber_ducky', name: 'Rubber Ducky', biome: 'city', category: 'object', baseRadius: 0.28, collisionRadius: 0.28, color: '#facc15', points: 15, rarity: 'common' },
  { id: 'traffic_cone', name: 'Traffic Cone', biome: 'city', category: 'object', baseRadius: 0.26, collisionRadius: 0.26, color: '#f97316', points: 10, rarity: 'common' },
  { id: 'city_pigeon', name: 'City Pigeon', biome: 'city', category: 'animal', baseRadius: 0.22, collisionRadius: 0.22, color: '#94a3b8', points: 15, rarity: 'common' },
  { id: 'cafe_chair', name: 'Cafe Chair', biome: 'city', category: 'object', baseRadius: 0.42, collisionRadius: 0.38, color: '#b45309', points: 25, rarity: 'common' },
  { id: 'city_cat', name: 'City Cat', biome: 'city', category: 'animal', baseRadius: 0.42, collisionRadius: 0.35, color: '#f97316', points: 30, rarity: 'common' },
  { id: 'fire_hydrant', name: 'Fire Hydrant', biome: 'city', category: 'object', baseRadius: 0.38, collisionRadius: 0.32, color: '#dc2626', points: 20, rarity: 'common' },
  { id: 'city_dog', name: 'Shiba Dog', biome: 'city', category: 'animal', baseRadius: 0.55, collisionRadius: 0.45, color: '#eab308', points: 50, rarity: 'uncommon' },
  { id: 'city_pedestrian', name: 'City Pedestrian', biome: 'city', category: 'person', baseRadius: 0.6, collisionRadius: 0.45, color: '#2563eb', points: 55, rarity: 'uncommon' },
  { id: 'city_jogger', name: 'City Jogger', biome: 'city', category: 'person', baseRadius: 0.62, collisionRadius: 0.45, color: '#10b981', points: 65, rarity: 'uncommon' },
  { id: 'pizza_delivery', name: 'Pizza Delivery Scooter', biome: 'city', category: 'person', baseRadius: 0.95, collisionRadius: 0.7, color: '#ef4444', points: 85, rarity: 'uncommon' },
  { id: 'bicycle', name: 'Bicycle', biome: 'city', category: 'object', baseRadius: 0.7, collisionRadius: 0.45, color: '#0284c7', points: 50, rarity: 'uncommon' },
  { id: 'street_lamp', name: 'Street Lamp', biome: 'city', category: 'object', baseRadius: 1.1, collisionRadius: 0.35, height: 2.8, color: '#334155', points: 90, rarity: 'uncommon' },
  { id: 'cafe_cart', name: 'Cafe Cart', biome: 'city', category: 'object', baseRadius: 1.3, collisionRadius: 0.85, color: '#f43f5e', points: 130, rarity: 'uncommon' },
  { id: 'taxi_car', name: 'City Taxi', biome: 'city', category: 'object', baseRadius: 2.3, collisionRadius: 1.6, color: '#eab308', points: 320, rarity: 'rare' },
  { id: 'transit_bus', name: 'Transit Bus', biome: 'city', category: 'object', baseRadius: 3.6, collisionRadius: 2.4, color: '#2563eb', points: 650, rarity: 'rare' },
  { id: 'fire_truck', name: 'City Fire Truck', biome: 'city', category: 'object', baseRadius: 3.8, collisionRadius: 2.3, color: '#dc2626', points: 750, rarity: 'rare' },
  { id: 'townhouse', name: 'Townhouse', biome: 'city', category: 'object', baseRadius: 4.2, collisionRadius: 2.1, height: 7.5, color: '#991b1b', points: 1100, rarity: 'epic' },
  { id: 'skyscraper', name: 'Office Skyscraper', biome: 'city', category: 'object', baseRadius: 6.5, collisionRadius: 2.9, height: 16.0, color: '#0ea5e9', points: 3000, rarity: 'legendary' },

  // --- FOREST WORLD ---
  { id: 'mushroom', name: 'Red Mushroom', biome: 'forest', category: 'object', baseRadius: 0.22, collisionRadius: 0.2, color: '#ef4444', points: 10, rarity: 'common' },
  { id: 'flower_patch', name: 'Wildflowers', biome: 'forest', category: 'object', baseRadius: 0.32, collisionRadius: 0.3, color: '#ec4899', points: 12, rarity: 'common' },
  { id: 'garden_gnome', name: 'Garden Gnome', biome: 'forest', category: 'object', baseRadius: 0.38, collisionRadius: 0.3, color: '#ef4444', points: 25, rarity: 'common' },
  { id: 'campfire', name: 'Campfire', biome: 'forest', category: 'object', baseRadius: 0.6, collisionRadius: 0.5, color: '#f97316', points: 40, rarity: 'common' },
  { id: 'red_fox', name: 'Red Fox', biome: 'forest', category: 'animal', baseRadius: 0.62, collisionRadius: 0.45, color: '#ea580c', points: 55, rarity: 'uncommon' },
  { id: 'forest_hiker', name: 'Trail Hiker', biome: 'forest', category: 'person', baseRadius: 0.6, collisionRadius: 0.45, color: '#16a34a', points: 60, rarity: 'uncommon' },
  { id: 'flannel_lumberjack', name: 'Flannel Lumberjack', biome: 'forest', category: 'person', baseRadius: 0.68, collisionRadius: 0.48, color: '#dc2626', points: 65, rarity: 'uncommon' },
  { id: 'forest_camper', name: 'Forest Camper', biome: 'forest', category: 'person', baseRadius: 0.6, collisionRadius: 0.45, color: '#b45309', points: 60, rarity: 'uncommon' },
  { id: 'deer', name: 'Forest Deer', biome: 'forest', category: 'animal', baseRadius: 0.95, collisionRadius: 0.7, color: '#a16207', points: 80, rarity: 'uncommon' },
  { id: 'forest_bear', name: 'Grizzly Bear', biome: 'forest', category: 'animal', baseRadius: 1.65, collisionRadius: 1.3, color: '#713f12', points: 190, rarity: 'rare' },
  { id: 'camping_tent', name: 'Camping Tent', biome: 'forest', category: 'object', baseRadius: 1.35, collisionRadius: 1.1, color: '#f59e0b', points: 140, rarity: 'uncommon' },
  { id: 'pine_tree', name: 'Fir Pine Tree', biome: 'forest', category: 'object', baseRadius: 1.5, collisionRadius: 0.75, height: 3.8, color: '#15803d', points: 160, rarity: 'uncommon' },
  { id: 'log_cabin', name: 'Log Cabin', biome: 'forest', category: 'object', baseRadius: 3.2, collisionRadius: 1.9, height: 4.8, color: '#713f12', points: 580, rarity: 'rare' },
  { id: 'log_camper', name: 'Vintage Log Camper', biome: 'forest', category: 'object', baseRadius: 3.3, collisionRadius: 2.1, height: 2.8, color: '#f8fafc', points: 620, rarity: 'rare' },
  { id: 'windmill', name: 'Farm Windmill', biome: 'forest', category: 'object', baseRadius: 3.8, collisionRadius: 2.3, height: 9.0, color: '#e2e8f0', points: 1250, rarity: 'epic' },
  { id: 'mountain_peak', name: 'Alpine Peak', biome: 'forest', category: 'object', baseRadius: 6.8, collisionRadius: 4.5, height: 13.0, color: '#64748b', points: 2800, rarity: 'legendary' },

  // --- DESERT WORLD ---
  { id: 'desert_rock', name: 'Desert Quartz', biome: 'desert', category: 'object', baseRadius: 0.28, collisionRadius: 0.28, color: '#d97706', points: 12, rarity: 'common' },
  { id: 'desert_lizard', name: 'Horned Lizard', biome: 'desert', category: 'animal', baseRadius: 0.35, collisionRadius: 0.3, color: '#ca8a04', points: 25, rarity: 'common' },
  { id: 'desert_fennec', name: 'Fennec Fox', biome: 'desert', category: 'animal', baseRadius: 0.48, collisionRadius: 0.38, color: '#fde047', points: 50, rarity: 'uncommon' },
  { id: 'cactus', name: 'Saguaro Cactus', biome: 'desert', category: 'object', baseRadius: 0.85, collisionRadius: 0.5, height: 2.2, color: '#16a34a', points: 65, rarity: 'uncommon' },
  { id: 'desert_nomad', name: 'Desert Nomad', biome: 'desert', category: 'person', baseRadius: 0.62, collisionRadius: 0.45, color: '#e2e8f0', points: 65, rarity: 'uncommon' },
  { id: 'desert_tent', name: 'Bedouin Tent', biome: 'desert', category: 'object', baseRadius: 1.4, collisionRadius: 1.1, color: '#b45309', points: 150, rarity: 'uncommon' },
  { id: 'camel', name: 'Desert Camel', biome: 'desert', category: 'animal', baseRadius: 1.6, collisionRadius: 1.1, color: '#d97706', points: 210, rarity: 'rare' },
  { id: 'sandstone_arch', name: 'Sandstone Arch', biome: 'desert', category: 'object', baseRadius: 3.5, collisionRadius: 2.4, height: 7.0, color: '#c2410c', points: 850, rarity: 'epic' },
  { id: 'golden_sphinx', name: 'Golden Sphinx', biome: 'desert', category: 'object', baseRadius: 3.8, collisionRadius: 2.3, height: 4.2, color: '#eab308', points: 920, rarity: 'epic' },
  { id: 'ancient_obelisk', name: 'Ancient Obelisk', biome: 'desert', category: 'object', baseRadius: 4.5, collisionRadius: 1.65, height: 12.0, color: '#ca8a04', points: 2100, rarity: 'legendary' },
  { id: 'crashed_ufo', name: 'Crashed Retro UFO', biome: 'desert', category: 'object', baseRadius: 5.4, collisionRadius: 3.6, height: 3.2, color: '#94a3b8', points: 2700, rarity: 'legendary' },

  // --- BEACH WORLD ---
  { id: 'starfish', name: 'Starfish', biome: 'beach', category: 'animal', baseRadius: 0.25, collisionRadius: 0.25, color: '#f43f5e', points: 10, rarity: 'common' },
  { id: 'beach_crab', name: 'Beach Crab', biome: 'beach', category: 'animal', baseRadius: 0.28, collisionRadius: 0.28, color: '#ef4444', points: 20, rarity: 'common' },
  { id: 'flamingo_floatie', name: 'Flamingo Floatie', biome: 'beach', category: 'object', baseRadius: 0.48, collisionRadius: 0.42, color: '#f43f5e', points: 30, rarity: 'common' },
  { id: 'seagull', name: 'Coastal Seagull', biome: 'beach', category: 'animal', baseRadius: 0.35, collisionRadius: 0.3, color: '#f8fafc', points: 25, rarity: 'common' },
  { id: 'beach_ball', name: 'Beach Ball', biome: 'beach', category: 'object', baseRadius: 0.38, collisionRadius: 0.38, color: '#38bdf8', points: 18, rarity: 'common' },
  { id: 'surfboard', name: 'Surfboard', biome: 'beach', category: 'object', baseRadius: 0.65, collisionRadius: 0.4, height: 1.6, color: '#06b6d4', points: 45, rarity: 'uncommon' },
  { id: 'beach_swimmer', name: 'Beach Swimmer', biome: 'beach', category: 'person', baseRadius: 0.6, collisionRadius: 0.45, color: '#06b6d4', points: 55, rarity: 'uncommon' },
  { id: 'beach_tourist', name: 'Aloha Tourist', biome: 'beach', category: 'person', baseRadius: 0.62, collisionRadius: 0.45, color: '#f43f5e', points: 65, rarity: 'uncommon' },
  { id: 'sea_turtle', name: 'Sea Turtle', biome: 'beach', category: 'animal', baseRadius: 0.65, collisionRadius: 0.55, color: '#15803d', points: 75, rarity: 'uncommon' },
  { id: 'beach_umbrella', name: 'Beach Umbrella', biome: 'beach', category: 'object', baseRadius: 1.25, collisionRadius: 0.45, height: 2.4, color: '#ef4444', points: 110, rarity: 'uncommon' },
  { id: 'palm_tree', name: 'Tropical Palm', biome: 'beach', category: 'object', baseRadius: 1.6, collisionRadius: 0.6, height: 4.2, color: '#15803d', points: 180, rarity: 'uncommon' },
  { id: 'lifeguard_tower', name: 'Lifeguard Tower', biome: 'beach', category: 'object', baseRadius: 2.8, collisionRadius: 1.6, height: 4.8, color: '#f8fafc', points: 420, rarity: 'rare' },
  { id: 'fishing_boat', name: 'Fishing Boat', biome: 'beach', category: 'object', baseRadius: 3.2, collisionRadius: 1.8, height: 3.5, color: '#b91c1c', points: 520, rarity: 'rare' },
  { id: 'lighthouse', name: 'Maritime Lighthouse', biome: 'beach', category: 'object', baseRadius: 4.8, collisionRadius: 2.3, height: 14.0, color: '#dc2626', points: 2400, rarity: 'legendary' },
];

/**
 * Shared low-poly materials for optimal performance and authentic aesthetic
 */
const materialCache = new Map<string, THREE.Material>();

function getMaterial(color: string, options: { transparent?: boolean; opacity?: number; roughness?: number; metalness?: number; emissive?: string } = {}) {
  const key = `${color}_${options.transparent}_${options.opacity}_${options.roughness}_${options.metalness}_${options.emissive}`;
  if (materialCache.has(key)) {
    return materialCache.get(key)!;
  }
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: options.roughness ?? 0.8,
    metalness: options.metalness ?? 0.1,
    flatShading: true,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1.0,
    emissive: options.emissive ? new THREE.Color(options.emissive) : new THREE.Color(0x000000),
  });
  materialCache.set(key, mat);
  return mat;
}

/**
 * Helper to build a humanoid low-poly mesh with legs, torso, head, and arms touching ground y = 0
 */
function createHumanoidMesh(shirtColor: string, pantsColor: string, skinColor: string = '#fed7aa', hatColor?: string): THREE.Group {
  const group = new THREE.Group();
  const shirtMat = getMaterial(shirtColor);
  const pantsMat = getMaterial(pantsColor);
  const skinMat = getMaterial(skinColor);

  // Left Leg (pivot at hip y=0.55, reaches down to y=0)
  const leftLegPivot = new THREE.Group();
  leftLegPivot.name = 'leg_l';
  leftLegPivot.position.set(-0.13, 0.55, 0);
  const leftLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.13), pantsMat);
  leftLegMesh.position.set(0, -0.275, 0);
  leftLegMesh.castShadow = true;
  leftLegPivot.add(leftLegMesh);
  group.add(leftLegPivot);

  // Right Leg
  const rightLegPivot = new THREE.Group();
  rightLegPivot.name = 'leg_r';
  rightLegPivot.position.set(0.13, 0.55, 0);
  const rightLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.13), pantsMat);
  rightLegMesh.position.set(0, -0.275, 0);
  rightLegMesh.castShadow = true;
  rightLegPivot.add(rightLegMesh);
  group.add(rightLegPivot);

  // Torso (y=0.55 to y=1.05)
  const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.5, 0.22), shirtMat);
  bodyMesh.name = 'body';
  bodyMesh.position.set(0, 0.8, 0);
  bodyMesh.castShadow = true;
  group.add(bodyMesh);

  // Left Arm (pivot at shoulder y=0.98)
  const leftArmPivot = new THREE.Group();
  leftArmPivot.name = 'arm_l';
  leftArmPivot.position.set(-0.25, 0.98, 0);
  const leftArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.45, 0.1), shirtMat);
  leftArmMesh.position.set(0, -0.225, 0);
  leftArmPivot.add(leftArmMesh);
  group.add(leftArmPivot);

  // Right Arm
  const rightArmPivot = new THREE.Group();
  rightArmPivot.name = 'arm_r';
  rightArmPivot.position.set(0.25, 0.98, 0);
  const rightArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.45, 0.1), shirtMat);
  rightArmMesh.position.set(0, -0.225, 0);
  rightArmPivot.add(rightArmMesh);
  group.add(rightArmPivot);

  // Head
  const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.24), skinMat);
  headMesh.name = 'head';
  headMesh.position.set(0, 1.18, 0);
  headMesh.castShadow = true;
  group.add(headMesh);

  // Optional Hat or Beanie
  if (hatColor) {
    const hatMat = getMaterial(hatColor);
    const hatMesh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.12, 0.28), hatMat);
    hatMesh.position.set(0, 1.34, 0);
    hatMesh.castShadow = true;
    group.add(hatMesh);
  }

  return group;
}

/**
 * Helper to build a 4-legged quadruped animal with legs touching y=0
 */
function createQuadrupedMesh(
  bodyColor: string,
  bodySize: [number, number, number],
  legHeight: number,
  legWidth: number,
  options: {
    headSize?: [number, number, number];
    headOffset?: [number, number, number];
    tailSize?: [number, number, number];
    tailOffset?: [number, number, number];
    neckSize?: [number, number, number];
    earColor?: string;
    snoutColor?: string;
  } = {}
): THREE.Group {
  const group = new THREE.Group();
  const bodyMat = getMaterial(bodyColor);

  const [bw, bh, bl] = bodySize;
  const bodyY = legHeight + bh / 2;

  // 4 Legs (pivots at hip height = legHeight)
  const legPositions: [string, number, number][] = [
    ['leg_fl', -bw * 0.38, bl * 0.35],
    ['leg_fr', bw * 0.38, bl * 0.35],
    ['leg_bl', -bw * 0.38, -bl * 0.35],
    ['leg_br', bw * 0.38, -bl * 0.35],
  ];

  const legGeo = new THREE.BoxGeometry(legWidth, legHeight, legWidth);
  legPositions.forEach(([name, lx, lz]) => {
    const legPivot = new THREE.Group();
    legPivot.name = name;
    legPivot.position.set(lx, legHeight, lz);

    const legMesh = new THREE.Mesh(legGeo, bodyMat);
    legMesh.position.set(0, -legHeight / 2, 0);
    legMesh.castShadow = true;
    legPivot.add(legMesh);
    group.add(legPivot);
  });

  // Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bl), bodyMat);
  body.name = 'body';
  body.position.set(0, bodyY, 0);
  body.castShadow = true;
  group.add(body);

  // Neck if any
  if (options.neckSize) {
    const [nw, nh, nl] = options.neckSize;
    const neck = new THREE.Mesh(new THREE.BoxGeometry(nw, nh, nl), bodyMat);
    neck.position.set(0, bodyY + bh * 0.4 + nh * 0.4, bl * 0.35);
    neck.rotation.x = -0.2;
    group.add(neck);
  }

  // Head
  if (options.headSize) {
    const [hw, hh, hl] = options.headSize;
    const hOff = options.headOffset || [0, bodyY + bh * 0.4, bl * 0.5];
    const head = new THREE.Mesh(new THREE.BoxGeometry(hw, hh, hl), bodyMat);
    head.name = 'head';
    head.position.set(hOff[0], hOff[1], hOff[2]);
    head.castShadow = true;
    group.add(head);

    // Snout
    if (options.snoutColor) {
      const snout = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.6, hh * 0.5, hl * 0.6), getMaterial(options.snoutColor));
      snout.position.set(hOff[0], hOff[1] - hh * 0.2, hOff[2] + hl * 0.6);
      group.add(snout);
    }
  }

  // Tail
  if (options.tailSize) {
    const [tw, th, tl] = options.tailSize;
    const tOff = options.tailOffset || [0, bodyY + bh * 0.2, -bl * 0.5];
    const tailPivot = new THREE.Group();
    tailPivot.name = 'tail';
    tailPivot.position.set(tOff[0], tOff[1], tOff[2]);
    const tail = new THREE.Mesh(new THREE.BoxGeometry(tw, th, tl), bodyMat);
    tail.position.set(0, 0, -tl / 2);
    tail.rotation.x = -0.3;
    tailPivot.add(tail);
    group.add(tailPivot);
  }

  return group;
}

/**
 * Create custom 3D low-poly Mesh/Group for each object definition.
 * GUARANTEE: The lowest point of every model rests on y = 0.0 (ground level).
 */
export function createObjectMesh(defId: string): THREE.Group {
  const group = new THREE.Group();
  group.name = defId;

  switch (defId) {
    // ==========================================
    // --- SNOW WORLD ---
    // ==========================================
    case 'ice_cube': {
      const geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const mat = getMaterial('#93c5fd', { transparent: true, opacity: 0.85, roughness: 0.2 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = 0.25; // bottom at y=0
      mesh.castShadow = true;
      group.add(mesh);
      break;
    }
    case 'snowball': {
      const geo = new THREE.DodecahedronGeometry(0.35, 1);
      const mat = getMaterial('#f8fafc', { roughness: 0.9 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = 0.35; // bottom at y=0
      mesh.castShadow = true;
      group.add(mesh);
      break;
    }
    case 'snow_penguin': {
      // Emperor Penguin: body, white belly, orange feet, cute flippers, beak
      const blackMat = getMaterial('#0f172a');
      const whiteMat = getMaterial('#ffffff');
      const orangeMat = getMaterial('#f97316');

      // Feet on ground y = 0
      const footGeo = new THREE.BoxGeometry(0.12, 0.04, 0.2);
      const footL = new THREE.Mesh(footGeo, orangeMat);
      footL.position.set(-0.09, 0.02, 0.05);
      const footR = new THREE.Mesh(footGeo, orangeMat);
      footR.position.set(0.09, 0.02, 0.05);
      group.add(footL, footR);

      // Body (cylinder/capsule)
      const bodyPivot = new THREE.Group();
      bodyPivot.name = 'body';
      bodyPivot.position.y = 0.04;

      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.55, 7), blackMat);
      body.position.y = 0.275;
      body.castShadow = true;
      bodyPivot.add(body);

      // White belly
      const belly = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.42, 0.12), whiteMat);
      belly.position.set(0, 0.26, 0.15);
      bodyPivot.add(belly);

      // Head
      const head = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16, 1), blackMat);
      head.position.set(0, 0.6, 0);
      bodyPivot.add(head);

      // Beak
      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.15, 4), orangeMat);
      beak.rotation.x = Math.PI / 2;
      beak.position.set(0, 0.58, 0.22);
      bodyPivot.add(beak);

      // Flippers
      const flipperGeo = new THREE.BoxGeometry(0.05, 0.32, 0.1);
      const flipperL = new THREE.Mesh(flipperGeo, blackMat);
      flipperL.name = 'arm_l';
      flipperL.position.set(-0.23, 0.32, 0);
      flipperL.rotation.z = 0.2;
      const flipperR = new THREE.Mesh(flipperGeo, blackMat);
      flipperR.name = 'arm_r';
      flipperR.position.set(0.23, 0.32, 0);
      flipperR.rotation.z = -0.2;
      bodyPivot.add(flipperL, flipperR);

      group.add(bodyPivot);
      break;
    }
    case 'glacier_spike': {
      const gMat = getMaterial('#38bdf8', { roughness: 0.1, transparent: true, opacity: 0.9 });
      for (let i = 0; i < 3; i++) {
        const height = 1.2 + i * 0.4;
        const geo = new THREE.ConeGeometry(0.25 + i * 0.05, height, 5);
        const spike = new THREE.Mesh(geo, gMat);
        spike.position.set((i - 1) * 0.3, height / 2, i % 2 === 0 ? 0.1 : -0.1);
        spike.rotation.z = (i - 1) * 0.12;
        spike.castShadow = true;
        group.add(spike);
      }
      break;
    }
    case 'snow_skier': {
      // Skier with skis touching ground y=0, ski poles, red jacket, beanie
      const skier = createHumanoidMesh('#ef4444', '#1e293b', '#fed7aa', '#3b82f6');
      // Add Skis at y = 0
      const skiMat = getMaterial('#0284c7');
      const skiGeo = new THREE.BoxGeometry(0.1, 0.02, 1.1);
      const skiL = new THREE.Mesh(skiGeo, skiMat);
      skiL.position.set(-0.13, 0.01, 0.15);
      const skiR = new THREE.Mesh(skiGeo, skiMat);
      skiR.position.set(0.13, 0.01, 0.15);
      group.add(skiL, skiR, skier);
      break;
    }
    case 'mountain_goat': {
      // Goat with 4 sturdy legs touching y = 0
      const goat = createQuadrupedMesh('#f8fafc', [0.55, 0.55, 0.9], 0.45, 0.11, {
        headSize: [0.28, 0.35, 0.35],
        headOffset: [0, 0.95, 0.45],
        tailSize: [0.08, 0.15, 0.08],
        snoutColor: '#475569',
      });
      // Horns
      const hornMat = getMaterial('#334155');
      const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.35, 4), hornMat);
      hornL.position.set(-0.1, 1.18, 0.35);
      hornL.rotation.x = -0.3;
      const hornR = hornL.clone();
      hornR.position.x = 0.1;
      goat.add(hornL, hornR);
      group.add(goat);
      break;
    }
    case 'polar_bear': {
      // Large sturdy polar bear with 4 legs touching y = 0
      const bear = createQuadrupedMesh('#f8fafc', [0.9, 0.8, 1.5], 0.55, 0.22, {
        headSize: [0.5, 0.45, 0.55],
        headOffset: [0, 1.15, 0.85],
        tailSize: [0.15, 0.15, 0.12],
        snoutColor: '#1e293b',
      });
      group.add(bear);
      break;
    }
    case 'snow_pine': {
      const trunkMat = getMaterial('#5c381e');
      const snowGreenMat = getMaterial('#1e3a2f');
      const snowWhiteMat = getMaterial('#f1f5f9');
      // Trunk bottom touches y=0
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.32, 1.0, 6), trunkMat);
      trunk.position.y = 0.5;
      trunk.castShadow = true;
      group.add(trunk);
      for (let i = 0; i < 3; i++) {
        const radius = 1.3 - i * 0.35;
        const cone = new THREE.Mesh(new THREE.ConeGeometry(radius, 1.2, 6), snowGreenMat);
        cone.position.y = 1.1 + i * 0.8;
        cone.castShadow = true;
        group.add(cone);
        const snowCap = new THREE.Mesh(new THREE.ConeGeometry(radius * 0.6, 0.5, 6), snowWhiteMat);
        snowCap.position.y = 1.5 + i * 0.8;
        group.add(snowCap);
      }
      break;
    }
    case 'igloo': {
      const iglooMat = getMaterial('#e2e8f0', { roughness: 0.95 });
      const dome = new THREE.Mesh(new THREE.SphereGeometry(1.9, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.5), iglooMat);
      dome.castShadow = true;
      group.add(dome);
      const entrance = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 1.0, 6, 1, false, 0, Math.PI), iglooMat);
      entrance.rotation.z = Math.PI / 2;
      entrance.position.set(0, 0.3, 1.7);
      group.add(entrance);
      break;
    }
    case 'ski_gondola': {
      const redMat = getMaterial('#ef4444');
      const darkMat = getMaterial('#1e293b');
      // Base skid touching y = 0
      const skidGeo = new THREE.BoxGeometry(0.12, 0.08, 1.9);
      const skidL = new THREE.Mesh(skidGeo, darkMat);
      skidL.position.set(-0.8, 0.04, 0);
      const skidR = new THREE.Mesh(skidGeo, darkMat);
      skidR.position.set(0.8, 0.04, 0);
      group.add(skidL, skidR);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.8, 1.8), redMat);
      cabin.position.y = 1.0;
      cabin.castShadow = true;
      group.add(cabin);

      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 6), darkMat);
      arm.position.set(0, 2.4, 0);
      group.add(arm);
      break;
    }
    case 'snow_lodge': {
      const woodMat = getMaterial('#78350f');
      const roofMat = getMaterial('#f8fafc');
      const stoneMat = getMaterial('#64748b');
      const base = new THREE.Mesh(new THREE.BoxGeometry(4.0, 2.5, 4.0), woodMat);
      base.position.y = 1.25; // bottom at y=0
      base.castShadow = true;
      group.add(base);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(3.6, 2.2, 4), roofMat);
      roof.position.y = 3.5;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      group.add(roof);
      const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.2, 0.6), stoneMat);
      chimney.position.set(1.2, 3.2, 1.0);
      group.add(chimney);
      break;
    }

    // ==========================================
    // --- CITY WORLD ---
    // ==========================================
    case 'traffic_cone': {
      const orangeMat = getMaterial('#f97316');
      const whiteMat = getMaterial('#ffffff');
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.4), orangeMat);
      base.position.y = 0.025; // bottom at y=0
      group.add(base);
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 7), orangeMat);
      cone.position.y = 0.325;
      cone.castShadow = true;
      group.add(cone);
      const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.12, 7), whiteMat);
      stripe.position.y = 0.3;
      group.add(stripe);
      break;
    }
    case 'city_pigeon': {
      // Small grey bird hopping on ground
      const greyMat = getMaterial('#94a3b8');
      const beakMat = getMaterial('#f97316');
      const footGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.08, 4);
      const footL = new THREE.Mesh(footGeo, beakMat);
      footL.position.set(-0.04, 0.04, 0);
      const footR = new THREE.Mesh(footGeo, beakMat);
      footR.position.set(0.04, 0.04, 0);
      group.add(footL, footR);

      const body = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12, 1), greyMat);
      body.name = 'body';
      body.position.set(0, 0.15, 0);
      body.castShadow = true;
      group.add(body);

      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.08, 4), beakMat);
      beak.rotation.x = Math.PI / 2;
      beak.position.set(0, 0.16, 0.14);
      group.add(beak);
      break;
    }
    case 'cafe_chair': {
      const chairMat = getMaterial('#b45309');
      const legGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.45, 5);
      const legMat = getMaterial('#334155');
      // 4 legs touching y = 0
      [[-0.2, 0.225, -0.2], [0.2, 0.225, -0.2], [-0.2, 0.225, 0.2], [0.2, 0.225, 0.2]].forEach(([x, y, z]) => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(x, y, z);
        group.add(leg);
      });
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.5), chairMat);
      seat.position.y = 0.48;
      seat.castShadow = true;
      group.add(seat);
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.06), chairMat);
      back.position.set(0, 0.72, -0.22);
      group.add(back);
      break;
    }
    case 'city_cat': {
      // Agile cat with 4 legs touching y=0, pointed ears, curved tail
      const cat = createQuadrupedMesh('#f97316', [0.24, 0.22, 0.45], 0.22, 0.06, {
        headSize: [0.18, 0.16, 0.18],
        headOffset: [0, 0.45, 0.26],
        tailSize: [0.05, 0.35, 0.05],
      });
      // Pointy ears
      const earMat = getMaterial('#ea580c');
      const earL = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.1, 4), earMat);
      earL.position.set(-0.06, 0.56, 0.24);
      const earR = earL.clone();
      earR.position.x = 0.06;
      cat.add(earL, earR);
      group.add(cat);
      break;
    }
    case 'fire_hydrant': {
      const redMat = getMaterial('#dc2626');
      const silverMat = getMaterial('#e2e8f0', { metalness: 0.5, roughness: 0.4 });
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.1, 8), redMat);
      base.position.y = 0.05;
      group.add(base);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.55, 8), redMat);
      body.position.y = 0.375;
      body.castShadow = true;
      group.add(body);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.5), redMat);
      cap.position.y = 0.65;
      group.add(cap);
      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 6), silverMat);
      nozzle.position.y = 0.4;
      nozzle.rotation.z = Math.PI / 2;
      group.add(nozzle);
      break;
    }
    case 'city_dog': {
      // Golden shiba dog with wagging tail and 4 legs touching y=0
      const dog = createQuadrupedMesh('#eab308', [0.32, 0.32, 0.65], 0.28, 0.08, {
        headSize: [0.24, 0.22, 0.25],
        headOffset: [0, 0.58, 0.36],
        tailSize: [0.08, 0.28, 0.08],
        snoutColor: '#1e293b',
      });
      // Cute triangular ears
      const earMat = getMaterial('#ca8a04');
      const earL = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 4), earMat);
      earL.position.set(-0.08, 0.72, 0.34);
      const earR = earL.clone();
      earR.position.x = 0.08;
      dog.add(earL, earR);
      group.add(dog);
      break;
    }
    case 'city_pedestrian': {
      // Pedestrian with blue suit, grey pants, briefcase
      const person = createHumanoidMesh('#2563eb', '#475569', '#fed7aa', '#1e293b');
      // Briefcase
      const caseMat = getMaterial('#78350f');
      const briefcase = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25, 0.3), caseMat);
      briefcase.position.set(0.3, 0.5, 0);
      person.add(briefcase);
      group.add(person);
      break;
    }
    case 'city_jogger': {
      // Sporty runner with green shirt, shorts, headband
      const jogger = createHumanoidMesh('#10b981', '#1e293b', '#fed7aa', '#ec4899');
      group.add(jogger);
      break;
    }
    case 'bicycle': {
      const frameMat = getMaterial('#0284c7');
      const tireMat = getMaterial('#1e293b');
      // Wheels touch ground y = 0 (radius = 0.28, center at y = 0.28)
      const wheelGeo = new THREE.TorusGeometry(0.28, 0.05, 6, 12);
      const wheelF = new THREE.Mesh(wheelGeo, tireMat);
      wheelF.position.set(0, 0.28, 0.5);
      const wheelB = new THREE.Mesh(wheelGeo, tireMat);
      wheelB.position.set(0, 0.28, -0.5);
      group.add(wheelF, wheelB);
      // Frame
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.95), frameMat);
      bar.position.set(0, 0.45, 0);
      bar.rotation.x = 0.15;
      group.add(bar);
      break;
    }
    case 'street_lamp': {
      const ironMat = getMaterial('#334155');
      const lightMat = getMaterial('#fef08a', { emissive: '#fef08a' });
      // Base plate touching y = 0
      const basePlate = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.1, 8), ironMat);
      basePlate.position.y = 0.05;
      group.add(basePlate);
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 2.5, 6), ironMat);
      post.position.y = 1.35;
      post.castShadow = true;
      group.add(post);
      const lamp = new THREE.Mesh(new THREE.DodecahedronGeometry(0.25, 0), lightMat);
      lamp.position.set(0, 2.65, 0);
      group.add(lamp);
      break;
    }
    case 'cafe_cart': {
      const cartMat = getMaterial('#f43f5e');
      const canopyMat = getMaterial('#fde047');
      const darkMat = getMaterial('#1e293b');
      // Wheels touching ground y = 0
      const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.1, 8);
      wheelGeo.rotateZ(Math.PI / 2);
      const wL = new THREE.Mesh(wheelGeo, darkMat);
      wL.position.set(-0.85, 0.32, 0);
      const wR = new THREE.Mesh(wheelGeo, darkMat);
      wR.position.set(0.85, 0.32, 0);
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.32, 0.1), darkMat);
      stand.position.set(0, 0.16, 0.6);
      group.add(wL, wR, stand);

      const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.8, 1.0), cartMat);
      body.position.y = 0.72;
      body.castShadow = true;
      group.add(body);

      const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.5, 4), canopyMat);
      canopy.position.y = 1.7;
      canopy.rotation.y = Math.PI / 4;
      group.add(canopy);
      break;
    }
    case 'taxi_car': {
      const yellowMat = getMaterial('#eab308');
      const glassMat = getMaterial('#38bdf8', { roughness: 0.1 });
      const wheelMat = getMaterial('#1e293b');
      // 4 wheels touching ground y = 0 (radius = 0.28, center at y = 0.28)
      const wGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.25, 8);
      wGeo.rotateZ(Math.PI / 2);
      [[-0.9, 0.28, 1.0], [0.9, 0.28, 1.0], [-0.9, 0.28, -1.0], [0.9, 0.28, -1.0]].forEach(([x, y, z]) => {
        const w = new THREE.Mesh(wGeo, wheelMat);
        w.position.set(x, y, z);
        group.add(w);
      });
      // Chassis resting directly on wheels
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.55, 3.2), yellowMat);
      chassis.position.y = 0.55;
      chassis.castShadow = true;
      group.add(chassis);
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 1.6), glassMat);
      cabin.position.set(0, 0.95, -0.2);
      group.add(cabin);
      break;
    }
    case 'transit_bus': {
      const busMat = getMaterial('#2563eb');
      const glassMat = getMaterial('#67e8f9');
      const wheelMat = getMaterial('#1e293b');
      // 6 wheels touching ground y = 0 (radius = 0.38, center at y = 0.38)
      const wGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.3, 8);
      wGeo.rotateZ(Math.PI / 2);
      [
        [-1.25, 0.38, 1.8], [1.25, 0.38, 1.8],
        [-1.25, 0.38, -0.8], [1.25, 0.38, -0.8],
        [-1.25, 0.38, -1.8], [1.25, 0.38, -1.8],
      ].forEach(([x, y, z]) => {
        const w = new THREE.Mesh(wGeo, wheelMat);
        w.position.set(x, y, z);
        group.add(w);
      });
      // Body
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.1, 5.4), busMat);
      body.position.y = 1.35;
      body.castShadow = true;
      group.add(body);
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.35, 5.0), glassMat);
      stripe.position.set(0, 1.55, 0);
      group.add(stripe);
      break;
    }
    case 'townhouse': {
      const brickMat = getMaterial('#991b1b');
      const roofMat = getMaterial('#475569');
      const house = new THREE.Mesh(new THREE.BoxGeometry(3.6, 6.0, 3.6), brickMat);
      house.position.y = 3.0; // bottom at y=0
      house.castShadow = true;
      group.add(house);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(3.0, 1.6, 4), roofMat);
      roof.position.y = 6.8;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      group.add(roof);
      break;
    }
    case 'skyscraper': {
      const glassMat = getMaterial('#0ea5e9', { roughness: 0.1, metalness: 0.8 });
      const tower = new THREE.Mesh(new THREE.BoxGeometry(5.0, 15.0, 5.0), glassMat);
      tower.position.y = 7.5; // bottom at y=0
      tower.castShadow = true;
      group.add(tower);
      const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.4, 3.5, 6), getMaterial('#f8fafc', { emissive: '#ef4444' }));
      spire.position.y = 16.75;
      group.add(spire);
      break;
    }

    // ==========================================
    // --- FOREST WORLD ---
    // ==========================================
    case 'mushroom': {
      const stemMat = getMaterial('#fef08a');
      const capMat = getMaterial('#ef4444');
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.25, 6), stemMat);
      stem.position.y = 0.125; // bottom at y=0
      group.add(stem);
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.18, 7), capMat);
      cap.position.y = 0.28;
      group.add(cap);
      break;
    }
    case 'flower_patch': {
      const stemMat = getMaterial('#16a34a');
      const petalMat = getMaterial('#ec4899');
      const grass = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 0.08, 6), stemMat);
      grass.position.y = 0.04; // bottom at y=0
      group.add(grass);
      for (let i = 0; i < 4; i++) {
        const flower = new THREE.Mesh(new THREE.DodecahedronGeometry(0.1, 0), petalMat);
        flower.position.set((i % 2 - 0.5) * 0.25, 0.18, (Math.floor(i / 2) - 0.5) * 0.25);
        group.add(flower);
      }
      break;
    }
    case 'campfire': {
      const stoneMat = getMaterial('#64748b');
      const woodMat = getMaterial('#78350f');
      const flameMat = getMaterial('#f97316', { emissive: '#ea580c' });
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2;
        const stone = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12, 0), stoneMat);
        stone.position.set(Math.cos(ang) * 0.45, 0.1, Math.sin(ang) * 0.45);
        group.add(stone);
      }
      const log = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.6, 5), woodMat);
      log.rotation.z = Math.PI / 4;
      log.position.y = 0.15;
      group.add(log);
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.35, 5), flameMat);
      flame.position.y = 0.28;
      group.add(flame);
      break;
    }
    case 'red_fox': {
      // Fox with 4 legs touching y = 0
      const fox = createQuadrupedMesh('#ea580c', [0.28, 0.28, 0.55], 0.26, 0.07, {
        headSize: [0.22, 0.2, 0.25],
        headOffset: [0, 0.52, 0.35],
        tailSize: [0.12, 0.4, 0.12],
        snoutColor: '#ffffff',
      });
      group.add(fox);
      break;
    }
    case 'forest_hiker': {
      // Hiker with backpack and trekking poles
      const hiker = createHumanoidMesh('#16a34a', '#854d0e', '#fed7aa', '#eab308');
      const bagMat = getMaterial('#ea580c');
      const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.35, 0.2), bagMat);
      backpack.position.set(0, 0.8, -0.18);
      hiker.add(backpack);
      group.add(hiker);
      break;
    }
    case 'forest_camper': {
      // Camper with flannel shirt and cap
      const camper = createHumanoidMesh('#dc2626', '#1e3a8a', '#fed7aa', '#15803d');
      group.add(camper);
      break;
    }
    case 'deer': {
      // Forest deer with 4 long slender legs touching y = 0 and antlers
      const deer = createQuadrupedMesh('#a16207', [0.45, 0.5, 0.9], 0.55, 0.09, {
        neckSize: [0.18, 0.5, 0.2],
        headSize: [0.22, 0.24, 0.3],
        headOffset: [0, 1.25, 0.48],
        tailSize: [0.08, 0.15, 0.08],
        snoutColor: '#1e293b',
      });
      // Antlers
      const antlerMat = getMaterial('#78350f');
      const antlerL = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.4, 4), antlerMat);
      antlerL.position.set(-0.1, 1.45, 0.4);
      antlerL.rotation.z = -0.4;
      const antlerR = antlerL.clone();
      antlerR.position.x = 0.1;
      antlerR.rotation.z = 0.4;
      deer.add(antlerL, antlerR);
      group.add(deer);
      break;
    }
    case 'forest_bear': {
      // Brown grizzly bear with 4 legs touching y = 0
      const bear = createQuadrupedMesh('#713f12', [0.85, 0.75, 1.4], 0.5, 0.2, {
        headSize: [0.48, 0.42, 0.5],
        headOffset: [0, 1.05, 0.8],
        tailSize: [0.12, 0.12, 0.1],
        snoutColor: '#3d2007',
      });
      group.add(bear);
      break;
    }
    case 'camping_tent': {
      const tentMat = getMaterial('#f59e0b');
      const tent = new THREE.Mesh(new THREE.ConeGeometry(1.4, 1.2, 4), tentMat);
      tent.position.y = 0.6; // bottom touches y=0
      tent.rotation.y = Math.PI / 4;
      tent.castShadow = true;
      group.add(tent);
      break;
    }
    case 'pine_tree': {
      const trunkMat = getMaterial('#5c381e');
      const pineMat = getMaterial('#15803d');
      // Trunk bottom touches y = 0
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 1.2, 6), trunkMat);
      trunk.position.y = 0.6;
      trunk.castShadow = true;
      group.add(trunk);
      for (let i = 0; i < 3; i++) {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(1.3 - i * 0.3, 1.2, 6), pineMat);
        cone.position.y = 1.3 + i * 0.8;
        cone.castShadow = true;
        group.add(cone);
      }
      break;
    }
    case 'log_cabin': {
      const timberMat = getMaterial('#713f12');
      const roofMat = getMaterial('#047857');
      const house = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.0, 2.6), timberMat);
      house.position.y = 1.0; // bottom touches y=0
      house.castShadow = true;
      group.add(house);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.4, 4), roofMat);
      roof.position.y = 2.6;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      group.add(roof);
      break;
    }
    case 'windmill': {
      const stoneMat = getMaterial('#e2e8f0');
      const woodMat = getMaterial('#92400e');
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 2.2, 6.0, 8), stoneMat);
      tower.position.y = 3.0; // bottom touches y=0
      tower.castShadow = true;
      group.add(tower);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.4, 8), woodMat);
      roof.position.y = 6.7;
      group.add(roof);
      for (let i = 0; i < 4; i++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.2, 0.05), woodMat);
        blade.position.set(0, 6.2, 1.4);
        blade.rotation.z = (i * Math.PI) / 2;
        group.add(blade);
      }
      break;
    }
    case 'mountain_peak': {
      const peakMat = getMaterial('#64748b');
      const snowMat = getMaterial('#f8fafc');
      const base = new THREE.Mesh(new THREE.ConeGeometry(5.5, 9.0, 6), peakMat);
      base.position.y = 4.5; // bottom touches y=0
      base.castShadow = true;
      group.add(base);
      const snowCap = new THREE.Mesh(new THREE.ConeGeometry(2.8, 3.8, 6), snowMat);
      snowCap.position.y = 7.8;
      group.add(snowCap);
      break;
    }

    // ==========================================
    // --- DESERT WORLD ---
    // ==========================================
    case 'desert_rock': {
      const rockMat = getMaterial('#d97706');
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.35, 0), rockMat);
      rock.position.y = 0.28;
      rock.castShadow = true;
      group.add(rock);
      break;
    }
    case 'desert_lizard': {
      // Scuttling horned lizard with 4 splayed legs
      const lizardMat = getMaterial('#ca8a04');
      const darkMat = getMaterial('#78350f');
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.1, 0.45), lizardMat);
      body.name = 'body';
      body.position.y = 0.08;
      group.add(body);
      // Splayed legs
      const legGeo = new THREE.BoxGeometry(0.12, 0.04, 0.06);
      [[-0.14, 0.04, 0.12], [0.14, 0.04, 0.12], [-0.14, 0.04, -0.12], [0.14, 0.04, -0.12]].forEach(([lx, ly, lz]) => {
        const leg = new THREE.Mesh(legGeo, darkMat);
        leg.position.set(lx, ly, lz);
        group.add(leg);
      });
      // Tail
      const tail = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.35, 4), lizardMat);
      tail.rotation.x = -Math.PI / 2;
      tail.position.set(0, 0.08, -0.35);
      group.add(tail);
      break;
    }
    case 'desert_fennec': {
      // Fennec fox with big ears and 4 legs touching y = 0
      const fennec = createQuadrupedMesh('#fde047', [0.24, 0.22, 0.45], 0.2, 0.06, {
        headSize: [0.18, 0.16, 0.2],
        headOffset: [0, 0.4, 0.28],
        tailSize: [0.1, 0.32, 0.1],
        snoutColor: '#1e293b',
      });
      // Giant ears
      const earMat = getMaterial('#fef08a');
      const earL = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.24, 4), earMat);
      earL.position.set(-0.08, 0.58, 0.24);
      earL.rotation.z = -0.3;
      const earR = earL.clone();
      earR.position.x = 0.08;
      earR.rotation.z = 0.3;
      fennec.add(earL, earR);
      group.add(fennec);
      break;
    }
    case 'cactus': {
      const cactusMat = getMaterial('#16a34a');
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 1.8, 7), cactusMat);
      stem.position.y = 0.9; // bottom at y=0
      stem.castShadow = true;
      group.add(stem);
      const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 6), cactusMat);
      arm1.position.set(0.3, 1.1, 0);
      arm1.rotation.z = -Math.PI / 4;
      group.add(arm1);
      const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 6), cactusMat);
      arm2.position.set(-0.28, 0.8, 0);
      arm2.rotation.z = Math.PI / 4;
      group.add(arm2);
      break;
    }
    case 'desert_nomad': {
      // Nomad with flowing desert tunic and headscarf
      const nomad = createHumanoidMesh('#f1f5f9', '#d97706', '#fed7aa', '#e2e8f0');
      group.add(nomad);
      break;
    }
    case 'desert_tent': {
      const tentMat = getMaterial('#b45309');
      const tent = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.0, 4), tentMat);
      tent.position.y = 0.5; // bottom at y=0
      tent.rotation.y = Math.PI / 4;
      tent.castShadow = true;
      group.add(tent);
      break;
    }
    case 'camel': {
      // Camel with 4 long legs firmly touching y = 0, humps, tall neck and head
      const camel = createQuadrupedMesh('#d97706', [0.65, 0.7, 1.4], 0.75, 0.14, {
        neckSize: [0.24, 0.85, 0.24],
        headSize: [0.26, 0.28, 0.45],
        headOffset: [0, 1.75, 0.8],
        tailSize: [0.08, 0.35, 0.08],
        snoutColor: '#78350f',
      });
      // 2 humps
      const humpMat = getMaterial('#b45309');
      const hump1 = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.55, 6), humpMat);
      hump1.position.set(0, 1.6, 0.25);
      const hump2 = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.55, 6), humpMat);
      hump2.position.set(0, 1.6, -0.25);
      camel.add(hump1, hump2);
      group.add(camel);
      break;
    }
    case 'sandstone_arch': {
      const archMat = getMaterial('#c2410c');
      // Pillars touch y = 0
      const pillarL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.0, 1.2), archMat);
      pillarL.position.set(-2.2, 2.5, 0);
      pillarL.castShadow = true;
      const pillarR = pillarL.clone();
      pillarR.position.x = 2.2;
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(5.6, 1.4, 1.4), archMat);
      lintel.position.set(0, 5.5, 0);
      lintel.castShadow = true;
      group.add(pillarL, pillarR, lintel);
      break;
    }
    case 'ancient_obelisk': {
      const stoneMat = getMaterial('#ca8a04', { roughness: 0.7 });
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.6, 9.0, 4), stoneMat);
      body.position.y = 4.5; // bottom touches y=0
      body.rotation.y = Math.PI / 4;
      body.castShadow = true;
      group.add(body);
      const top = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.8, 4), stoneMat);
      top.position.y = 9.8;
      top.rotation.y = Math.PI / 4;
      group.add(top);
      break;
    }

    // ==========================================
    // --- BEACH WORLD ---
    // ==========================================
    case 'starfish': {
      const starMat = getMaterial('#f43f5e');
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 5), starMat);
      core.position.y = 0.025; // bottom touches y=0
      group.add(core);
      for (let i = 0; i < 5; i++) {
        const arm = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.28, 4), starMat);
        const ang = (i / 5) * Math.PI * 2;
        arm.position.set(Math.cos(ang) * 0.15, 0.025, Math.sin(ang) * 0.15);
        arm.rotation.x = Math.PI / 2;
        arm.rotation.z = -ang;
        group.add(arm);
      }
      break;
    }
    case 'beach_crab': {
      // Red crab with 6 legs touching y = 0, 2 claws
      const redMat = getMaterial('#ef4444');
      const darkMat = getMaterial('#991b1b');
      const shell = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.22), redMat);
      shell.name = 'body';
      shell.position.y = 0.08;
      group.add(shell);
      // 6 legs
      const legGeo = new THREE.BoxGeometry(0.12, 0.04, 0.05);
      for (let i = 0; i < 6; i++) {
        const side = i % 2 === 0 ? -1 : 1;
        const row = Math.floor(i / 2) - 1;
        const leg = new THREE.Mesh(legGeo, darkMat);
        leg.position.set(side * 0.18, 0.03, row * 0.08);
        group.add(leg);
      }
      // Claws
      const clawGeo = new THREE.BoxGeometry(0.08, 0.08, 0.14);
      const clawL = new THREE.Mesh(clawGeo, redMat);
      clawL.position.set(-0.16, 0.08, 0.15);
      const clawR = new THREE.Mesh(clawGeo, redMat);
      clawR.position.set(0.16, 0.08, 0.15);
      group.add(clawL, clawR);
      break;
    }
    case 'seagull': {
      // Seagull standing on yellow feet at y = 0
      const whiteMat = getMaterial('#f8fafc');
      const yellowMat = getMaterial('#eab308');
      const footGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.14, 4);
      const footL = new THREE.Mesh(footGeo, yellowMat);
      footL.position.set(-0.06, 0.07, 0);
      const footR = new THREE.Mesh(footGeo, yellowMat);
      footR.position.set(0.06, 0.07, 0);
      group.add(footL, footR);

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.2, 0.45), whiteMat);
      body.name = 'body';
      body.position.set(0, 0.22, 0);
      body.castShadow = true;
      group.add(body);

      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.15, 4), yellowMat);
      beak.rotation.x = Math.PI / 2;
      beak.position.set(0, 0.25, 0.28);
      group.add(beak);
      break;
    }
    case 'beach_ball': {
      const ballMat = getMaterial('#38bdf8', { roughness: 0.3 });
      const ball = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38, 2), ballMat);
      ball.position.y = 0.38; // bottom touches y=0
      ball.castShadow = true;
      group.add(ball);
      break;
    }
    case 'surfboard': {
      const surfMat = getMaterial('#06b6d4');
      const board = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.6, 0.08), surfMat);
      board.position.y = 0.8;
      board.rotation.x = 0.2;
      board.castShadow = true;
      group.add(board);
      break;
    }
    case 'beach_swimmer': {
      // Swimmer with swim trunks and goggles
      const swimmer = createHumanoidMesh('#06b6d4', '#0284c7', '#fed7aa');
      group.add(swimmer);
      break;
    }
    case 'beach_tourist': {
      // Tourist with tropical aloha shirt, shorts, sunhat
      const tourist = createHumanoidMesh('#f43f5e', '#38bdf8', '#fed7aa', '#fde047');
      group.add(tourist);
      break;
    }
    case 'sea_turtle': {
      // Sea turtle with green carapace, head, 4 flippers resting on ground y = 0
      const shellMat = getMaterial('#15803d');
      const flipperMat = getMaterial('#4ade80');
      const shell = new THREE.Mesh(new THREE.SphereGeometry(0.4, 7, 5, 0, Math.PI * 2, 0, Math.PI * 0.5), shellMat);
      shell.name = 'body';
      shell.scale.set(1.1, 0.55, 1.3);
      shell.position.y = 0.1;
      shell.castShadow = true;
      group.add(shell);

      // Flippers
      const flipperGeo = new THREE.BoxGeometry(0.25, 0.05, 0.18);
      [[-0.38, 0.03, 0.28], [0.38, 0.03, 0.28], [-0.32, 0.03, -0.28], [0.32, 0.03, -0.28]].forEach(([fx, fy, fz]) => {
        const flipper = new THREE.Mesh(flipperGeo, flipperMat);
        flipper.position.set(fx, fy, fz);
        group.add(flipper);
      });

      // Head
      const head = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12, 0), flipperMat);
      head.position.set(0, 0.12, 0.58);
      group.add(head);
      break;
    }
    case 'beach_umbrella': {
      const poleMat = getMaterial('#cbd5e1');
      const topMat = getMaterial('#ef4444');
      const baseMat = getMaterial('#64748b');
      // Umbrella ground stand at y = 0
      const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.08, 8), baseMat);
      stand.position.y = 0.04;
      group.add(stand);

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 6), poleMat);
      pole.position.y = 1.1;
      pole.castShadow = true;
      group.add(pole);

      const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.3, 0.45, 8), topMat);
      canopy.position.y = 2.15;
      canopy.castShadow = true;
      group.add(canopy);
      break;
    }
    case 'palm_tree': {
      const trunkMat = getMaterial('#78350f');
      const leafMat = getMaterial('#15803d');
      // Trunk bottom touches y = 0
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 3.2, 6), trunkMat);
      trunk.position.set(0.3, 1.6, 0);
      trunk.rotation.z = -0.15;
      trunk.castShadow = true;
      group.add(trunk);
      for (let i = 0; i < 5; i++) {
        const ang = (i / 5) * Math.PI * 2;
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.8, 4), leafMat);
        leaf.position.set(Math.cos(ang) * 0.7 + 0.55, 3.3, Math.sin(ang) * 0.7);
        leaf.rotation.x = Math.PI / 3;
        leaf.rotation.y = ang;
        leaf.castShadow = true;
        group.add(leaf);
      }
      break;
    }
    case 'fishing_boat': {
      const upperHullMat = getMaterial('#1e3a8a');
      const whiteTrimMat = getMaterial('#f8fafc');
      const deckWoodMat = getMaterial('#d97706');
      const cabinWhiteMat = getMaterial('#ffffff');
      const glassMat = getMaterial('#38bdf8', { transparent: true, opacity: 0.85 });
      const woodTrimMat = getMaterial('#78350f');
      const metalMat = getMaterial('#64748b', { metalness: 0.7 });
      const redMat = getMaterial('#991b1b');

      // Hull body (stern to midship) plus a 45deg-rotated box forming the pointed bow
      const hull = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.55, 2.6), upperHullMat);
      hull.position.set(0, 0.275, -0.65);
      hull.castShadow = true;
      group.add(hull);

      const bow = new THREE.Mesh(new THREE.BoxGeometry(1.13, 0.55, 1.13), upperHullMat);
      bow.position.set(0, 0.275, 0.65);
      bow.rotation.y = Math.PI / 4;
      bow.castShadow = true;
      group.add(bow);

      // White waterline stripe
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.09, 2.6), whiteTrimMat);
      stripe.position.set(0, 0.275, -0.65);
      group.add(stripe);

      // Wooden deck
      const deck = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.06, 2.45), deckWoodMat);
      deck.position.set(0, 0.585, -0.68);
      group.add(deck);

      // Wheelhouse: cabin, windshield, roof
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.85, 1.2), cabinWhiteMat);
      cabin.position.set(0, 1.035, 0.1);
      cabin.castShadow = true;
      group.add(cabin);

      const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.35, 0.06), glassMat);
      windshield.position.set(0, 1.175, 0.73);
      group.add(windshield);

      const roof = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.08, 1.3), upperHullMat);
      roof.position.set(0, 1.495, 0.1);
      group.add(roof);

      // Exhaust stack behind the wheelhouse
      const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.55, 6), metalMat);
      stack.position.set(-0.4, 1.745, -0.5);
      group.add(stack);

      // Aft mast with crossbar and pennant
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 1.9, 6), woodTrimMat);
      mast.position.set(0, 1.525, -1.25);
      mast.castShadow = true;
      group.add(mast);

      const crossbar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 0.06), woodTrimMat);
      crossbar.position.set(0, 2.325, -1.25);
      group.add(crossbar);

      const pennant = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.28, 4), redMat);
      pennant.rotation.z = -Math.PI / 2;
      pennant.position.set(0.15, 2.425, -1.25);
      group.add(pennant);

      // Aft deck cargo: fish crates and a barrel
      const crate1 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.3, 0.45), woodTrimMat);
      crate1.position.set(-0.35, 0.765, -1.5);
      group.add(crate1);
      const crate2 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.26, 0.38), woodTrimMat);
      crate2.position.set(-0.35, 1.045, -1.5);
      group.add(crate2);
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.4, 8), woodTrimMat);
      barrel.position.set(0.4, 0.815, -1.5);
      group.add(barrel);

      break;
    }
    case 'lighthouse': {
      const whiteMat = getMaterial('#ffffff');
      const redMat = getMaterial('#dc2626');
      const glassMat = getMaterial('#fde047', { emissive: '#fef08a' });
      const basePlate = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.2, 0.4, 8), getMaterial('#475569'));
      basePlate.position.y = 0.2; // bottom touches y=0
      group.add(basePlate);

      for (let i = 0; i < 4; i++) {
        const seg = new THREE.Mesh(
          new THREE.CylinderGeometry(1.4 - i * 0.2, 1.6 - i * 0.2, 2.4, 8),
          i % 2 === 0 ? redMat : whiteMat
        );
        seg.position.y = 1.4 + i * 2.4;
        seg.castShadow = true;
        group.add(seg);
      }
      const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.2, 8), glassMat);
      lantern.position.y = 11.0;
      group.add(lantern);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.8, 8), redMat);
      roof.position.y = 12.0;
      group.add(roof);
      break;
    }
    case 'rubber_ducky': {
      const yellowMat = getMaterial('#facc15');
      const orangeMat = getMaterial('#f97316');
      const blackMat = getMaterial('#0f172a');
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), yellowMat);
      body.position.set(0, 0.18, 0);
      body.scale.set(1.1, 0.9, 1.25);
      body.castShadow = true;
      group.add(body);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), yellowMat);
      head.position.set(0, 0.32, 0.1);
      group.add(head);
      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.1, 4), orangeMat);
      beak.rotation.x = Math.PI / 2;
      beak.position.set(0, 0.31, 0.23);
      group.add(beak);
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.025, 4, 4), blackMat);
      eyeL.position.set(-0.06, 0.34, 0.18);
      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.025, 4, 4), blackMat);
      eyeR.position.set(0.06, 0.34, 0.18);
      group.add(eyeL);
      group.add(eyeR);
      const tail = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.1, 4), yellowMat);
      tail.rotation.x = -Math.PI / 3;
      tail.position.set(0, 0.22, -0.2);
      group.add(tail);
      break;
    }
    case 'flamingo_floatie': {
      const pinkMat = getMaterial('#f43f5e');
      const darkPinkMat = getMaterial('#e11d48');
      const beakBlackMat = getMaterial('#0f172a');
      const whiteMat = getMaterial('#ffffff');
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.13, 8, 16), pinkMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, 0.14, 0);
      ring.castShadow = true;
      group.add(ring);
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.45, 8), pinkMat);
      neck.position.set(0, 0.4, 0.3);
      neck.rotation.x = -0.3;
      group.add(neck);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), darkPinkMat);
      head.position.set(0, 0.62, 0.36);
      head.scale.set(0.85, 1.1, 1.3);
      group.add(head);
      const beakBase = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.08, 0.12), whiteMat);
      beakBase.position.set(0, 0.58, 0.47);
      group.add(beakBase);
      const beakTip = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.1, 4), beakBlackMat);
      beakTip.rotation.x = Math.PI / 1.7;
      beakTip.position.set(0, 0.53, 0.54);
      group.add(beakTip);
      const tail = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.18, 4), darkPinkMat);
      tail.rotation.x = -Math.PI / 3;
      tail.position.set(0, 0.22, -0.4);
      group.add(tail);
      break;
    }
    case 'garden_gnome': {
      const redMat = getMaterial('#ef4444');
      const blueMat = getMaterial('#2563eb');
      const skinMat = getMaterial('#fed7aa');
      const whiteMat = getMaterial('#f8fafc');
      const blackMat = getMaterial('#1e293b');
      const goldMat = getMaterial('#eab308');
      const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.15), blackMat);
      bootL.position.set(-0.08, 0.04, 0.02);
      const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.15), blackMat);
      bootR.position.set(0.08, 0.04, 0.02);
      group.add(bootL);
      group.add(bootR);
      const tunic = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.26, 8), blueMat);
      tunic.position.set(0, 0.21, 0);
      group.add(tunic);
      const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.05, 8), blackMat);
      belt.position.set(0, 0.18, 0);
      group.add(belt);
      const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.02), goldMat);
      buckle.position.set(0, 0.18, 0.18);
      group.add(buckle);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), skinMat);
      head.position.set(0, 0.38, 0);
      group.add(head);
      const nose = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), skinMat);
      nose.position.set(0, 0.38, 0.12);
      group.add(nose);
      const beard = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.24, 6), whiteMat);
      beard.rotation.x = 0.25;
      beard.position.set(0, 0.28, 0.08);
      group.add(beard);
      const hat = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.36, 8), redMat);
      hat.position.set(0, 0.58, -0.04);
      hat.rotation.x = -0.2;
      group.add(hat);
      break;
    }
    case 'pizza_delivery': {
      const scooterGroup = new THREE.Group();
      scooterGroup.name = 'body';
      const redMat = getMaterial('#dc2626');
      const blackMat = getMaterial('#1e293b');
      const silverMat = getMaterial('#94a3b8');
      const whiteMat = getMaterial('#ffffff');
      const yellowMat = getMaterial('#facc15', { emissive: '#fef08a' });

      const wheelGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 8);
      wheelGeom.rotateZ(Math.PI / 2);
      const wheelFront = new THREE.Mesh(wheelGeom, blackMat);
      wheelFront.name = 'wheel_f';
      wheelFront.position.set(0, 0.18, 0.45);
      const wheelRear = new THREE.Mesh(wheelGeom, blackMat);
      wheelRear.name = 'wheel_r';
      wheelRear.position.set(0, 0.18, -0.45);
      scooterGroup.add(wheelFront);
      scooterGroup.add(wheelRear);

      const deck = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.8), redMat);
      deck.position.set(0, 0.22, 0);
      scooterGroup.add(deck);
      const frontShield = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.42, 0.1), redMat);
      frontShield.position.set(0, 0.44, 0.38);
      frontShield.rotation.x = -0.15;
      scooterGroup.add(frontShield);
      const light = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 6), yellowMat);
      light.rotation.x = Math.PI / 2;
      light.position.set(0, 0.55, 0.44);
      scooterGroup.add(light);
      const handlebar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.48, 6), silverMat);
      handlebar.rotation.z = Math.PI / 2;
      handlebar.position.set(0, 0.68, 0.36);
      scooterGroup.add(handlebar);

      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.1, 0.36), blackMat);
      seat.position.set(0, 0.4, -0.1);
      scooterGroup.add(seat);

      const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.36, 0.38), redMat);
      trunk.position.set(0, 0.52, -0.42);
      scooterGroup.add(trunk);
      const pizzaSign = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.24, 0.02), whiteMat);
      pizzaSign.position.set(0, 0.52, -0.62);
      scooterGroup.add(pizzaSign);

      const riderTorso = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.34, 0.2), getMaterial('#1e40af'));
      riderTorso.position.set(0, 0.66, -0.05);
      riderTorso.rotation.x = 0.15;
      scooterGroup.add(riderTorso);
      const riderHead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), redMat);
      riderHead.position.set(0, 0.9, -0.02);
      scooterGroup.add(riderHead);
      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.07, 0.1), blackMat);
      visor.position.set(0, 0.9, 0.08);
      scooterGroup.add(visor);

      group.add(scooterGroup);
      break;
    }
    case 'flannel_lumberjack': {
      const jack = createHumanoidMesh('#dc2626', '#1e293b', '#fed7aa', '#b45309');
      const strapL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 0.02), getMaterial('#78350f'));
      strapL.position.set(-0.1, 0.78, 0.12);
      const strapR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.45, 0.02), getMaterial('#78350f'));
      strapR.position.set(0.1, 0.78, 0.12);
      jack.add(strapL);
      jack.add(strapR);
      const beard = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.12), getMaterial('#78350f'));
      beard.position.set(0, 1.05, 0.1);
      jack.add(beard);
      const armR = jack.getObjectByName('arm_r');
      if (armR) {
        const axeHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.65, 6), getMaterial('#a16207'));
        axeHandle.position.set(0.08, -0.2, 0.1);
        axeHandle.rotation.x = Math.PI / 4;
        const axeHead = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.18), getMaterial('#94a3b8', { metalness: 0.7 }));
        axeHead.position.set(0.08, -0.05, 0.28);
        armR.add(axeHandle);
        armR.add(axeHead);
      }
      group.add(jack);
      break;
    }
    case 'yeti': {
      const whiteFurMat = getMaterial('#f1f5f9');
      const faceMat = getMaterial('#93c5fd');
      const eyeMat = getMaterial('#0f172a');
      const hornMat = getMaterial('#cbd5e1');

      const bodyPivot = new THREE.Group();
      bodyPivot.name = 'body';
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.85, 1.2, 8), whiteFurMat);
      torso.position.set(0, 1.15, 0);
      torso.castShadow = true;
      bodyPivot.add(torso);

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.55, 0.55), whiteFurMat);
      head.position.set(0, 1.9, 0.05);
      bodyPivot.add(head);

      const face = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.08), faceMat);
      face.position.set(0, 1.88, 0.32);
      bodyPivot.add(face);
      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 4, 4), eyeMat);
      eyeL.position.set(-0.13, 1.92, 0.37);
      const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.05, 4, 4), eyeMat);
      eyeR.position.set(0.13, 1.92, 0.37);
      bodyPivot.add(eyeL);
      bodyPivot.add(eyeR);

      const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 4), hornMat);
      hornL.position.set(-0.35, 2.2, 0);
      hornL.rotation.z = 0.3;
      const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 4), hornMat);
      hornR.position.set(0.35, 2.2, 0);
      hornR.rotation.z = -0.3;
      bodyPivot.add(hornL);
      bodyPivot.add(hornR);
      group.add(bodyPivot);

      const legL = new THREE.Group();
      legL.name = 'leg_l';
      legL.position.set(-0.38, 0.7, 0);
      const footL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.7, 0.42), whiteFurMat);
      footL.position.set(0, -0.35, 0.05);
      footL.castShadow = true;
      legL.add(footL);
      group.add(legL);

      const legR = new THREE.Group();
      legR.name = 'leg_r';
      legR.position.set(0.38, 0.7, 0);
      const footR = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.7, 0.42), whiteFurMat);
      footR.position.set(0, -0.35, 0.05);
      footR.castShadow = true;
      legR.add(footR);
      group.add(legR);

      const armL = new THREE.Group();
      armL.name = 'arm_l';
      armL.position.set(-0.85, 1.65, 0);
      const armLMesh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.1, 0.3), whiteFurMat);
      armLMesh.position.set(0, -0.5, 0);
      armLMesh.castShadow = true;
      armL.add(armLMesh);
      group.add(armL);

      const armR = new THREE.Group();
      armR.name = 'arm_r';
      armR.position.set(0.85, 1.65, 0);
      const armRMesh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.1, 0.3), whiteFurMat);
      armRMesh.position.set(0, -0.5, 0);
      armRMesh.castShadow = true;
      armR.add(armRMesh);
      group.add(armR);
      break;
    }
    case 'fire_truck': {
      const redMat = getMaterial('#dc2626');
      const whiteMat = getMaterial('#ffffff');
      const blackMat = getMaterial('#1e293b');
      const silverMat = getMaterial('#94a3b8', { metalness: 0.6 });
      const glassMat = getMaterial('#38bdf8', { transparent: true, opacity: 0.85 });
      const blueLightMat = getMaterial('#3b82f6', { emissive: '#60a5fa' });
      const redLightMat = getMaterial('#ef4444', { emissive: '#f87171' });

      const wheelGeom = new THREE.CylinderGeometry(0.42, 0.42, 0.28, 10);
      wheelGeom.rotateZ(Math.PI / 2);
      [-1.8, 0.5, 1.7].forEach((zPos) => {
        [-1.05, 1.05].forEach((xPos) => {
          const w = new THREE.Mesh(wheelGeom, blackMat);
          w.position.set(xPos, 0.42, zPos);
          group.add(w);
        });
      });

      const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.35, 4.6), redMat);
      body.position.set(0, 1.15, 0);
      body.castShadow = true;
      group.add(body);

      const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.22, 4.5), whiteMat);
      stripe.position.set(0, 1.05, 0);
      group.add(stripe);

      const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.6, 0.1), glassMat);
      frontGlass.position.set(0, 1.45, 2.31);
      group.add(frontGlass);

      const lightbarBase = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.25), blackMat);
      lightbarBase.position.set(0, 1.88, 1.7);
      group.add(lightbarBase);
      const lightL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.15, 0.2), redLightMat);
      lightL.position.set(-0.35, 1.98, 1.7);
      const lightR = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.15, 0.2), blueLightMat);
      lightR.position.set(0.35, 1.98, 1.7);
      group.add(lightL);
      group.add(lightR);

      [-1.02, 1.02].forEach((x) => {
        const hose = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.8, 8), getMaterial('#eab308'));
        hose.rotation.z = Math.PI / 2;
        hose.position.set(x, 0.9, -0.6);
        group.add(hose);
      });

      const turntable = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.15, 8), silverMat);
      turntable.position.set(0, 1.9, -0.8);
      group.add(turntable);

      const ladder = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.15, 3.2), silverMat);
      ladder.position.set(0, 2.1, -0.4);
      ladder.rotation.x = -0.12;
      group.add(ladder);
      break;
    }
    case 'lifeguard_tower': {
      const whiteWood = getMaterial('#f8fafc');
      const redWood = getMaterial('#dc2626');
      const blueMat = getMaterial('#0284c7');
      const yellowMat = getMaterial('#facc15');

      const stiltGeom = new THREE.CylinderGeometry(0.08, 0.1, 2.4, 6);
      [
        [-0.9, -0.9],
        [0.9, -0.9],
        [-0.9, 0.9],
        [0.9, 0.9],
      ].forEach(([x, z]) => {
        const stilt = new THREE.Mesh(stiltGeom, whiteWood);
        stilt.position.set(x, 1.2, z);
        stilt.rotation.z = x > 0 ? -0.1 : 0.1;
        stilt.rotation.x = z > 0 ? 0.1 : -0.1;
        group.add(stilt);
      });

      const platform = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.15, 2.4), whiteWood);
      platform.position.set(0, 2.4, 0);
      group.add(platform);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.5, 1.6), whiteWood);
      cabin.position.set(0, 3.2, -0.2);
      cabin.castShadow = true;
      group.add(cabin);

      const windowF = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.6, 0.05), blueMat);
      windowF.position.set(0, 3.4, 0.61);
      group.add(windowF);

      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.5, 0.8, 4), redWood);
      roof.rotation.y = Math.PI / 4;
      roof.position.set(0, 4.35, -0.2);
      group.add(roof);

      const ladderL = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.7, 4), whiteWood);
      ladderL.position.set(-0.35, 1.2, 1.3);
      ladderL.rotation.x = 0.2;
      const ladderR = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.7, 4), whiteWood);
      ladderR.position.set(0.35, 1.2, 1.3);
      ladderR.rotation.x = 0.2;
      group.add(ladderL);
      group.add(ladderR);
      for (let r = 0; r < 5; r++) {
        const rung = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.04), whiteWood);
        rung.position.set(0, 0.4 + r * 0.45, 1.1 + r * 0.1);
        group.add(rung);
      }

      const lifebuoy = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.06, 6, 12), redWood);
      lifebuoy.position.set(-0.82, 3.2, -0.2);
      lifebuoy.rotation.y = Math.PI / 2;
      group.add(lifebuoy);

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.0, 4), getMaterial('#94a3b8'));
      pole.position.set(0, 5.0, -0.2);
      group.add(pole);
      const flag = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.25, 0.02), yellowMat);
      flag.position.set(0.22, 5.3, -0.2);
      group.add(flag);
      break;
    }
    case 'golden_sphinx': {
      const goldMat = getMaterial('#eab308', { roughness: 0.5, metalness: 0.35 });
      const darkGoldMat = getMaterial('#ca8a04');
      const royalBlue = getMaterial('#1d4ed8');

      const baseSlab = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.3, 4.4), darkGoldMat);
      baseSlab.position.set(0, 0.15, 0);
      group.add(baseSlab);

      const lionBody = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.4, 2.8), goldMat);
      lionBody.position.set(0, 0.95, -0.5);
      lionBody.castShadow = true;
      group.add(lionBody);

      const pawL = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 1.6), goldMat);
      pawL.position.set(-0.7, 0.45, 1.3);
      const pawR = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 1.6), goldMat);
      pawR.position.set(0.7, 0.45, 1.3);
      group.add(pawL);
      group.add(pawR);

      const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 1.1, 8), goldMat);
      chest.position.set(0, 1.8, 0.5);
      group.add(chest);

      const head = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.1, 0.9), goldMat);
      head.position.set(0, 2.7, 0.5);
      group.add(head);

      const headdressL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 0.7), royalBlue);
      headdressL.position.set(-0.65, 2.5, 0.45);
      headdressL.rotation.z = -0.15;
      const headdressR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 0.7), royalBlue);
      headdressR.position.set(0.65, 2.5, 0.45);
      headdressR.rotation.z = 0.15;
      group.add(headdressL);
      group.add(headdressR);

      const crown = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 4), darkGoldMat);
      crown.position.set(0, 3.35, 0.9);
      crown.rotation.x = -0.3;
      group.add(crown);
      break;
    }
    case 'log_camper': {
      const creamMat = getMaterial('#f8fafc');
      const tealMat = getMaterial('#0d9488');
      const woodTrim = getMaterial('#78350f');
      const blackMat = getMaterial('#1e293b');
      const glassMat = getMaterial('#38bdf8', { transparent: true, opacity: 0.8 });
      const orangeAwning = getMaterial('#f97316');

      const wheelGeom = new THREE.CylinderGeometry(0.38, 0.38, 0.22, 10);
      wheelGeom.rotateZ(Math.PI / 2);
      [-1.15, 1.15].forEach((x) => {
        const w = new THREE.Mesh(wheelGeom, blackMat);
        w.position.set(x, 0.38, 0);
        group.add(w);
      });

      const hitchL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.0), blackMat);
      hitchL.position.set(-0.35, 0.3, 2.2);
      hitchL.rotation.y = -0.35;
      const hitchR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.0), blackMat);
      hitchR.position.set(0.35, 0.3, 2.2);
      hitchR.rotation.y = 0.35;
      group.add(hitchL);
      group.add(hitchR);

      const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.8, 3.6), tealMat);
      lowerBody.position.set(0, 0.85, 0);
      lowerBody.castShadow = true;
      group.add(lowerBody);

      const upperBody = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 3.6, 12, 1, false, 0, Math.PI), creamMat);
      upperBody.rotation.z = Math.PI / 2;
      upperBody.rotation.y = Math.PI / 2;
      upperBody.position.set(0, 1.25, 0);
      group.add(upperBody);

      const woodPanel = new THREE.Mesh(new THREE.BoxGeometry(2.14, 0.45, 2.6), woodTrim);
      woodPanel.position.set(0, 0.95, -0.1);
      group.add(woodPanel);

      const windowL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.45, 1.2), glassMat);
      windowL.position.set(-1.08, 1.45, 0);
      const windowR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.45, 1.2), glassMat);
      windowR.position.set(1.08, 1.45, 0);
      group.add(windowL);
      group.add(windowR);

      const awning = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 1.6), orangeAwning);
      awning.position.set(1.4, 1.75, 0);
      awning.rotation.z = -0.25;
      group.add(awning);
      break;
    }
    case 'crashed_ufo': {
      const sandMat = getMaterial('#d97706', { roughness: 0.9 });
      const sandDarkMat = getMaterial('#b45309', { roughness: 0.95 });

      // Impact crater furrow and sand mounds banked up where saucer plowed into the dunes
      const impactRim = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.42, 6, 18, Math.PI * 1.1), sandMat);
      impactRim.rotation.x = Math.PI / 2;
      impactRim.rotation.z = -0.42;
      impactRim.position.set(0.65, 0.08, 0.15);
      impactRim.scale.set(1.15, 0.5, 1.0);
      group.add(impactRim);

      const mound1 = new THREE.Mesh(new THREE.ConeGeometry(1.4, 0.48, 8), sandMat);
      mound1.position.set(1.6, 0.18, 0.7);
      mound1.scale.set(1.3, 0.55, 1.1);
      group.add(mound1);

      const mound2 = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.52, 8), sandDarkMat);
      mound2.position.set(1.85, 0.2, -0.65);
      mound2.scale.set(1.4, 0.48, 1.2);
      group.add(mound2);

      const skidTrench = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 3.2), sandDarkMat);
      skidTrench.position.set(-1.1, 0.03, -1.3);
      skidTrench.rotation.y = 0.38;
      group.add(skidTrench);

      // Embedded Saucer (Lowered directly into the ground at a dramatic 24-degree impact tilt)
      const saucerGroup = new THREE.Group();
      saucerGroup.rotation.z = 0.38;
      saucerGroup.rotation.x = -0.16;
      saucerGroup.position.set(0, 0.12, 0);

      const silverMat = getMaterial('#94a3b8', { metalness: 0.85, roughness: 0.25 });
      const rimMat = getMaterial('#0284c7', { emissive: '#0ea5e9' });
      const cockpitMat = getMaterial('#06b6d4', { emissive: '#22d3ee', transparent: true, opacity: 0.85 });
      const thrusterMat = getMaterial('#a855f7', { emissive: '#c084fc' });

      const lowerHull = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 1.2, 0.7, 16), silverMat);
      lowerHull.position.set(0, 0.35, 0);
      saucerGroup.add(lowerHull);

      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.65, 0.12, 8, 20), rimMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, 0.7, 0);
      saucerGroup.add(ring);

      const upperHull = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 2.6, 0.6, 16), silverMat);
      upperHull.position.set(0, 1.0, 0);
      upperHull.castShadow = true;
      saucerGroup.add(upperHull);

      const cockpit = new THREE.Mesh(new THREE.SphereGeometry(1.1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), cockpitMat);
      cockpit.position.set(0, 1.3, 0);
      saucerGroup.add(cockpit);

      const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 6), silverMat);
      ant.position.set(0, 2.6, 0);
      saucerGroup.add(ant);
      const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), thrusterMat);
      beacon.position.set(0, 2.9, 0);
      saucerGroup.add(beacon);

      // Underside exposed glowing thruster conduits
      for (let t = 0; t < 3; t++) {
        const ang = (t / 3) * Math.PI * 2;
        const thruster = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 0.15, 8), thrusterMat);
        thruster.position.set(Math.cos(ang) * 1.5, 0.04, Math.sin(ang) * 1.5);
        saucerGroup.add(thruster);
      }

      group.add(saucerGroup);
      break;
    }
    default: {
      const mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.5, 0), getMaterial('#6366f1'));
      mesh.position.y = 0.25;
      group.add(mesh);
    }
  }

  return group;
}
