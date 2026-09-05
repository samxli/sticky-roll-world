import * as THREE from 'three';
import { BiomeType } from '../types';

export interface PlanetData {
  planetGroup: THREE.Group;
  terrainMesh: THREE.Mesh;
  oceanMesh: THREE.Mesh;
  cloudsGroup: THREE.Group;
  radius: number;
}

/**
 * Determine biome based on spherical coordinates on the planet
 */
export function getBiomeAtPosition(pos: THREE.Vector3): BiomeType {
  const norm = pos.clone().normalize();
  const y = norm.y; // -1 to 1 (polar)
  const angle = Math.atan2(norm.z, norm.x); // -PI to PI (azimuthal)
  const normAngle = (angle + Math.PI) / (Math.PI * 2); // 0 to 1

  // North pole is Snow / Alpine
  if (y > 0.48) {
    return 'snow';
  }

  // Equator and lower hemisphere split into 4 sectors
  if (normAngle < 0.25) {
    return 'forest';
  } else if (normAngle < 0.50) {
    return 'city';
  } else if (normAngle < 0.75) {
    return 'desert';
  } else {
    return 'beach';
  }
}

/**
 * Get color hex for biome
 */
export function getBiomeBaseColor(biome: BiomeType): THREE.Color {
  switch (biome) {
    case 'snow':
      return new THREE.Color('#e2e8f0'); // Crisp snow
    case 'forest':
      return new THREE.Color('#22c55e'); // Lush green
    case 'city':
      return new THREE.Color('#64748b'); // Slate cobblestone/plaza
    case 'desert':
      return new THREE.Color('#eab308'); // Golden sand
    case 'beach':
      return new THREE.Color('#fef08a'); // Warm shore sand
  }
}

/**
 * Generate low-poly spherical planet with biomes and orbiting clouds
 */
export function createPlanet(radius: number = 60, seed: number = 1): PlanetData {
  const planetGroup = new THREE.Group();
  planetGroup.name = 'planet';

  // Base terrain geometry with low-poly faceted subdivision
  const detail = 4; // Icosahedron level for low-poly look
  const terrainGeo = new THREE.IcosahedronGeometry(radius, detail);
  
  // Non-indexed for flat low-poly shading with vertex colors
  const nonIndexed = terrainGeo.toNonIndexed();
  const posAttr = nonIndexed.getAttribute('position');
  const count = posAttr.count;

  const colors = new Float32Array(count * 3);
  const tempVec = new THREE.Vector3();
  const biomeColor = new THREE.Color();

  // Pseudo-random function based on seed
  function seededRandom(x: number, y: number, z: number) {
    const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719 + seed) * 43758.5453;
    return s - Math.floor(s);
  }

  for (let i = 0; i < count; i += 3) {
    // Calculate centroid of the triangle to color the entire face uniformly (crisp low-poly)
    const cX = (posAttr.getX(i) + posAttr.getX(i + 1) + posAttr.getX(i + 2)) / 3;
    const cY = (posAttr.getY(i) + posAttr.getY(i + 1) + posAttr.getY(i + 2)) / 3;
    const cZ = (posAttr.getZ(i) + posAttr.getZ(i + 1) + posAttr.getZ(i + 2)) / 3;
    tempVec.set(cX, cY, cZ);

    const biome = getBiomeAtPosition(tempVec);
    const baseCol = getBiomeBaseColor(biome);

    // Subtle face jitter for rich organic shading
    const noise = (seededRandom(cX, cY, cZ) - 0.5) * 0.12;
    biomeColor.copy(baseCol);
    biomeColor.offsetHSL(noise * 0.05, noise * 0.1, noise * 0.08);

    for (let j = 0; j < 3; j++) {
      const idx = i + j;
      colors[idx * 3] = biomeColor.r;
      colors[idx * 3 + 1] = biomeColor.g;
      colors[idx * 3 + 2] = biomeColor.b;
    }
  }

  nonIndexed.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  nonIndexed.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    flatShading: true,
    roughness: 0.85,
    metalness: 0.05,
  });

  const terrainMesh = new THREE.Mesh(nonIndexed, terrainMat);
  terrainMesh.receiveShadow = true;
  planetGroup.add(terrainMesh);

  // Ocean sector (lagoon) - slight overlay sphere layer in the beach quadrant
  const oceanGeo = new THREE.SphereGeometry(radius * 0.998, 32, 24, 0, Math.PI * 0.65, Math.PI * 0.55, Math.PI * 0.4);
  const oceanMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#06b6d4'),
    roughness: 0.15,
    metalness: 0.2,
    transparent: true,
    opacity: 0.85,
    flatShading: true,
  });
  const oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
  oceanMesh.rotation.y = Math.PI * 1.4;
  oceanMesh.receiveShadow = true;
  planetGroup.add(oceanMesh);

  // Orbiting Low-Poly Puffy Clouds
  const cloudsGroup = new THREE.Group();
  cloudsGroup.name = 'clouds';

  const cloudMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ffffff'),
    flatShading: true,
    roughness: 0.9,
    transparent: true,
    opacity: 0.92,
  });

  const cloudCount = 14;
  for (let c = 0; c < cloudCount; c++) {
    const cloud = new THREE.Group();
    const puffCount = 3 + Math.floor(Math.random() * 4);
    for (let p = 0; p < puffCount; p++) {
      const puffRadius = 1.2 + Math.random() * 1.5;
      const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(puffRadius, 1), cloudMat);
      puff.position.set(
        (p - puffCount / 2) * 1.5 + (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.8
      );
      puff.castShadow = true;
      cloud.add(puff);
    }

    // Place cloud at spherical altitude
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const altitude = radius + 9 + Math.random() * 6;

    cloud.position.set(
      altitude * Math.sin(phi) * Math.cos(theta),
      altitude * Math.cos(phi),
      altitude * Math.sin(phi) * Math.sin(theta)
    );

    // Orient cloud to face outwards from planet center
    cloud.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), cloud.position.clone().normalize());

    cloudsGroup.add(cloud);
  }

  planetGroup.add(cloudsGroup);

  return {
    planetGroup,
    terrainMesh,
    oceanMesh,
    cloudsGroup,
    radius,
  };
}
