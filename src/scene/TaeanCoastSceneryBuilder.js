import * as THREE from 'three';

/**
 * Helper to create crisp procedural CanvasTexture for Korean + English coastal milestone signs.
 */
function createCoastalSignTexture(titleKr, titleEn, bgHex = '#2a4a5e', accentHex = '#ff9e44') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  // Weathered timber / coastal slate sign board
  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, 256, 128);

  // Inner subtle wood grain / border
  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 240, 112);

  ctx.fillStyle = '#fff9ee';
  ctx.font = 'bold 34px "Inter", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(titleKr, 128, 48);

  ctx.fillStyle = '#bfe9ff';
  ctx.font = 'bold 18px "Orbitron", "Inter", sans-serif';
  ctx.fillText(titleEn, 128, 88);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Helper to create striped fabric CanvasTexture for Mallipo beach parasols.
 */
function createParasolStripeTexture(colorA, colorB) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const slices = 8;
  for (let i = 0; i < slices; i++) {
    ctx.fillStyle = i % 2 === 0 ? colorA : colorB;
    ctx.fillRect((i / slices) * 128, 0, 128 / slices + 1, 128);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Builds handcrafted miniature South Korea West Coast (Taean Peninsula / 태안 반도) scenery:
 *  - West Sea ocean bay & sandy Mallipo / Kkotji shoreline with animated foam surf waves
 *  - Iconic Kkotji Halmi & Harabi Sea Stacks (꽃지 할미·할아비 바위) with coastal pines on top
 *  - Taean Red & White Coastal Lighthouse (태안 해안 등대) with rotating golden light beam
 *  - Mallipo Beach Resort zone: colorful striped beach parasols, loungers, lifeguard tower, boardwalk
 *  - Anmyeondo windswept coastal pine trees (안면도 해송 / 곰솔)
 *  - Traditional Taean Mudflats & Checkered Sea-Salt Pans (태안 천일염 염전 & 소금 창고)
 *  - Miniature Korean wooden fishing boats (서해 통통배) gently bobbing on the waves
 *  - Soaring West Sea seagulls (갈매기) circling above the coastline
 *  - Warm West Sea Sunset horizon orb & Korean coastal milestone signs
 */
export function buildTaeanCoastScenery(splineData) {
  const sceneryGroup = new THREE.Group();
  sceneryGroup.name = 'TaeanCoastSceneryGroup';

  const samples = splineData?.samples || [];
  const N = samples.length;

  // -------------------------------------------------------------------------
  // SHARED PBR MATERIALS (West Sea Golden Sand, Pine, Coastal Granite & Salt)
  // -------------------------------------------------------------------------
  const drySandMat = new THREE.MeshStandardMaterial({
    color: 0xd9be8c,
    roughness: 0.92,
    metalness: 0.0,
  });

  const wetSandMat = new THREE.MeshStandardMaterial({
    color: 0xa6895b,
    roughness: 0.34,
    metalness: 0.08,
  });

  const mudflatMat = new THREE.MeshStandardMaterial({
    color: 0x524c45,
    roughness: 0.48,
    metalness: 0.12,
  });

  const westSeaMat = new THREE.MeshPhysicalMaterial({
    color: 0x16556e,
    roughness: 0.14,
    metalness: 0.22,
    clearcoat: 0.65,
    clearcoatRoughness: 0.18,
    envMapIntensity: 1.4,
  });

  const sunsetReflectionMat = new THREE.MeshBasicMaterial({
    color: 0xffa64d,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
  });

  const surfFoamMat = new THREE.MeshBasicMaterial({
    color: 0xeef9ff,
    transparent: true,
    opacity: 0.58,
    depthWrite: false,
  });

  const graniteRockMat = new THREE.MeshStandardMaterial({
    color: 0x5c5752,
    roughness: 0.88,
    metalness: 0.05,
  });

  const darkTidalRockMat = new THREE.MeshStandardMaterial({
    color: 0x353433,
    roughness: 0.72,
    metalness: 0.08,
  });

  const pineBarkMat = new THREE.MeshStandardMaterial({
    color: 0x6f432b,
    roughness: 0.90,
    metalness: 0.02,
  });

  const pineNeedleMat = new THREE.MeshStandardMaterial({
    color: 0x1f592d,
    roughness: 0.78,
    metalness: 0.0,
  });

  const boardwalkWoodMat = new THREE.MeshStandardMaterial({
    color: 0x8a613e,
    roughness: 0.82,
    metalness: 0.02,
  });

  const saltWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xf4f7fa,
    roughness: 0.55,
    metalness: 0.04,
  });

  const brineWaterMat = new THREE.MeshStandardMaterial({
    color: 0x2f7d94,
    roughness: 0.08,
    metalness: 0.35,
    envMapIntensity: 1.6,
  });

  const lighthouseWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xf3f5f8,
    roughness: 0.42,
    metalness: 0.05,
  });

  const lighthouseRedMat = new THREE.MeshStandardMaterial({
    color: 0xd93829,
    roughness: 0.45,
    metalness: 0.06,
  });

  // -------------------------------------------------------------------------
  // 1. WEST SEA OCEAN BASIN, SANDY BEACHES & ANIMATED FOAM SURF (서해 바다 & 백사장)
  // -------------------------------------------------------------------------
  const oceanGroup = new THREE.Group();
  oceanGroup.name = 'TaeanWestSeaOcean';

  // Northern West Sea bay extending from cliff/headland out toward the horizon
  const northSeaGeo = new THREE.PlaneGeometry(1.12, 0.34);
  const northSeaMesh = new THREE.Mesh(northSeaGeo, westSeaMat);
  northSeaMesh.rotation.x = -Math.PI / 2;
  northSeaMesh.position.set(-0.02, 0.003, -0.32);
  northSeaMesh.receiveShadow = true;
  oceanGroup.add(northSeaMesh);

  // Shimmering Sunset Water Reflection Path toward the western horizon
  const sunStreakGeo = new THREE.PlaneGeometry(0.11, 0.24);
  const sunStreakMesh = new THREE.Mesh(sunStreakGeo, sunsetReflectionMat);
  sunStreakMesh.rotation.x = -Math.PI / 2;
  sunStreakMesh.rotation.z = -0.32;
  sunStreakMesh.position.set(-0.24, 0.0038, -0.30);
  oceanGroup.add(sunStreakMesh);

  // Northern Kkotji Beach Golden Sand Strip (between track and north sea)
  const northSandGeo = new THREE.BoxGeometry(0.68, 0.006, 0.11);
  const northSandMesh = new THREE.Mesh(northSandGeo, drySandMat);
  northSandMesh.position.set(-0.04, 0.004, -0.175);
  northSandMesh.receiveShadow = true;
  oceanGroup.add(northSandMesh);

  // Wet tidal zone on north beach
  const northWetGeo = new THREE.PlaneGeometry(0.64, 0.032);
  const northWetMesh = new THREE.Mesh(northWetGeo, wetSandMat);
  northWetMesh.rotation.x = -Math.PI / 2;
  northWetMesh.position.set(-0.04, 0.0048, -0.22);
  oceanGroup.add(northWetMesh);

  // Southern Mallipo Beach Sandy Strip (along the main beachfront straight, z ~ 0.25..0.31)
  const southSandGeo = new THREE.BoxGeometry(0.76, 0.005, 0.068);
  const southSandMesh = new THREE.Mesh(southSandGeo, drySandMat);
  southSandMesh.position.set(0.0, 0.004, 0.268);
  southSandMesh.receiveShadow = true;
  oceanGroup.add(southSandMesh);

  // Shallow turquoise surf strip lapping along the southern beach edge
  const southSeaGeo = new THREE.PlaneGeometry(0.78, 0.055);
  const southSeaMesh = new THREE.Mesh(southSeaGeo, westSeaMat);
  southSeaMesh.rotation.x = -Math.PI / 2;
  southSeaMesh.position.set(0.0, 0.0042, 0.305);
  oceanGroup.add(southSeaMesh);

  // Animated white surf wave ribbons (north & south)
  const waveBands = [];
  const waveGeoN = new THREE.PlaneGeometry(0.62, 0.009);
  for (let w = 0; w < 3; w++) {
    const wave = new THREE.Mesh(waveGeoN, surfFoamMat);
    wave.rotation.x = -Math.PI / 2;
    wave.position.set(-0.04, 0.0049, -0.23 - w * 0.022);
    wave.userData = { baseZ: -0.23 - w * 0.022, dir: 1, phase: w * 2.1 };
    oceanGroup.add(wave);
    waveBands.push(wave);
  }
  const waveGeoS = new THREE.PlaneGeometry(0.68, 0.007);
  for (let w = 0; w < 2; w++) {
    const wave = new THREE.Mesh(waveGeoS, surfFoamMat);
    wave.rotation.x = -Math.PI / 2;
    wave.position.set(0.0, 0.0049, 0.286 + w * 0.015);
    wave.userData = { baseZ: 0.286 + w * 0.015, dir: -1, phase: w * 2.5 + 1.0 };
    oceanGroup.add(wave);
    waveBands.push(wave);
  }

  // Setting Golden Sun on the distant West Sea Horizon
  const sunsetGroup = new THREE.Group();
  sunsetGroup.name = 'WestSeaSunset';
  sunsetGroup.position.set(-0.42, 0.115, -0.44);

  const sunOrbMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.036, 20, 16),
    new THREE.MeshBasicMaterial({ color: 0xff8c32, toneMapped: false })
  );
  sunsetGroup.add(sunOrbMesh);

  const sunHaloMesh = new THREE.Mesh(
    new THREE.RingGeometry(0.038, 0.068, 28),
    new THREE.MeshBasicMaterial({
      color: 0xffb35c,
      transparent: true,
      opacity: 0.30,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
  );
  sunsetGroup.add(sunHaloMesh);
  oceanGroup.add(sunsetGroup);

  sceneryGroup.add(oceanGroup);

  // -------------------------------------------------------------------------
  // 2. ANMYEONDO WINDSWEPT COASTAL PINES (안면도 해송 / 곰솔)
  // -------------------------------------------------------------------------
  function createCoastalPine(scale = 1.0, leanAngle = 0.14) {
    const pine = new THREE.Group();
    pine.name = 'AnmyeondoCoastalPine';

    // Lower curved trunk segment
    const trunkLow = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0018 * scale, 0.0028 * scale, 0.018 * scale, 7),
      pineBarkMat
    );
    trunkLow.position.set(0, 0.009 * scale, 0);
    trunkLow.rotation.z = leanAngle;
    trunkLow.castShadow = true;
    pine.add(trunkLow);

    // Upper gnarled windswept trunk segment
    const trunkHigh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0011 * scale, 0.0018 * scale, 0.016 * scale, 7),
      pineBarkMat
    );
    trunkHigh.position.set(-Math.sin(leanAngle) * 0.012 * scale, 0.023 * scale, 0);
    trunkHigh.rotation.z = -leanAngle * 0.6;
    trunkHigh.castShadow = true;
    pine.add(trunkHigh);

    // Flat-topped layered windswept pine needle pads (characteristic Korean sea pine silhouette)
    const pads = [
      { x: -0.004, y: 0.031, z: 0.001, r: 0.013, h: 0.0065 },
      { x: 0.005, y: 0.026, z: -0.003, r: 0.0095, h: 0.0055 },
      { x: -0.009, y: 0.024, z: 0.004, r: 0.0085, h: 0.005 },
    ];
    for (const pad of pads) {
      const canopy = new THREE.Mesh(
        new THREE.SphereGeometry(pad.r * scale, 10, 7),
        pineNeedleMat
      );
      canopy.position.set(pad.x * scale, pad.y * scale, pad.z * scale);
      canopy.scale.set(1.25, 0.48, 1.15);
      canopy.castShadow = true;
      pine.add(canopy);
    }

    return pine;
  }

  // -------------------------------------------------------------------------
  // 3. KKOTJI HALMI & HARABI SEA STACKS (꽃지 해수욕장 할미·할아비 바위)
  // -------------------------------------------------------------------------
  function createSeaStack(baseRadius, height, pineScale) {
    const stack = new THREE.Group();

    // Dark wet tidal rock base
    const baseRock = new THREE.Mesh(
      new THREE.CylinderGeometry(baseRadius * 0.88, baseRadius * 1.18, height * 0.30, 9),
      darkTidalRockMat
    );
    baseRock.position.y = height * 0.15;
    baseRock.castShadow = true;
    baseRock.receiveShadow = true;
    stack.add(baseRock);

    // Craggy upper granite spire
    const spire = new THREE.Mesh(
      new THREE.ConeGeometry(baseRadius * 0.85, height * 0.78, 8),
      graniteRockMat
    );
    spire.position.y = height * 0.58;
    spire.scale.set(1.0, 1.0, 0.86);
    spire.castShadow = true;
    stack.add(spire);

    // Side rock shoulder
    const shoulder = new THREE.Mesh(
      new THREE.DodecahedronGeometry(baseRadius * 0.55, 0),
      graniteRockMat
    );
    shoulder.position.set(baseRadius * 0.45, height * 0.34, baseRadius * 0.2);
    shoulder.scale.set(1.1, 1.4, 0.9);
    stack.add(shoulder);

    // Miniature windswept pine perched atop the sea stack!
    const topPine = createCoastalPine(pineScale, 0.20);
    topPine.position.set(0, height * 0.85, 0);
    stack.add(topPine);

    return stack;
  }

  const seaStacksGroup = new THREE.Group();
  seaStacksGroup.name = 'KkotjiHalmiHarabiRocks';

  // Harabi Rock (larger outer sea stack)
  const harabiRock = createSeaStack(0.022, 0.056, 0.65);
  harabiRock.position.set(-0.14, 0.003, -0.275);
  harabiRock.rotation.y = 0.4;
  seaStacksGroup.add(harabiRock);

  // Halmi Rock (companion sea stack)
  const halmiRock = createSeaStack(0.017, 0.044, 0.52);
  halmiRock.position.set(-0.075, 0.003, -0.258);
  halmiRock.rotation.y = -0.7;
  seaStacksGroup.add(halmiRock);

  sceneryGroup.add(seaStacksGroup);

  // -------------------------------------------------------------------------
  // 4. TAEAN COASTAL LIGHTHOUSE ON GRANITE HEADLAND (태안 빨간·하얀 해안 등대)
  // -------------------------------------------------------------------------
  const headlandGroup = new THREE.Group();
  headlandGroup.name = 'TaeanLighthouseHeadland';
  headlandGroup.position.set(0.32, 0.004, -0.22);

  // Granite rocky cliff mound
  const cliffBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.048, 0.078, 0.044, 12),
    graniteRockMat
  );
  cliffBase.position.y = 0.022;
  cliffBase.scale.set(1.2, 1.0, 0.92);
  cliffBase.castShadow = true;
  cliffBase.receiveShadow = true;
  headlandGroup.add(cliffBase);

  // Lighthouse Composite Structure
  const lighthouse = new THREE.Group();
  lighthouse.name = 'TaeanLighthouse';
  lighthouse.position.set(0, 0.044, 0);

  // Stone plinth
  const lhPlinth = new THREE.Mesh(
    new THREE.CylinderGeometry(0.013, 0.015, 0.010, 8),
    darkTidalRockMat
  );
  lhPlinth.position.y = 0.005;
  lighthouse.add(lhPlinth);

  // Alternating White & Crimson Red Tower Bands
  const bandHeights = [0.018, 0.018, 0.018, 0.016];
  const bandRadiiTop = [0.0108, 0.0096, 0.0084, 0.0074];
  const bandRadiiBot = [0.0120, 0.0108, 0.0096, 0.0084];
  let curY = 0.010;
  for (let b = 0; b < 4; b++) {
    const h = bandHeights[b];
    const band = new THREE.Mesh(
      new THREE.CylinderGeometry(bandRadiiTop[b], bandRadiiBot[b], h, 14),
      b % 2 === 0 ? lighthouseWhiteMat : lighthouseRedMat
    );
    band.position.y = curY + h * 0.5;
    band.castShadow = true;
    lighthouse.add(band);
    curY += h;
  }

  // Observation gallery balcony
  const balcony = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0105, 0.009, 0.0035, 14),
    lighthouseRedMat
  );
  balcony.position.y = curY + 0.0017;
  lighthouse.add(balcony);

  // Glowing lantern room
  const lanternGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0068, 0.0068, 0.010, 12),
    new THREE.MeshBasicMaterial({ color: 0xffe699, toneMapped: false })
  );
  lanternGlass.position.y = curY + 0.0085;
  lighthouse.add(lanternGlass);

  // Conical red lighthouse dome cap
  const lhCap = new THREE.Mesh(
    new THREE.ConeGeometry(0.0082, 0.009, 14),
    lighthouseRedMat
  );
  lhCap.position.y = curY + 0.018;
  lighthouse.add(lhCap);

  // Rotating Lighthouse Golden Searchlight Beam
  const beaconPivot = new THREE.Group();
  beaconPivot.position.y = curY + 0.0085;

  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xffd570,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const beamGeo = new THREE.ConeGeometry(0.036, 0.22, 16, 1, true);
  beamGeo.translate(0, -0.11, 0);
  beamGeo.rotateX(Math.PI / 2);

  const beamA = new THREE.Mesh(beamGeo, beamMat);
  beaconPivot.add(beamA);
  const beamB = new THREE.Mesh(beamGeo, beamMat);
  beamB.rotation.y = Math.PI;
  beaconPivot.add(beamB);

  lighthouse.add(beaconPivot);
  headlandGroup.add(lighthouse);
  sceneryGroup.add(headlandGroup);

  // -------------------------------------------------------------------------
  // 5. MALLIPO BEACH PARASOLS, LIFEGUARD TOWER & BOARDWALK (만리포 해수욕장)
  // -------------------------------------------------------------------------
  const beachGroup = new THREE.Group();
  beachGroup.name = 'MallipoBeachProps';

  const parasolPalettes = [
    ['#ff5e3a', '#fff6e8'],
    ['#00a8b5', '#fff8ee'],
    ['#ffb703', '#ffffff'],
    ['#e63946', '#f1faee'],
  ];

  function createBeachParasol(x, y, z, colorPair, rotY = 0) {
    const group = new THREE.Group();

    // Aluminum pole
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0006, 0.0006, 0.018, 6),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3, metalness: 0.7 })
    );
    pole.position.y = 0.009;
    group.add(pole);

    // Striped octagonal canopy
    const canopyTex = createParasolStripeTexture(colorPair[0], colorPair[1]);
    const canopy = new THREE.Mesh(
      new THREE.ConeGeometry(0.0115, 0.0055, 8),
      new THREE.MeshStandardMaterial({
        map: canopyTex,
        roughness: 0.75,
        side: THREE.DoubleSide,
      })
    );
    canopy.position.y = 0.017;
    canopy.castShadow = true;
    group.add(canopy);

    // Lounger towel + sunbed next to umbrella
    const towel = new THREE.Mesh(
      new THREE.BoxGeometry(0.007, 0.001, 0.012),
      new THREE.MeshStandardMaterial({ color: colorPair[0], roughness: 0.85 })
    );
    towel.position.set(0.009, 0.001, 0.002);
    towel.rotation.y = 0.15;
    group.add(towel);

    group.position.set(x, y, z);
    group.rotation.y = rotY;
    return group;
  }

  // Front Mallipo Beach Parasol Row (south of Start/Finish straight)
  const parasolPlacements = [
    [-0.18, 0.006, 0.268, 0, 0.2],
    [-0.08, 0.006, 0.272, 1, -0.3],
    [0.02, 0.006, 0.268, 2, 0.5],
    [0.14, 0.006, 0.270, 3, -0.1],
    [0.24, 0.006, 0.265, 0, 0.4],
    // North Kkotji cove beach parasols
    [-0.20, 0.006, -0.195, 1, 0.1],
    [-0.08, 0.006, -0.205, 2, -0.2],
    [0.06, 0.006, -0.198, 3, 0.3],
  ];
  for (const [px, py, pz, palIdx, rot] of parasolPlacements) {
    beachGroup.add(createBeachParasol(px, py, pz, parasolPalettes[palIdx % parasolPalettes.length], rot));
  }

  // Lifeguard Tower (해상 구조대 망루) near Mallipo straight
  const lifeguard = new THREE.Group();
  lifeguard.name = 'LifeguardTower';
  lifeguard.position.set(-0.26, 0.006, 0.274);

  for (const sx of [-0.006, 0.006]) {
    for (const sz of [-0.006, 0.006]) {
      const stilt = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0008, 0.001, 0.015, 6),
        boardwalkWoodMat
      );
      stilt.position.set(sx, 0.0075, sz);
      lifeguard.add(stilt);
    }
  }
  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(0.016, 0.002, 0.016),
    boardwalkWoodMat
  );
  deck.position.y = 0.015;
  lifeguard.add(deck);

  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(0.012, 0.011, 0.012),
    lighthouseWhiteMat
  );
  cabin.position.y = 0.0215;
  cabin.castShadow = true;
  lifeguard.add(cabin);

  const cabinRoof = new THREE.Mesh(
    new THREE.ConeGeometry(0.012, 0.006, 4),
    lighthouseRedMat
  );
  cabinRoof.position.y = 0.030;
  cabinRoof.rotation.y = Math.PI / 4;
  lifeguard.add(cabinRoof);

  // Orange lifebuoy ring on front wall
  const buoy = new THREE.Mesh(
    new THREE.TorusGeometry(0.0028, 0.0008, 8, 14),
    new THREE.MeshStandardMaterial({ color: 0xff5a1f, roughness: 0.4 })
  );
  buoy.position.set(0, 0.021, -0.0064);
  lifeguard.add(buoy);
  beachGroup.add(lifeguard);

  // Coastal Wooden Boardwalk Promenade along Sector 1/6 beach border
  const boardwalk = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.0024, 0.012),
    boardwalkWoodMat
  );
  boardwalk.position.set(0.0, 0.007, 0.256);
  boardwalk.receiveShadow = true;
  beachGroup.add(boardwalk);

  sceneryGroup.add(beachGroup);

  // -------------------------------------------------------------------------
  // 6. ANMYEONDO PINE GROVE & COASTAL DUNES (안면도 해송 숲길)
  // -------------------------------------------------------------------------
  const pineGroveGroup = new THREE.Group();
  pineGroveGroup.name = 'AnmyeondoPineGrove';

  const pinePlacements = [
    // Sector 2 & 3 coastal cliff pines (outside left curve)
    [-0.39, 0.018, 0.220, 1.15, 0.16],
    [-0.47, 0.022, 0.165, 1.30, 0.18],
    [-0.50, 0.028, 0.085, 1.25, 0.12],
    [-0.48, 0.036, -0.015, 1.35, -0.15],
    [-0.41, 0.044, -0.115, 1.20, 0.18],
    // Inner peninsula dunes & picnic grove
    [-0.30, 0.010, 0.145, 1.10, 0.12],
    [-0.24, 0.010, 0.110, 1.28, -0.14],
    [-0.28, 0.010, 0.035, 1.18, 0.15],
    [-0.20, 0.010, -0.035, 1.05, 0.10],
    // Eastern headland pines near lighthouse
    [0.26, 0.024, -0.21, 0.95, -0.16],
    [0.39, 0.022, -0.18, 1.05, 0.14],
  ];

  for (const [tx, ty, tz, sc, lean] of pinePlacements) {
    const pine = createCoastalPine(sc, lean);
    pine.position.set(tx, ty - 0.002, tz);
    pine.rotation.y = (tx * 17 + tz * 23) % (Math.PI * 2);
    pineGroveGroup.add(pine);
  }
  sceneryGroup.add(pineGroveGroup);

  // -------------------------------------------------------------------------
  // 7. TAEAN MUDFLATS & CHECKERED SALT PANS (태안 갯벌 & 천일염 염전)
  // -------------------------------------------------------------------------
  const saltPanGroup = new THREE.Group();
  saltPanGroup.name = 'TaeanSaltPans';
  saltPanGroup.position.set(0.24, 0.005, 0.045);

  // Dark tidal mudflat bed
  const mudBed = new THREE.Mesh(
    new THREE.BoxGeometry(0.19, 0.003, 0.15),
    mudflatMat
  );
  mudBed.position.y = 0.0015;
  mudBed.receiveShadow = true;
  saltPanGroup.add(mudBed);

  // 3x2 Grid of Checkered Evaporation Brine Ponds + Timber Walkways
  const pondGeo = new THREE.PlaneGeometry(0.048, 0.048);
  const saltPileGeo = new THREE.ConeGeometry(0.0075, 0.0075, 6);
  for (let gx = -1; gx <= 1; gx++) {
    for (let gz = -0.5; gz <= 0.5; gz += 1) {
      const px = gx * 0.056;
      const pz = gz * 0.058;

      const pond = new THREE.Mesh(pondGeo, brineWaterMat);
      pond.rotation.x = -Math.PI / 2;
      pond.position.set(px, 0.0035, pz);
      saltPanGroup.add(pond);

      // White pyramid of harvested sea salt inside some ponds
      if ((gx + 2) % 2 === 0 || gz > 0) {
        const pile = new THREE.Mesh(saltPileGeo, saltWhiteMat);
        pile.position.set(px + 0.01, 0.0068, pz - 0.008);
        pile.castShadow = true;
        saltPanGroup.add(pile);
      }
    }
  }

  // Traditional Dark-Timber Salt Storage Hut (소금 창고)
  const saltHut = new THREE.Group();
  saltHut.position.set(-0.068, 0.003, -0.050);

  const hutBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.028, 0.014, 0.022),
    new THREE.MeshStandardMaterial({ color: 0x3b2c22, roughness: 0.90 })
  );
  hutBody.position.y = 0.007;
  hutBody.castShadow = true;
  saltHut.add(hutBody);

  const hutRoof = new THREE.Mesh(
    new THREE.ConeGeometry(0.022, 0.010, 4),
    new THREE.MeshStandardMaterial({ color: 0x2a2d34, roughness: 0.78 })
  );
  hutRoof.position.y = 0.0185;
  hutRoof.rotation.y = Math.PI / 4;
  hutRoof.castShadow = true;
  saltHut.add(hutRoof);
  saltPanGroup.add(saltHut);

  sceneryGroup.add(saltPanGroup);

  // -------------------------------------------------------------------------
  // 8. MINIATURE KOREAN FISHING BOATS (서해 통통배 - Animated Bobbing)
  // -------------------------------------------------------------------------
  const boats = [];
  function createFishingBoat(hullHex, cabinTrimHex) {
    const boat = new THREE.Group();

    const hull = new THREE.Mesh(
      new THREE.BoxGeometry(0.013, 0.006, 0.032),
      new THREE.MeshStandardMaterial({ color: hullHex, roughness: 0.55 })
    );
    hull.position.y = 0.003;
    hull.castShadow = true;
    boat.add(hull);

    // Tapered bow
    const bow = new THREE.Mesh(
      new THREE.ConeGeometry(0.007, 0.012, 4),
      new THREE.MeshStandardMaterial({ color: hullHex, roughness: 0.55 })
    );
    bow.rotation.x = Math.PI / 2;
    bow.rotation.z = Math.PI / 4;
    bow.position.set(0, 0.0035, 0.020);
    boat.add(bow);

    // White wheelhouse cabin
    const wheelhouse = new THREE.Mesh(
      new THREE.BoxGeometry(0.009, 0.008, 0.011),
      lighthouseWhiteMat
    );
    wheelhouse.position.set(0, 0.0095, -0.002);
    boat.add(wheelhouse);

    const roofTrim = new THREE.Mesh(
      new THREE.BoxGeometry(0.010, 0.002, 0.012),
      new THREE.MeshStandardMaterial({ color: cabinTrimHex, roughness: 0.45 })
    );
    roofTrim.position.set(0, 0.014, -0.002);
    boat.add(roofTrim);

    // Mast
    const mast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0005, 0.0006, 0.016, 6),
      boardwalkWoodMat
    );
    mast.position.set(0, 0.015, 0.006);
    boat.add(mast);

    return boat;
  }

  const boat1 = createFishingBoat(0x1f6aa8, 0xff7b29);
  boat1.position.set(-0.24, 0.0035, -0.265);
  boat1.rotation.y = 0.85;
  boat1.userData = { baseY: 0.0035, phase: 0.0 };
  sceneryGroup.add(boat1);
  boats.push(boat1);

  const boat2 = createFishingBoat(0xc93b2b, 0x22a6b3);
  boat2.position.set(0.08, 0.0035, -0.255);
  boat2.rotation.y = -0.55;
  boat2.userData = { baseY: 0.0035, phase: 2.2 };
  sceneryGroup.add(boat2);
  boats.push(boat2);

  // -------------------------------------------------------------------------
  // 9. CIRCLING WEST SEA SEAGULLS (서해 갈매기 - Animated Flight)
  // -------------------------------------------------------------------------
  const gullOrbitGroup = new THREE.Group();
  gullOrbitGroup.name = 'WestSeaSeagulls';
  gullOrbitGroup.position.set(-0.08, 0.105, -0.20);

  const gullMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
  const gullBeakMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
  const gulls = [];

  for (let g = 0; g < 5; g++) {
    const gull = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.0025, 0.0022, 0.0075), gullMat);
    gull.add(body);

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.0008, 0.0025, 4), gullBeakMat);
    beak.rotation.x = Math.PI / 2;
    beak.position.z = 0.0048;
    gull.add(beak);

    const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.009, 0.0008, 0.003), gullMat);
    wingL.position.set(-0.005, 0.001, 0);
    wingL.rotation.z = -0.25;
    gull.add(wingL);

    const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.009, 0.0008, 0.003), gullMat);
    wingR.position.set(0.005, 0.001, 0);
    wingR.rotation.z = 0.25;
    gull.add(wingR);

    const angle = (g / 5) * Math.PI * 2;
    const rad = 0.08 + (g % 2) * 0.04;
    gull.position.set(Math.cos(angle) * rad, (g % 3) * 0.012, Math.sin(angle) * rad * 0.65);
    gull.rotation.y = -angle;
    gull.userData = { wingL, wingR, phase: g * 1.3 };
    gullOrbitGroup.add(gull);
    gulls.push(gull);
  }
  sceneryGroup.add(gullOrbitGroup);

  // -------------------------------------------------------------------------
  // 10. KOREAN COASTAL MILESTONE SIGNS (만리포 · 꽃지 · 태안 해송길 표지판)
  // -------------------------------------------------------------------------
  function createCoastalMilestone(titleKr, titleEn, x, y, z, rotY = 0) {
    const marker = new THREE.Group();

    const postL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0012, 0.0014, 0.018, 6),
      boardwalkWoodMat
    );
    postL.position.set(-0.006, 0.009, 0);
    marker.add(postL);

    const postR = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0012, 0.0014, 0.018, 6),
      boardwalkWoodMat
    );
    postR.position.set(0.006, 0.009, 0);
    marker.add(postR);

    const signTex = createCoastalSignTexture(titleKr, titleEn);
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(0.020, 0.010, 0.002),
      [
        boardwalkWoodMat,
        boardwalkWoodMat,
        boardwalkWoodMat,
        boardwalkWoodMat,
        new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.55 }),
        new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.55 }),
      ]
    );
    board.position.set(0, 0.015, 0);
    board.castShadow = true;
    marker.add(board);

    marker.position.set(x, y, z);
    marker.rotation.y = rotY;
    return marker;
  }

  // Mallipo Beach entrance sign (Sector 1)
  sceneryGroup.add(createCoastalMilestone('만리포 해수욕장', 'MALLIPO BEACH', 0.02, 0.015, 0.258, 0));
  // Kkotji Sea Stacks overlook sign (Sector 4)
  sceneryGroup.add(createCoastalMilestone('꽃지 할미·할아비바위', 'KKOTJI SUNSET', -0.05, 0.056, -0.184, Math.PI));
  // Anmyeondo Coastal Pine sign (Sector 2)
  sceneryGroup.add(createCoastalMilestone('안면도 해송길', 'ANMYEONDO PINE', -0.35, 0.024, 0.165, Math.PI * 0.28));

  // Suppress unused warning if samples array length check needed
  if (N > 0) {
    // Grounding reference check available for dynamic extensions
  }

  // -------------------------------------------------------------------------
  // CONTINUOUS 60FPS ANIMATION UPDATE (Lighthouse Beam, Waves, Boats, Gulls)
  // -------------------------------------------------------------------------
  sceneryGroup.userData.update = function (elapsedTime, delta) {
    // 1. Rotate the Taean Lighthouse golden searchlight beam
    if (beaconPivot) {
      beaconPivot.rotation.y += delta * 1.15;
    }

    // 2. Gently animate West Sea white surf waves rolling toward shore
    for (let i = 0; i < waveBands.length; i++) {
      const w = waveBands[i];
      const waveCycle = Math.sin(elapsedTime * 1.4 + w.userData.phase);
      w.position.z = w.userData.baseZ + waveCycle * 0.0065 * w.userData.dir;
      w.scale.x = 1.0 + waveCycle * 0.04;
    }

    // 3. Gently bob fishing boats on the sea swells
    for (let i = 0; i < boats.length; i++) {
      const b = boats[i];
      const t = elapsedTime * 1.8 + b.userData.phase;
      b.position.y = b.userData.baseY + Math.sin(t) * 0.0010;
      b.rotation.z = Math.sin(t * 0.9) * 0.06;
      b.rotation.x = Math.cos(t * 1.1) * 0.04;
    }

    // 4. Circle seagulls & flap wings gracefully
    if (gullOrbitGroup) {
      gullOrbitGroup.rotation.y = elapsedTime * 0.28;
      for (let i = 0; i < gulls.length; i++) {
        const g = gulls[i];
        const flap = Math.sin(elapsedTime * 7.5 + g.userData.phase) * 0.42;
        g.userData.wingL.rotation.z = -0.2 + flap;
        g.userData.wingR.rotation.z = 0.2 - flap;
      }
    }
  };

  return sceneryGroup;
}
