import * as THREE from 'three';
import { BiomeType, GameStats, ObjectDefinition, PlacedObject, StuckObjectInfo } from '../types';
import { soundEngine } from './audio';
import { createObjectMesh, OBJECT_DEFINITIONS } from './models';
import { createPlanet, getBiomeAtPosition, PlanetData } from './planet';

export interface StickyBallGameCallbacks {
  onStatsUpdate: (stats: GameStats) => void;
  onObjectPickedUp: (item: StuckObjectInfo) => void;
  onMilestoneReached: (diameter: number) => void;
  onGameOver: (finalStats: GameStats) => void;
  onBiomeChange: (biome: BiomeType) => void;
}

export class StickyBallGame {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private callbacks: StickyBallGameCallbacks;

  // Planet & Objects
  private planetData: PlanetData | null = null;
  private planetRadius: number = 55;
  private placedObjects: PlacedObject[] = [];
  private objectMeshes: Map<string, THREE.Group> = new Map();

  // Sticky Ball Player
  private ballGroup: THREE.Group;
  private coreSphereMesh: THREE.Mesh;
  private ballPosition: THREE.Vector3 = new THREE.Vector3();
  private ballNormal: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
  private ballForward: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
  private ballRight: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
  private ballRadius: number = 0.65; // Starting radius (1.30m diameter)
  private initialRadius: number = 0.65;
  private targetRadius: number = 0.65;

  // Movement & Physics with high ground traction
  private velocity: THREE.Vector3 = new THREE.Vector3();
  private rollSpeed: number = 0;
  private maxSpeed: number = 11.5;
  private acceleration: number = 38.0; // High traction torque
  private friction: number = 18.0; // High sticky braking resistance (stops in ~0.2s without sliding)
  private brakeTraction: number = 55.0; // Active reverse/braking grip
  private turnSpeed: number = 3.2; // Responsive steering grip
  private isBoosting: boolean = false;
  private boostCooldown: number = 0;
  private keys: { [key: string]: boolean } = {};

  // Raycasting for ground alignment
  private groundRaycaster: THREE.Raycaster = new THREE.Raycaster();
  private groundRayOrigin: THREE.Vector3 = new THREE.Vector3();
  private groundRayDir: THREE.Vector3 = new THREE.Vector3();

  // Traction ground particles
  private tractionParticles: THREE.Points | null = null;
  private tractionCount: number = 50;
  private tractionIndex: number = 0;
  private tractionLifetimes: Float32Array = new Float32Array(50);

  // Camera settings
  private cameraOffset: THREE.Vector3 = new THREE.Vector3();
  private cameraTarget: THREE.Vector3 = new THREE.Vector3();
  private isBirdEye: boolean = false;

  // Game Progress
  private level: number = 1;
  private score: number = 0;
  private timeRemaining: number = 600; // 10 minutes
  private isGameOver: boolean = false;
  private isPaused: boolean = false;
  private stuckObjectsList: StuckObjectInfo[] = [];
  private currentBiome: BiomeType = 'forest';
  private highScoreDiameter: number = 0;
  private lastMilestonePassed: number = 1.3;

  // Visual effects
  private bumpFeedbackTimer: number = 0;
  private recoilTimer: number = 0;
  private bumpSquash: number = 0;
  private pickupParticles: THREE.Points | null = null;
  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  private statsEmitTimer: number = 0;

  // Shadow-casting sun light that follows the player
  private sunDirection: THREE.Vector3 = new THREE.Vector3(90, 110, 70).normalize();
  private dirLight!: THREE.DirectionalLight;

  constructor(container: HTMLElement, callbacks: StickyBallGameCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    // Load high score from localStorage
    const saved = localStorage.getItem('stickyroll_highscore_diameter');
    if (saved) {
      this.highScoreDiameter = parseFloat(saved) || 0;
    }

    // 1. Three.js Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0a1b2a');
    this.scene.fog = new THREE.FogExp2('#0a1b2a', 0.0035);

    // 2. Camera
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 1000);

    // 3. Renderer with shadows and tone mapping
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.appendChild(this.renderer.domElement);

    // 4. Lights
    this.setupLights();

    // 5. Ball setup
    this.ballGroup = new THREE.Group();
    this.ballGroup.name = 'playerBall';
    this.scene.add(this.ballGroup);

    // Core sticky ball sphere with cheerful low-poly studded look
    const sphereGeo = new THREE.DodecahedronGeometry(this.ballRadius, 2);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#10b981'), // Vibrant green
      roughness: 0.35,
      metalness: 0.15,
      flatShading: true,
    });
    this.coreSphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    this.coreSphereMesh.castShadow = true;
    this.coreSphereMesh.receiveShadow = true;
    this.ballGroup.add(this.coreSphereMesh);

    // Cute colored decorative studs around the ball
    const studColors = ['#f43f5e', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899', '#eab308'];
    const studGeo = new THREE.DodecahedronGeometry(0.12, 0);
    for (let i = 0; i < 24; i++) {
      const phi = Math.acos(-1 + (2 * i) / 24);
      const theta = Math.sqrt(24 * Math.PI) * phi;
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);
      const z = Math.cos(phi);

      const studMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(studColors[i % studColors.length]),
        roughness: 0.4,
        metalness: 0.2,
      });
      const stud = new THREE.Mesh(studGeo, studMat);
      stud.position.set(x, y, z).multiplyScalar(this.ballRadius * 0.94);
      stud.castShadow = true;
      // Parent to core sphere so studs scale (and squash) together with ball growth
      this.coreSphereMesh.add(stud);
    }

    // 6. Particle system for stick pickups
    this.setupParticles();

    // 7. Inputs
    this.setupInput();

    // 8. Resize listener
    window.addEventListener('resize', this.onResize);

    // 9. Start initial level
    this.initLevel(1);

    // 10. Start loop
    this.lastTime = performance.now();
    this.animate();
  }

  /**
   * Raycast down into the terrain mesh to find the exact surface point and face normal.
   * Eliminates all floating or clipping above faceted terrain faces.
   */
  public getGroundIntersection(directionOrPos: THREE.Vector3): { position: THREE.Vector3; normal: THREE.Vector3 } {
    const n = directionOrPos.clone().normalize();
    if (!this.planetData || !this.planetData.terrainMesh) {
      return {
        position: n.clone().multiplyScalar(this.planetRadius),
        normal: n,
      };
    }

    this.groundRayOrigin.copy(n).multiplyScalar(this.planetRadius * 1.35);
    this.groundRayDir.copy(n).negate();
    this.groundRaycaster.set(this.groundRayOrigin, this.groundRayDir);

    const hits = this.groundRaycaster.intersectObject(this.planetData.terrainMesh, false);
    if (hits.length > 0 && hits[0].face) {
      return {
        position: hits[0].point,
        normal: hits[0].face.normal.clone().normalize(),
      };
    }

    return {
      position: n.clone().multiplyScalar(this.planetRadius),
      normal: n,
    };
  }

  private setupLights() {
    // Ambient light with warm/cool hemispheric tint
    const hemiLight = new THREE.HemisphereLight('#bae6fd', '#1e293b', 0.85);
    this.scene.add(hemiLight);

    // Main celestial directional sun (follows the player so shadows stay valid planet-wide)
    this.dirLight = new THREE.DirectionalLight('#fffbeb', 1.8);
    this.dirLight.position.set(90, 110, 70);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 10;
    this.dirLight.shadow.camera.far = 300;
    const d = 90;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.dirLight.shadow.bias = -0.0004;
    this.scene.add(this.dirLight);
    this.scene.add(this.dirLight.target);

    // Secondary rim backlight
    const rimLight = new THREE.DirectionalLight('#38bdf8', 0.6);
    rimLight.position.set(-80, -40, -80);
    this.scene.add(rimLight);
  }

  private setupParticles() {
    const pCount = 80;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(pCount * 3);
    const col = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
      col[i * 3] = 1;
      col[i * 3 + 1] = 0.8;
      col[i * 3 + 2] = 0.2;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    this.pickupParticles = new THREE.Points(geo, mat);
    this.scene.add(this.pickupParticles);

    // Ground traction dust / specks particles
    const tGeo = new THREE.BufferGeometry();
    const tPos = new Float32Array(this.tractionCount * 3);
    const tCol = new Float32Array(this.tractionCount * 3);
    for (let i = 0; i < this.tractionCount; i++) {
      tPos[i * 3] = 0;
      tPos[i * 3 + 1] = -1000;
      tPos[i * 3 + 2] = 0;
      tCol[i * 3] = 0.8;
      tCol[i * 3 + 1] = 0.8;
      tCol[i * 3 + 2] = 0.8;
      this.tractionLifetimes[i] = 0;
    }
    tGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3));
    tGeo.setAttribute('color', new THREE.BufferAttribute(tCol, 3));

    const tMat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.NormalBlending,
    });
    this.tractionParticles = new THREE.Points(tGeo, tMat);
    this.scene.add(this.tractionParticles);
  }

  private updateTractionParticles(delta: number, speed: number) {
    if (!this.tractionParticles) return;
    const posAttr = this.tractionParticles.geometry.getAttribute('position') as THREE.BufferAttribute;
    const colAttr = this.tractionParticles.geometry.getAttribute('color') as THREE.BufferAttribute;
    let needsUpdate = false;

    // Decay existing particles
    for (let i = 0; i < this.tractionCount; i++) {
      if (this.tractionLifetimes[i] > 0) {
        this.tractionLifetimes[i] -= delta * 3.2;
        if (this.tractionLifetimes[i] <= 0) {
          this.tractionLifetimes[i] = 0;
          posAttr.setY(i, -1000);
          needsUpdate = true;
        }
      }
    }

    // Emit new ground traction specks when rolling with ground grip
    if (Math.abs(speed) > 0.5) {
      const idx = this.tractionIndex;
      this.tractionIndex = (this.tractionIndex + 1) % this.tractionCount;

      // Contact point on ground underneath the ball
      const contact = this.ballPosition.clone().sub(this.ballNormal.clone().multiplyScalar(this.ballRadius * 0.98));
      const spread = (Math.random() - 0.5) * this.ballRadius * 0.4;
      const kickDir = this.ballRight.clone().multiplyScalar(spread).sub(this.ballForward.clone().multiplyScalar(Math.sign(speed) * 0.12));

      posAttr.setXYZ(idx, contact.x + kickDir.x, contact.y + kickDir.y, contact.z + kickDir.z);
      this.tractionLifetimes[idx] = 1.0;

      // Biome-specific turf color
      let r = 0.5, g = 0.75, b = 0.35;
      if (this.currentBiome === 'snow') {
        r = 0.9; g = 0.95; b = 1.0;
      } else if (this.currentBiome === 'desert') {
        r = 0.95; g = 0.8; b = 0.45;
      } else if (this.currentBiome === 'city') {
        r = 0.7; g = 0.7; b = 0.75;
      } else if (this.currentBiome === 'beach') {
        r = 0.9; g = 0.88; b = 0.65;
      }
      colAttr.setXYZ(idx, r, g, b);
      needsUpdate = true;
    }

    if (needsUpdate) {
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }
  }

  private triggerPickupEffect(pos: THREE.Vector3) {
    if (!this.pickupParticles) return;
    const posAttr = this.pickupParticles.geometry.getAttribute('position') as THREE.BufferAttribute;
    const colAttr = this.pickupParticles.geometry.getAttribute('color') as THREE.BufferAttribute;
    const count = posAttr.count;
    for (let i = 0; i < count; i++) {
      posAttr.setXYZ(
        i,
        pos.x + (Math.random() - 0.5) * this.ballRadius * 1.5,
        pos.y + (Math.random() - 0.5) * this.ballRadius * 1.5,
        pos.z + (Math.random() - 0.5) * this.ballRadius * 1.5
      );
      if (colAttr) {
        colAttr.setXYZ(i, 1.0, 0.9, 0.2);
      }
    }
    posAttr.needsUpdate = true;
    if (colAttr) colAttr.needsUpdate = true;
    (this.pickupParticles.material as THREE.PointsMaterial).opacity = 1.0;
  }

  private triggerBumpEffect(pos: THREE.Vector3) {
    if (!this.pickupParticles) return;
    const posAttr = this.pickupParticles.geometry.getAttribute('position') as THREE.BufferAttribute;
    const colAttr = this.pickupParticles.geometry.getAttribute('color') as THREE.BufferAttribute;
    const count = posAttr.count;
    for (let i = 0; i < count; i++) {
      posAttr.setXYZ(
        i,
        pos.x + (Math.random() - 0.5) * this.ballRadius * 1.2,
        pos.y + (Math.random() - 0.5) * this.ballRadius * 1.2,
        pos.z + (Math.random() - 0.5) * this.ballRadius * 1.2
      );
      if (colAttr) {
        // Bright cartoon impact sparks: gold and glowing orange
        if (i % 2 === 0) {
          colAttr.setXYZ(i, 1.0, 0.85, 0.15);
        } else {
          colAttr.setXYZ(i, 1.0, 0.45, 0.1);
        }
      }
    }
    posAttr.needsUpdate = true;
    if (colAttr) colAttr.needsUpdate = true;
    (this.pickupParticles.material as THREE.PointsMaterial).opacity = 1.0;
  }

  /**
   * Frees GPU resources (geometries and materials) for a whole subtree.
   * Called when regenerating the planet so repeated restarts don't leak VRAM.
   */
  private disposeObject(root: THREE.Object3D) {
    root.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) {
        mat.forEach((m) => m.dispose());
      } else if (mat) {
        mat.dispose();
      }
    });
  }

  public initLevel(lvlNumber: number = 1) {
    this.level = lvlNumber;
    this.timeRemaining = 600; // 10 minutes per level
    this.isGameOver = false;
    this.isPaused = false;
    this.stuckObjectsList = [];
    this.score = 0;
    this.ballRadius = this.initialRadius;
    this.targetRadius = this.initialRadius;
    this.lastMilestonePassed = Math.round(this.ballRadius * 2 * 10) / 10;

    // Remove old planet and objects if any, freeing their GPU resources
    if (this.planetData) {
      this.scene.remove(this.planetData.planetGroup);
      this.disposeObject(this.planetData.planetGroup);
    }
    this.objectMeshes.forEach((mesh) => {
      if (mesh.parent) mesh.parent.remove(mesh);
      this.disposeObject(mesh);
    });
    this.objectMeshes.clear();
    this.placedObjects = [];

    // Clear stuck objects from ball group (except core sphere and decorative studs)
    const toRemove: THREE.Object3D[] = [];
    this.ballGroup.children.forEach((child) => {
      if (child !== this.coreSphereMesh && child.type === 'Group') {
        toRemove.push(child);
      }
    });
    toRemove.forEach((c) => this.ballGroup.remove(c));
    this.coreSphereMesh.scale.set(1, 1, 1);

    // Create fresh planet with random seed
    const seed = lvlNumber * 1337 + Math.random() * 999;
    this.planetRadius = 55;
    this.planetData = createPlanet(this.planetRadius, seed);
    this.scene.add(this.planetData.planetGroup);
    this.planetData.terrainMesh.updateMatrixWorld(true);

    // Set initial ball position firmly planted on ground along radial normal
    const startRadial = new THREE.Vector3(0, 1, 0);
    const startGround = this.getGroundIntersection(startRadial);
    const startElevation = startGround.position.length();

    this.ballNormal.copy(startRadial);
    this.ballPosition.copy(startRadial).multiplyScalar(startElevation + this.ballRadius);
    this.ballForward.set(0, 0, 1);
    this.ballRight.set(1, 0, 0);
    this.ballGroup.position.copy(this.ballPosition);

    // Populate objects across biomes randomly
    this.generateWorldObjects(seed);

    // Start background music
    soundEngine.startAmbientBGM();

    // Initial stats emit
    this.emitStats();
  }

  /**
   * Helper to place a single object at a given surface normal with raycasted ground contact
   */
  private placeSingleObjectAtNorm(def: ObjectDefinition, biome: BiomeType, norm: THREE.Vector3, index: number, isDynamic: boolean) {
    // 1. Raycast to find exact ground surface facet point and normal
    const ground = this.getGroundIntersection(norm);

    // Slight embed (0.02) so base vertices are firmly planted without any air gap
    const pos = ground.position.clone().sub(ground.normal.clone().multiplyScalar(0.02));

    // 2. Instantiate 3D mesh
    const mesh = createObjectMesh(def.id);
    mesh.position.copy(pos);

    // 3. Compute orientation: upright along ground normal, facing random tangent forward
    const randomVec = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    const forwardVec = randomVec.sub(ground.normal.clone().multiplyScalar(randomVec.dot(ground.normal))).normalize();
    const upVec = ground.normal;
    const rightVec = new THREE.Vector3().crossVectors(upVec, forwardVec).normalize();
    const rotMatrix = new THREE.Matrix4().makeBasis(rightVec, upVec, forwardVec);
    mesh.quaternion.setFromRotationMatrix(rotMatrix);

    // Store initial body Y for walking bounce animation
    const bodyPart = mesh.getObjectByName('body');
    if (bodyPart) {
      bodyPart.userData.initialY = bodyPart.position.y;
    }

    this.scene.add(mesh);

    const objId = `obj_${index}_${def.id}`;
    this.objectMeshes.set(objId, mesh);

    // Determine roam speed based on species / character type
    let speed = 1.0 + Math.random() * 0.7;
    if (def.id === 'sea_turtle') speed = 0.5;
    if (def.id === 'city_jogger' || def.id === 'snow_skier') speed = 2.3;
    if (def.id === 'pizza_delivery') speed = 2.7;
    if (def.id === 'flannel_lumberjack') speed = 0.95;
    if (def.id === 'yeti') speed = 1.15;
    if (def.id === 'city_pigeon' || def.id === 'beach_crab') speed = 1.4;
    if (def.id === 'polar_bear' || def.id === 'forest_bear') speed = 1.25;

    this.placedObjects.push({
      id: objId,
      defId: def.id,
      name: def.name,
      biome: biome,
      category: def.category,
      radius: def.baseRadius,
      collisionRadius: def.collisionRadius ?? def.baseRadius,
      worldPos: { x: pos.x, y: pos.y, z: pos.z },
      normal: { x: ground.normal.x, y: ground.normal.y, z: ground.normal.z },
      isStuck: false,
      isDynamic: isDynamic,
      speed: speed,
      heading: { x: forwardVec.x, y: forwardVec.y, z: forwardVec.z },
      animPhase: Math.random() * Math.PI * 2,
      isScared: false,
      scaredTimer: 0,
    });
  }

  /**
   * Helper to find a point on the planet within a specific biome sector and place an object there
   */
  private placeSingleObjectInBiome(def: ObjectDefinition, targetBiome: BiomeType, index: number, isDynamic: boolean) {
    let attempts = 0;
    while (attempts < 35) {
      attempts++;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);

      const norm = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      ).normalize();

      if (norm.distanceTo(new THREE.Vector3(0, 1, 0)) < 0.22) continue;

      const biome = getBiomeAtPosition(norm);
      if (biome === targetBiome) {
        this.placeSingleObjectAtNorm(def, targetBiome, norm, index, isDynamic);
        return;
      }
    }
  }

  private generateWorldObjects(seed: number) {
    const totalCount = 230 + Math.min(60, this.level * 15);
    const definitionsByBiome: Record<BiomeType, ObjectDefinition[]> = {
      snow: OBJECT_DEFINITIONS.filter((d) => d.biome === 'snow'),
      city: OBJECT_DEFINITIONS.filter((d) => d.biome === 'city'),
      forest: OBJECT_DEFINITIONS.filter((d) => d.biome === 'forest'),
      desert: OBJECT_DEFINITIONS.filter((d) => d.biome === 'desert'),
      beach: OBJECT_DEFINITIONS.filter((d) => d.biome === 'beach'),
    };

    const biomes: BiomeType[] = ['snow', 'city', 'forest', 'desert', 'beach'];
    let placed = 0;

    // Phase 1: Guaranteed dynamic living entities (animals and people) across all 5 biomes!
    // Each biome receives 13-16 moving creatures (~70-80 active moving animals and people in the world)
    biomes.forEach((b) => {
      const livingCandidates = definitionsByBiome[b].filter((d) => d.category === 'animal' || d.category === 'person');
      const countForBiome = 14 + Math.floor(Math.random() * 4);

      for (let i = 0; i < countForBiome && livingCandidates.length > 0; i++) {
        const def = livingCandidates[Math.floor(Math.random() * livingCandidates.length)];
        this.placeSingleObjectInBiome(def, b, placed, true);
        placed++;
      }
    });

    // Phase 2: Static world objects, buildings, vehicles, nature props
    let attempts = 0;
    while (placed < totalCount && attempts < totalCount * 4) {
      attempts++;

      // Uniform point on sphere
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);

      const norm = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      ).normalize();

      // Don't spawn directly on player start position
      if (norm.distanceTo(new THREE.Vector3(0, 1, 0)) < 0.22) {
        continue;
      }

      const biome = getBiomeAtPosition(norm);
      const candidates = definitionsByBiome[biome];
      if (!candidates || candidates.length === 0) continue;

      // Pick object with size distribution:
      const roll = Math.random();
      let chosenDef = candidates[0];
      if (roll < 0.45) {
        // Small items
        const smalls = candidates.filter((c) => c.baseRadius < 0.8);
        chosenDef = smalls[Math.floor(Math.random() * smalls.length)] || candidates[0];
      } else if (roll < 0.78) {
        // Medium
        const mediums = candidates.filter((c) => c.baseRadius >= 0.8 && c.baseRadius < 2.5);
        chosenDef = mediums[Math.floor(Math.random() * mediums.length)] || candidates[0];
      } else if (roll < 0.93) {
        // Large
        const larges = candidates.filter((c) => c.baseRadius >= 2.5 && c.baseRadius < 6.0);
        chosenDef = larges[Math.floor(Math.random() * larges.length)] || candidates[candidates.length - 1];
      } else {
        // Giant / landmarks
        const giants = candidates.filter((c) => c.baseRadius >= 6.0);
        chosenDef = giants[Math.floor(Math.random() * giants.length)] || candidates[candidates.length - 1];
      }

      const isLiving = chosenDef.category === 'animal' || chosenDef.category === 'person';
      this.placeSingleObjectAtNorm(chosenDef, biome, norm, placed, isLiving);
      placed++;
    }
  }

  private onKeyDown = (e: KeyboardEvent) => {
    this.keys[e.code] = true;
    if (e.code === 'Space' && !this.isBoosting && this.boostCooldown <= 0) {
      this.boost();
    }
    if (e.code === 'KeyC') {
      this.toggleCameraView();
    }
    if (e.code === 'KeyP') {
      this.togglePause();
    }
    if (e.code === 'KeyR' && this.isGameOver) {
      this.initLevel(this.level);
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
  };

  private setupInput() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  // Virtual touch controls & camera view controls
  private virtualForward: number = 0;
  private virtualTurn: number = 0;

  public setVirtualInput(forward: number, turn: number) {
    this.virtualForward = forward;
    this.virtualTurn = turn;
  }

  public applyVirtualInput(forward: number, turn: number, isBoosting?: boolean) {
    this.virtualForward = forward;
    this.virtualTurn = turn;
    if (isBoosting && !this.isBoosting && this.boostCooldown <= 0) {
      this.boost();
    }
  }

  public toggleCameraView(): boolean {
    this.isBirdEye = !this.isBirdEye;
    return this.isBirdEye;
  }

  public boost() {
    if (this.boostCooldown <= 0 && !this.isBoosting) {
      this.isBoosting = true;
      this.boostCooldown = 4.0;
      soundEngine.playBoostSound();
      setTimeout(() => {
        this.isBoosting = false;
      }, 1200);
    }
  }

  public togglePause() {
    if (this.isGameOver) return;
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      soundEngine.stopAmbientBGM();
    } else {
      soundEngine.startAmbientBGM();
      this.lastTime = performance.now();
    }
    this.emitStats();
  }

  public nextLevel() {
    this.initLevel(this.level + 1);
  }

  public restartLevel() {
    this.initLevel(this.level);
  }

  private onResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const now = performance.now();
    const delta = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    if (this.isPaused || this.isGameOver) {
      // Still render static/paused scene
      this.renderer.render(this.scene, this.camera);
      return;
    }

    // 1. Time countdown
    this.timeRemaining -= delta;
    if (this.timeRemaining <= 0) {
      this.timeRemaining = 0;
      this.handleTimeUp();
    }

    // 2. Cooldowns
    if (this.boostCooldown > 0) {
      this.boostCooldown -= delta;
    }
    if (this.bumpFeedbackTimer > 0) {
      this.bumpFeedbackTimer -= delta;
    }

    // 3. Smooth ball growth interpolation and impact squish spring
    if (this.ballRadius < this.targetRadius) {
      this.ballRadius += (this.targetRadius - this.ballRadius) * Math.min(delta * 5.0, 1.0);
    }
    const baseScale = this.ballRadius / this.initialRadius;
    if (this.bumpSquash > 0.001) {
      this.bumpSquash = THREE.MathUtils.damp(this.bumpSquash, 0, 9.0, delta);
      const squashFactor = 1.0 - this.bumpSquash * 0.35;
      const bulgeFactor = 1.0 + this.bumpSquash * 0.2;
      this.coreSphereMesh.scale.set(baseScale * bulgeFactor, baseScale * bulgeFactor, baseScale * squashFactor);
    } else {
      this.coreSphereMesh.scale.set(baseScale, baseScale, baseScale);
    }

    // 4. Clouds orbit rotation
    if (this.planetData && this.planetData.cloudsGroup) {
      this.planetData.cloudsGroup.rotation.y += delta * 0.02;
    }

    // 5. Update pickup particles fade
    if (this.pickupParticles) {
      const pMat = this.pickupParticles.material as THREE.PointsMaterial;
      if (pMat.opacity > 0) {
        pMat.opacity = Math.max(0, pMat.opacity - delta * 3.0);
      }
    }

    // 6. Player Movement & Rolling on Sphere
    this.updatePlayerMovement(delta);

    // 6.5. Dynamic Moving Entities (Animals & People)
    this.updateDynamicEntities(delta);

    // 7. Check Collisions & Object Sticking
    this.checkCollisions();

    // 8. Update Camera
    this.updateCamera(delta);

    // 9. Periodic stats emission, throttled to ~5Hz so React HUD doesn't re-render at 60fps
    this.statsEmitTimer += delta;
    if (this.statsEmitTimer >= 0.2) {
      this.statsEmitTimer = 0;
      this.emitStats();
    }

    // 10. Keep shadow sun anchored above the player so shadows work planet-wide
    this.dirLight.position.copy(this.ballPosition).addScaledVector(this.sunDirection, 150);
    this.dirLight.target.position.copy(this.ballPosition);
    this.dirLight.target.updateMatrixWorld();

    // 11. Render
    this.renderer.render(this.scene, this.camera);
  };

  private updatePlayerMovement(delta: number) {
    // Current surface normal
    this.ballNormal.copy(this.ballPosition).normalize();

    // Input collection
    let forwardInput = 0;
    let turnInput = 0;

    if (this.keys['KeyW'] || this.keys['ArrowUp']) forwardInput += 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) forwardInput -= 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) turnInput -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) turnInput += 1;

    // Blend virtual touch input
    forwardInput += this.virtualForward;
    turnInput += this.virtualTurn;
    forwardInput = Math.max(-1, Math.min(1, forwardInput));
    turnInput = Math.max(-1, Math.min(1, turnInput));

    // Recoil state from colliding with solid obstacles:
    // Disables forward acceleration during recoil so the ball actually bounces backward
    if (this.recoilTimer > 0) {
      this.recoilTimer -= delta;
      forwardInput = Math.min(0, forwardInput);
      this.rollSpeed = THREE.MathUtils.damp(this.rollSpeed, 0, 3.2, delta);
    }

    // Steering: Rotate ballForward around ballNormal
    if (turnInput !== 0) {
      const turnAngle = -turnInput * this.turnSpeed * delta;
      const rotQuat = new THREE.Quaternion().setFromAxisAngle(this.ballNormal, turnAngle);
      this.ballForward.applyQuaternion(rotQuat).normalize();
    }

    // Ensure ballForward is orthogonal to ballNormal
    this.ballRight.crossVectors(this.ballNormal, this.ballForward).normalize();
    this.ballForward.crossVectors(this.ballRight, this.ballNormal).normalize();

    // Check for blocking solid obstacles immediately in front of the ball
    let isBlockedAhead = false;
    let glancingSlideVec: THREE.Vector3 | null = null;
    let speedLimitFactor = 1.0;

    for (let i = 0; i < this.placedObjects.length; i++) {
      const obj = this.placedObjects[i];
      if (obj.isStuck) continue;

      // Only obstacles too large to stick to can block movement
      const canStick = this.ballRadius >= obj.radius * 0.72;
      if (canStick) continue;

      const colliders = this.getObstacleColliders(obj);
      for (let c = 0; c < colliders.length; c++) {
        const col = colliders[c];
        if (this.ballPosition.distanceToSquared(col.pos) > 250) continue;

        // Compute horizontal distance in planet tangent plane
        const toBall = this.ballPosition.clone().sub(col.pos);
        const normalDot = toBall.dot(this.ballNormal);
        const tangentVec = toBall.sub(this.ballNormal.clone().multiplyScalar(normalDot));
        const distHoriz = tangentVec.length();

        const solidDist = this.ballRadius + col.radius;

        // If ball is in contact or immediately approaching contact
        if (distHoriz < solidDist + 0.1) {
          const tangentCol = distHoriz > 0.0001 ? tangentVec.normalize() : this.ballForward.clone().negate();
          const forwardDot = this.ballForward.dot(tangentCol); // < 0 means heading into obstacle

          if (forwardDot < -0.15) {
            if (forwardDot < -0.45) {
              // Direct head-on collision against solid obstacle
              isBlockedAhead = true;
              if (this.recoilTimer <= 0 && (this.rollSpeed > 0.35 || forwardInput > 0)) {
                this.triggerObstacleBounce(Math.max(this.rollSpeed, 2.6), col.pos);
              }
              break;
            } else {
              // Glancing angle: smoothly slide along the obstacle perimeter
              const slideDir = this.ballForward.clone().sub(tangentCol.clone().multiplyScalar(forwardDot)).normalize();
              glancingSlideVec = slideDir;
              speedLimitFactor = Math.min(speedLimitFactor, Math.sqrt(Math.max(0, 1 - forwardDot * forwardDot)));
            }
          }
        }
      }
      if (isBlockedAhead) break;
    }

    // High traction acceleration, active braking, and sticky ground friction
    let targetSpeed = forwardInput * this.maxSpeed * (this.isBoosting ? 1.85 : 1.0);

    // If pushing forward into a solid obstacle ahead
    if (forwardInput > 0) {
      if (isBlockedAhead) {
        targetSpeed = 0;
      } else if (glancingSlideVec) {
        // Gently guide the ball forward along the obstacle's outer perimeter
        this.ballForward.lerp(glancingSlideVec, Math.min(delta * 12.0, 1.0)).normalize();
        this.ballRight.crossVectors(this.ballNormal, this.ballForward).normalize();
        targetSpeed *= speedLimitFactor;
      }
    }

    if (forwardInput !== 0 && !isBlockedAhead && this.recoilTimer <= 0) {
      // If pressing opposite to current movement, apply sharp braking grip
      const isReversing = (forwardInput > 0 && this.rollSpeed < -0.1) || (forwardInput < 0 && this.rollSpeed > 0.1);
      const accelRate = isReversing ? this.brakeTraction : this.acceleration;

      if (isReversing && Math.abs(this.rollSpeed) > 1.8) {
        soundEngine.playTractionScuffSound();
      }

      this.rollSpeed += (targetSpeed - this.rollSpeed) * Math.min(delta * (accelRate / this.maxSpeed), 1.0);
    } else {
      // Sticky terrain grip: halts firmly without sliding or drifting like on ice
      this.rollSpeed = THREE.MathUtils.damp(this.rollSpeed, 0, this.recoilTimer > 0 ? 3.5 : this.friction, delta);
      if (Math.abs(this.rollSpeed) < 0.05) {
        this.rollSpeed = 0;
      }
    }

    // Rolling audio update
    soundEngine.updateRolling(Math.abs(this.rollSpeed));

    // Track previous ball position for zero-slip roll rotation
    const prevBallPos = this.ballPosition.clone();

    // Apply movement along spherical surface
    const moveDist = this.rollSpeed * delta;
    if (Math.abs(moveDist) > 0.00001) {
      const currentOrbitRadius = this.planetRadius + this.ballRadius;
      const angularDistance = moveDist / currentOrbitRadius;

      // Rotation axis on sphere is perpendicular to travel direction
      const sphereRotationAxis = this.ballRight.clone();
      const moveQuat = new THREE.Quaternion().setFromAxisAngle(sphereRotationAxis, angularDistance);

      // Rotate position around planet center (0,0,0)
      this.ballPosition.applyQuaternion(moveQuat);

      // Rotate forward and normal vectors along with sphere movement
      this.ballNormal.applyQuaternion(moveQuat).normalize();
      this.ballForward.applyQuaternion(moveQuat).normalize();
      this.ballRight.crossVectors(this.ballNormal, this.ballForward).normalize();
    }

    // Lock exact height to terrain surface along radial direction:
    // Prevents lateral snapping across faceted triangle edges
    const radialDir = this.ballPosition.clone().normalize();
    const ground = this.getGroundIntersection(radialDir);
    const terrainHeight = ground.position.length();

    // Firmly plant ball center at terrainHeight + ballRadius along radial normal
    this.ballPosition.copy(radialDir).multiplyScalar(terrainHeight + this.ballRadius);

    // Smooth surface normal alignment
    const targetNormal = radialDir.clone().lerp(ground.normal, 0.35).normalize();
    this.ballNormal.lerp(targetNormal, Math.min(delta * 14.0, 1.0)).normalize();
    this.ballRight.crossVectors(this.ballNormal, this.ballForward).normalize();
    this.ballForward.crossVectors(this.ballRight, this.ballNormal).normalize();

    // Strict solid collision penetration resolution immediately after move
    this.resolveSolidCollisions();

    // PURE ZERO-SLIP ROLLING KINEMATICS:
    // Compute actual 3D displacement vector across the ground
    const actualDelta = this.ballPosition.clone().sub(prevBallPos);
    const actualDist = actualDelta.length();

    if (actualDist > 0.0001) {
      // Rotation axis = contactNormal x actualDelta
      // This produces exactly zero linear velocity at the ground contact patch (v_contact = 0)
      const rollAxis = new THREE.Vector3().crossVectors(this.ballNormal, actualDelta).normalize();
      if (rollAxis.lengthSq() > 0.5) {
        const rollAngle = actualDist / this.ballRadius;
        const rollQuat = new THREE.Quaternion().setFromAxisAngle(rollAxis, rollAngle);
        this.ballGroup.quaternion.premultiply(rollQuat);
      }
    }

    // STEERING YAW TRACTION:
    // Ground traction rotates the ball on its contact patch when turning
    if (turnInput !== 0) {
      const yawAngle = -turnInput * this.turnSpeed * delta * 0.85;
      const yawQuat = new THREE.Quaternion().setFromAxisAngle(this.ballNormal, yawAngle);
      this.ballGroup.quaternion.premultiply(yawQuat);
    }

    // Update ball group position
    this.ballGroup.position.copy(this.ballPosition);

    // Update traction dust particles at ground contact point
    this.updateTractionParticles(delta, this.rollSpeed);

    // Update current biome
    const newBiome = getBiomeAtPosition(this.ballPosition);
    if (newBiome !== this.currentBiome) {
      this.currentBiome = newBiome;
      this.callbacks.onBiomeChange(newBiome);
    }
  }

  /**
   * Update moving animals and people across the planet
   */
  private updateDynamicEntities(delta: number) {
    if (!this.planetData) return;

    const playerPos = this.ballPosition;
    const currentRadius = this.ballRadius;
    const tempPos = new THREE.Vector3();
    const tempNormal = new THREE.Vector3();
    const tempHeading = new THREE.Vector3();
    const tempFlee = new THREE.Vector3();

    for (let i = 0; i < this.placedObjects.length; i++) {
      const obj = this.placedObjects[i];
      if (obj.isStuck || !obj.isDynamic) continue;

      const mesh = this.objectMeshes.get(obj.id);
      if (!mesh) continue;

      tempPos.set(obj.worldPos.x, obj.worldPos.y, obj.worldPos.z);
      const distToPlayer = tempPos.distanceTo(playerPos);
      const isPlayerThreat = currentRadius >= obj.radius * 0.72;

      // React to player: flee if player is nearby and large enough to roll them up!
      if (distToPlayer < 14.0 && isPlayerThreat) {
        obj.isScared = true;
        obj.scaredTimer = 2.5;
      } else if (obj.scaredTimer && obj.scaredTimer > 0) {
        obj.scaredTimer -= delta;
        if (obj.scaredTimer <= 0) {
          obj.isScared = false;
        }
      }

      // Cull far-side entities: they're beyond the horizon (~50u sight line on this
      // planet size), and animating each costs a terrain raycast against a 5k-triangle mesh
      if (distToPlayer > 70) continue;

      tempNormal.copy(tempPos).normalize();
      tempHeading.set(obj.heading?.x || 1, obj.heading?.y || 0, obj.heading?.z || 0);

      if (obj.isScared) {
        // Steer directly away from player along sphere surface
        tempFlee.copy(tempPos).sub(playerPos);
        tempFlee.sub(tempNormal.clone().multiplyScalar(tempFlee.dot(tempNormal))).normalize();
        if (tempFlee.lengthSq() > 0.001) {
          tempHeading.lerp(tempFlee, Math.min(delta * 5.5, 1.0)).normalize();
        }
      } else {
        // Gentle wander steering around surface normal
        const wanderSeed = i * 19.3 + Date.now() * 0.0008;
        const wanderAngle = Math.sin(wanderSeed) * 0.6 * delta;
        tempHeading.applyAxisAngle(tempNormal, wanderAngle).normalize();
      }

      // Keep heading orthogonal to surface normal
      tempHeading.sub(tempNormal.clone().multiplyScalar(tempHeading.dot(tempNormal))).normalize();

      const baseSpeed = obj.speed || 1.1;
      const currentSpeed = obj.isScared ? baseSpeed * 2.2 : baseSpeed;

      // Move along spherical planet surface
      const angularDist = (currentSpeed * delta) / this.planetRadius;
      const moveAxis = new THREE.Vector3().crossVectors(tempNormal, tempHeading).normalize();
      const moveQuat = new THREE.Quaternion().setFromAxisAngle(moveAxis, angularDist);

      tempPos.applyQuaternion(moveQuat);
      tempHeading.applyQuaternion(moveQuat);

      // Snap to exact ground terrain with slight 0.02 embed so feet are firmly planted
      const ground = this.getGroundIntersection(tempPos);
      const finalPos = ground.position.clone().sub(ground.normal.clone().multiplyScalar(0.02));

      mesh.position.copy(finalPos);

      // Orient mesh: Up along ground.normal, Forward along tempHeading
      const upVec = ground.normal;
      const forwardVec = tempHeading.clone().sub(upVec.clone().multiplyScalar(tempHeading.dot(upVec))).normalize();
      const rightVec = new THREE.Vector3().crossVectors(upVec, forwardVec).normalize();
      const rotMatrix = new THREE.Matrix4().makeBasis(rightVec, upVec, forwardVec);
      mesh.quaternion.setFromRotationMatrix(rotMatrix);

      // Save updated state
      obj.worldPos = { x: finalPos.x, y: finalPos.y, z: finalPos.z };
      obj.normal = { x: ground.normal.x, y: ground.normal.y, z: ground.normal.z };
      obj.heading = { x: forwardVec.x, y: forwardVec.y, z: forwardVec.z };

      // Procedural limb animation
      obj.animPhase = (obj.animPhase || 0) + delta * currentSpeed * 8.0;
      const phase = obj.animPhase;

      // 4-legged quadruped legs
      const legFL = mesh.getObjectByName('leg_fl');
      const legFR = mesh.getObjectByName('leg_fr');
      const legBL = mesh.getObjectByName('leg_bl');
      const legBR = mesh.getObjectByName('leg_br');
      if (legFL && legFR) {
        legFL.rotation.x = Math.sin(phase) * 0.45;
        legFR.rotation.x = -Math.sin(phase) * 0.45;
        if (legBL && legBR) {
          legBL.rotation.x = -Math.sin(phase) * 0.45;
          legBR.rotation.x = Math.sin(phase) * 0.45;
        }
      }

      // 2-legged humanoid / bird legs & arms
      const legL = mesh.getObjectByName('leg_l');
      const legR = mesh.getObjectByName('leg_r');
      const armL = mesh.getObjectByName('arm_l');
      const armR = mesh.getObjectByName('arm_r');
      if (legL && legR) {
        legL.rotation.x = Math.sin(phase) * 0.55;
        legR.rotation.x = -Math.sin(phase) * 0.55;
        if (armL && armR) {
          armL.rotation.x = -Math.sin(phase) * 0.45;
          armR.rotation.x = Math.sin(phase) * 0.45;
        }
      }

      // Tail wagging
      const tail = mesh.getObjectByName('tail');
      if (tail) {
        tail.rotation.y = Math.sin(phase * 2.0) * 0.4;
      }

      // Body tilt / waddle / hop
      const body = mesh.getObjectByName('body');
      if (body) {
        if (obj.defId === 'snow_penguin') {
          // Penguin waddle side to side
          body.rotation.z = Math.sin(phase) * 0.25;
        } else if (obj.defId === 'beach_crab') {
          // Crab scuttle tilt
          body.rotation.y = Math.sin(phase * 1.5) * 0.15;
        } else if (obj.defId === 'yeti') {
          // Yeti swagger sway
          body.rotation.z = Math.sin(phase) * 0.12;
        } else if (obj.defId === 'pizza_delivery') {
          // Scooter vibration and wheel spinning
          body.position.y = Math.sin(phase * 3.0) * 0.02;
          const wf = mesh.getObjectByName('wheel_f');
          const wr = mesh.getObjectByName('wheel_r');
          if (wf && wr) {
            wf.rotation.x += delta * currentSpeed * 10;
            wr.rotation.x += delta * currentSpeed * 10;
          }
        }
      }
    }
  }

  /**
   * Returns collision footprints on the planet surface for an obstacle.
   * Special case for 'sandstone_arch': if the ball is small enough (< 2.2m radius),
   * it provides colliders for the two side pillars (radius 0.75 at x = ±2.2),
   * allowing the player to roll freely right through the archway tunnel!
   */
  private getObstacleColliders(obj: PlacedObject): Array<{ pos: THREE.Vector3; radius: number }> {
    if (obj.defId === 'sandstone_arch' && this.ballRadius < 2.2 && obj.heading) {
      const normal = new THREE.Vector3(obj.normal.x, obj.normal.y, obj.normal.z);
      const heading = new THREE.Vector3(obj.heading.x, obj.heading.y, obj.heading.z);
      const right = new THREE.Vector3().crossVectors(normal, heading).normalize();
      const basePos = new THREE.Vector3(obj.worldPos.x, obj.worldPos.y, obj.worldPos.z);
      return [
        { pos: basePos.clone().addScaledVector(right, -2.2), radius: 0.75 },
        { pos: basePos.clone().addScaledVector(right, 2.2), radius: 0.75 }
      ];
    }
    return [
      { pos: new THREE.Vector3(obj.worldPos.x, obj.worldPos.y, obj.worldPos.z), radius: obj.collisionRadius }
    ];
  }

  /**
   * Triggers an elastic bounce back when colliding with an obstacle too large to roll up
   */
  private triggerObstacleBounce(incomingSpeed: number, obstaclePos?: THREE.Vector3) {
    const reboundSpeed = Math.max(Math.abs(incomingSpeed) * 0.6, 2.8);
    this.rollSpeed = -reboundSpeed;
    this.recoilTimer = 0.24; // Disables forward acceleration during recoil so ball visibly rolls backward
    this.bumpSquash = 0.22; // Squish ball slightly and spring back

    if (this.bumpFeedbackTimer <= 0) {
      soundEngine.playBumpSound();
      this.bumpFeedbackTimer = 0.25;

      const contactPos = obstaclePos
        ? this.ballPosition.clone().lerp(obstaclePos, 0.45)
        : this.ballPosition.clone().addScaledVector(this.ballForward, this.ballRadius);
      this.triggerBumpEffect(contactPos);
    }
  }

  /**
   * Resolves physical penetration with obstacles too large to stick to,
   * firmly pushing the ball out along the spherical surface tangent plane so it cannot clip through.
   */
  private resolveSolidCollisions() {
    const maxPasses = 3;
    const incomingSpeed = this.rollSpeed;

    for (let pass = 0; pass < maxPasses; pass++) {
      let hasPenetration = false;

      for (let i = 0; i < this.placedObjects.length; i++) {
        const obj = this.placedObjects[i];
        if (obj.isStuck) continue;

        // Skip objects that the ball can stick to
        const canStick = this.ballRadius >= obj.radius * 0.72;
        if (canStick) continue;

        const colliders = this.getObstacleColliders(obj);
        for (let c = 0; c < colliders.length; c++) {
          const col = colliders[c];
          if (this.ballPosition.distanceToSquared(col.pos) > 250) continue;

          // Horizontal distance in planet tangent plane
          const toBall = this.ballPosition.clone().sub(col.pos);
          const normalDot = toBall.dot(this.ballNormal);
          const tangentVec = toBall.sub(this.ballNormal.clone().multiplyScalar(normalDot));
          const distHoriz = tangentVec.length();

          const minAllowedDist = this.ballRadius + col.radius;

          if (distHoriz < minAllowedDist) {
            hasPenetration = true;
            const penetration = minAllowedDist - distHoriz;
            const tangentCol = distHoriz > 0.0001 ? tangentVec.normalize() : this.ballForward.clone().negate();

            // 1. Firm push-out along planet surface tangent plane
            this.ballPosition.addScaledVector(tangentCol, penetration);

            // Re-project firmly to planet terrain elevation along radial direction
            const radial = this.ballPosition.clone().normalize();
            const groundElev = this.getGroundIntersection(radial).position.length();
            this.ballPosition.copy(radial).multiplyScalar(groundElev + this.ballRadius);
            this.ballNormal.copy(radial);

            // Re-align ballForward to be orthogonal to ballNormal
            this.ballForward.sub(this.ballNormal.clone().multiplyScalar(this.ballForward.dot(this.ballNormal))).normalize();
            this.ballRight.crossVectors(this.ballNormal, this.ballForward).normalize();

            // 2. Velocity & Audio Impact Response: bounce back if moving into obstacle
            const forwardDot = this.ballForward.dot(tangentCol);
            if (forwardDot < -0.15 && this.recoilTimer <= 0) {
              this.triggerObstacleBounce(Math.max(Math.abs(incomingSpeed), 2.4), col.pos);
            }
          }
        }
      }

      if (!hasPenetration) break;
    }
  }

  private checkCollisions() {
    const tempObjPos = new THREE.Vector3();
    const effectiveStickRadius = this.ballRadius * 1.05;

    // 1. Check pickup and stick objects small enough to roll up
    for (let i = 0; i < this.placedObjects.length; i++) {
      const obj = this.placedObjects[i];
      if (obj.isStuck) continue;

      tempObjPos.set(obj.worldPos.x, obj.worldPos.y, obj.worldPos.z);
      if (this.ballPosition.distanceToSquared(tempObjPos) > 250) continue;

      const toBall = this.ballPosition.clone().sub(tempObjPos);
      const normalDot = toBall.dot(this.ballNormal);
      const distHoriz = toBall.sub(this.ballNormal.clone().multiplyScalar(normalDot)).length();

      const stickDist = effectiveStickRadius + obj.radius * 0.85;

      if (distHoriz <= stickDist) {
        // Size rule: ball can roll up items if ball is large enough!
        const canStick = this.ballRadius >= obj.radius * 0.72;
        if (canStick) {
          this.stickObject(obj);
        }
      }
    }

    // 2. Final safety resolve for solid obstacle clearance
    this.resolveSolidCollisions();
  }

  private stickObject(obj: PlacedObject) {
    obj.isStuck = true;
    obj.isDynamic = false;
    const mesh = this.objectMeshes.get(obj.id);
    if (!mesh) return;

    // Reset animated limbs to tidy neutral pose
    ['leg_fl', 'leg_fr', 'leg_bl', 'leg_br', 'leg_l', 'leg_r', 'arm_l', 'arm_r', 'tail'].forEach((partName) => {
      const p = mesh.getObjectByName(partName);
      if (p) p.rotation.set(0, 0, 0);
    });
    const body = mesh.getObjectByName('body');
    if (body && body.userData.initialY !== undefined) {
      body.position.y = body.userData.initialY;
      body.rotation.set(0, 0, 0);
    }

    // 1. Reparent mesh from scene to ballGroup
    // Preserve exact world transform during reparenting
    this.scene.remove(mesh);
    this.ballGroup.add(mesh);

    // Convert world position & orientation into ballGroup's local coordinate space
    this.ballGroup.worldToLocal(mesh.position);
    mesh.quaternion.premultiply(this.ballGroup.quaternion.clone().invert());

    // 2. Increase ball size proportionally
    const oldVol = Math.pow(this.targetRadius, 3);
    const addedVol = Math.pow(obj.radius * 0.48, 3);
    this.targetRadius = Math.cbrt(oldVol + addedVol);

    // 3. Add score
    const def = OBJECT_DEFINITIONS.find((d) => d.id === obj.defId);
    const pts = (def?.points || 20) * this.level;
    this.score += pts;

    // 4. Log stuck item
    const info: StuckObjectInfo = {
      name: obj.name,
      biome: obj.biome,
      radius: obj.radius,
      timestamp: Date.now(),
    };
    this.stuckObjectsList.push(info);

    // 5. Sound & visual fx
    soundEngine.playStickSound(obj.radius);
    this.triggerPickupEffect(this.ballPosition);
    this.callbacks.onObjectPickedUp(info);

    // 6. Check size milestone
    const currentDiameter = Math.round(this.targetRadius * 2 * 10) / 10;
    if (currentDiameter >= this.lastMilestonePassed + 1.0) {
      this.lastMilestonePassed = currentDiameter;
      soundEngine.playMilestoneSound();
      this.callbacks.onMilestoneReached(currentDiameter);
    }

    // 7. Check if all objects collected
    const remaining = this.placedObjects.filter((o) => !o.isStuck).length;
    if (remaining === 0) {
      this.handleVictory();
    }
  }

  private updateCamera(delta: number) {
    const ballPos = this.ballPosition;
    const up = this.ballNormal;
    const fwd = this.ballForward;

    // Camera distance scales smoothly with ball size
    let distBehind: number;
    let distAbove: number;

    if (this.isBirdEye) {
      distBehind = this.ballRadius * 5.0 + 8.0;
      distAbove = this.ballRadius * 7.0 + 18.0;
    } else {
      distBehind = this.ballRadius * 4.2 + 4.5;
      distAbove = this.ballRadius * 2.2 + 2.2;
    }

    // Target camera position behind the ball
    const targetCamPos = ballPos
      .clone()
      .addScaledVector(fwd, -distBehind)
      .addScaledVector(up, distAbove);

    // Smoothly interpolate camera position and up vector
    this.camera.position.lerp(targetCamPos, Math.min(delta * 6.5, 1.0));
    this.camera.up.lerp(up, Math.min(delta * 8.0, 1.0));

    // Look slightly ahead of the ball
    const lookTarget = ballPos.clone().addScaledVector(fwd, this.ballRadius * 1.5);
    this.camera.lookAt(lookTarget);
  }

  private handleTimeUp() {
    this.isGameOver = true;
    this.checkAndSaveHighScore();
    this.callbacks.onGameOver(this.getStats());
  }

  private handleVictory() {
    this.isGameOver = true;
    this.checkAndSaveHighScore();
    this.callbacks.onGameOver(this.getStats());
  }

  private checkAndSaveHighScore() {
    const diameter = this.ballRadius * 2;
    if (diameter > this.highScoreDiameter) {
      this.highScoreDiameter = diameter;
      localStorage.setItem('stickyroll_highscore_diameter', diameter.toString());
    }
  }

  public getStats(): GameStats {
    const diameter = this.ballRadius * 2;
    const collected = this.placedObjects.filter((o) => o.isStuck).length;
    return {
      level: this.level,
      score: this.score,
      ballRadius: this.ballRadius,
      ballDiameter: diameter,
      timeRemaining: Math.max(0, Math.ceil(this.timeRemaining)),
      totalObjectsCount: this.placedObjects.length,
      collectedCount: collected,
      stuckObjects: this.stuckObjectsList,
      currentBiome: this.currentBiome,
      highScoreDiameter: Math.max(this.highScoreDiameter, diameter),
      isGameOver: this.isGameOver,
      isPaused: this.isPaused,
      isVictory: collected >= this.placedObjects.length && this.placedObjects.length > 0,
    };
  }

  private emitStats() {
    this.callbacks.onStatsUpdate(this.getStats());
  }

  public destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    soundEngine.stopAmbientBGM();
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
