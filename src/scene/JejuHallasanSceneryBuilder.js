import * as THREE from 'three';

/**
 * Builds handcrafted miniature Jeju Island Mt. Hallasan scenery for the Hallasan 1100 Circuit.
 * Features:
 *  - Distant Mt. Hallasan volcanic shield peak with Baeknokdam (백록담) crater lake rim & mountain mist
 *  - Parasitic volcanic cones (오름 / Oreum) with smooth velvet green grass
 *  - Iconic Dol Hareubang (돌하르방) volcanic basalt stone grandfather statues with hats & belly pose
 *  - Jeju black basalt dry-stacked stone walls (흑룡만리 밭담 / 돌담) along winding curves
 *  - Saryeoni Cedar Forest (사려니 삼나무 & 한라산 구상나무) towering mountain tree corridors
 *  - Tamra Tangerine & Hallabong citrus orchards (탐라 감귤 & 한라봉) with bright ripe fruit & harvest boxes
 *  - Golden-yellow Canola flower fields (제주 유채꽃밭)
 *  - Rotating coastal wind turbine (제주 풍력발전기) gracefully spinning in the mountain breeze
 *  - Cute miniature Jeju pony (제주 조랑말) grazing peacefully on an oreum slope
 *  - Traditional wooden & basalt milestone signs ("한라산 1100고지", "백록담", "감귤길")
 */
export function buildJejuHallasanScenery(splineData) {
  const sceneryGroup = new THREE.Group();
  sceneryGroup.name = 'JejuHallasanSceneryGroup';

  const samples = splineData?.samples || [];
  const N = samples.length;

  // -------------------------------------------------------------------------
  // SHARED PBR MATERIALS (Authentic Jeju Volcanic & Natural Palette)
  // -------------------------------------------------------------------------
  // Porous dark volcanic basalt (현무암)
  const basaltDarkMat = new THREE.MeshStandardMaterial({
    color: 0x24272c,
    roughness: 0.95,
    metalness: 0.08,
  });

  const basaltWeatheredMat = new THREE.MeshStandardMaterial({
    color: 0x3a3e46,
    roughness: 0.90,
    metalness: 0.05,
  });

  // Mountain rock & slopes
  const mountainRockMat = new THREE.MeshStandardMaterial({
    color: 0x2e333b,
    roughness: 0.92,
    metalness: 0.05,
  });

  const mountainSlopeMat = new THREE.MeshStandardMaterial({
    color: 0x365430, // Alpine volcanic moss/grass
    roughness: 0.88,
    metalness: 0.02,
  });

  // Baeknokdam crater lake water
  const baeknokdamWaterMat = new THREE.MeshStandardMaterial({
    color: 0x1b728d,
    roughness: 0.15,
    metalness: 0.25,
    envMapIntensity: 1.5,
  });

  // Oreum velvet grass
  const oreumGrassMat = new THREE.MeshStandardMaterial({
    color: 0x437e38,
    roughness: 0.84,
    metalness: 0.0,
  });

  // Tangerine tree bark & leaves
  const citrusWoodMat = new THREE.MeshStandardMaterial({
    color: 0x543825,
    roughness: 0.86,
    metalness: 0.02,
  });

  const citrusLeafMat = new THREE.MeshStandardMaterial({
    color: 0x226224,
    roughness: 0.70,
    metalness: 0.0,
  });

  // Ripe Jeju Tangerine & Hallabong fruit
  const tangerineFruitMat = new THREE.MeshStandardMaterial({
    color: 0xff7200,
    roughness: 0.42,
    metalness: 0.05,
  });

  const hallabongFruitMat = new THREE.MeshStandardMaterial({
    color: 0xff8800,
    roughness: 0.40,
    metalness: 0.05,
  });

  // Canola flower petals
  const canolaFlowerMat = new THREE.MeshStandardMaterial({
    color: 0xffd400,
    roughness: 0.65,
    metalness: 0.0,
  });

  // Saryeoni Cedar bark & needles
  const cedarTrunkMat = new THREE.MeshStandardMaterial({
    color: 0x6e3b22,
    roughness: 0.88,
    metalness: 0.02,
  });

  const cedarNeedleMat = new THREE.MeshStandardMaterial({
    color: 0x1a4325,
    roughness: 0.80,
    metalness: 0.0,
  });

  // Wind Turbine
  const turbineWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xf2f5f8,
    roughness: 0.32,
    metalness: 0.08,
  });

  // Jeju Pony
  const ponyCoatMat = new THREE.MeshStandardMaterial({
    color: 0x61361c,
    roughness: 0.75,
    metalness: 0.02,
  });
  const ponyManeMat = new THREE.MeshStandardMaterial({
    color: 0x181412,
    roughness: 0.82,
    metalness: 0.0,
  });

  // Wood signs & crates
  const signWoodMat = new THREE.MeshStandardMaterial({
    color: 0x825634,
    roughness: 0.82,
    metalness: 0.04,
  });

  // -------------------------------------------------------------------------
  // 1. DISTANT MT. HALLASAN VOLCANIC PEAK & BAEKNOKDAM CRATER RIM (한라산 영봉)
  // -------------------------------------------------------------------------
  const hallasanGroup = new THREE.Group();
  hallasanGroup.name = 'HallasanPeakGroup';
  // Positioned majestically along the northern mountain ridge
  hallasanGroup.position.set(-0.06, 0.015, -0.34);

  // Volcanic Base Shield (broad gentle volcanic slope of Hallasan)
  const mountainBaseGeo = new THREE.ConeGeometry(0.38, 0.22, 28, 1, true);
  const mountainBaseMesh = new THREE.Mesh(mountainBaseGeo, mountainSlopeMat);
  mountainBaseMesh.position.y = 0.10;
  mountainBaseMesh.scale.set(1.4, 0.95, 0.9);
  mountainBaseMesh.castShadow = true;
  mountainBaseMesh.receiveShadow = true;
  hallasanGroup.add(mountainBaseMesh);

  // Rugged Basalt Rocky Crags (Upper Ridge & Summit Cliffs)
  const cragGeo = new THREE.CylinderGeometry(0.09, 0.22, 0.11, 16, 2);
  const cragMesh = new THREE.Mesh(cragGeo, mountainRockMat);
  cragMesh.position.y = 0.19;
  cragMesh.scale.set(1.15, 1.0, 0.85);
  cragMesh.castShadow = true;
  cragMesh.receiveShadow = true;
  hallasanGroup.add(cragMesh);

  // Baeknokdam Crater Lake Rim (백록담 분화구 림)
  const craterRimGeo = new THREE.TorusGeometry(0.042, 0.014, 10, 24);
  const craterRimMesh = new THREE.Mesh(craterRimGeo, basaltDarkMat);
  craterRimMesh.rotation.x = Math.PI * 0.5;
  craterRimMesh.position.y = 0.245;
  craterRimMesh.castShadow = true;
  hallasanGroup.add(craterRimMesh);

  // Baeknokdam Crater Water Surface (푸른 분화구 호수)
  const craterWaterGeo = new THREE.CircleGeometry(0.041, 24);
  const craterWaterMesh = new THREE.Mesh(craterWaterGeo, baeknokdamWaterMat);
  craterWaterMesh.rotation.x = -Math.PI * 0.5;
  craterWaterMesh.position.y = 0.242;
  hallasanGroup.add(craterWaterMesh);

  // Craggy Summit Rock Horns (Summit peaks flanking crater)
  const hornGeo = new THREE.ConeGeometry(0.016, 0.038, 6);
  for (let a = 0; a < Math.PI * 2; a += Math.PI * 0.45) {
    const rx = Math.cos(a) * 0.044;
    const rz = Math.sin(a) * 0.044;
    const horn = new THREE.Mesh(hornGeo, mountainRockMat);
    horn.position.set(rx, 0.252, rz);
    horn.rotation.y = a;
    horn.rotation.z = (Math.sin(a * 3) * 0.15);
    hallasanGroup.add(horn);
  }

  // Floating Mountain Cloud / Mist Ribbon around the Hallasan slopes
  const cloudGroup = new THREE.Group();
  cloudGroup.name = 'HallasanMistBands';
  const mistMat = new THREE.MeshBasicMaterial({
    color: 0xe8f0f8,
    transparent: true,
    opacity: 0.38,
    depthWrite: false,
  });

  const mistRingGeo = new THREE.TorusGeometry(0.24, 0.026, 8, 32);
  const mistRingMesh = new THREE.Mesh(mistRingGeo, mistMat);
  mistRingMesh.rotation.x = Math.PI * 0.48;
  mistRingMesh.position.y = 0.135;
  cloudGroup.add(mistRingMesh);

  // A couple of soft wispy cloud puffs
  const puffGeo = new THREE.SphereGeometry(0.032, 12, 10);
  for (let p = 0; p < 5; p++) {
    const puff = new THREE.Mesh(puffGeo, mistMat);
    const ang = p * 1.25;
    puff.position.set(Math.cos(ang) * 0.25, 0.14 + (p % 2) * 0.02, Math.sin(ang) * 0.16);
    puff.scale.set(1.6, 0.6, 1.2);
    cloudGroup.add(puff);
  }
  hallasanGroup.add(cloudGroup);
  sceneryGroup.add(hallasanGroup);

  // -------------------------------------------------------------------------
  // 2. PARASITIC VOLCANIC CONES (오름 / Oreum)
  // -------------------------------------------------------------------------
  const oreumGroup = new THREE.Group();
  oreumGroup.name = 'JejuOreumHills';

  // West Oreum (Darangshi style dome)
  const oreumWestGeo = new THREE.ConeGeometry(0.18, 0.095, 24);
  const oreumWestMesh = new THREE.Mesh(oreumWestGeo, oreumGrassMat);
  oreumWestMesh.position.set(-0.38, 0.046, -0.27);
  oreumWestMesh.scale.set(1.2, 0.9, 1.0);
  oreumWestMesh.castShadow = true;
  oreumWestMesh.receiveShadow = true;
  oreumGroup.add(oreumWestMesh);

  // East Oreum (Yongnuni style saddleback cone with wind turbine on top)
  const oreumEastGeo = new THREE.ConeGeometry(0.22, 0.105, 24);
  const oreumEastMesh = new THREE.Mesh(oreumEastGeo, oreumGrassMat);
  oreumEastMesh.position.set(0.36, 0.052, -0.21);
  oreumEastMesh.scale.set(1.3, 0.95, 1.1);
  oreumEastMesh.castShadow = true;
  oreumEastMesh.receiveShadow = true;
  oreumGroup.add(oreumEastMesh);
  sceneryGroup.add(oreumGroup);

  // -------------------------------------------------------------------------
  // 3. JEJU COASTAL WIND TURBINE (제주 삼달리 풍력 발전기 - Animated)
  // -------------------------------------------------------------------------
  const turbineGroup = new THREE.Group();
  turbineGroup.name = 'JejuWindTurbine';
  turbineGroup.position.set(0.38, 0.102, -0.20); // Perched on the East Oreum summit

  // Tapered White Tower
  const towerGeo = new THREE.CylinderGeometry(0.0032, 0.0065, 0.125, 14);
  const towerMesh = new THREE.Mesh(towerGeo, turbineWhiteMat);
  towerMesh.position.y = 0.0625;
  towerMesh.castShadow = true;
  turbineGroup.add(towerMesh);

  // Nacelle Generator Housing
  const nacelleGeo = new THREE.BoxGeometry(0.012, 0.009, 0.024);
  const nacelleMesh = new THREE.Mesh(nacelleGeo, turbineWhiteMat);
  nacelleMesh.position.set(0.0, 0.126, 0.003);
  nacelleMesh.castShadow = true;
  turbineGroup.add(nacelleMesh);

  // Rotor Hub & 3 Aerodynamic Blades
  const rotorHubGroup = new THREE.Group();
  rotorHubGroup.name = 'TurbineRotorHub';
  rotorHubGroup.position.set(0.0, 0.126, 0.015);

  const noseConeGeo = new THREE.ConeGeometry(0.0045, 0.009, 12);
  const noseConeMesh = new THREE.Mesh(noseConeGeo, turbineWhiteMat);
  noseConeMesh.rotation.x = Math.PI * 0.5;
  rotorHubGroup.add(noseConeMesh);

  // 3 Blades (120 deg apart)
  const bladeGeo = new THREE.BoxGeometry(0.0028, 0.065, 0.001);
  bladeGeo.translate(0, 0.032, 0); // Pivot at hub center
  for (let b = 0; b < 3; b++) {
    const blade = new THREE.Mesh(bladeGeo, turbineWhiteMat);
    blade.rotation.z = b * ((Math.PI * 2) / 3);
    blade.castShadow = true;
    rotorHubGroup.add(blade);
  }
  turbineGroup.add(rotorHubGroup);
  sceneryGroup.add(turbineGroup);

  // -------------------------------------------------------------------------
  // 4. AUTHENTIC DOL HAREUBANG (돌하르방 - Stone Grandfathers)
  // -------------------------------------------------------------------------
  function createDolHareubang(scale = 1.0, isLeftHandHigh = true) {
    const hareubang = new THREE.Group();
    hareubang.name = 'DolHareubang';

    // 1. Plinth Base (Faceted porous basalt block)
    const baseGeo = new THREE.BoxGeometry(0.013 * scale, 0.004 * scale, 0.013 * scale);
    const baseMesh = new THREE.Mesh(baseGeo, basaltDarkMat);
    baseMesh.position.y = (0.002 * scale);
    baseMesh.castShadow = true;
    hareubang.add(baseMesh);

    // 2. Body / Robe Torso
    const bodyGeo = new THREE.CylinderGeometry(
      0.0055 * scale,
      0.0062 * scale,
      0.016 * scale,
      12
    );
    const bodyMesh = new THREE.Mesh(bodyGeo, basaltDarkMat);
    bodyMesh.position.y = (0.012 * scale);
    bodyMesh.castShadow = true;
    hareubang.add(bodyMesh);

    // 3. Arms & Hands in Iconic Asymmetric Pose (Hands resting on chest/belly)
    const armGeo = new THREE.CylinderGeometry(0.0016 * scale, 0.0016 * scale, 0.0075 * scale, 6);
    // Right arm
    const armR = new THREE.Mesh(armGeo, basaltWeatheredMat);
    armR.position.set(0.0055 * scale, isLeftHandHigh ? 0.011 * scale : 0.014 * scale, 0.003 * scale);
    armR.rotation.z = Math.PI * 0.35;
    armR.rotation.y = -Math.PI * 0.2;
    hareubang.add(armR);

    // Left arm
    const armL = new THREE.Mesh(armGeo, basaltWeatheredMat);
    armL.position.set(-0.0055 * scale, isLeftHandHigh ? 0.014 * scale : 0.011 * scale, 0.003 * scale);
    armL.rotation.z = -Math.PI * 0.35;
    armL.rotation.y = Math.PI * 0.2;
    hareubang.add(armL);

    // 4. Characteristic Head
    const headGeo = new THREE.SphereGeometry(0.0065 * scale, 12, 10);
    const headMesh = new THREE.Mesh(headGeo, basaltDarkMat);
    headMesh.position.y = (0.024 * scale);
    headMesh.scale.set(0.95, 1.15, 0.95);
    headMesh.castShadow = true;
    hareubang.add(headMesh);

    // 5. Mushroom-Brim Stone Hat (벙거지 모자)
    const hatBrimGeo = new THREE.CylinderGeometry(0.0095 * scale, 0.0085 * scale, 0.0022 * scale, 14);
    const hatBrim = new THREE.Mesh(hatBrimGeo, basaltDarkMat);
    hatBrim.position.y = (0.031 * scale);
    hatBrim.castShadow = true;
    hareubang.add(hatBrim);

    const hatCrownGeo = new THREE.SphereGeometry(0.0068 * scale, 12, 8);
    const hatCrown = new THREE.Mesh(hatCrownGeo, basaltDarkMat);
    hatCrown.position.y = (0.0325 * scale);
    hatCrown.scale.set(1.0, 0.75, 1.0);
    hatCrown.castShadow = true;
    hareubang.add(hatCrown);

    // 6. Facial Features: Bulging Eyes, Broad Nose, Smiling Lips
    const eyeGeo = new THREE.SphereGeometry(0.0016 * scale, 8, 8);
    const eyeR = new THREE.Mesh(eyeGeo, basaltWeatheredMat);
    eyeR.position.set(0.0025 * scale, 0.025 * scale, 0.0055 * scale);
    hareubang.add(eyeR);

    const eyeL = new THREE.Mesh(eyeGeo, basaltWeatheredMat);
    eyeL.position.set(-0.0025 * scale, 0.025 * scale, 0.0055 * scale);
    hareubang.add(eyeL);

    // Broad bulbous nose
    const noseGeo = new THREE.BoxGeometry(0.0025 * scale, 0.0035 * scale, 0.002 * scale);
    const nose = new THREE.Mesh(noseGeo, basaltWeatheredMat);
    nose.position.set(0.0, 0.023 * scale, 0.0062 * scale);
    hareubang.add(nose);

    // Ears (long stone earlobes)
    const earGeo = new THREE.CylinderGeometry(0.001 * scale, 0.001 * scale, 0.005 * scale, 6);
    const earR = new THREE.Mesh(earGeo, basaltDarkMat);
    earR.position.set(0.0065 * scale, 0.0235 * scale, 0.0);
    hareubang.add(earR);

    const earL = new THREE.Mesh(earGeo, basaltDarkMat);
    earL.position.set(-0.0065 * scale, 0.0235 * scale, 0.0);
    hareubang.add(earL);

    return hareubang;
  }

  // Place Grand Gatekeeper Dol Hareubangs along the circuit
  // 1. Entrance Pair at Start / Sector 1
  const gateLeft = createDolHareubang(1.25, true);
  gateLeft.position.set(-0.11, 0.018, 0.262);
  gateLeft.rotation.y = Math.PI * 0.12;
  sceneryGroup.add(gateLeft);

  const gateRight = createDolHareubang(1.25, false);
  gateRight.position.set(-0.02, 0.018, 0.262);
  gateRight.rotation.y = -Math.PI * 0.15;
  sceneryGroup.add(gateRight);

  // 2. High Summit Overlook Dol Hareubang (1100 Ridge - Sector 4)
  const summitHareubang = createDolHareubang(1.35, true);
  summitHareubang.position.set(0.24, 0.078, -0.095);
  summitHareubang.rotation.y = -Math.PI * 0.45;
  sceneryGroup.add(summitHareubang);

  // 3. Saryeoni Pass Gatekeeper (Sector 3)
  const passHareubang = createDolHareubang(1.1, false);
  passHareubang.position.set(-0.25, 0.060, -0.178);
  passHareubang.rotation.y = Math.PI * 0.35;
  sceneryGroup.add(passHareubang);

  // -------------------------------------------------------------------------
  // 5. JEJU BASALT DRY-STACKED STONE WALLS (흑룡만리 돌담 / 밭담)
  // -------------------------------------------------------------------------
  const stoneWallsGroup = new THREE.Group();
  stoneWallsGroup.name = 'JejuBasaltWalls';

  const stoneRockGeoA = new THREE.DodecahedronGeometry(0.0035, 1);
  const stoneRockGeoB = new THREE.DodecahedronGeometry(0.0028, 1);

  // Wall segments along track curves (Sectors 2, 4, 5)
  const wallRanges = [
    { start: 70, end: 170, step: 8, side: -1, offset: 0.018 },
    { start: 240, end: 350, step: 9, side: 1, offset: 0.018 },
    { start: 420, end: 540, step: 8, side: -1, offset: 0.018 },
    { start: 600, end: 690, step: 9, side: 1, offset: 0.019 },
  ];

  if (N > 0) {
    for (const range of wallRanges) {
      for (let i = range.start; i <= range.end; i += range.step) {
        const s = samples[i % N];
        const p = new THREE.Vector3(...s.position);
        const r = new THREE.Vector3(...s.right);

        const rockBasePos = p.clone().addScaledVector(r, range.side * range.offset);
        const wallY = Math.max(0.002, rockBasePos.y - 0.001);

        // Lower boulder
        const rock1 = new THREE.Mesh(stoneRockGeoA, basaltDarkMat);
        rock1.position.set(rockBasePos.x, wallY + 0.0025, rockBasePos.z);
        rock1.scale.set(1.4, 0.85, 1.2);
        rock1.rotation.set((i * 0.4) % 1, (i * 0.7) % 3, 0);
        rock1.castShadow = true;
        stoneWallsGroup.add(rock1);

        // Stacked upper boulder
        const rock2 = new THREE.Mesh(stoneRockGeoB, basaltWeatheredMat);
        rock2.position.set(rockBasePos.x + (Math.sin(i) * 0.001), wallY + 0.0055, rockBasePos.z + (Math.cos(i) * 0.001));
        rock2.scale.set(1.2, 0.8, 1.1);
        rock2.rotation.set((i * 0.8) % 2, (i * 0.5) % 3, 0);
        rock2.castShadow = true;
        stoneWallsGroup.add(rock2);
      }
    }
  }
  sceneryGroup.add(stoneWallsGroup);

  // -------------------------------------------------------------------------
  // 6. SARYEONI CEDAR & KOREAN FIR TREES (사려니 삼나무 & 구상나무 숲)
  // -------------------------------------------------------------------------
  function createCedarTree(scale = 1.0) {
    const tree = new THREE.Group();
    tree.name = 'SaryeoniCedar';

    // Tall Slender Cedar Trunk
    const trunkH = 0.038 * scale;
    const trunkGeo = new THREE.CylinderGeometry(0.0014 * scale, 0.0022 * scale, trunkH, 8);
    const trunk = new THREE.Mesh(trunkGeo, cedarTrunkMat);
    trunk.position.y = trunkH * 0.5;
    trunk.castShadow = true;
    tree.add(trunk);

    // Multi-tier Conical Evergreen Needles
    const tierHeights = [0.016, 0.024, 0.032, 0.040, 0.047];
    const tierRadii = [0.013, 0.011, 0.009, 0.0065, 0.0035];

    for (let t = 0; t < tierHeights.length; t++) {
      const coneH = 0.015 * scale;
      const coneR = tierRadii[t] * scale;
      const tierGeo = new THREE.ConeGeometry(coneR, coneH, 8);
      const tier = new THREE.Mesh(tierGeo, cedarNeedleMat);
      tier.position.y = (tierHeights[t] * scale);
      tier.castShadow = true;
      tree.add(tier);
    }
    return tree;
  }

  const forestGroup = new THREE.Group();
  forestGroup.name = 'SaryeoniForest';

  // Clusters lining Sector 3 Mountain Pass
  const cedarPositions = [
    [-0.14, 0.065, -0.19, 1.25],
    [-0.08, 0.068, -0.19, 1.4],
    [-0.02, 0.072, -0.185, 1.3],
    [0.05, 0.074, -0.18, 1.5],
    [0.11, 0.075, -0.19, 1.35],
    [0.17, 0.076, -0.18, 1.2],
    // Opposite side
    [-0.11, 0.064, -0.135, 1.15],
    [-0.04, 0.069, -0.125, 1.2],
    [0.03, 0.072, -0.130, 1.3],
    [0.09, 0.074, -0.135, 1.1],
  ];

  for (const [cx, cy, cz, cScale] of cedarPositions) {
    const tree = createCedarTree(cScale);
    tree.position.set(cx, cy - 0.004, cz);
    tree.rotation.y = Math.random() * Math.PI * 2;
    forestGroup.add(tree);
  }
  sceneryGroup.add(forestGroup);

  // -------------------------------------------------------------------------
  // 7. TAMRA TANGERINE & HALLABONG ORCHARDS (탐라 감귤 & 한라봉 과수원)
  // -------------------------------------------------------------------------
  function createTangerineTree(scale = 1.0, isHallabong = false) {
    const tree = new THREE.Group();
    tree.name = isHallabong ? 'HallabongTree' : 'TangerineTree';

    // Gnarled low trunk
    const trunkH = 0.016 * scale;
    const trunkGeo = new THREE.CylinderGeometry(0.0018 * scale, 0.0026 * scale, trunkH, 7);
    const trunk = new THREE.Mesh(trunkGeo, citrusWoodMat);
    trunk.position.y = trunkH * 0.5;
    trunk.castShadow = true;
    tree.add(trunk);

    // Rounded leafy crown globes
    const crownMat = citrusLeafMat;
    const centerCrownGeo = new THREE.SphereGeometry(0.012 * scale, 10, 8);
    const centerCrown = new THREE.Mesh(centerCrownGeo, crownMat);
    centerCrown.position.y = (0.020 * scale);
    centerCrown.scale.set(1.2, 0.95, 1.2);
    centerCrown.castShadow = true;
    tree.add(centerCrown);

    // Sub foliage puffs
    const subGeo = new THREE.SphereGeometry(0.0085 * scale, 8, 6);
    for (let i = 0; i < 4; i++) {
      const ang = (i * Math.PI * 0.5) + 0.3;
      const sub = new THREE.Mesh(subGeo, crownMat);
      sub.position.set(
        Math.cos(ang) * 0.007 * scale,
        (0.018 + (i % 2) * 0.003) * scale,
        Math.sin(ang) * 0.007 * scale
      );
      tree.add(sub);
    }

    // Bright Ripe Fruits (Dozens of glossy oranges!)
    const fruitGeo = new THREE.SphereGeometry(0.0022 * scale, 6, 6);
    const fruitMat = isHallabong ? hallabongFruitMat : tangerineFruitMat;

    for (let f = 0; f < 10; f++) {
      const u = (f / 10) * Math.PI * 2;
      const r = (0.008 + (f % 3) * 0.003) * scale;
      const y = (0.014 + (f % 4) * 0.0025) * scale;
      const fruit = new THREE.Mesh(fruitGeo, fruitMat);
      fruit.position.set(Math.cos(u) * r, y, Math.sin(u) * r);
      // Hallabong has distinctive protruding stem cap
      if (isHallabong) {
        fruit.scale.set(1.0, 1.25, 1.0);
      }
      tree.add(fruit);
    }
    return tree;
  }

  // Orchard Grove along Sector 6 and Lower Straight
  const orchardGroup = new THREE.Group();
  orchardGroup.name = 'TangerineOrchard';

  const orchardPlacements = [
    [0.18, 0.018, 0.265, 1.15, false],
    [0.26, 0.018, 0.268, 1.2, true],
    [0.32, 0.020, 0.258, 1.1, false],
    [0.38, 0.024, 0.250, 1.25, true],
    [0.44, 0.028, 0.235, 1.1, false],
    // Inner orchard patch
    [0.15, 0.018, 0.208, 1.0, true],
    [0.23, 0.020, 0.198, 1.15, false],
  ];

  for (const [ox, oy, oz, oScale, isHb] of orchardPlacements) {
    const tree = createTangerineTree(oScale, isHb);
    tree.position.set(ox, oy, oz);
    tree.rotation.y = Math.random() * Math.PI * 2;
    orchardGroup.add(tree);
  }

  // Wooden Fruit Crates filled with harvested Jeju oranges
  function createOrangeCrate(x, y, z) {
    const crate = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(0.009, 0.0055, 0.007);
    const box = new THREE.Mesh(boxGeo, signWoodMat);
    box.position.y = 0.00275;
    box.castShadow = true;
    crate.add(box);

    // Oranges inside
    const miniOrangeGeo = new THREE.SphereGeometry(0.0014, 5, 5);
    for (let ox = -0.0025; ox <= 0.0025; ox += 0.0025) {
      for (let oz = -0.002; oz <= 0.002; oz += 0.002) {
        const o = new THREE.Mesh(miniOrangeGeo, tangerineFruitMat);
        o.position.set(ox, 0.0056, oz);
        crate.add(o);
      }
    }
    crate.position.set(x, y, z);
    return crate;
  }

  orchardGroup.add(createOrangeCrate(0.12, 0.017, 0.262));
  orchardGroup.add(createOrangeCrate(0.132, 0.017, 0.262));
  orchardGroup.add(createOrangeCrate(0.126, 0.022, 0.262)); // Stacked crate!
  sceneryGroup.add(orchardGroup);

  // -------------------------------------------------------------------------
  // 8. BRIGHT CANOLA FLOWER FIELDS (제주 유채꽃밭)
  // -------------------------------------------------------------------------
  const canolaGroup = new THREE.Group();
  canolaGroup.name = 'CanolaFlowerFields';

  const canolaPatchGeo = new THREE.BoxGeometry(0.022, 0.0035, 0.018);
  const petalMeshGeo = new THREE.SphereGeometry(0.0016, 5, 4);

  // Roadside canola flower strips
  const canolaBeds = [
    [-0.24, 0.019, 0.252, 1.2],
    [-0.32, 0.025, 0.230, 1.4],
    [-0.38, 0.032, 0.185, 1.3],
    [0.36, 0.034, 0.195, 1.2],
    [0.40, 0.042, 0.145, 1.3],
  ];

  for (const [bx, by, bz, bScale] of canolaBeds) {
    const bed = new THREE.Mesh(canolaPatchGeo, oreumGrassMat);
    bed.position.set(bx, by, bz);
    bed.scale.set(bScale, 1.0, bScale);
    canolaGroup.add(bed);

    // Dotted bright yellow florets
    for (let f = 0; f < 8; f++) {
      const floret = new THREE.Mesh(petalMeshGeo, canolaFlowerMat);
      floret.position.set(
        bx + (Math.sin(f * 2.1) * 0.008 * bScale),
        by + 0.0028,
        bz + (Math.cos(f * 1.7) * 0.006 * bScale)
      );
      canolaGroup.add(floret);
    }
  }
  sceneryGroup.add(canolaGroup);

  // -------------------------------------------------------------------------
  // 9. CUTE MINIATURE JEJU PONY (제주 조랑말) GRAZING ON OREUM
  // -------------------------------------------------------------------------
  const ponyGroup = new THREE.Group();
  ponyGroup.name = 'JejuPony';
  ponyGroup.position.set(-0.35, 0.065, -0.22); // Grazing on the West Oreum
  ponyGroup.rotation.y = Math.PI * 0.35;

  // Body
  const ponyBodyGeo = new THREE.BoxGeometry(0.014, 0.008, 0.007);
  const ponyBody = new THREE.Mesh(ponyBodyGeo, ponyCoatMat);
  ponyBody.position.y = 0.008;
  ponyBody.castShadow = true;
  ponyGroup.add(ponyBody);

  // Sturdy Legs
  const legGeo = new THREE.CylinderGeometry(0.0009, 0.0011, 0.007, 6);
  const legPositions = [
    [0.005, 0.0035, 0.0025],
    [0.005, 0.0035, -0.0025],
    [-0.005, 0.0035, 0.0025],
    [-0.005, 0.0035, -0.0025],
  ];
  for (const [lx, ly, lz] of legPositions) {
    const leg = new THREE.Mesh(legGeo, ponyCoatMat);
    leg.position.set(lx, ly, lz);
    leg.castShadow = true;
    ponyGroup.add(leg);
  }

  // Grazing Head & Neck (lowered to grass)
  const neckGeo = new THREE.CylinderGeometry(0.0018, 0.0024, 0.006, 6);
  const neck = new THREE.Mesh(neckGeo, ponyCoatMat);
  neck.position.set(0.008, 0.006, 0.0);
  neck.rotation.z = -Math.PI * 0.35;
  ponyGroup.add(neck);

  const headGeo = new THREE.BoxGeometry(0.005, 0.004, 0.0035);
  const ponyHead = new THREE.Mesh(headGeo, ponyCoatMat);
  ponyHead.position.set(0.011, 0.0035, 0.0);
  ponyGroup.add(ponyHead);

  // Mane & Tail
  const maneGeo = new THREE.BoxGeometry(0.008, 0.002, 0.0015);
  const mane = new THREE.Mesh(maneGeo, ponyManeMat);
  mane.position.set(0.006, 0.009, 0.0);
  ponyGroup.add(mane);

  const tailGeo = new THREE.CylinderGeometry(0.0006, 0.0012, 0.008, 5);
  const tail = new THREE.Mesh(tailGeo, ponyManeMat);
  tail.position.set(-0.008, 0.006, 0.0);
  tail.rotation.z = Math.PI * 0.25;
  ponyGroup.add(tail);

  sceneryGroup.add(ponyGroup);

  // -------------------------------------------------------------------------
  // 10. TRADITIONAL WOODEN & BASALT ROAD MILESTONES (한라산 1100고지 표지석)
  // -------------------------------------------------------------------------
  function createMilestone(titleKr, titleEn, x, y, z, rotY = 0) {
    const marker = new THREE.Group();
    // Basalt pillar
    const postGeo = new THREE.BoxGeometry(0.004, 0.016, 0.004);
    const post = new THREE.Mesh(postGeo, basaltDarkMat);
    post.position.y = 0.008;
    post.castShadow = true;
    marker.add(post);

    // Wooden sign plaque
    const plaqueGeo = new THREE.BoxGeometry(0.015, 0.008, 0.002);
    const plaque = new THREE.Mesh(plaqueGeo, signWoodMat);
    plaque.position.set(0.0, 0.013, 0.002);
    plaque.castShadow = true;
    marker.add(plaque);

    marker.position.set(x, y, z);
    marker.rotation.y = rotY;
    return marker;
  }

  // Sector 4: 1100 Highland Ridge
  sceneryGroup.add(createMilestone('한라산 1100고지', '1,100m Summit', 0.28, 0.076, -0.15, -Math.PI * 0.25));
  // Sector 3: Saryeoni Forest
  sceneryGroup.add(createMilestone('사려니숲길', 'Saryeoni Cedar', -0.18, 0.062, -0.17, Math.PI * 0.15));
  // Sector 6: Tangerine Orchard
  sceneryGroup.add(createMilestone('탐라 감귤길', 'Jeju Tangerine Road', 0.04, 0.018, 0.26, 0));

  // -------------------------------------------------------------------------
  // CONTINUOUS 60FPS ANIMATION UPDATE (Wind Turbine & Floating Clouds)
  // -------------------------------------------------------------------------
  sceneryGroup.userData.update = function (elapsedTime, delta) {
    // 1. Smoothly spin the coastal wind turbine
    if (rotorHubGroup) {
      rotorHubGroup.rotation.z += delta * 1.8;
    }
    // 2. Gentle drift of Hallasan mist clouds
    if (cloudGroup) {
      cloudGroup.rotation.y = Math.sin(elapsedTime * 0.15) * 0.06;
      cloudGroup.position.y = Math.sin(elapsedTime * 0.4) * 0.0015;
    }
  };

  return sceneryGroup;
}
