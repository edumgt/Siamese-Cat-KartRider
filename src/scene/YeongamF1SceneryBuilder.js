import * as THREE from 'three';

/**
 * YeongamF1SceneryBuilder.js
 * Procedural HO-scale (1:87) Korea International Circuit (전남 영암 F1 국제자동차경주장)
 * Grand Prix stadium scenery for the Yeongam F1 circuit in Desk Racer.
 *
 * Landmarks:
 *  - World-famous Korean Hanok Giwa-Roof Main Grandstand (한옥 기와 메인 그랜드스탠드)
 *    with tiered seating, InstancedMesh spectators & glowing VIP Paddock Club boxes
 *  - F1 Pit Building, 8 Illuminated Team Garages & Pit Wall (피트 빌딩 & 팀 개러지)
 *  - KIC Race Control Tower & Digital F1 Timing Leaderboard Pylon (레이스 컨트롤 & 순위 타워)
 *  - KOREA GRAND PRIX · 영암 F1 Overpass Bridge spanning the Long DRS Back Straight
 *  - Yeongsan Lake Marina Waterfront, Pier & Gently Bobbing Yachts (영산호 마리나 & 요트)
 *  - 6 Angled F1 Night-Race Stadium Floodlight Towers (조명탑) & FIA Tire/Run-Off Zones
 *  - Distant Wolchulsan Mountain Silhouette (월출산) & Yeongam Coastal Wind Turbines
 *  - Animated F1 TV Broadcast Helicopter & Fluttering Grandstand Flags
 */

function createF1BannerTexture(topText, bottomText, bgColor = '#111622', accentColor = '#e10600') {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Dark carbon base gradient
  const grad = ctx.createLinearGradient(0, 0, 1024, 256);
  grad.addColorStop(0, bgColor);
  grad.addColorStop(0.5, '#192234');
  grad.addColorStop(1, bgColor);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 256);

  // Diagonal F1 racing stripes on left and right edges
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(105, 0);
  ctx.lineTo(65, 256);
  ctx.lineTo(0, 256);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(116, 0);
  ctx.lineTo(132, 0);
  ctx.lineTo(92, 256);
  ctx.lineTo(76, 256);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.moveTo(959, 0);
  ctx.lineTo(1024, 0);
  ctx.lineTo(1024, 256);
  ctx.lineTo(919, 256);
  ctx.closePath();
  ctx.fill();

  // Top & bottom glowing FIA red borders
  ctx.fillStyle = accentColor;
  ctx.fillRect(0, 0, 1024, 14);
  ctx.fillRect(0, 242, 1024, 14);

  // Main English headline
  ctx.fillStyle = '#ffffff';
  ctx.font = 'italic 900 66px "Orbitron", "Arial Black", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(topText, 512, 98);

  // Korean subtitle
  ctx.fillStyle = '#ffd54f';
  ctx.font = '800 44px "Noto Sans KR", "Malgun Gothic", sans-serif';
  ctx.fillText(bottomText, 512, 178);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createHanokGiwaRoofTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Traditional Korean charcoal-slate Giwa base
  ctx.fillStyle = '#252b36';
  ctx.fillRect(0, 0, 512, 256);

  // Ribbed vertical concave/convex Giwa roof tile channels
  const cols = 32;
  const colW = 512 / cols;
  for (let i = 0; i < cols; i++) {
    const x = i * colW;
    const g = ctx.createLinearGradient(x, 0, x + colW, 0);
    g.addColorStop(0, '#171c24');
    g.addColorStop(0.32, '#3a4252');
    g.addColorStop(0.55, '#4b5568');
    g.addColorStop(0.85, '#1d222c');
    g.addColorStop(1, '#12161d');
    ctx.fillStyle = g;
    ctx.fillRect(x, 0, colW, 256);
  }

  // Horizontal overlapping tile courses
  ctx.strokeStyle = 'rgba(12, 15, 22, 0.55)';
  ctx.lineWidth = 2;
  for (let y = 18; y < 256; y += 22) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Subtle decorative round eave-end tiles (수막새) along lower edge
  for (let i = 0; i < cols; i++) {
    ctx.fillStyle = '#58647a';
    ctx.beginPath();
    ctx.arc((i + 0.5) * colW, 244, colW * 0.34, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.repeat.set(3, 1);
  tex.anisotropy = 8;
  return tex;
}

function createTimingPylonTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, 256, 512);

  // Red F1 top header
  ctx.fillStyle = '#e10600';
  ctx.fillRect(0, 0, 256, 76);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'italic 900 32px "Orbitron", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('KOREA GP', 128, 30);
  ctx.font = '700 19px "Noto Sans KR", sans-serif';
  ctx.fillStyle = '#ffe082';
  ctx.fillText('전남 영암 F1', 128, 58);

  // Lap & DRS status bar
  ctx.fillStyle = '#141e30';
  ctx.fillRect(10, 86, 236, 40);
  ctx.fillStyle = '#00e5ff';
  ctx.font = '800 21px "JetBrains Mono", monospace';
  ctx.fillText('LAP 1/3 · DRS', 128, 108);

  const rows = [
    { pos: '1', code: 'CAT', gap: 'LEADER', bar: '#00e5ff' },
    { pos: '2', code: 'SHB', gap: '+0.248', bar: '#ff8c00' },
    { pos: '3', code: 'FOX', gap: '+0.614', bar: '#ef4444' },
    { pos: '4', code: 'DOG', gap: '+1.092', bar: '#facc15' },
    { pos: '5', code: 'RBT', gap: '+1.530', bar: '#c084fc' },
    { pos: '6', code: 'MTB', gap: '+2.118', bar: '#22c55e' },
  ];

  rows.forEach((r, idx) => {
    const y = 142 + idx * 54;
    ctx.fillStyle = idx % 2 === 0 ? '#111827' : '#162033';
    ctx.fillRect(10, y, 236, 46);

    ctx.fillStyle = r.bar;
    ctx.fillRect(10, y, 10, 46);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px "Orbitron", sans-serif';
    ctx.fillText(r.pos, 28, y + 24);
    ctx.fillText(r.code, 62, y + 24);

    ctx.textAlign = 'right';
    ctx.fillStyle = idx === 0 ? '#38f8a8' : '#cbd5e1';
    ctx.font = '700 18px "JetBrains Mono", monospace';
    ctx.fillText(r.gap, 238, y + 24);
  });

  // Footer
  ctx.fillStyle = '#e10600';
  ctx.fillRect(10, 474, 236, 28);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = '800 16px "Orbitron", sans-serif';
  ctx.fillText('YEONGAM KIC 5.615KM', 128, 488);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createSignboardTexture(line1, line2, accent = '#e10600') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 192);
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, 512, 16);
  ctx.fillRect(0, 176, 512, 16);

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '800 44px "Noto Sans KR", "Malgun Gothic", sans-serif';
  ctx.fillText(line1, 256, 74);

  ctx.fillStyle = '#93c5fd';
  ctx.font = 'italic 800 28px "Orbitron", sans-serif';
  ctx.fillText(line2, 256, 134);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createTaegeukFlagTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 256, 160);

  // Red & Blue Taegeuk circle
  const cx = 128;
  const cy = 80;
  const r = 36;
  ctx.fillStyle = '#cd2e3a';
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 0, false);
  ctx.fill();
  ctx.fillStyle = '#0047a0';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI, false);
  ctx.fill();
  ctx.fillStyle = '#cd2e3a';
  ctx.beginPath();
  ctx.arc(cx - r * 0.5, cy, r * 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0047a0';
  ctx.beginPath();
  ctx.arc(cx + r * 0.5, cy, r * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Four corner trigrams (simplified crisp bars)
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 6;
  const drawTrigram = (x, y, angle) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(-18, i * 10);
      ctx.lineTo(18, i * 10);
      ctx.stroke();
    }
    ctx.restore();
  };
  drawTrigram(62, 40, -0.62);
  drawTrigram(194, 40, 0.62);
  drawTrigram(62, 120, 0.62);
  drawTrigram(194, 120, -0.62);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createCheckeredFlagTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  const sq = 32;
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 8; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? '#f8fafc' : '#111827';
      ctx.fillRect(x * sq, y * sq, sq, sq);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Builds the procedural Korea International Circuit (전남 영암 F1 국제자동차경주장) scenery diorama.
 */
export function buildYeongamF1Scenery(splineData) {
  const sceneryGroup = new THREE.Group();
  sceneryGroup.name = 'YeongamF1CircuitScenery';

  // Shared PBR Materials
  const concreteMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    roughness: 0.78,
    metalness: 0.08,
  });
  const darkConcreteMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.85,
    metalness: 0.12,
  });
  const tarmacApronMat = new THREE.MeshStandardMaterial({
    color: 0x262c36,
    roughness: 0.88,
    metalness: 0.06,
  });
  const fiaBlueRunoffMat = new THREE.MeshStandardMaterial({
    color: 0x1d4ed8,
    roughness: 0.72,
    metalness: 0.08,
  });
  const f1RedMat = new THREE.MeshStandardMaterial({
    color: 0xe10600,
    roughness: 0.36,
    metalness: 0.25,
  });
  const whiteSteelMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.34,
    metalness: 0.55,
  });
  const brushedSteelMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.32,
    metalness: 0.78,
  });
  const carbonDarkMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.42,
    metalness: 0.38,
  });
  const dancheongRedMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    roughness: 0.55,
    metalness: 0.12,
  });
  const dancheongJadeMat = new THREE.MeshStandardMaterial({
    color: 0x0f766e,
    roughness: 0.52,
    metalness: 0.14,
  });
  const hanokRoofTex = createHanokGiwaRoofTexture();
  const hanokRoofMat = new THREE.MeshStandardMaterial({
    map: hanokRoofTex,
    color: 0xd1d5db,
    roughness: 0.62,
    metalness: 0.18,
  });
  const vipGlassMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    emissive: 0xffb74d,
    emissiveIntensity: 0.42,
    roughness: 0.14,
    metalness: 0.82,
  });
  const controlGlassMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.45,
    roughness: 0.12,
    metalness: 0.88,
  });
  const ledWhiteMat = new THREE.MeshBasicMaterial({
    color: 0xfff6e0,
    toneMapped: false,
  });
  const ledRedMat = new THREE.MeshBasicMaterial({
    color: 0xff2a2a,
    toneMapped: false,
  });
  const grassInfieldMat = new THREE.MeshStandardMaterial({
    color: 0x264b2c,
    roughness: 0.92,
    metalness: 0.02,
  });

  // -------------------------------------------------------------------------
  // 1. FIA GRADE-1 CIRCUIT INFIELD TURF, PIT LANE & BLUE TARMAC RUN-OFF APRONS
  // -------------------------------------------------------------------------
  const groundGroup = new THREE.Group();
  groundGroup.name = 'YeongamCircuitGrounds';

  // Infield manicured grass oval inside the main circuit loop
  const infieldTurf = new THREE.Mesh(
    new THREE.BoxGeometry(0.76, 0.0022, 0.34),
    grassInfieldMat
  );
  infieldTurf.position.set(-0.01, 0.0014, 0.025);
  infieldTurf.receiveShadow = true;
  groundGroup.add(infieldTurf);

  // Pit Lane & Paddock tarmac apron parallel to Main Pit Straight
  const pitApron = new THREE.Mesh(
    new THREE.BoxGeometry(0.46, 0.0026, 0.088),
    tarmacApronMat
  );
  pitApron.position.set(-0.05, 0.0022, 0.168);
  pitApron.receiveShadow = true;
  groundGroup.add(pitApron);

  // Pit lane white guide stripe
  const pitLine = new THREE.Mesh(
    new THREE.PlaneGeometry(0.42, 0.0022),
    new THREE.MeshBasicMaterial({ color: 0xe2e8f0 })
  );
  pitLine.rotation.x = -Math.PI * 0.5;
  pitLine.position.set(-0.05, 0.0040, 0.204);
  groundGroup.add(pitLine);

  // FIA high-grip Blue Run-Off Aprons at Turn 1 (SW) and Turn 3 Hairpin (NE)
  const runoffSpecs = [
    { x: -0.455, z: 0.215, w: 0.10, d: 0.075, rot: 0.35 },
    { x: 0.455, z: -0.145, w: 0.095, d: 0.095, rot: -0.25 },
    { x: 0.445, z: 0.185, w: 0.075, d: 0.085, rot: 0.20 },
  ];
  for (const r of runoffSpecs) {
    const pad = new THREE.Mesh(new THREE.BoxGeometry(r.w, 0.0020, r.d), fiaBlueRunoffMat);
    pad.position.set(r.x, 0.0016, r.z);
    pad.rotation.y = r.rot;
    pad.receiveShadow = true;
    groundGroup.add(pad);
  }
  sceneryGroup.add(groundGroup);

  // -------------------------------------------------------------------------
  // 2. ICONIC HANOK GIWA-ROOF MAIN GRANDSTAND (영암 F1 한옥 기와 메인 그랜드스탠드)
  // -------------------------------------------------------------------------
  const grandstand = new THREE.Group();
  grandstand.name = 'YeongamHanokMainGrandstand';
  grandstand.position.set(-0.05, 0.002, 0.296);

  const gsWidth = 0.36;
  const gsDepth = 0.064;

  // Main concrete base plinth
  const gsBase = new THREE.Mesh(
    new THREE.BoxGeometry(gsWidth, 0.014, gsDepth),
    darkConcreteMat
  );
  gsBase.position.set(0, 0.007, 0);
  gsBase.castShadow = true;
  gsBase.receiveShadow = true;
  grandstand.add(gsBase);

  // 5 stepped concrete spectator seating tiers facing the Main Pit Straight (-Z)
  for (let tier = 0; tier < 5; tier++) {
    const tierY = 0.016 + tier * 0.0062;
    const tierZ = -0.022 + tier * 0.0095;
    const stepMesh = new THREE.Mesh(
      new THREE.BoxGeometry(gsWidth - 0.012, 0.0052, 0.0092),
      concreteMat
    );
    stepMesh.position.set(0, tierY, tierZ);
    stepMesh.receiveShadow = true;
    grandstand.add(stepMesh);
  }

  // InstancedMesh cheering F1 spectators across all 5 grandstand rows
  const specCols = 38;
  const specRows = 5;
  const specCount = specCols * specRows;
  const specGeo = new THREE.CapsuleGeometry(0.0016, 0.0026, 4, 6);
  const specMat = new THREE.MeshStandardMaterial({ roughness: 0.65, metalness: 0.05 });
  const specInstanced = new THREE.InstancedMesh(specGeo, specMat, specCount);
  const dummy = new THREE.Object3D();
  const palette = [
    new THREE.Color(0xe10600), // Ferrari red
    new THREE.Color(0x00e5ff), // Mercedes/desk cyan
    new THREE.Color(0xf8fafc), // Korean white
    new THREE.Color(0xff8c00), // McLaren papaya
    new THREE.Color(0x2563eb), // Red Bull blue
    new THREE.Color(0xfacc15), // Renault gold
    new THREE.Color(0x10b981), // Aston green
  ];
  let sIdx = 0;
  for (let row = 0; row < specRows; row++) {
    const y = 0.0215 + row * 0.0062;
    const z = -0.022 + row * 0.0095;
    for (let col = 0; col < specCols; col++) {
      const x = -gsWidth * 0.46 + (col / (specCols - 1)) * (gsWidth * 0.92);
      const jitter = Math.sin(col * 3.7 + row * 11.3) * 0.0008;
      dummy.position.set(x, y + Math.abs(jitter) * 0.6, z + jitter);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(0.92 + ((col * 7 + row * 3) % 5) * 0.05);
      dummy.updateMatrix();
      specInstanced.setMatrixAt(sIdx, dummy.matrix);
      specInstanced.setColorAt(sIdx, palette[(col * 3 + row * 5) % palette.length]);
      sIdx++;
    }
  }
  specInstanced.instanceMatrix.needsUpdate = true;
  if (specInstanced.instanceColor) specInstanced.instanceColor.needsUpdate = true;
  specInstanced.computeBoundingSphere();
  grandstand.add(specInstanced);

  // Rear VIP Paddock Club Glass Skybox Wall
  const vipWall = new THREE.Mesh(
    new THREE.BoxGeometry(gsWidth - 0.016, 0.022, 0.012),
    vipGlassMat
  );
  vipWall.position.set(0, 0.054, 0.023);
  grandstand.add(vipWall);

  // Sleek white cantilevered steel columns supporting the Hanok Giwa Roof
  for (let i = 0; i < 7; i++) {
    const px = -gsWidth * 0.45 + (i / 6) * (gsWidth * 0.90);
    const colMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.0042, 0.068, 0.0055),
      whiteSteelMat
    );
    colMesh.position.set(px, 0.036, 0.027);
    colMesh.castShadow = true;
    grandstand.add(colMesh);

    // Cantilevered roof rafter beam
    const rafter = new THREE.Mesh(
      new THREE.BoxGeometry(0.0034, 0.004, gsDepth + 0.018),
      whiteSteelMat
    );
    rafter.position.set(px, 0.067, -0.002);
    rafter.rotation.x = 0.08;
    grandstand.add(rafter);
  }

  // Traditional Korean Dancheong (단청) crimson & jade beam fascia under the roof eaves
  const dancheongBeam = new THREE.Mesh(
    new THREE.BoxGeometry(gsWidth + 0.024, 0.0048, 0.006),
    dancheongRedMat
  );
  dancheongBeam.position.set(0, 0.065, -0.034);
  grandstand.add(dancheongBeam);

  const dancheongAccent = new THREE.Mesh(
    new THREE.BoxGeometry(gsWidth + 0.016, 0.0022, 0.0065),
    dancheongJadeMat
  );
  dancheongAccent.position.set(0, 0.0622, -0.0342);
  grandstand.add(dancheongAccent);

  // Signature Yeongam KIC Sweeping Hanok Giwa Roof (전통 한옥 팔작 기와지붕)
  const roofFrontSlope = new THREE.Mesh(
    new THREE.BoxGeometry(gsWidth + 0.036, 0.0046, 0.048),
    hanokRoofMat
  );
  roofFrontSlope.position.set(0, 0.075, -0.016);
  roofFrontSlope.rotation.x = -0.26;
  roofFrontSlope.castShadow = true;
  grandstand.add(roofFrontSlope);

  const roofBackSlope = new THREE.Mesh(
    new THREE.BoxGeometry(gsWidth + 0.036, 0.0046, 0.036),
    hanokRoofMat
  );
  roofBackSlope.position.set(0, 0.077, 0.020);
  roofBackSlope.rotation.x = 0.24;
  roofBackSlope.castShadow = true;
  grandstand.add(roofBackSlope);

  // Upturned Korean Hanok Roof Wing Eaves (추녀 / 처마 끝 곡선) on left & right ends
  for (const side of [-1, 1]) {
    const wing = new THREE.Mesh(
      new THREE.BoxGeometry(0.030, 0.0042, 0.076),
      hanokRoofMat
    );
    wing.position.set(side * (gsWidth * 0.5 + 0.024), 0.079, -0.001);
    wing.rotation.z = side * 0.24;
    wing.castShadow = true;
    grandstand.add(wing);

    // Traditional roof-ridge dragon-fin ornament (용두/치미)
    const finial = new THREE.Mesh(
      new THREE.ConeGeometry(0.0038, 0.011, 4),
      whiteSteelMat
    );
    finial.position.set(side * (gsWidth * 0.5 + 0.014), 0.088, 0.003);
    grandstand.add(finial);
  }

  // Central Hanok Ridge Beam (용마루)
  const ridgeBeam = new THREE.Mesh(
    new THREE.BoxGeometry(gsWidth + 0.034, 0.0055, 0.0072),
    carbonDarkMat
  );
  ridgeBeam.position.set(0, 0.083, 0.003);
  grandstand.add(ridgeBeam);

  // Glowing Grandstand Front Facade Banner ("KOREA INTERNATIONAL CIRCUIT · 전남 영암 F1")
  const gsBannerTex = createF1BannerTexture(
    'KOREA INTERNATIONAL CIRCUIT',
    '전남 영암 F1 국제자동차경주장 · MAIN GRANDSTAND'
  );
  const gsBanner = new THREE.Mesh(
    new THREE.PlaneGeometry(gsWidth - 0.012, 0.012),
    new THREE.MeshBasicMaterial({ map: gsBannerTex, side: THREE.DoubleSide })
  );
  gsBanner.position.set(0, 0.009, -0.0326);
  gsBanner.rotation.y = Math.PI; // Face track (-Z)
  grandstand.add(gsBanner);

  // Backlit upper roof sign visible from Pit Straight & Heli cam
  const gsRoofSign = new THREE.Mesh(
    new THREE.PlaneGeometry(0.24, 0.018),
    new THREE.MeshBasicMaterial({ map: gsBannerTex, side: THREE.DoubleSide })
  );
  gsRoofSign.position.set(0, 0.094, 0.003);
  gsRoofSign.rotation.y = Math.PI;
  grandstand.add(gsRoofSign);

  sceneryGroup.add(grandstand);

  // -------------------------------------------------------------------------
  // 3. F1 PIT BUILDING, 8 TEAM GARAGES & PIT WALL (피트 빌딩 & 팀 개러지)
  // -------------------------------------------------------------------------
  const pitBuilding = new THREE.Group();
  pitBuilding.name = 'YeongamF1PitBuilding';
  pitBuilding.position.set(-0.04, 0.003, 0.148);

  const pbW = 0.28;
  const pbD = 0.044;

  // Lower Garage Block
  const pbLower = new THREE.Mesh(
    new THREE.BoxGeometry(pbW, 0.022, pbD),
    whiteSteelMat
  );
  pbLower.position.set(0, 0.011, 0);
  pbLower.castShadow = true;
  pbLower.receiveShadow = true;
  pitBuilding.add(pbLower);

  // 8 Team Garage Doors with vibrant team header stripes facing the Pit Lane (+Z)
  const teamColors = [
    0xe10600, 0x00d2be, 0x1e40af, 0xff8000,
    0x059669, 0xec4899, 0xeab308, 0x38bdf8,
  ];
  for (let g = 0; g < 8; g++) {
    const gx = -pbW * 0.44 + (g / 7) * (pbW * 0.88);
    // Dark garage opening
    const bayDoor = new THREE.Mesh(
      new THREE.PlaneGeometry(0.026, 0.014),
      carbonDarkMat
    );
    bayDoor.position.set(gx, 0.0085, pbD * 0.5 + 0.0005);
    pitBuilding.add(bayDoor);

    // Team livery glowing header bar
    const headerBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.028, 0.0032, 0.0018),
      new THREE.MeshBasicMaterial({ color: teamColors[g] })
    );
    headerBar.position.set(gx, 0.0185, pbD * 0.5 + 0.001);
    pitBuilding.add(headerBar);
  }

  // 2nd Floor Paddock Club Glass Hospitality Level
  const pbUpper = new THREE.Mesh(
    new THREE.BoxGeometry(pbW - 0.010, 0.018, pbD - 0.006),
    vipGlassMat
  );
  pbUpper.position.set(0, 0.031, -0.001);
  pbUpper.castShadow = true;
  pitBuilding.add(pbUpper);

  // Sculpted cantilevered Pit Roof Canopy with Korean red trim
  const pbRoof = new THREE.Mesh(
    new THREE.BoxGeometry(pbW + 0.016, 0.0038, pbD + 0.016),
    whiteSteelMat
  );
  pbRoof.position.set(0, 0.0415, 0.003);
  pbRoof.castShadow = true;
  pitBuilding.add(pbRoof);

  const pbRedTrim = new THREE.Mesh(
    new THREE.BoxGeometry(pbW + 0.018, 0.0022, 0.0025),
    f1RedMat
  );
  pbRedTrim.position.set(0, 0.0415, pbD * 0.5 + 0.011);
  pitBuilding.add(pbRedTrim);

  // White rooftop VIP hospitality tents (3 miniature pyramid canopies)
  for (let t = -1; t <= 1; t++) {
    const tent = new THREE.Mesh(
      new THREE.ConeGeometry(0.018, 0.012, 4),
      whiteSteelMat
    );
    tent.rotation.y = Math.PI * 0.25;
    tent.position.set(t * 0.072, 0.049, -0.002);
    pitBuilding.add(tent);
  }

  // Pit Wall & Timing Command Stands between Pit Lane and Main Straight
  const pitWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.0068, 0.0042),
    concreteMat
  );
  pitWall.position.set(0, 0.0034, 0.056);
  pitBuilding.add(pitWall);

  const pitWallRedStripe = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.0018, 0.0046),
    f1RedMat
  );
  pitWallRedStripe.position.set(0, 0.0062, 0.056);
  pitBuilding.add(pitWallRedStripe);

  // 3 Pit-Wall Team Telemetry Command Canopies
  for (let c = -1; c <= 1; c++) {
    const cmd = new THREE.Mesh(
      new THREE.BoxGeometry(0.032, 0.009, 0.009),
      carbonDarkMat
    );
    cmd.position.set(c * 0.088, 0.010, 0.052);
    pitBuilding.add(cmd);
  }

  sceneryGroup.add(pitBuilding);

  // -------------------------------------------------------------------------
  // 4. KIC RACE CONTROL TOWER & F1 DIGITAL TIMING PYLON (레이스 컨트롤 & 순위 타워)
  // -------------------------------------------------------------------------
  const controlTower = new THREE.Group();
  controlTower.name = 'YeongamRaceControlTower';
  controlTower.position.set(-0.275, 0.003, 0.145);

  // Cylindrical elevator core
  const towerCore = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.015, 0.072, 12),
    whiteSteelMat
  );
  towerCore.position.y = 0.036;
  towerCore.castShadow = true;
  controlTower.add(towerCore);

  // Mid technical observation deck
  const midDeck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.019, 0.012, 12),
    controlGlassMat
  );
  midDeck.position.y = 0.048;
  controlTower.add(midDeck);

  // Cantilevered Top Race Control Operations Pod
  const topPod = new THREE.Mesh(
    new THREE.BoxGeometry(0.052, 0.016, 0.030),
    controlGlassMat
  );
  topPod.position.set(0.005, 0.068, 0.006);
  topPod.castShadow = true;
  controlTower.add(topPod);

  const topRoof = new THREE.Mesh(
    new THREE.BoxGeometry(0.058, 0.004, 0.036),
    whiteSteelMat
  );
  topRoof.position.set(0.005, 0.078, 0.006);
  controlTower.add(topRoof);

  const topRedBand = new THREE.Mesh(
    new THREE.BoxGeometry(0.059, 0.0024, 0.037),
    f1RedMat
  );
  topRedBand.position.set(0.005, 0.0595, 0.006);
  controlTower.add(topRedBand);

  // Comms spire + glowing red aviation warning beacon
  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0009, 0.0018, 0.032, 6),
    brushedSteelMat
  );
  antenna.position.set(0.005, 0.095, 0.006);
  controlTower.add(antenna);

  const towerBeacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.0028, 8, 8),
    ledRedMat
  );
  towerBeacon.position.set(0.005, 0.112, 0.006);
  controlTower.add(towerBeacon);

  sceneryGroup.add(controlTower);

  // Digital F1 Timing Leaderboard Pylon (standing tall near Pit Exit / Turn 1)
  const timingPylon = new THREE.Group();
  timingPylon.name = 'YeongamTimingPylon';
  timingPylon.position.set(-0.228, 0.003, 0.174);
  timingPylon.rotation.y = 0.32;

  const pylonBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.022, 0.092, 0.014),
    carbonDarkMat
  );
  pylonBody.position.y = 0.046;
  pylonBody.castShadow = true;
  timingPylon.add(pylonBody);

  const pylonTex = createTimingPylonTexture();
  const pylonScreenMat = new THREE.MeshBasicMaterial({ map: pylonTex });
  const pylonFront = new THREE.Mesh(new THREE.PlaneGeometry(0.020, 0.086), pylonScreenMat);
  pylonFront.position.set(0, 0.046, 0.0074);
  timingPylon.add(pylonFront);

  const pylonBack = new THREE.Mesh(new THREE.PlaneGeometry(0.020, 0.086), pylonScreenMat);
  pylonBack.position.set(0, 0.046, -0.0074);
  pylonBack.rotation.y = Math.PI;
  timingPylon.add(pylonBack);

  sceneryGroup.add(timingPylon);

  // -------------------------------------------------------------------------
  // 5. KOREA GRAND PRIX · 영암 F1 OVERPASS SPONSOR BRIDGE (BACK STRAIGHT)
  // -------------------------------------------------------------------------
  const bridgeGroup = new THREE.Group();
  bridgeGroup.name = 'YeongamOverpassBridge';
  // Back straight passes through x = -0.04, z = -0.174 at y ≈ 0.024m
  bridgeGroup.position.set(-0.04, 0.002, -0.174);

  const bridgeSpanZ = 0.068;
  const bridgeClearY = 0.072; // High clearance above roadbed (y=0.024 + kart height 0.018)

  for (const side of [-1, 1]) {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.016, bridgeClearY + 0.014, 0.012),
      whiteSteelMat
    );
    leg.position.set(0, (bridgeClearY + 0.014) * 0.5, side * (bridgeSpanZ * 0.5));
    leg.castShadow = true;
    bridgeGroup.add(leg);

    const legFoot = new THREE.Mesh(
      new THREE.BoxGeometry(0.022, 0.010, 0.018),
      darkConcreteMat
    );
    legFoot.position.set(0, 0.005, side * (bridgeSpanZ * 0.5));
    bridgeGroup.add(legFoot);
  }

  const bridgeDeck = new THREE.Mesh(
    new THREE.BoxGeometry(0.020, 0.018, bridgeSpanZ + 0.020),
    carbonDarkMat
  );
  bridgeDeck.position.set(0, bridgeClearY + 0.006, 0);
  bridgeDeck.castShadow = true;
  bridgeGroup.add(bridgeDeck);

  const bridgeTopBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.022, 0.0032, bridgeSpanZ + 0.024),
    f1RedMat
  );
  bridgeTopBar.position.set(0, bridgeClearY + 0.016, 0);
  bridgeGroup.add(bridgeTopBar);

  const bridgeBannerTex = createF1BannerTexture(
    'KOREA GRAND PRIX · DRS',
    '전남 영암 F1 국제자동차경주장'
  );
  const bridgeBannerMat = new THREE.MeshBasicMaterial({ map: bridgeBannerTex });

  // Faces approaching cars coming from -X along the back straight
  const bridgeSignWest = new THREE.Mesh(new THREE.PlaneGeometry(bridgeSpanZ + 0.012, 0.016), bridgeBannerMat);
  bridgeSignWest.position.set(-0.0105, bridgeClearY + 0.006, 0);
  bridgeSignWest.rotation.y = -Math.PI * 0.5;
  bridgeGroup.add(bridgeSignWest);

  const bridgeSignEast = new THREE.Mesh(new THREE.PlaneGeometry(bridgeSpanZ + 0.012, 0.016), bridgeBannerMat);
  bridgeSignEast.position.set(0.0105, bridgeClearY + 0.006, 0);
  bridgeSignEast.rotation.y = Math.PI * 0.5;
  bridgeGroup.add(bridgeSignEast);

  sceneryGroup.add(bridgeGroup);

  // -------------------------------------------------------------------------
  // 6. YEONGSAN LAKE MARINA WATERFRONT & BOBBING YACHTS (영산호 마리나 & 요트)
  // -------------------------------------------------------------------------
  const marinaGroup = new THREE.Group();
  marinaGroup.name = 'YeongsanLakeMarina';
  marinaGroup.position.set(0.545, 0.001, 0.075);

  const marinaWaterMat = new THREE.MeshStandardMaterial({
    color: 0x0b3b66,
    emissive: 0x06213d,
    emissiveIntensity: 0.35,
    roughness: 0.14,
    metalness: 0.65,
  });
  const waterBasin = new THREE.Mesh(
    new THREE.BoxGeometry(0.115, 0.0022, 0.32),
    marinaWaterMat
  );
  waterBasin.position.set(0.025, 0.0011, 0);
  waterBasin.receiveShadow = true;
  marinaGroup.add(waterBasin);

  // Timber waterfront promenade quay separating Sector 3 track from Yeongsan Lake
  const timberMat = new THREE.MeshStandardMaterial({
    color: 0x7c583c,
    roughness: 0.82,
    metalness: 0.04,
  });
  const quay = new THREE.Mesh(
    new THREE.BoxGeometry(0.018, 0.006, 0.31),
    timberMat
  );
  quay.position.set(-0.032, 0.003, 0);
  quay.receiveShadow = true;
  marinaGroup.add(quay);

  // 3 wooden marina finger piers extending into Yeongsan Lake
  for (let p = -1; p <= 1; p++) {
    const pier = new THREE.Mesh(
      new THREE.BoxGeometry(0.046, 0.003, 0.008),
      timberMat
    );
    pier.position.set(-0.005, 0.0035, p * 0.088);
    marinaGroup.add(pier);
  }

  // 3 miniature composite luxury sailing yachts gently bobbing in the marina
  const yachts = [];
  const yachtPositions = [
    { x: 0.028, z: -0.046, rot: 0.15, scale: 1.05, phase: 0.0 },
    { x: 0.034, z: 0.044, rot: -0.18, scale: 0.94, phase: 2.1 },
    { x: 0.024, z: 0.122, rot: 0.28, scale: 1.00, phase: 4.2 },
  ];
  const sailMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.45,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });
  for (const yp of yachtPositions) {
    const yacht = new THREE.Group();
    const hull = new THREE.Mesh(
      new THREE.BoxGeometry(0.030 * yp.scale, 0.006 * yp.scale, 0.011 * yp.scale),
      whiteSteelMat
    );
    hull.position.y = 0.0035;
    yacht.add(hull);

    const bow = new THREE.Mesh(
      new THREE.ConeGeometry(0.0056 * yp.scale, 0.012 * yp.scale, 4),
      whiteSteelMat
    );
    bow.rotation.z = -Math.PI * 0.5;
    bow.rotation.x = Math.PI * 0.25;
    bow.position.set(0.020 * yp.scale, 0.004, 0);
    yacht.add(bow);

    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(0.014 * yp.scale, 0.005 * yp.scale, 0.0075 * yp.scale),
      controlGlassMat
    );
    cabin.position.set(-0.002, 0.008, 0);
    yacht.add(cabin);

    const mast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0007, 0.001, 0.034 * yp.scale, 6),
      brushedSteelMat
    );
    mast.position.set(0.002, 0.021 * yp.scale, 0);
    yacht.add(mast);

    const sail = new THREE.Mesh(
      new THREE.ConeGeometry(0.009 * yp.scale, 0.027 * yp.scale, 3),
      sailMat
    );
    sail.position.set(-0.003, 0.022 * yp.scale, 0);
    sail.scale.set(1.1, 1.0, 0.14);
    yacht.add(sail);

    yacht.position.set(yp.x, 0.0028, yp.z);
    yacht.rotation.y = yp.rot;
    yacht.userData.baseY = 0.0028;
    yacht.userData.phase = yp.phase;
    marinaGroup.add(yacht);
    yachts.push(yacht);
  }
  sceneryGroup.add(marinaGroup);

  // -------------------------------------------------------------------------
  // 7. 6 ANGLED F1 STADIUM FLOODLIGHT TOWERS (F1 야간 경기장 조명탑)
  // -------------------------------------------------------------------------
  const floodlightSpecs = [
    { x: -0.495, z: 0.245, lookAtX: -0.35, lookAtZ: 0.16 },
    { x: -0.475, z: -0.205, lookAtX: -0.25, lookAtZ: -0.14 },
    { x: 0.14, z: -0.232, lookAtX: 0.12, lookAtZ: -0.14 },
    { x: 0.495, z: -0.185, lookAtX: 0.36, lookAtZ: -0.10 },
    { x: 0.495, z: 0.235, lookAtX: 0.34, lookAtZ: 0.16 },
    { x: -0.02, z: 0.035, lookAtX: 0.14, lookAtZ: 0.01 },
  ];

  for (const fl of floodlightSpecs) {
    const tower = new THREE.Group();
    tower.position.set(fl.x, 0.002, fl.z);
    tower.rotation.y = Math.atan2(fl.lookAtX - fl.x, fl.lookAtZ - fl.z);

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0022, 0.0038, 0.115, 8),
      brushedSteelMat
    );
    pole.position.y = 0.0575;
    pole.castShadow = true;
    tower.add(pole);

    const neck = new THREE.Mesh(
      new THREE.BoxGeometry(0.004, 0.022, 0.004),
      brushedSteelMat
    );
    neck.position.set(0, 0.120, 0.005);
    neck.rotation.x = 0.42;
    tower.add(neck);

    const lampHousing = new THREE.Mesh(
      new THREE.BoxGeometry(0.026, 0.012, 0.006),
      carbonDarkMat
    );
    lampHousing.position.set(0, 0.126, 0.011);
    lampHousing.rotation.x = 0.38;
    tower.add(lampHousing);

    const ledPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(0.023, 0.0092),
      ledWhiteMat
    );
    ledPanel.position.set(0, 0.1245, 0.0145);
    ledPanel.rotation.x = 0.38;
    tower.add(ledPanel);

    sceneryGroup.add(tower);
  }

  // -------------------------------------------------------------------------
  // 8. FIA TIRE BARRIERS (InstancedMesh) & TRACKSIDE KOREAN F1 SIGNBOARDS
  // -------------------------------------------------------------------------
  const tirePositions = [
    // Turn 1 outside barrier
    [-0.472, 0.228], [-0.484, 0.214], [-0.494, 0.198], [-0.500, 0.180], [-0.502, 0.160],
    // Turn 3 Hairpin outside barrier
    [0.478, -0.152], [0.490, -0.136], [0.496, -0.118], [0.496, -0.098], [0.488, -0.080],
    // Marina bend outside barrier
    [0.486, 0.135], [0.482, 0.155], [0.474, 0.175], [0.462, 0.192],
  ];
  const tireGeo = new THREE.CylinderGeometry(0.0045, 0.0045, 0.0085, 10);
  const tireMat = new THREE.MeshStandardMaterial({ roughness: 0.82, metalness: 0.06 });
  const tireInst = new THREE.InstancedMesh(tireGeo, tireMat, tirePositions.length);
  const tireRed = new THREE.Color(0xe10600);
  const tireWhite = new THREE.Color(0xf8fafc);
  tirePositions.forEach((pt, idx) => {
    dummy.position.set(pt[0], 0.0062, pt[1]);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.setScalar(1.0);
    dummy.updateMatrix();
    tireInst.setMatrixAt(idx, dummy.matrix);
    tireInst.setColorAt(idx, idx % 2 === 0 ? tireRed : tireWhite);
  });
  tireInst.instanceMatrix.needsUpdate = true;
  if (tireInst.instanceColor) tireInst.instanceColor.needsUpdate = true;
  tireInst.computeBoundingSphere();
  sceneryGroup.add(tireInst);

  // Trackside Korean Landmark Signboards
  const signSpecs = [
    { x: -0.37, z: 0.268, rotY: 0.18, l1: '전남 영암 F1 경기장', l2: 'TURN 1 · 100M', accent: '#e10600' },
    { x: 0.42, z: -0.215, rotY: -0.45, l1: '턴 3 헤어핀 감속구간', l2: 'HEAVY BRAKING', accent: '#f59e0b' },
    { x: 0.42, z: 0.252, rotY: -0.35, l1: '영산호 마리나 섹터', l2: 'MARINA SECTOR 3', accent: '#0284c7' },
  ];
  for (const s of signSpecs) {
    const sg = new THREE.Group();
    sg.position.set(s.x, 0.003, s.z);
    sg.rotation.y = s.rotY;

    const postL = new THREE.Mesh(new THREE.CylinderGeometry(0.0012, 0.0014, 0.024, 6), brushedSteelMat);
    postL.position.set(-0.018, 0.012, 0);
    sg.add(postL);
    const postR = postL.clone();
    postR.position.x = 0.018;
    sg.add(postR);

    const board = new THREE.Mesh(
      new THREE.BoxGeometry(0.052, 0.020, 0.0024),
      new THREE.MeshBasicMaterial({ map: createSignboardTexture(s.l1, s.l2, s.accent) })
    );
    board.position.y = 0.024;
    sg.add(board);

    sceneryGroup.add(sg);
  }

  // -------------------------------------------------------------------------
  // 9. DISTANT WOLCHULSAN MOUNTAIN RIDGE (월출산) & YEONGAM COASTAL WIND TURBINES
  // -------------------------------------------------------------------------
  const wolchulsanMat = new THREE.MeshStandardMaterial({
    color: 0x263147,
    roughness: 0.94,
    metalness: 0.04,
  });
  const peakSpecs = [
    { x: -0.34, z: -0.355, r: 0.088, h: 0.095 },
    { x: -0.18, z: -0.382, r: 0.105, h: 0.132 }, // Cheonhwangbong main peak
    { x: -0.02, z: -0.368, r: 0.092, h: 0.108 },
    { x: 0.16, z: -0.375, r: 0.100, h: 0.118 },
    { x: 0.34, z: -0.352, r: 0.082, h: 0.088 },
  ];
  for (const pk of peakSpecs) {
    const mtn = new THREE.Mesh(new THREE.ConeGeometry(pk.r, pk.h, 7), wolchulsanMat);
    mtn.position.set(pk.x, pk.h * 0.48, pk.z);
    mtn.scale.set(1.35, 1.0, 0.72);
    sceneryGroup.add(mtn);
  }

  // 2 Yeongam Coastal Wind Turbines rotating lazily near the northern horizon
  const turbineHubs = [];
  const turbinePositions = [
    { x: -0.44, z: -0.315, scale: 1.0 },
    { x: 0.44, z: -0.305, scale: 0.92 },
  ];
  for (const tp of turbinePositions) {
    const wt = new THREE.Group();
    wt.position.set(tp.x, 0.002, tp.z);
    wt.scale.setScalar(tp.scale);

    const mast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0018, 0.0036, 0.105, 8),
      whiteSteelMat
    );
    mast.position.y = 0.0525;
    wt.add(mast);

    const hub = new THREE.Group();
    hub.position.set(0, 0.105, 0.004);
    for (let b = 0; b < 3; b++) {
      const bladeWrap = new THREE.Group();
      bladeWrap.rotation.z = (b * Math.PI * 2) / 3;
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.0032, 0.036, 0.0014),
        whiteSteelMat
      );
      blade.position.y = 0.018;
      bladeWrap.add(blade);
      hub.add(bladeWrap);
    }
    wt.add(hub);
    turbineHubs.push(hub);
    sceneryGroup.add(wt);
  }

  // -------------------------------------------------------------------------
  // 10. GRANDSTAND TAEGEUKGI & CHECKERED FLAGS (태극기 & 체커기)
  // -------------------------------------------------------------------------
  const flags = [];
  const taegeukMat = new THREE.MeshBasicMaterial({
    map: createTaegeukFlagTexture(),
    side: THREE.DoubleSide,
  });
  const checkerMat = new THREE.MeshBasicMaterial({
    map: createCheckeredFlagTexture(),
    side: THREE.DoubleSide,
  });
  const flagSpecs = [
    { x: -0.25, z: 0.278, mat: taegeukMat },
    { x: 0.15, z: 0.278, mat: taegeukMat },
    { x: -0.21, z: 0.125, mat: checkerMat },
    { x: 0.12, z: 0.125, mat: checkerMat },
  ];
  flagSpecs.forEach((fs, idx) => {
    const fg = new THREE.Group();
    fg.position.set(fs.x, 0.003, fs.z);

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.001, 0.0014, 0.072, 6),
      brushedSteelMat
    );
    pole.position.y = 0.036;
    fg.add(pole);

    const cloth = new THREE.Mesh(new THREE.PlaneGeometry(0.024, 0.015), fs.mat);
    cloth.position.set(0.012, 0.064, 0);
    cloth.userData.phase = idx * 1.4;
    fg.add(cloth);
    flags.push(cloth);

    sceneryGroup.add(fg);
  });

  // -------------------------------------------------------------------------
  // 11. ANIMATED F1 TV BROADCAST HELICOPTER (F1 중계 헬리콥터)
  // -------------------------------------------------------------------------
  const heli = new THREE.Group();
  heli.name = 'YeongamBroadcastHelicopter';

  const heliFuselage = new THREE.Mesh(
    new THREE.SphereGeometry(0.012, 12, 10),
    f1RedMat
  );
  heliFuselage.scale.set(1.55, 0.85, 0.88);
  heli.add(heliFuselage);

  const heliCanopy = new THREE.Mesh(
    new THREE.SphereGeometry(0.0095, 10, 8),
    controlGlassMat
  );
  heliCanopy.position.set(0.007, 0.002, 0);
  heliCanopy.scale.set(1.15, 0.78, 0.85);
  heli.add(heliCanopy);

  const heliTailBoom = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0020, 0.0042, 0.028, 8),
    whiteSteelMat
  );
  heliTailBoom.rotation.z = Math.PI * 0.5;
  heliTailBoom.position.set(-0.022, 0.002, 0);
  heli.add(heliTailBoom);

  const heliTailFin = new THREE.Mesh(
    new THREE.BoxGeometry(0.007, 0.012, 0.002),
    f1RedMat
  );
  heliTailFin.position.set(-0.035, 0.006, 0);
  heli.add(heliTailFin);

  // Camera gimbal under nose
  const cameraGimbal = new THREE.Mesh(
    new THREE.SphereGeometry(0.0038, 8, 8),
    carbonDarkMat
  );
  cameraGimbal.position.set(0.014, -0.007, 0);
  heli.add(cameraGimbal);

  // Landing skids
  for (const s of [-1, 1]) {
    const skid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.001, 0.001, 0.026, 6),
      brushedSteelMat
    );
    skid.rotation.z = Math.PI * 0.5;
    skid.position.set(0, -0.011, s * 0.0075);
    heli.add(skid);
  }

  // Spinning Main Rotor
  const mainRotor = new THREE.Group();
  mainRotor.position.set(0, 0.013, 0);
  const rotorBlade1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.068, 0.0014, 0.0042),
    carbonDarkMat
  );
  const rotorBlade2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.0042, 0.0014, 0.068),
    carbonDarkMat
  );
  mainRotor.add(rotorBlade1, rotorBlade2);
  heli.add(mainRotor);

  // Spinning Tail Rotor
  const tailRotor = new THREE.Mesh(
    new THREE.BoxGeometry(0.0018, 0.012, 0.0018),
    whiteSteelMat
  );
  tailRotor.position.set(-0.035, 0.007, 0.0032);
  heli.add(tailRotor);

  heli.position.set(0, 0.215, 0);
  sceneryGroup.add(heli);

  // -------------------------------------------------------------------------
  // PER-FRAME ANIMATION UPDATE (ZERO ALLOCATIONS)
  // -------------------------------------------------------------------------
  sceneryGroup.userData.update = function updateYeongamScenery(elapsedTime, delta) {
    const dt = Math.min(delta || 0.016, 0.05);

    // 1. Orbit F1 TV Broadcast Helicopter over the Yeongam stadium
    const orbitAngle = elapsedTime * 0.34;
    const rx = 0.29;
    const rz = 0.16;
    const hx = Math.cos(orbitAngle) * rx;
    const hz = Math.sin(orbitAngle) * rz + 0.01;
    const hy = 0.205 + Math.sin(elapsedTime * 1.1) * 0.008;
    heli.position.set(hx, hy, hz);
    // Tangent direction of ellipse
    const vx = -Math.sin(orbitAngle) * rx;
    const vz = Math.cos(orbitAngle) * rz;
    heli.rotation.y = Math.atan2(-vz, vx);
    heli.rotation.z = -0.10; // Slight forward pitch
    heli.rotation.x = 0.14;  // Inward bank
    mainRotor.rotation.y += dt * 38.0;
    tailRotor.rotation.x += dt * 44.0;

    // 2. Gently bob Yeongsan Lake Marina yachts
    for (let i = 0; i < yachts.length; i++) {
      const y = yachts[i];
      const ph = y.userData.phase;
      y.position.y = y.userData.baseY + Math.sin(elapsedTime * 1.8 + ph) * 0.0012;
      y.rotation.z = Math.sin(elapsedTime * 1.4 + ph) * 0.045;
      y.rotation.x = Math.cos(elapsedTime * 1.1 + ph) * 0.030;
    }

    // 3. Spin distant Yeongam coastal wind turbines
    for (let i = 0; i < turbineHubs.length; i++) {
      turbineHubs[i].rotation.z -= dt * (1.1 + i * 0.18);
    }

    // 4. Flutter grandstand Taegeukgi & checkered flags
    for (let i = 0; i < flags.length; i++) {
      const fl = flags[i];
      fl.rotation.y = Math.sin(elapsedTime * 5.2 + fl.userData.phase) * 0.22;
    }

    // 5. Pulse Race Control Tower aviation beacon
    const pulse = 0.55 + 0.45 * Math.sin(elapsedTime * 4.2);
    towerBeacon.scale.setScalar(0.85 + pulse * 0.35);
  };

  return sceneryGroup;
}
