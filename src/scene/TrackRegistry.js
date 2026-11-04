import * as THREE from 'three';

/**
 * Registry of available race circuits in Desk Racer.
 * Each circuit specifies metadata and spline definition.
 */
export const TRACK_DEFINITIONS = [
  {
    id: 'classic',
    name: 'Classic Coaster',
    nameKr: '클래식 코스터',
    tagline: 'High-Altitude Desktop Rollercoaster',
    taglineKr: '공중 롤러코스터 · 캣 헬릭스 & 램프 코크스크루',
    icon: '🎢',
    difficulty: 'Normal',
    difficultyKr: '보통',
    lengthM: 3.84,
    turns: 14,
    color: '#00e5ff',
    badgeText: 'ORIGINAL',
    description: 'Iconic desktop coaster winding through the Giant Cat 360° helix, white key-light lamp corkscrew, and laptop viaduct.',
    descriptionKr: '책상 위를 입체적으로 가로지르는 클래식 롤러코스터 트랙. 샴 고양이 360° 뱅킹 헬릭스와 데스크 조명 코크스크루가 특징입니다.',
    sectors: [
      { id: 1, name: 'BoYata Laptop Sky-Climb' },
      { id: 2, name: 'Siamese Cat 360° Banked Helix' },
      { id: 3, name: 'Glowing Blue Mic Underpass' },
      { id: 4, name: 'White Key-Light Corkscrew' },
      { id: 5, name: 'Mouse Mat C-Curve' },
      { id: 6, name: 'Keyboard Viaduct Start/Finish' },
    ],
  },
  {
    id: 'gymkhana',
    name: 'Desk Gymkhana',
    nameKr: '데스크 짐카나',
    tagline: 'Flat Surface Drift Circuit',
    taglineKr: '데스크탑 저공 드리프트 · 키보드 & 머그잔 슬라럼',
    icon: '⚡',
    difficulty: 'Technical',
    difficultyKr: '테크니컬',
    lengthM: 2.95,
    turns: 18,
    color: '#ffaa00',
    badgeText: 'NEW DRIFT',
    description: 'Low-profile desktop surface circuit weaving between the coffee mug, microphone stand, monitor base, and mouse pad.',
    descriptionKr: '책상 표면과 장패드를 밀착하여 달리는 저공 드리프트 테크니컬 코스. 키보드 앞 직선 구간과 머그잔 및 마이크 사이의 연속 헤어핀이 압권입니다.',
    sectors: [
      { id: 1, name: 'Keyboard Main Sprint' },
      { id: 2, name: 'Coffee Mug Chicane' },
      { id: 3, name: 'Yeti Microphone Slalom' },
      { id: 4, name: 'Monitor Base Sweeper' },
      { id: 5, name: 'Mousepad S-Bends' },
      { id: 6, name: 'Final Grid Turn' },
    ],
  },
  {
    id: 'infinity',
    name: 'Sky Infinity Loop',
    nameKr: '스카이 인피니티',
    tagline: 'High Elevation Figure-8 Supersonic Track',
    taglineKr: '고공 3차원 입체 8자 루프 · 초고속 다운힐',
    icon: '♾️',
    difficulty: 'Fast & Extreme',
    difficultyKr: '익스트림',
    lengthM: 4.28,
    turns: 12,
    color: '#a855f7',
    badgeText: '3D FIGURE-8',
    description: 'Spectacular multi-level figure-8 crossover track soaring high above the laptop stand before plunging in a steep supersonic downhill.',
    descriptionKr: '노트북 스탠드 위로 17cm 높이까지 솟구쳤다가 가파르게 급강하하는 3차원 입체 8자 교차 코스. 공중 육교와 오버헤드 플라이오버가 포함되어 있습니다.',
    sectors: [
      { id: 1, name: 'BoYata Sky Ramp' },
      { id: 2, name: 'Cloud-Nine High Apex' },
      { id: 3, name: 'Figure-8 Center Flyover' },
      { id: 4, name: 'Supersonic Lamp Dive' },
      { id: 5, name: 'Lower Underpass Tunnel' },
      { id: 6, name: 'Grand Prix Home Straight' },
    ],
  },
  {
    id: 'countryside',
    name: 'Country Meadow',
    nameKr: '시골 들판길',
    tagline: 'Gentle Pastoral Country Byway',
    taglineKr: '평화로운 시골 들판길 · 완만한 힐링 드라이브',
    icon: '🌾',
    difficulty: 'Easy',
    difficultyKr: '초급 / 힐링',
    lengthM: 3.32,
    turns: 10,
    color: '#4ade80',
    badgeText: 'EASY 힐링',
    description: 'A peaceful, wide, gentle countryside road winding leisurely around the desk with soft rolling knolls, wooden fences, and miniature pine trees.',
    descriptionKr: '넓고 완만한 코너로 이루어진 초급 힐링 시골길. 가파른 낙하나 급격한 롤러코스터 경사 없이 아기자기한 통나무 울타리와 미니 가로수를 감상하며 편안하게 주행할 수 있습니다.',
    sectors: [
      { id: 1, name: 'Country Home Straight (시골 마을 출발로)' },
      { id: 2, name: 'Meadow Hillock Curve (초원 언덕길 코너)' },
      { id: 3, name: 'Wooden Fence Pasture (통나무 울타리 목초지)' },
      { id: 4, name: 'Peaceful Creek Bend (고요한 시냇가 곡선로)' },
      { id: 5, name: 'Windmill Village Bypass (풍차 마을 우회로)' },
      { id: 6, name: 'Golden Field Return (황금빛 들판 귀환로)' },
    ],
  },
];

// In-memory cache of generated splineData objects
const splineCache = new Map();

/**
 * Builds a 720-sample periodic closed splineData object from control points
 */
function buildSplineDataFromControlPoints(def, controlPoints, startFinishIdx = 0, startSector = 1) {
  const vectors = controlPoints.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
  const banks = controlPoints.map((p) => p[3] || 0.0);
  const sectors = controlPoints.map((p) => p[4] || 1);
  const numCp = controlPoints.length;

  const curve = new THREE.CatmullRomCurve3(vectors, true, 'centripetal', 0.5);

  const numSamples = 720;
  const rawPoints = curve.getSpacedPoints(numSamples - 1); // 720 points

  const samples = [];
  let totalLength = 0;
  const arcLengths = [0];

  for (let i = 1; i < numSamples; i++) {
    const d = rawPoints[i].distanceTo(rawPoints[i - 1]);
    totalLength += d;
    arcLengths.push(totalLength);
  }
  // Add closing segment distance
  const closingDist = rawPoints[0].distanceTo(rawPoints[numSamples - 1]);
  totalLength += closingDist;

  // Pre-calculate tangents and reference frames
  const baseUp = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i < numSamples; i++) {
    const t = i / numSamples;
    const pos = rawPoints[i];
    const tangent = curve.getTangentAt(t).normalize();

    // Interpolate bank angle and sector from closest control points
    const cpIndexFloat = t * numCp;
    const cp0 = Math.floor(cpIndexFloat) % numCp;
    const cp1 = (cp0 + 1) % numCp;
    const cpFrac = cpIndexFloat - Math.floor(cpIndexFloat);

    const bankDeg = THREE.MathUtils.lerp(banks[cp0], banks[cp1], cpFrac);
    const sector = sectors[Math.min(numCp - 1, Math.floor(cpIndexFloat))];

    // Compute initial right and normal vectors
    let right = new THREE.Vector3().crossVectors(tangent, baseUp).normalize();
    if (right.lengthSq() < 0.01) {
      // Tangent is nearly vertical
      right = new THREE.Vector3(1, 0, 0);
    }
    let normal = new THREE.Vector3().crossVectors(right, tangent).normalize();

    // Apply banking rotation around tangent
    if (Math.abs(bankDeg) > 0.1) {
      const bankRad = THREE.MathUtils.degToRad(bankDeg);
      const qBank = new THREE.Quaternion().setFromAxisAngle(tangent, bankRad);
      right.applyQuaternion(qBank).normalize();
      normal.applyQuaternion(qBank).normalize();
    }

    samples.push({
      index: i,
      t: Number(t.toFixed(6)),
      sector,
      position: [Number(pos.x.toFixed(5)), Number(pos.y.toFixed(5)), Number(pos.z.toFixed(5))],
      tangent: [Number(tangent.x.toFixed(5)), Number(tangent.y.toFixed(5)), Number(tangent.z.toFixed(5))],
      right: [Number(right.x.toFixed(5)), Number(right.y.toFixed(5)), Number(right.z.toFixed(5))],
      normal: [Number(normal.x.toFixed(5)), Number(normal.y.toFixed(5)), Number(normal.z.toFixed(5))],
      bank_deg: Number(bankDeg.toFixed(2)),
      arc_length_m: Number(arcLengths[i].toFixed(5)),
    });
  }

  return {
    id: def.id,
    name: def.name,
    is_closed_periodic_loop: true,
    track_width_m: def.id === 'countryside' ? 0.024 : 0.022,
    curb_width_m: def.id === 'countryside' ? 0.0028 : 0.0025,
    rail_height_m: 0.0035,
    total_length_m: Number(totalLength.toFixed(4)),
    scale_equivalent_length_m: Number((totalLength * 87.0).toFixed(1)),
    num_control_points: numCp,
    num_samples: numSamples,
    sectors: def.sectors,
    start_finish_index: startFinishIdx,
    start_sector: startSector,
    samples,
  };
}

/**
 * Control points for Desk Gymkhana: low-profile surface drift circuit
 * Format: [x, y, z, bank_deg, sector_id]
 */
const GYMKHANA_CONTROL_POINTS = [
  // Sector 1: Keyboard Main Sprint & Start Line
  [0.08, 0.016, 0.245, 0.0, 1],
  [-0.08, 0.016, 0.245, 0.0, 1],
  [-0.24, 0.017, 0.242, 8.0, 1],

  // Sector 2: Coffee Mug Chicane
  [-0.38, 0.018, 0.225, 14.0, 2],
  [-0.47, 0.018, 0.160, 18.0, 2],
  [-0.48, 0.018, 0.070, 12.0, 2],
  [-0.42, 0.018, -0.010, -12.0, 2],

  // Sector 3: Yeti Microphone Slalom
  [-0.32, 0.019, -0.050, 14.0, 3],
  [-0.20, 0.018, -0.020, -16.0, 3],
  [-0.10, 0.020, -0.070, 12.0, 3],

  // Sector 4: Monitor Base Sweeper
  [0.05, 0.022, -0.115, -12.0, 4],
  [0.20, 0.020, -0.090, 14.0, 4],
  [0.34, 0.018, -0.020, -15.0, 4],

  // Sector 5: Mousepad S-Bends
  [0.43, 0.017, 0.070, 16.0, 5],
  [0.41, 0.016, 0.160, -14.0, 5],
  [0.32, 0.016, 0.225, 10.0, 5],

  // Sector 6: Final Grid Turn back to Start
  [0.20, 0.016, 0.245, 2.0, 6],
];

/**
 * Control points for Sky Infinity Loop: 3D Figure-8 with High Flyover & Tunnel
 * Format: [x, y, z, bank_deg, sector_id]
 */
const INFINITY_CONTROL_POINTS = [
  // Sector 6: Home Straight & Start Line
  [0.00, 0.038, 0.245, 0.0, 6],

  // Sector 1: BoYata Sky Ramp
  [-0.15, 0.058, 0.235, -10.0, 1],
  [-0.28, 0.098, 0.205, -20.0, 1],
  [-0.38, 0.142, 0.125, -28.0, 1],

  // Sector 2: Cloud-Nine High Apex (17.2cm peak)
  [-0.44, 0.172, 0.010, -32.0, 2],
  [-0.42, 0.168, -0.100, -26.0, 2],
  [-0.28, 0.145, -0.165, 14.0, 2],

  // Sector 3: Figure-8 Center Flyover (High Bridge soaring at Y = 10.5cm)
  [-0.12, 0.118, -0.115, 18.0, 3],
  [0.00, 0.098, -0.020, 20.0, 3],
  [0.14, 0.076, 0.065, 22.0, 3],

  // Sector 4: Supersonic Lamp Dive
  [0.28, 0.050, 0.145, 25.0, 4],
  [0.42, 0.034, 0.130, 30.0, 4],
  [0.44, 0.030, 0.020, -22.0, 4],

  // Sector 5: Lower Underpass Tunnel (Ducks cleanly under high bridge at Y = 2.7cm)
  [0.34, 0.028, -0.100, -26.0, 5],
  [0.18, 0.027, -0.075, -14.0, 5],
  [0.05, 0.027, 0.025, 8.0, 5],

  // Return curve to Grand Prix Straight
  [0.12, 0.032, 0.160, 6.0, 6],
  [0.08, 0.036, 0.235, 0.0, 6],
];

/**
 * Control points for Country Meadow: easy, wide, gentle countryside road
 * Format: [x, y, z, bank_deg, sector_id]
 */
const COUNTRYSIDE_CONTROL_POINTS = [
  // Sector 1: Country Home Straight & Start Line
  [0.00, 0.016, 0.238, 0.0, 1],
  [-0.14, 0.016, 0.238, 0.0, 1],
  [-0.26, 0.018, 0.230, 4.0, 1],

  // Sector 2: Meadow Hillock Curve (soft rising knoll)
  [-0.37, 0.024, 0.195, 6.0, 2],
  [-0.45, 0.030, 0.125, 7.0, 2],
  [-0.46, 0.034, 0.020, 6.0, 2],

  // Sector 3: Wooden Fence Pasture
  [-0.41, 0.036, -0.085, 5.0, 3],
  [-0.30, 0.034, -0.160, 4.0, 3],
  [-0.16, 0.030, -0.175, -3.0, 3],

  // Sector 4: Peaceful Creek Bend
  [-0.02, 0.026, -0.170, -4.0, 4],
  [0.14, 0.023, -0.155, 3.0, 4],
  [0.28, 0.020, -0.125, 5.0, 4],

  // Sector 5: Windmill Village Bypass
  [0.40, 0.018, -0.035, 6.0, 5],
  [0.44, 0.017, 0.075, 5.0, 5],
  [0.39, 0.016, 0.175, 3.0, 5],

  // Sector 6: Golden Field Return
  [0.28, 0.016, 0.230, 2.0, 6],
  [0.14, 0.016, 0.238, 0.0, 6],
];

/**
 * Returns the splineData object for the requested track ID.
 * @param {string} trackId - 'classic', 'gymkhana', 'infinity', or 'countryside'
 * @param {object} defaultClassicSpline - Pre-loaded track_spline.json if available
 */
export function getTrackSplineData(trackId, defaultClassicSpline = null) {
  if (trackId === 'classic') {
    if (defaultClassicSpline) {
      // Ensure start_finish_index is present
      if (defaultClassicSpline.start_finish_index === undefined) {
        defaultClassicSpline.start_finish_index = 646;
        defaultClassicSpline.start_sector = 6;
      }
      return defaultClassicSpline;
    }
  }

  if (splineCache.has(trackId)) {
    return splineCache.get(trackId);
  }

  const def = TRACK_DEFINITIONS.find((t) => t.id === trackId) || TRACK_DEFINITIONS[0];

  if (trackId === 'gymkhana') {
    const generated = buildSplineDataFromControlPoints(def, GYMKHANA_CONTROL_POINTS, 0, 1);
    splineCache.set('gymkhana', generated);
    return generated;
  }

  if (trackId === 'infinity') {
    const generated = buildSplineDataFromControlPoints(def, INFINITY_CONTROL_POINTS, 0, 6);
    splineCache.set('infinity', generated);
    return generated;
  }

  if (trackId === 'countryside') {
    const generated = buildSplineDataFromControlPoints(def, COUNTRYSIDE_CONTROL_POINTS, 0, 1);
    splineCache.set('countryside', generated);
    return generated;
  }

  // Fallback to classic
  return defaultClassicSpline;
}

/**
 * Retrieves the track definition metadata by ID
 */
export function getTrackDefinition(trackId) {
  return TRACK_DEFINITIONS.find((t) => t.id === trackId) || TRACK_DEFINITIONS[0];
}
