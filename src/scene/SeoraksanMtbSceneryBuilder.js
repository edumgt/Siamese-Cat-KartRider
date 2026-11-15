import * as THREE from 'three';

/**
 * Creates a crisp procedural CanvasTexture for Seoraksan Korean Mountain Trail milestone signs.
 */
function createSeorakSignTexture(titleKr, titleEn, bgHex = '#3a271c', accentHex = '#ef4444') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, 256, 128);

  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 6;
  ctx.strokeRect(8, 8, 240, 112);

  ctx.fillStyle = '#fff8ee';
  ctx.font = 'bold 34px "Inter", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(titleKr, 128, 48);

  ctx.fillStyle = '#fcd34d';
  ctx.font = 'bold 17px "Orbitron", "Inter", sans-serif';
  ctx.fillText(titleEn, 128, 88);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Builds handcrafted miniature Korean Mt. Seoraksan (설악산) Mountain Bike trail scenery:
 *  - Ulsanbawi Granite Cliff Massif (울산바위 기암괴석 6봉) & Dinosaur Ridge (공룡능선)
 *  - Animated Seoraksan Red Cable Car (설악산 권금성 빨간 케이블카) gliding along mountain cable
 *  - Sinheungsa Korean Traditional Pavilion Gate (전통 기와 정자 / 일주문 & 석등)
 *  - Biryong Waterfall & Seorak Valley Creek (비룡폭포 & 계곡) + Red Suspension Bridge (출렁다리)
 *  - Vibrant Autumn Danpung Maple Trees (설악산 단풍나무) & Geumgang Red Pines (금강송)
 *  - Wooden MTB Trailhead Portal Arch ("설악산 MTB 1코스") & Korean trail milestone signs
 */
export function buildSeoraksanMtbScenery(splineData) {
  const sceneryGroup = new THREE.Group();
  sceneryGroup.name = 'SeoraksanMtbSceneryGroup';

  const samples = splineData?.samples || [];
  const N = samples.length;

  // -------------------------------------------------------------------------
  // SHARED PBR MATERIALS (Seorak Pale Granite, Autumn Maple, Pine & Timber)
  // -------------------------------------------------------------------------
  const graniteLightMat = new THREE.MeshStandardMaterial({
    color: 0xc8c0b4, // Iconic pale white-grey Seorak granite (울산바위 화강암)
    roughness: 0.90,
    metalness: 0.04,
  });

  const graniteShadowMat = new THREE.MeshStandardMaterial({
    color: 0x847d74,
    roughness: 0.92,
    metalness: 0.05,
  });

  const mountainMossMat = new THREE.MeshStandardMaterial({
    color: 0x3b522c,
    roughness: 0.88,
    metalness: 0.02,
  });

  const trailWoodMat = new THREE.MeshStandardMaterial({
    color: 0x6b442a,
    roughness: 0.84,
    metalness: 0.02,
  });

  const dancheongRedMat = new THREE.MeshStandardMaterial({
    color: 0xb82924, // Traditional Korean temple crimson pillar paint
    roughness: 0.52,
    metalness: 0.08,
  });

  const giwaRoofMat = new THREE.MeshStandardMaterial({
    color: 0x262930, // Traditional dark grey Korean Giwa clay roof tiles
    roughness: 0.65,
    metalness: 0.10,
  });

  const creekWaterMat = new THREE.MeshPhysicalMaterial({
    color: 0x1e8896,
    roughness: 0.12,
    metalness: 0.18,
    clearcoat: 0.75,
    envMapIntensity: 1.4,
  });

  const waterfallFoamMat = new THREE.MeshBasicMaterial({
    color: 0xe6f8ff,
    transparent: true,
    opacity: 0.84,
  });

  // Autumn Danpung (단풍) foliage palette
  const mapleCrimsonMat = new THREE.MeshStandardMaterial({ color: 0xc92a2a, roughness: 0.74 });
  const mapleOrangeMat = new THREE.MeshStandardMaterial({ color: 0xe8590c, roughness: 0.74 });
  const mapleAmberMat = new THREE.MeshStandardMaterial({ color: 0xf59f00, roughness: 0.72 });

  // Geumgang Red Pine (금강소나무)
  const redPineBarkMat = new THREE.MeshStandardMaterial({ color: 0x874428, roughness: 0.88 });
  const pineGreenMat = new THREE.MeshStandardMaterial({ color: 0x1e4d2b, roughness: 0.80 });

  // Cable Car Crimson Cabin
  const cableCarRedMat = new THREE.MeshStandardMaterial({
    color: 0xd92626,
    roughness: 0.30,
    metalness: 0.25,
  });
  const cableSteelMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.35,
    metalness: 0.85,
  });

  // -------------------------------------------------------------------------
  // 1. ULSANBAWI GRANITE MASSIF & DINOSAUR RIDGE (설악산 울산바위 기암괴석)
  // -------------------------------------------------------------------------
  const ulsanbawiGroup = new THREE.Group();
  ulsanbawiGroup.name = 'UlsanbawiGranitePeaks';
  ulsanbawiGroup.position.set(-0.08, 0.008, -0.34);

  // Rugged alpine base ridge
  const baseRidge = new THREE.Mesh(
    new THREE.ConeGeometry(0.36, 0.16, 20),
    mountainMossMat
  );
  baseRidge.position.y = 0.075;
  baseRidge.scale.set(1.5, 1.0, 0.65);
  baseRidge.castShadow = true;
  baseRidge.receiveShadow = true;
  ulsanbawiGroup.add(baseRidge);

  // Iconic 6-Spire Serrated Granite Wall of Ulsanbawi!
  const spireSpecs = [
    { x: -0.22, z: 0.02, r: 0.048, h: 0.18, tilt: -0.08 },
    { x: -0.13, z: -0.01, r: 0.056, h: 0.23, tilt: -0.03 },
    { x: -0.04, z: 0.01, r: 0.062, h: 0.26, tilt: 0.02 },
    { x: 0.05, z: -0.02, r: 0.054, h: 0.24, tilt: 0.05 },
    { x: 0.14, z: 0.01, r: 0.050, h: 0.20, tilt: -0.04 },
    { x: 0.23, z: 0.03, r: 0.042, h: 0.16, tilt: 0.09 },
  ];

  for (let i = 0; i < spireSpecs.length; i++) {
    const sp = spireSpecs[i];
    // Steep granite monolith spire (faceted cylinder + peaked cap)
    const monolith = new THREE.Mesh(
      new THREE.CylinderGeometry(sp.r * 0.58, sp.r, sp.h, 7),
      i % 2 === 0 ? graniteLightMat : graniteShadowMat
    );
    monolith.position.set(sp.x, sp.h * 0.5 + 0.03, sp.z);
    monolith.rotation.z = sp.tilt;
    monolith.rotation.y = i * 0.7;
    monolith.scale.set(1.0, 1.0, 0.65);
    monolith.castShadow = true;
    monolith.receiveShadow = true;
    ulsanbawiGroup.add(monolith);

    // Craggy pinnacle crown rock
    const crown = new THREE.Mesh(
      new THREE.ConeGeometry(sp.r * 0.62, sp.h * 0.28, 6),
      graniteLightMat
    );
    crown.position.set(sp.x - sp.tilt * sp.h * 0.4, sp.h + 0.045, sp.z);
    crown.rotation.y = i * 1.1;
    crown.scale.set(1.0, 1.0, 0.68);
    crown.castShadow = true;
    ulsanbawiGroup.add(crown);
  }

  // Secondary West Dinosaur Ridge Peak (공룡능선 암봉)
  const dinoPeak = new THREE.Mesh(
    new THREE.ConeGeometry(0.16, 0.19, 10),
    graniteShadowMat
  );
  dinoPeak.position.set(-0.34, 0.095, 0.05);
  dinoPeak.scale.set(1.1, 1.0, 0.75);
  dinoPeak.castShadow = true;
  ulsanbawiGroup.add(dinoPeak);

  sceneryGroup.add(ulsanbawiGroup);

  // -------------------------------------------------------------------------
  // 2. SEORAKSAN ANIMATED RED CABLE CAR TO KWONGEUMSEONG PEAK (설악산 케이블카)
  // -------------------------------------------------------------------------
  const cableStart = new THREE.Vector3(0.32, 0.035, -0.22); // Lower Station Ridge
  const cableEnd = new THREE.Vector3(0.06, 0.225, -0.32); // Kwongeumseong Upper Station

  // Lower Cable Car Station Platform
  const lowerStation = new THREE.Group();
  lowerStation.position.set(0.32, 0.005, -0.22);
  const stBase = new THREE.Mesh(new THREE.BoxGeometry(0.040, 0.030, 0.034), graniteShadowMat);
  stBase.position.y = 0.015;
  stBase.castShadow = true;
  lowerStation.add(stBase);
  const stRoof = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.006, 0.038), giwaRoofMat);
  stRoof.position.y = 0.033;
  lowerStation.add(stRoof);
  sceneryGroup.add(lowerStation);

  // Steel Cable Span between stations
  const cableDir = new THREE.Vector3().subVectors(cableEnd, cableStart);
  const cableLen = cableDir.length();
  const cableMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0007, 0.0007, cableLen, 6),
    cableSteelMat
  );
  cableMesh.position.copy(cableStart).addScaledVector(cableDir, 0.5);
  cableMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), cableDir.clone().normalize());
  sceneryGroup.add(cableMesh);

  // Red Seoraksan Cable Car Cabin
  const cableCarGroup = new THREE.Group();
  cableCarGroup.name = 'SeoraksanCableCar';

  const trolley = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.003, 0.004), cableSteelMat);
  cableCarGroup.add(trolley);

  const hanger = new THREE.Mesh(new THREE.CylinderGeometry(0.0005, 0.0005, 0.010, 6), cableSteelMat);
  hanger.position.y = -0.005;
  cableCarGroup.add(hanger);

  const cabinBody = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.012, 0.012), cableCarRedMat);
  cabinBody.position.y = -0.014;
  cabinBody.castShadow = true;
  cableCarGroup.add(cabinBody);

  const cabinWindow = new THREE.Mesh(
    new THREE.BoxGeometry(0.0165, 0.005, 0.0125),
    new THREE.MeshStandardMaterial({ color: 0xbae6fd, roughness: 0.1, metalness: 0.6 })
  );
  cabinWindow.position.y = -0.012;
  cableCarGroup.add(cabinWindow);

  cableCarGroup.position.copy(cableStart).lerp(cableEnd, 0.5);
  sceneryGroup.add(cableCarGroup);

  // -------------------------------------------------------------------------
  // 3. BIRYONG WATERFALL, SEORAK CREEK & RED SUSPENSION BRIDGE (비룡폭포 & 출렁다리)
  // -------------------------------------------------------------------------
  const valleyGroup = new THREE.Group();
  valleyGroup.name = 'BiryongWaterfallValley';

  // Granite waterfall cliff behind Sector 5
  const wfCliff = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.082, 0.11, 9),
    graniteShadowMat
  );
  wfCliff.position.set(0.24, 0.055, -0.25);
  wfCliff.castShadow = true;
  valleyGroup.add(wfCliff);

  // Shimmering white cascading waterfall ribbon
  const waterfallRibbon = new THREE.Mesh(
    new THREE.BoxGeometry(0.022, 0.095, 0.008),
    waterfallFoamMat
  );
  waterfallRibbon.position.set(0.23, 0.052, -0.205);
  waterfallRibbon.rotation.x = 0.24;
  valleyGroup.add(waterfallRibbon);

  // Mountain Valley Stream winding through the inner valley (x ~ 0.18..0.28, z ~ -0.10..0.15)
  const creekMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.075, 0.26),
    creekWaterMat
  );
  creekMesh.rotation.x = -Math.PI / 2;
  creekMesh.rotation.z = 0.22;
  creekMesh.position.set(0.22, 0.0035, 0.02);
  valleyGroup.add(creekMesh);

  // Rounded granite creek boulders
  const boulderGeo = new THREE.DodecahedronGeometry(0.009, 1);
  const boulderSpecs = [
    [0.17, 0.006, -0.04, 1.2],
    [0.26, 0.006, -0.01, 1.0],
    [0.19, 0.006, 0.08, 1.3],
    [0.25, 0.006, 0.11, 0.9],
  ];
  for (const [bx, by, bz, sc] of boulderSpecs) {
    const b = new THREE.Mesh(boulderGeo, graniteLightMat);
    b.position.set(bx, by, bz);
    b.scale.set(sc * 1.2, sc * 0.7, sc);
    b.castShadow = true;
    valleyGroup.add(b);
  }

  // Seorak Red Suspension Footbridge spanning the creek (출렁다리)
  const bridgeGroup = new THREE.Group();
  bridgeGroup.position.set(0.22, 0.012, 0.03);
  bridgeGroup.rotation.y = -0.22;

  const bridgeDeck = new THREE.Mesh(
    new THREE.BoxGeometry(0.095, 0.003, 0.018),
    trailWoodMat
  );
  bridgeDeck.castShadow = true;
  bridgeGroup.add(bridgeDeck);

  for (const px of [-0.042, 0.042]) {
    for (const pz of [-0.008, 0.008]) {
      const pylon = new THREE.Mesh(
        new THREE.BoxGeometry(0.004, 0.024, 0.004),
        dancheongRedMat
      );
      pylon.position.set(px, 0.011, pz);
      pylon.castShadow = true;
      bridgeGroup.add(pylon);
    }
  }
  for (const pz of [-0.008, 0.008]) {
    const railCable = new THREE.Mesh(
      new THREE.BoxGeometry(0.092, 0.0014, 0.0014),
      dancheongRedMat
    );
    railCable.position.set(0, 0.018, pz);
    bridgeGroup.add(railCable);
  }
  valleyGroup.add(bridgeGroup);
  sceneryGroup.add(valleyGroup);

  // -------------------------------------------------------------------------
  // 4. TRADITIONAL KOREAN PAVILION & STONE LANTERN (신흥사 전통 누각 & 석등)
  // -------------------------------------------------------------------------
  const templeGroup = new THREE.Group();
  templeGroup.name = 'SeorakTraditionalPavilion';
  templeGroup.position.set(-0.22, 0.004, 0.11);
  templeGroup.rotation.y = 0.25;

  // Stone foundation platform (기단)
  const stonePlinth = new THREE.Mesh(
    new THREE.BoxGeometry(0.048, 0.007, 0.040),
    graniteLightMat
  );
  stonePlinth.position.y = 0.0035;
  stonePlinth.castShadow = true;
  templeGroup.add(stonePlinth);

  // 4 Red Dancheong Wooden Columns
  for (const cx of [-0.017, 0.017]) {
    for (const cz of [-0.014, 0.014]) {
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0022, 0.0024, 0.022, 8),
        dancheongRedMat
      );
      col.position.set(cx, 0.018, cz);
      col.castShadow = true;
      templeGroup.add(col);
    }
  }

  // Two-tier Traditional Dark Giwa Pitched Roof (팔작지붕)
  const roofLower = new THREE.Mesh(
    new THREE.ConeGeometry(0.038, 0.014, 4),
    giwaRoofMat
  );
  roofLower.position.y = 0.034;
  roofLower.rotation.y = Math.PI / 4;
  roofLower.scale.set(1.18, 1.0, 0.96);
  roofLower.castShadow = true;
  templeGroup.add(roofLower);

  const roofUpper = new THREE.Mesh(
    new THREE.ConeGeometry(0.024, 0.010, 4),
    giwaRoofMat
  );
  roofUpper.position.y = 0.042;
  roofUpper.rotation.y = Math.PI / 4;
  roofUpper.scale.set(1.18, 1.0, 0.96);
  templeGroup.add(roofUpper);

  // Stone Lantern (석등) beside the pavilion with warm glowing core
  const lantern = new THREE.Group();
  lantern.position.set(0.036, 0.0, 0.012);
  const lPost = new THREE.Mesh(new THREE.CylinderGeometry(0.0025, 0.0035, 0.016, 6), graniteLightMat);
  lPost.position.y = 0.008;
  lantern.add(lPost);
  const lGlow = new THREE.Mesh(
    new THREE.BoxGeometry(0.005, 0.005, 0.005),
    new THREE.MeshBasicMaterial({ color: 0xffb84d, toneMapped: false })
  );
  lGlow.position.y = 0.018;
  lantern.add(lGlow);
  const lCap = new THREE.Mesh(new THREE.ConeGeometry(0.006, 0.005, 6), graniteShadowMat);
  lCap.position.y = 0.023;
  lantern.add(lCap);
  templeGroup.add(lantern);

  sceneryGroup.add(templeGroup);

  // -------------------------------------------------------------------------
  // 5. SEORAKSAN AUTUMN MAPLE (단풍) & GEUMGANG RED PINE FOREST (금강송)
  // -------------------------------------------------------------------------
  function createMapleTree(scale = 1.0, colorIdx = 0) {
    const tree = new THREE.Group();
    const leafMats = [mapleCrimsonMat, mapleOrangeMat, mapleAmberMat];
    const leafMat = leafMats[colorIdx % leafMats.length];

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0014 * scale, 0.0024 * scale, 0.018 * scale, 6),
      trailWoodMat
    );
    trunk.position.y = 0.009 * scale;
    trunk.castShadow = true;
    tree.add(trunk);

    const puffs = [
      [0, 0.022, 0, 0.012],
      [-0.006, 0.019, 0.004, 0.009],
      [0.006, 0.020, -0.003, 0.0095],
      [0.001, 0.027, 0.002, 0.0085],
    ];
    for (const [px, py, pz, pr] of puffs) {
      const crown = new THREE.Mesh(new THREE.SphereGeometry(pr * scale, 9, 7), leafMat);
      crown.position.set(px * scale, py * scale, pz * scale);
      crown.scale.set(1.15, 0.85, 1.15);
      crown.castShadow = true;
      tree.add(crown);
    }
    return tree;
  }

  function createGeumgangPine(scale = 1.0) {
    const pine = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0014 * scale, 0.0024 * scale, 0.028 * scale, 7),
      redPineBarkMat
    );
    trunk.position.y = 0.014 * scale;
    trunk.castShadow = true;
    pine.add(trunk);

    const tiers = [0.020, 0.027, 0.034];
    const radii = [0.012, 0.0095, 0.0065];
    for (let t = 0; t < tiers.length; t++) {
      const tier = new THREE.Mesh(
        new THREE.ConeGeometry(radii[t] * scale, 0.011 * scale, 8),
        pineGreenMat
      );
      tier.position.y = tiers[t] * scale;
      tier.castShadow = true;
      pine.add(tier);
    }
    return pine;
  }

  const forestGroup = new THREE.Group();
  forestGroup.name = 'SeorakDanpungForest';

  const treePlacements = [
    // Sector 2 & 3 Autumn Switchback Forest (Left/West slopes)
    [-0.36, 0.020, 0.235, 1.15, 'maple', 0],
    [-0.46, 0.030, 0.175, 1.25, 'maple', 1],
    [-0.50, 0.044, 0.095, 1.30, 'pine', 0],
    [-0.49, 0.056, -0.010, 1.20, 'maple', 2],
    [-0.41, 0.068, -0.105, 1.30, 'maple', 0],
    [-0.29, 0.078, -0.175, 1.15, 'pine', 0],
    // Inner valley grove flanking Sinheungsa & Creek
    [-0.31, 0.008, 0.080, 1.20, 'maple', 1],
    [-0.28, 0.008, -0.020, 1.15, 'maple', 0],
    [-0.14, 0.008, 0.020, 1.25, 'pine', 0],
    [-0.08, 0.008, -0.065, 1.10, 'maple', 2],
    [0.04, 0.008, 0.090, 1.15, 'maple', 1],
    [0.08, 0.008, -0.045, 1.20, 'pine', 0],
    // Sector 5 & 6 Eastern Downhill Danpung Trees
    [0.39, 0.050, -0.115, 1.20, 'maple', 0],
    [0.48, 0.036, -0.030, 1.25, 'maple', 2],
    [0.49, 0.024, 0.075, 1.15, 'pine', 0],
    [0.44, 0.016, 0.165, 1.30, 'maple', 1],
    [0.32, 0.014, 0.252, 1.10, 'maple', 0],
  ];

  for (const [tx, ty, tz, sc, kind, cIdx] of treePlacements) {
    const t = kind === 'pine' ? createGeumgangPine(sc) : createMapleTree(sc, cIdx);
    t.position.set(tx, ty - 0.002, tz);
    t.rotation.y = (tx * 19 + tz * 13) % (Math.PI * 2);
    forestGroup.add(t);
  }
  sceneryGroup.add(forestGroup);

  // -------------------------------------------------------------------------
  // 6. MTB WOODEN TRAILHEAD PORTAL ARCH & KOREAN MILESTONES (설악산 MTB 1코스)
  // -------------------------------------------------------------------------
  function createSeorakMilestone(titleKr, titleEn, x, y, z, rotY = 0) {
    const marker = new THREE.Group();

    const stonePost = new THREE.Mesh(
      new THREE.BoxGeometry(0.0045, 0.016, 0.0045),
      graniteLightMat
    );
    stonePost.position.y = 0.008;
    stonePost.castShadow = true;
    marker.add(stonePost);

    const signTex = createSeorakSignTexture(titleKr, titleEn);
    const plaque = new THREE.Mesh(
      new THREE.BoxGeometry(0.022, 0.010, 0.0024),
      [
        trailWoodMat,
        trailWoodMat,
        trailWoodMat,
        trailWoodMat,
        new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.55 }),
        new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.55 }),
      ]
    );
    plaque.position.set(0, 0.015, 0.002);
    plaque.castShadow = true;
    marker.add(plaque);

    marker.position.set(x, y, z);
    marker.rotation.y = rotY;
    return marker;
  }

  // Trailhead Start Milestone (Sector 1)
  sceneryGroup.add(createSeorakMilestone('설악산 MTB 1코스', 'SEORAKSAN TRAIL', -0.02, 0.018, 0.262, 0));
  // Ulsanbawi Ridge Summit Milestone (Sector 4)
  sceneryGroup.add(createSeorakMilestone('울산바위 공룡능선', 'ULSANBAWI RIDGE', -0.04, 0.092, -0.188, Math.PI));
  // Biryong Waterfall Downhill Sign (Sector 5)
  sceneryGroup.add(createSeorakMilestone('비룡폭포 다운힐', 'BIRYONG FALLS', 0.34, 0.062, -0.115, -Math.PI * 0.32));

  // Wooden MTB Trailhead Arch Gate spanning near Sector 1 exit
  const mtbGate = new THREE.Group();
  mtbGate.position.set(-0.14, 0.018, 0.236);
  for (const gz of [-0.018, 0.018]) {
    const logPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0018, 0.0022, 0.026, 8),
      trailWoodMat
    );
    logPost.position.set(0, 0.013, gz);
    logPost.castShadow = true;
    mtbGate.add(logPost);
  }
  const archBeamTex = createSeorakSignTexture('설악산 산악자전거', 'SEORAK MTB #1', '#233b27', '#f59e0b');
  const archBeam = new THREE.Mesh(
    new THREE.BoxGeometry(0.004, 0.009, 0.042),
    [
      new THREE.MeshStandardMaterial({ map: archBeamTex, roughness: 0.55 }),
      new THREE.MeshStandardMaterial({ map: archBeamTex, roughness: 0.55 }),
      trailWoodMat,
      trailWoodMat,
      trailWoodMat,
      trailWoodMat,
    ]
  );
  archBeam.position.set(0, 0.025, 0);
  archBeam.castShadow = true;
  mtbGate.add(archBeam);
  sceneryGroup.add(mtbGate);

  if (N > 0) {
    // Spline data available for procedural extensions
  }

  // -------------------------------------------------------------------------
  // CONTINUOUS 60FPS ANIMATION UPDATE (Cable Car & Cascading Waterfall Shimmer)
  // -------------------------------------------------------------------------
  sceneryGroup.userData.update = function (elapsedTime) {
    // Smoothly glide the Red Seoraksan Cable Car between valley & Kwongeumseong summit
    if (cableCarGroup) {
      const t = 0.5 + 0.44 * Math.sin(elapsedTime * 0.28);
      cableCarGroup.position.lerpVectors(cableStart, cableEnd, t);
    }
    // Subtle shimmering waterfall pulse
    if (waterfallRibbon) {
      waterfallRibbon.material.opacity = 0.76 + 0.14 * Math.sin(elapsedTime * 7.5);
    }
  };

  return sceneryGroup;
}
