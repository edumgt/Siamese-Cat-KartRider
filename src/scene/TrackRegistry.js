import * as THREE from 'three';

/**
 * Registry of available race circuits in Desk Racer.
 * Each circuit specifies metadata and spline definition.
 */
export const TRACK_DEFINITIONS = [
  {
    id: 'yeongam',
    name: 'Yeongam F1 Circuit',
    nameKr: '전남 영암 F1 경기장',
    tagline: 'Korea International Circuit · Hanok Grandstand & Marina GP',
    taglineKr: '영암 국제자동차경주장 · 한옥 기와 그랜드스탠드 & 영산호 마리나 F1',
    icon: '🏁',
    difficulty: 'FIA Grade 1',
    difficultyKr: 'F1 그랑프리',
    lengthM: 2.92,
    turns: 18,
    color: '#e10600',
    badgeText: 'KOREA F1 GP',
    description: 'Korea\'s FIA Grade-1 Grand Prix circuit in Yeongam, Jeollanam-do featuring the iconic Korean Hanok Giwa-roof main grandstand, 8-bay F1 pit garages, Race Control tower, long DRS back straight overpass, Turn 3 hairpin, high-speed flowing esses, and Yeongsan Lake marina complex.',
    descriptionKr: '전라남도 영암의 한국 국제자동차경주장(KIC) F1 서킷! 세계적으로 유명한 전통 한옥 기와지붕 메인 그랜드스탠드, 8개 팀 피트 개러지, 레이스 컨트롤 타워와 순위 전광판, 장거리 DRS 백스트레이트 오버패스, 턴3 헤어핀과 영산호 마리나 요트 구간을 질주합니다.',
    sectors: [
      { id: 1, name: 'Main Pit Straight & Hanok Grandstand (메인 스트레이트 · 한옥 그랜드스탠드)' },
      { id: 2, name: 'Turn 1–2 Uphill Braking Complex (턴 1–2 업힐 브레이킹)' },
      { id: 3, name: 'Long DRS Back Straight & Turn 3 Hairpin (장거리 DRS 백스트레이트 & 턴 3 헤어핀)' },
      { id: 4, name: 'Sector 2 High-Speed Flowing Esses (섹터 2 고속 연속 S코너)' },
      { id: 5, name: 'Yeongsan Lake Marina Harbor Complex (영산호 마리나 하버 구간)' },
      { id: 6, name: 'Pit Entry & Final Grandstand Sweeper (피트 진입 & 파이널 코너)' },
    ],
  },
  {
    id: 'seoraksan',
    name: 'Mt. Seoraksan MTB',
    nameKr: '설악산 산악자전거 1코스',
    tagline: 'Ulsanbawi Granite Ridge & Danpung Valley Singletrack',
    taglineKr: '설악산 울산바위 · 공룡능선 & 비룡폭포 산악자전거 코스',
    icon: '🚵',
    vehicleCategory: 'mtb',
    mtbOrder: 1,
    difficulty: 'MTB Trail #1',
    difficultyKr: '산악자전거 1코스',
    lengthM: 3.88,
    turns: 15,
    color: '#ef4444',
    badgeText: 'MTB #1 · 설악산',
    description: 'Korea\'s flagship Mt. Seoraksan mountain bike trail climbing past Sinheungsa traditional Korean pavilion, autumn Danpung maple switchbacks, Geumgang red pines, Ulsanbawi 6-spire granite massif with animated cable car, and Biryong Waterfall creek suspension bridge.',
    descriptionKr: '산악자전거 첫 번째 로드! 한국 설악산의 웅장한 울산바위 기암괴석과 공룡능선, 권금성 빨간 케이블카, 신흥사 전통 기와 누각, 비룡폭포 계곡 출렁다리와 단풍나무 숲길을 질주하는 산악자전거(MTB) 1코스입니다.',
    sectors: [
      { id: 1, name: 'Seorak Trailhead & Sinheungsa Gate (설악산 MTB 1코스 출발지)' },
      { id: 2, name: 'Danpung Maple Switchbacks (설악 단풍나무 업힐 헤어핀)' },
      { id: 3, name: 'Geumgang Red Pine Climb (금강송 소나무 숲길)' },
      { id: 4, name: 'Ulsanbawi & Dinosaur Ridge Summit (울산바위 · 공룡능선 정상)' },
      { id: 5, name: 'Biryong Waterfall Downhill (비룡폭포 계곡 다운힐)' },
      { id: 6, name: 'Seorak Creek Suspension Bridge Finish (계곡 출렁다리 피니시)' },
    ],
  },
  {
    id: 'taean',
    name: 'Taean West Coast',
    nameKr: '태안 서해 해안도로',
    tagline: 'West Sea Sunset Beach & Coastal Pine Trail',
    taglineKr: '태안 만리포 해수욕장 · 꽃지 할미바위 & 안면도 해송길',
    icon: '🏖️',
    difficulty: 'Scenic Coastal',
    difficultyKr: '해안 드라이브',
    lengthM: 3.76,
    turns: 13,
    color: '#00c2d1',
    badgeText: 'WEST SEA',
    description: 'Scenic Korean West Sea coastal circuit winding past Mallipo Beach boardwalks, Anmyeondo windswept pines, Kkotji Halmi & Harabi sea stacks, Taean salt pans, and a rotating red-white lighthouse.',
    descriptionKr: '서해안 태안 반도의 황금빛 모래사장과 해넘이 절경을 배경으로 달리는 해안 드라이브 코스. 만리포 해수욕장 파라솔, 안면도 해송 숲길, 꽃지 할미·할아비 바위와 태안 천일염 염전, 빨간 등대가 펼쳐집니다.',
    sectors: [
      { id: 1, name: 'Mallipo Beachfront Straight (만리포 해수욕장 해변로)' },
      { id: 2, name: 'Anmyeondo Coastal Pine Bend (안면도 해송 숲길)' },
      { id: 3, name: 'Taean Cliff & Lighthouse Ridge (해안 절벽 & 등대 전망대)' },
      { id: 4, name: 'Kkotji Sea Stacks Overlook (꽃지 할미·할아비 바위길)' },
      { id: 5, name: 'West Sea Mudflat & Salt Pan Curve (서해 갯벌 & 천일염 염전)' },
      { id: 6, name: 'Sunset Promenade Return (서해 해넘이 피니시)' },
    ],
  },
  {
    id: 'hallasan',
    name: 'Jeju Mt. Hallasan',
    nameKr: '제주 한라산 1100 도로',
    tagline: 'Mystic Volcanic Mountain & Tangerine Valley',
    taglineKr: '한라산 1100고지 · 돌하르방 & 탐라 감귤길 힐링 레이스',
    icon: '🌋',
    difficulty: 'Scenic & Winding',
    difficultyKr: '경관 와인딩',
    lengthM: 3.98,
    turns: 14,
    color: '#ff8a00',
    badgeText: 'JEJU ISLAND',
    description: 'Iconic Korean mountain scenic highway winding past Mt. Hallasan volcanic peak, Baeknokdam crater, ancient Dol Hareubang basalt grandfathers, Saryeoni cedar forests, and sweet tangerine orchards.',
    descriptionKr: '대한민국 최고봉 한라산과 백록담 영봉을 배경으로 달리는 1100고지 절경 코스. 웅장한 돌하르방 현무암 관문, 사려니 삼나무 숲길, 샛노란 유채꽃밭과 탐라 감귤 과수원이 펼쳐지는 환상적인 힐링 레이스입니다.',
    sectors: [
      { id: 1, name: 'Hallasan Foothills (한라산 산록도로)' },
      { id: 2, name: 'Dol Hareubang Basalt Gate (돌하르방 현무암 관문)' },
      { id: 3, name: 'Saryeoni Cedar Forest Tunnel (사려니 삼나무 숲길)' },
      { id: 4, name: '1100 Highland Ridge & Baeknokdam (1100고지 백록담 조망로)' },
      { id: 5, name: 'Oreum & Windmill Winding (오름 & 풍력발전기 밸리)' },
      { id: 6, name: 'Tamra Tangerine Orchard Straight (탐라 감귤길 피니시)' },
    ],
  },
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
    track_width_m: def.id === 'yeongam' ? 0.0245 : (def.id === 'countryside' ? 0.024 : (def.id === 'hallasan' || def.id === 'taean' || def.id === 'seoraksan' ? 0.0235 : 0.022)),
    curb_width_m: def.id === 'countryside' ? 0.0028 : (def.id === 'hallasan' || def.id === 'taean' || def.id === 'seoraksan' ? 0.0026 : 0.0025),
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
 * Control points for Jeju Mt. Hallasan: high-altitude volcanic mountain & 1100 Road circuit
 * Format: [x, y, z, bank_deg, sector_id]
 */
const HALLASAN_CONTROL_POINTS = [
  // Sector 6 -> Sector 1: Tamra Tangerine Orchard Straight & Start Line
  [0.08, 0.018, 0.238, 0.0, 6],
  [-0.06, 0.018, 0.238, 0.0, 1],
  [-0.20, 0.022, 0.232, 6.0, 1],

  // Sector 1: Hallasan Foothills S-Curve (Gentle climb through the foothills)
  [-0.32, 0.028, 0.205, 10.0, 1],
  [-0.42, 0.035, 0.150, 12.0, 1],
  [-0.46, 0.042, 0.070, 8.0, 1],

  // Sector 2: Dol Hareubang Basalt Gate (Passing between the giant stone grandfathers)
  [-0.44, 0.048, -0.020, -10.0, 2],
  [-0.36, 0.054, -0.095, -14.0, 2],
  [-0.24, 0.060, -0.150, 8.0, 2],

  // Sector 3: Saryeoni Cedar Forest Tunnel (Ascending deep through towering cedars)
  [-0.10, 0.066, -0.165, 12.0, 3],
  [0.02, 0.072, -0.155, -8.0, 3],
  [0.14, 0.076, -0.160, 14.0, 3],

  // Sector 4: 1100 Highland Ridge & Baeknokdam View (High Apex ~7.8cm with panoramic mountain vistas!)
  [0.26, 0.078, -0.130, 16.0, 4],
  [0.36, 0.074, -0.060, -12.0, 4],
  [0.44, 0.065, 0.020, 15.0, 4],

  // Sector 5: Oreum Valley Winding Downhill (Dynamic downhill curves winding around volcanic oreum)
  [0.46, 0.052, 0.105, 18.0, 5],
  [0.42, 0.040, 0.175, -14.0, 5],
  [0.34, 0.030, 0.220, 10.0, 5],

  // Sector 6: Tangerine Orchard Return Straight back to Start
  [0.22, 0.022, 0.238, 2.0, 6],
];

/**
 * Control points for Taean West Coast: Mallipo beach, Anmyeondo pines, Kkotji sea stacks & salt pans
 * Format: [x, y, z, bank_deg, sector_id]
 */
const TAEAN_CONTROL_POINTS = [
  // Sector 6 -> Sector 1: Mallipo Beachfront Boardwalk Straight & Start Line
  [0.06, 0.017, 0.238, 0.0, 6],
  [-0.08, 0.017, 0.238, 0.0, 1],
  [-0.22, 0.018, 0.232, 4.0, 1],

  // Sector 2: Anmyeondo Coastal Pine Bend
  [-0.34, 0.024, 0.205, 10.0, 2],
  [-0.43, 0.032, 0.140, 12.0, 2],
  [-0.46, 0.042, 0.055, 8.0, 2],

  // Sector 3: Taean Cliff & Lighthouse Ridge
  [-0.43, 0.050, -0.040, -10.0, 3],
  [-0.34, 0.056, -0.120, -14.0, 3],
  [-0.21, 0.060, -0.158, 8.0, 3],

  // Sector 4: Kkotji Halmi & Harabi Sea Stacks Overlook
  [-0.07, 0.062, -0.165, 10.0, 4],
  [0.08, 0.058, -0.155, -8.0, 4],
  [0.22, 0.052, -0.135, 12.0, 4],

  // Sector 5: West Sea Mudflat & Taean Salt Pan Curve
  [0.34, 0.044, -0.090, 15.0, 5],
  [0.43, 0.034, -0.015, -12.0, 5],
  [0.45, 0.026, 0.075, 14.0, 5],

  // Sector 6: Sunset Promenade Return to Start
  [0.40, 0.021, 0.160, 10.0, 6],
  [0.31, 0.018, 0.215, 6.0, 6],
  [0.19, 0.017, 0.236, 2.0, 6],
];

/**
 * Control points for Mt. Seoraksan MTB #1: Valley trailhead climbing up Ulsanbawi & Dinosaur Ridge to Y=0.095m summit,
 * then carving thrilling downhill switchbacks past Biryong Waterfall and the suspension bridge
 * Format: [x, y, z, bank_deg, sector_id]
 */
const SEORAKSAN_CONTROL_POINTS = [
  // Sector 6 -> Sector 1: Trailhead Wooden Arch & Sinheungsa Gate Straight
  [0.06, 0.018, 0.236, 0.0, 6],
  [-0.08, 0.018, 0.236, 0.0, 1],
  [-0.22, 0.022, 0.228, 8.0, 1],

  // Sector 2: Autumn Danpung Maple Switchbacks (Climbing up Western Seorak Ridge)
  [-0.35, 0.031, 0.195, 14.0, 2],
  [-0.44, 0.044, 0.125, 16.0, 2],
  [-0.46, 0.058, 0.035, -12.0, 2],

  // Sector 3: Geumgang Red Pine Climb
  [-0.42, 0.072, -0.055, 14.0, 3],
  [-0.33, 0.084, -0.130, 16.0, 3],
  [-0.20, 0.092, -0.165, -10.0, 3],

  // Sector 4: Ulsanbawi Granite Cliffs & Dinosaur Ridge Summit (9.5cm alpine high ridge)
  [-0.05, 0.095, -0.172, 12.0, 4],
  [0.09, 0.088, -0.155, -14.0, 4],
  [0.23, 0.076, -0.125, 16.0, 4],

  // Sector 5: Biryong Waterfall Downhill Berms
  [0.35, 0.060, -0.075, 18.0, 5],
  [0.44, 0.044, 0.005, -16.0, 5],
  [0.45, 0.032, 0.095, 15.0, 5],

  // Sector 6: Seorak Creek Suspension Bridge Return to Start
  [0.38, 0.024, 0.172, 10.0, 6],
  [0.28, 0.019, 0.220, 6.0, 6],
  [0.18, 0.018, 0.235, 2.0, 6],
];

/**
 * 7. YEONGAM F1 CIRCUIT (전남 영암 F1 국제자동차경주장 · Korea International Circuit)
 * Iconic FIA Grade-1 layout adapted to desk diorama bounds:
 *  - Sector 1: Arrow-straight Main Pit Straight past the Hanok Giwa-roof Grandstand & Pit Garages
 *  - Sector 2: Turn 1–2 uphill braking zone & sweeping climb
 *  - Sector 3: Long 1.2km-style DRS Back Straight under KOREA GRAND PRIX overpass into Turn 3 hairpin
 *  - Sector 4: Technical Sector 2 flowing high-speed S-esses
 *  - Sector 5: Yeongsan Lake Marina waterfront stadium bends
 *  - Sector 6: Fast Pit Entry & Final Sweeper onto the Main Straight
 */
const YEONGAM_CONTROL_POINTS = [
  // Sector 1: Main Pit Straight (Hanok Grandstand on +Z left, Pit Building on -Z right)
  [0.08, 0.018, 0.234, 0.0, 1],
  [-0.12, 0.018, 0.234, 0.0, 1],
  [-0.31, 0.019, 0.232, 2.0, 1],

  // Sector 2: Turn 1–2 Uphill Braking Complex
  [-0.425, 0.024, 0.205, 11.0, 2],
  [-0.465, 0.030, 0.125, 10.0, 2],
  [-0.445, 0.034, 0.015, 6.0, 2],
  [-0.435, 0.033, -0.095, 8.0, 2],
  [-0.365, 0.030, -0.165, 9.0, 2],

  // Sector 3: Long DRS Back Straight (under Overpass Bridge) & Turn 3 Heavy-Braking Hairpin
  [-0.20, 0.026, -0.174, 0.0, 3],
  [0.00, 0.024, -0.174, 0.0, 3],
  [0.22, 0.023, -0.170, 2.0, 3],
  [0.385, 0.024, -0.162, 12.0, 3],
  [0.455, 0.025, -0.105, 14.0, 3],

  // Sector 4: Flowing High-Speed Esses (Turns 4–9)
  [0.380, 0.022, -0.048, 10.0, 4],
  [0.225, 0.021, -0.055, -10.0, 4],
  [0.165, 0.020, 0.008, -11.0, 4],
  [0.265, 0.019, 0.055, 10.0, 4],

  // Sector 5: Yeongsan Lake Marina & Harbor Complex (Turns 10–16)
  [0.395, 0.019, 0.035, 9.0, 5],
  [0.462, 0.019, 0.095, 11.0, 5],
  [0.440, 0.018, 0.180, 10.0, 5],

  // Sector 6: Pit Entry & Final Sweeper returning to Main Straight
  [0.345, 0.018, 0.224, 6.0, 6],
  [0.220, 0.018, 0.234, 1.0, 6],
];

/**
 * Returns the splineData object for the requested track ID.
 * @param {string} trackId - 'yeongam', 'seoraksan', 'taean', 'hallasan', 'classic', 'gymkhana', 'infinity', or 'countryside'
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

  if (trackId === 'yeongam') {
    const generated = buildSplineDataFromControlPoints(def, YEONGAM_CONTROL_POINTS, 0, 1);
    splineCache.set('yeongam', generated);
    return generated;
  }

  if (trackId === 'seoraksan') {
    const generated = buildSplineDataFromControlPoints(def, SEORAKSAN_CONTROL_POINTS, 0, 1);
    splineCache.set('seoraksan', generated);
    return generated;
  }

  if (trackId === 'taean') {
    const generated = buildSplineDataFromControlPoints(def, TAEAN_CONTROL_POINTS, 0, 1);
    splineCache.set('taean', generated);
    return generated;
  }

  if (trackId === 'hallasan') {
    const generated = buildSplineDataFromControlPoints(def, HALLASAN_CONTROL_POINTS, 0, 1);
    splineCache.set('hallasan', generated);
    return generated;
  }

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
