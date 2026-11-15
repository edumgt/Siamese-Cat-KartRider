import * as THREE from 'three';

/**
 * Creates a procedural glowing radial spark texture with a bright incandescent core
 * and subtle starburst diffraction spikes for realistic molten metal/tire embers (zero 404 dependencies).
 */
function createSparkTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  // Radial incandescent core glow
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  gradient.addColorStop(0.16, 'rgba(255, 248, 205, 0.98)');
  gradient.addColorStop(0.38, 'rgba(255, 155, 35, 0.82)');
  gradient.addColorStop(0.68, 'rgba(235, 60, 12, 0.32)');
  gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  // Subtle cross starburst diffraction flares
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.fillRect(26, 31, 12, 2);
  ctx.fillRect(31, 26, 2, 12);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Creates a procedural multi-lobe billowing tire smoke cloud texture (128x128, zero 404 dependencies).
 * Overlapping off-center radial lobes give each rotated particle an organic curling vapor silhouette
 * instead of a uniform circular dot.
 */
function createSmokeTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);

  // Asymmetric multi-lobe cloud puffs so per-particle rotation creates natural billowing turbulence
  const lobes = [
    { x: 64, y: 64, r: 44, a: 0.62 },
    { x: 48, y: 54, r: 34, a: 0.46 },
    { x: 82, y: 58, r: 32, a: 0.44 },
    { x: 56, y: 80, r: 34, a: 0.42 },
    { x: 78, y: 78, r: 30, a: 0.38 },
    { x: 64, y: 42, r: 28, a: 0.35 },
  ];

  for (let i = 0; i < lobes.length; i++) {
    const l = lobes[i];
    const g = ctx.createRadialGradient(l.x, l.y, l.r * 0.08, l.x, l.y, l.r);
    g.addColorStop(0.0, `rgba(255, 255, 255, ${l.a.toFixed(2)})`);
    g.addColorStop(0.38, `rgba(242, 245, 250, ${(l.a * 0.72).toFixed(2)})`);
    g.addColorStop(0.72, `rgba(220, 226, 236, ${(l.a * 0.28).toFixed(2)})`);
    g.addColorStop(1.0, 'rgba(200, 210, 222, 0.0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Soft outer safety radial mask so no lobe ever clips the square canvas boundary
  ctx.globalCompositeOperation = 'destination-in';
  const mask = ctx.createRadialGradient(64, 64, 14, 64, 64, 62);
  mask.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  mask.addColorStop(0.65, 'rgba(255, 255, 255, 0.85)');
  mask.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');
  ctx.fillStyle = mask;
  ctx.fillRect(0, 0, size, size);
  ctx.globalCompositeOperation = 'source-over';

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * High-performance Three.js Wheel Particle System:
 *  1. Wheel Drift Tire Smoke: Rotating, expanding multi-lobe billowing tire smoke emitted from
 *     all 4 Kart wheels (weighted toward the loaded outside rear + front scrubbing tires) or
 *     MTB knobby tires during drifts & high-speed cornering.
 *  2. Drift Tire Sparks: Hot luminous friction embers from rear wheel contact patches.
 *     At higher drift speeds, emission rate, particle size, scatter arc, and luminous HDR glow increase.
 *  3. Track Boundary Sparks & Curb Scrub Mist: High-velocity metallic ricochet sparks and tire dust
 *     when grinding or impacting track rails/curbs.
 *  4. Dynamic Ground & Rail Lighting: Dynamic PointLight casting interactive glow onto the track and curbs.
 */
export function createKartDriftParticleSystem() {
  const group = new THREE.Group();
  group.name = 'KartDriftParticleSystem';

  const sparkTex = createSparkTexture();
  const smokeTex = createSmokeTexture();

  // -------------------------------------------------------------------------
  // 1. VOLUMETRIC BILLOWING WHEEL SMOKE BUFFER (480 particles cyclic pool)
  // -------------------------------------------------------------------------
  const SMOKE_COUNT = 480;
  const smokeGeo = new THREE.BufferGeometry();
  const smokePositions = new Float32Array(SMOKE_COUNT * 3);
  const smokeColors = new Float32Array(SMOKE_COUNT * 3);
  const smokeSizes = new Float32Array(SMOKE_COUNT);
  const smokeAlphas = new Float32Array(SMOKE_COUNT);
  const smokeRotations = new Float32Array(SMOKE_COUNT);

  const smokeVelocities = [];
  const smokeAges = new Float32Array(SMOKE_COUNT);
  const smokeMaxAges = new Float32Array(SMOKE_COUNT);
  const smokeBaseSizes = new Float32Array(SMOKE_COUNT);
  const smokePeakAlphas = new Float32Array(SMOKE_COUNT);
  const smokeSpins = new Float32Array(SMOKE_COUNT);
  const smokeCurlPhases = new Float32Array(SMOKE_COUNT);
  const smokeExpandTargets = new Float32Array(SMOKE_COUNT);

  for (let i = 0; i < SMOKE_COUNT; i++) {
    smokePositions[i * 3 + 1] = -999.0;
    smokeVelocities.push(new THREE.Vector3());
    smokeAges[i] = 999.0;
    smokeMaxAges[i] = 0.72;
    smokeAlphas[i] = 0.0;
    smokeSizes[i] = 0.008;
    smokeBaseSizes[i] = 0.008;
    smokePeakAlphas[i] = 0.55;
    smokeRotations[i] = Math.random() * Math.PI * 2;
    smokeSpins[i] = 0.0;
    smokeCurlPhases[i] = Math.random() * Math.PI * 2;
    smokeExpandTargets[i] = 3.4;
    smokeColors[i * 3 + 0] = 0.94;
    smokeColors[i * 3 + 1] = 0.95;
    smokeColors[i * 3 + 2] = 0.98;
  }

  smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));
  smokeGeo.setAttribute('aColor', new THREE.BufferAttribute(smokeColors, 3));
  smokeGeo.setAttribute('aSize', new THREE.BufferAttribute(smokeSizes, 1));
  smokeGeo.setAttribute('aAlpha', new THREE.BufferAttribute(smokeAlphas, 1));
  smokeGeo.setAttribute('aRotation', new THREE.BufferAttribute(smokeRotations, 1));

  const smokeMat = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: smokeTex },
      uViewportHeight: { value: typeof window !== 'undefined' ? window.innerHeight : 900.0 },
    },
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.NormalBlending,
    vertexShader: /* glsl */ `
      uniform float uViewportHeight;
      attribute vec3 aColor;
      attribute float aSize;
      attribute float aAlpha;
      attribute float aRotation;
      varying vec3 vColor;
      varying float vAlpha;
      varying float vRotation;
      void main() {
        vColor = aColor;
        vAlpha = aAlpha;
        vRotation = aRotation;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        float viewScale = max(480.0, uViewportHeight) * 0.62;
        float pSize = (aSize * viewScale) / max(0.032, -mvPosition.z);
        gl_PointSize = aAlpha > 0.01 ? clamp(pSize, 1.5, 136.0) : 0.0;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      varying vec3 vColor;
      varying float vAlpha;
      varying float vRotation;
      void main() {
        if (vAlpha <= 0.01) discard;
        vec2 centered = gl_PointCoord - vec2(0.5);
        float c = cos(vRotation);
        float s = sin(vRotation);
        vec2 rotUv = vec2(
          centered.x * c - centered.y * s,
          centered.x * s + centered.y * c
        ) + vec2(0.5);
        vec4 texColor = texture2D(uMap, rotUv);
        float alpha = texColor.a * vAlpha;
        if (alpha <= 0.01) discard;
        gl_FragColor = vec4(vColor * texColor.rgb, alpha);
      }
    `,
  });

  const smokePoints = new THREE.Points(smokeGeo, smokeMat);
  smokePoints.frustumCulled = false;
  smokePoints.renderOrder = 14;
  group.add(smokePoints);

  // -------------------------------------------------------------------------
  // 2. GLOWING SPARKS BUFFER (720 particles cyclic pool)
  // -------------------------------------------------------------------------
  const SPARK_COUNT = 720;
  const sparkGeo = new THREE.BufferGeometry();
  const sparkPositions = new Float32Array(SPARK_COUNT * 3);
  const sparkColors = new Float32Array(SPARK_COUNT * 3);
  const sparkSizes = new Float32Array(SPARK_COUNT);
  const sparkAlphas = new Float32Array(SPARK_COUNT);

  const sparkVelocities = [];
  const sparkAges = new Float32Array(SPARK_COUNT);
  const sparkMaxAges = new Float32Array(SPARK_COUNT);
  const sparkCoolRates = new Float32Array(SPARK_COUNT);

  for (let i = 0; i < SPARK_COUNT; i++) {
    sparkPositions[i * 3 + 1] = -999.0; // Hide initially
    sparkVelocities.push(new THREE.Vector3());
    sparkAges[i] = 999.0;
    sparkMaxAges[i] = 0.28;
    sparkCoolRates[i] = 2.2;
    sparkAlphas[i] = 0.0;
    sparkSizes[i] = 0.005;
    sparkColors[i * 3 + 0] = 1.0;
    sparkColors[i * 3 + 1] = 0.55;
    sparkColors[i * 3 + 2] = 0.12;
  }

  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
  sparkGeo.setAttribute('aColor', new THREE.BufferAttribute(sparkColors, 3));
  sparkGeo.setAttribute('aSize', new THREE.BufferAttribute(sparkSizes, 1));
  sparkGeo.setAttribute('aAlpha', new THREE.BufferAttribute(sparkAlphas, 1));

  const sparkMat = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: sparkTex },
      uViewportHeight: { value: typeof window !== 'undefined' ? window.innerHeight : 900.0 },
    },
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      uniform float uViewportHeight;
      attribute vec3 aColor;
      attribute float aSize;
      attribute float aAlpha;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vColor = aColor;
        vAlpha = aAlpha;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        float viewScale = max(480.0, uViewportHeight) * 0.50;
        float pSize = (aSize * viewScale) / max(0.035, -mvPosition.z);
        gl_PointSize = aAlpha > 0.01 ? clamp(pSize, 0.0, 56.0) : 0.0;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        if (vAlpha <= 0.01) discard;
        vec4 texColor = texture2D(uMap, gl_PointCoord);
        float alpha = texColor.a * vAlpha;
        if (alpha <= 0.01) discard;
        // HDR boost (1.85x) so UnrealBloomPass gives each glowing spark a luminous halo
        gl_FragColor = vec4(vColor * texColor.rgb * 1.85, alpha);
      }
    `,
  });

  const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
  sparkPoints.frustumCulled = false;
  sparkPoints.renderOrder = 16;
  group.add(sparkPoints);

  // -------------------------------------------------------------------------
  // 3. DYNAMIC GROUND / RAIL FRICTION LIGHT
  // -------------------------------------------------------------------------
  const groundFlickerLight = new THREE.PointLight(0xff7818, 0.0, 0.09, 1.6);
  groundFlickerLight.castShadow = false;
  group.add(groundFlickerLight);

  // Internal ring cursor counters & telemetry state
  let sparkCursor = 0;
  let smokeCursor = 0;
  let hasActiveParticles = false;
  let isDriftingActive = false;
  let currentDriftSpeed = 0.0;
  let isBoundaryContactActive = false;
  let smokeEmitAccumulator = 0.0;

  let vehicleMode = 'kart';
  function setVehicleMode(mode) {
    vehicleMode = mode === 'mtb' ? 'mtb' : 'kart';
  }

  function setViewportHeight(heightPx) {
    const safeH = Math.max(360.0, Number(heightPx) || 900.0);
    smokeMat.uniforms.uViewportHeight.value = safeH;
    sparkMat.uniforms.uViewportHeight.value = safeH;
  }

  // Reusable math vectors (zero garbage collection in 60fps render loop)
  const _rearLeftTireWorld = new THREE.Vector3();
  const _rearRightTireWorld = new THREE.Vector3();
  const _frontLeftTireWorld = new THREE.Vector3();
  const _frontRightTireWorld = new THREE.Vector3();
  const _centerAxleWorld = new THREE.Vector3();
  const _mtbRearTireWorld = new THREE.Vector3();
  const _mtbFrontTireWorld = new THREE.Vector3();
  const _localRailContact = new THREE.Vector3();
  const _worldRailContact = new THREE.Vector3();
  const _backDir = new THREE.Vector3();
  const _rightDir = new THREE.Vector3();
  const _upDir = new THREE.Vector3();
  const _spawnPoint = new THREE.Vector3();

  // Local coordinates of all 4 Kart tire contact patches + MTB front & rear tires
  const LOCAL_REAR_LEFT = new THREE.Vector3(-0.0059, 0.0003, -0.0054);
  const LOCAL_REAR_RIGHT = new THREE.Vector3(0.0059, 0.0003, -0.0054);
  const LOCAL_FRONT_LEFT = new THREE.Vector3(-0.0056, 0.0003, 0.0054);
  const LOCAL_FRONT_RIGHT = new THREE.Vector3(0.0056, 0.0003, 0.0054);
  const LOCAL_REAR_CENTER = new THREE.Vector3(0.0, 0.0012, -0.0054);
  const LOCAL_REAR_MTB_TIRE = new THREE.Vector3(0.0, 0.0003, -0.0060);
  const LOCAL_FRONT_MTB_TIRE = new THREE.Vector3(0.0, 0.0003, 0.0062);

  /**
   * Spawns a glowing spark particle
   * @param {THREE.Vector3} origin - spawn position in world space
   * @param {THREE.Vector3} backDir - reverse heading vector
   * @param {THREE.Vector3} rightDir - lateral right vector
   * @param {THREE.Vector3} upDir - track normal vector
   * @param {number} lateralSign - direction of lateral spray (-1 to +1)
   * @param {number} kScale - kart scale multiplier
   * @param {'drift'|'boundary'} type - particle type
   * @param {number} intensity - intensity factor (0.0 to 1.0+)
   */
  function emitSpark(origin, backDir, rightDir, upDir, lateralSign, kScale, type = 'drift', intensity = 1.0) {
    const idx = sparkCursor % SPARK_COUNT;
    sparkCursor++;

    const isBoundary = type === 'boundary';
    const isSupercharged = intensity > 0.65;

    // Randomize micro-offset around collision or tire contact
    const scatterR = isBoundary ? 0.0022 : 0.0014;
    _spawnPoint
      .copy(origin)
      .addScaledVector(rightDir, (Math.random() - 0.5) * scatterR * kScale)
      .addScaledVector(backDir, (Math.random() - 0.2) * scatterR * kScale)
      .addScaledVector(upDir, (0.0003 + Math.random() * (isBoundary ? 0.0012 : 0.0008)) * kScale);

    sparkPositions[idx * 3 + 0] = _spawnPoint.x;
    sparkPositions[idx * 3 + 1] = _spawnPoint.y;
    sparkPositions[idx * 3 + 2] = _spawnPoint.z;

    const baseVelSpeed = isBoundary
      ? (0.20 + Math.random() * 0.32) * (0.8 + 0.4 * intensity) * kScale
      : (0.13 + Math.random() * 0.24) * (0.8 + 0.5 * intensity) * kScale;

    const latScatter = isBoundary
      ? lateralSign * (0.06 + Math.random() * 0.12) * kScale
      : lateralSign * (0.045 + Math.random() * 0.09) * kScale;

    const upBounce = isBoundary
      ? (0.04 + Math.random() * 0.09) * kScale
      : (0.02 + Math.random() * 0.06) * kScale;

    sparkVelocities[idx]
      .copy(backDir)
      .multiplyScalar(baseVelSpeed)
      .addScaledVector(rightDir, latScatter)
      .addScaledVector(upDir, upBounce);

    sparkAges[idx] = 0.0;
    sparkMaxAges[idx] = (isBoundary ? 0.22 : 0.18) + Math.random() * (isSupercharged ? 0.24 : 0.16);
    sparkAlphas[idx] = 1.0;
    sparkCoolRates[idx] = isBoundary ? 1.8 : (isSupercharged ? 1.9 : 2.5);

    const baseSize = isBoundary
      ? (0.0065 + Math.random() * 0.0065)
      : (0.0045 + Math.random() * (isSupercharged ? 0.0075 : 0.0055));
    sparkSizes[idx] = baseSize * kScale * (0.85 + 0.35 * intensity);

    if (isBoundary) {
      const isWhiteHot = Math.random() < 0.65;
      sparkColors[idx * 3 + 0] = 1.0;
      sparkColors[idx * 3 + 1] = isWhiteHot ? 0.94 : 0.72;
      sparkColors[idx * 3 + 2] = isWhiteHot ? 0.78 : 0.15;
    } else if (isSupercharged && Math.random() < 0.35) {
      sparkColors[idx * 3 + 0] = 0.88;
      sparkColors[idx * 3 + 1] = 0.96;
      sparkColors[idx * 3 + 2] = 1.0;
    } else {
      const rG = 0.42 + Math.random() * (isSupercharged ? 0.52 : 0.44);
      sparkColors[idx * 3 + 0] = 1.0;
      sparkColors[idx * 3 + 1] = rG;
      sparkColors[idx * 3 + 2] = rG > 0.75 ? 0.38 : 0.05;
    }
  }

  /**
   * Spawns a single billowing tire friction smoke puff from a specific wheel contact patch
   * @param {THREE.Vector3} origin - wheel contact world position
   * @param {THREE.Vector3} backDir - backward vector relative to car
   * @param {THREE.Vector3} rightDir - lateral right vector
   * @param {THREE.Vector3} upDir - track surface normal vector
   * @param {number} lateralSign - outward centrifugal fling direction (-1..+1)
   * @param {number} kScale - kart scale multiplier
   * @param {number} cornerIntensity - 0.0 (gentle) to 1.0 (high-speed cornering)
   * @param {'rear'|'front'|'curb'} wheelRole - wheel role for scale, tint, and dispersion
   * @param {boolean} isBoosting - whether turbo boost is actively heating the tire wake
   */
  function emitSmoke(
    origin,
    backDir,
    rightDir,
    upDir,
    lateralSign,
    kScale,
    cornerIntensity = 0.5,
    wheelRole = 'rear',
    isBoosting = false
  ) {
    const idx = smokeCursor % SMOKE_COUNT;
    smokeCursor++;

    const isFront = wheelRole === 'front';
    const isCurb = wheelRole === 'curb';

    const jitterScale = isFront ? 0.0013 : 0.0022;
    _spawnPoint
      .copy(origin)
      .addScaledVector(rightDir, (Math.random() - 0.5) * jitterScale * kScale)
      .addScaledVector(backDir, (0.0006 + Math.random() * 0.0022) * kScale)
      .addScaledVector(upDir, (0.0007 + Math.random() * 0.0009) * kScale);

    smokePositions[idx * 3 + 0] = _spawnPoint.x;
    smokePositions[idx * 3 + 1] = _spawnPoint.y;
    smokePositions[idx * 3 + 2] = _spawnPoint.z;

    // Velocity scales dynamically with cornering speed & lateral centrifugal throw
    const speedFactor = 0.7 + 0.9 * cornerIntensity;
    const backSpeed = (isFront ? 0.036 : 0.026 + Math.random() * 0.048) * speedFactor * kScale;
    const latSpeed = lateralSign * (0.018 + Math.random() * 0.038) * (0.65 + 0.85 * cornerIntensity) * kScale;
    const upSpeed = (0.012 + Math.random() * 0.024) * (0.75 + 0.65 * cornerIntensity) * kScale;

    smokeVelocities[idx]
      .copy(backDir)
      .multiplyScalar(backSpeed)
      .addScaledVector(rightDir, latSpeed)
      .addScaledVector(upDir, upSpeed);

    smokeAges[idx] = 0.0;
    // Higher cornering speeds leave a longer billowing tire smoke trail behind the apex
    const baseLife = isFront ? 0.42 : isCurb ? 0.48 : 0.58;
    smokeMaxAges[idx] = baseLife + cornerIntensity * 0.34 + Math.random() * 0.24;

    const peakAlpha = isFront
      ? (0.28 + 0.24 * cornerIntensity + Math.random() * 0.12)
      : isCurb
        ? (0.36 + 0.26 * cornerIntensity + Math.random() * 0.14)
        : (0.42 + 0.34 * cornerIntensity + Math.random() * 0.16);
    smokePeakAlphas[idx] = Math.min(0.84, peakAlpha);
    smokeAlphas[idx] = 0.04;

    const baseDiameter = isFront
      ? (0.0052 + Math.random() * 0.0038)
      : (0.0074 + cornerIntensity * 0.0046 + Math.random() * 0.0045);
    smokeBaseSizes[idx] = baseDiameter * kScale;
    smokeSizes[idx] = smokeBaseSizes[idx];
    smokeExpandTargets[idx] = (isFront ? 2.6 : 3.2) + cornerIntensity * 1.45 + Math.random() * 0.7;

    smokeRotations[idx] = Math.random() * Math.PI * 2;
    smokeSpins[idx] = (Math.random() > 0.5 ? 1 : -1) * (1.4 + Math.random() * 2.8) * (0.7 + 0.6 * cornerIntensity);
    smokeCurlPhases[idx] = Math.random() * Math.PI * 2;

    // Color palette:
    // - Curb/MTB dirt mist: slightly warmer dusty slate-grey
    // - Boosted high-speed drift: bright crisp white with subtle warm amber core tint
    // - Tire friction smoke: crisp bright white-silver cloud cooling toward blue-grey asphalt haze
    if (isCurb) {
      const d = 0.78 + Math.random() * 0.14;
      smokeColors[idx * 3 + 0] = d;
      smokeColors[idx * 3 + 1] = d * 0.94;
      smokeColors[idx * 3 + 2] = d * 0.86;
    } else if (isBoosting && Math.random() < 0.28) {
      smokeColors[idx * 3 + 0] = 0.99;
      smokeColors[idx * 3 + 1] = 0.93;
      smokeColors[idx * 3 + 2] = 0.86;
    } else {
      const tint = 0.88 + cornerIntensity * 0.08 + Math.random() * 0.04;
      smokeColors[idx * 3 + 0] = Math.min(1.0, tint * 0.98);
      smokeColors[idx * 3 + 1] = Math.min(1.0, tint * 0.99);
      smokeColors[idx * 3 + 2] = Math.min(1.0, tint * 1.02);
    }
  }

  /**
   * Explicitly triggers an explosive shower of metallic sparks + scrub smoke when hitting the track boundary
   * @param {number} severity - impact severity (0.35 to 1.0)
   * @param {object} state - live physics state
   * @param {THREE.Object3D} kartRoot - kart 3D root
   */
  function triggerBoundaryImpact(severity = 0.7, state = null, kartRoot = null) {
    if (!state) return;
    hasActiveParticles = true;
    const kScale = kartRoot?.scale?.x || 0.38;

    const latOffset = state.lateralOffset || 0.0;
    const railSign = Math.sign(latOffset) || 1.0;

    const flankOffset = vehicleMode === 'mtb' ? 0.0042 : 0.0068;
    if (kartRoot) {
      kartRoot.updateMatrixWorld(true);
      _localRailContact.set(railSign * flankOffset, 0.0022, -0.001);
      _worldRailContact.copy(_localRailContact).applyMatrix4(kartRoot.matrixWorld);
    } else if (state.position && state.right) {
      _worldRailContact
        .copy(state.position)
        .addScaledVector(state.right, railSign * 0.0068 * kScale)
        .addScaledVector(state.normal || _upDir, 0.0022 * kScale);
    }

    if (state.tangent && state.right && state.normal) {
      _backDir.copy(state.tangent).multiplyScalar(-1);
      _rightDir.copy(state.right);
      _upDir.copy(state.normal);
    }

    const burstCount = Math.floor(28 + 20 * severity);
    const inwardRicochetSign = -railSign;

    for (let b = 0; b < burstCount; b++) {
      emitSpark(
        _worldRailContact,
        _backDir,
        _rightDir,
        _upDir,
        inwardRicochetSign,
        kScale,
        'boundary',
        severity * 1.4
      );
    }

    // Impact dust/smoke puff burst off the contacted rail/tire
    const smokeBurst = Math.floor(4 + 5 * severity);
    for (let m = 0; m < smokeBurst; m++) {
      emitSmoke(
        _worldRailContact,
        _backDir,
        _rightDir,
        _upDir,
        inwardRicochetSign,
        kScale,
        Math.min(1.0, severity),
        'curb',
        false
      );
    }

    groundFlickerLight.position.copy(_worldRailContact);
    groundFlickerLight.color.setHex(0xfff0aa);
    groundFlickerLight.intensity = Math.min(2.2, 1.2 + severity * 0.8);
  }

  /**
   * Immediately clears all active sparks and smoke particles (used on track switches, restarts, and replay toggles)
   */
  function reset() {
    hasActiveParticles = false;
    isDriftingActive = false;
    currentDriftSpeed = 0.0;
    isBoundaryContactActive = false;
    smokeEmitAccumulator = 0.0;
    groundFlickerLight.intensity = 0.0;

    for (let i = 0; i < SPARK_COUNT; i++) {
      sparkAges[i] = 999.0;
      sparkAlphas[i] = 0.0;
      sparkPositions[i * 3 + 1] = -999.0;
    }
    sparkGeo.attributes.position.needsUpdate = true;
    sparkGeo.attributes.aAlpha.needsUpdate = true;

    for (let j = 0; j < SMOKE_COUNT; j++) {
      smokeAges[j] = 999.0;
      smokeAlphas[j] = 0.0;
      smokePositions[j * 3 + 1] = -999.0;
    }
    smokeGeo.attributes.position.needsUpdate = true;
    smokeGeo.attributes.aAlpha.needsUpdate = true;
  }

  /**
   * Per-frame update loop (called at 60fps in main tick)
   * @param {number} dt - delta time in seconds
   * @param {THREE.Object3D} kartRoot - the 3D kart root object
   * @param {object} state - current physics state from KartPhysicsController
   */
  function update(dt, kartRoot, state) {
    if (!kartRoot || !state) return;

    const absSpeed = Math.abs(state.speed || 0.0);
    const steerInput = state.steerInput !== undefined ? state.steerInput : (state.turnRight || 0.0);
    const steerAngle = state.steerAngle || 0.0;
    const absSteer = Math.max(Math.abs(steerInput), Math.abs(steerAngle) / 0.45);
    const absDriftSlip = Math.abs(state.driftAngle || 0.0);
    const isBoosting = Boolean(state.boostActive && state.boostActive > 0);

    // Drift trigger condition: actively drifting, steering hard while moving, or boosting through a corner
    const isSteeringHard = Math.abs(steerInput) > 0.16 || Math.abs(steerAngle) > 0.06;
    const isMoving = absSpeed > 0.032;

    const isDrifting =
      (state.isDrifting || isSteeringHard || isBoosting) &&
      isMoving;

    const absLat = Math.abs(state.lateralOffset || 0.0);
    const isHittingBoundary =
      (state.railImpactActive || absLat >= 0.0083) && isMoving;
    const isScrubbingCurb = Boolean(state.curbRumble > 0.25 && isMoving);

    isDriftingActive = isDrifting;
    currentDriftSpeed = isDrifting ? absSpeed : 0.0;
    isBoundaryContactActive = isHittingBoundary;

    const kScale = kartRoot.scale.x || 0.38;

    // Ensure kart world matrix is fresh
    kartRoot.updateMatrixWorld(true);

    // Calculate exact world contact patches of all 4 Kart wheels (plus both MTB wheels)
    _rearLeftTireWorld.copy(LOCAL_REAR_LEFT).applyMatrix4(kartRoot.matrixWorld);
    _rearRightTireWorld.copy(LOCAL_REAR_RIGHT).applyMatrix4(kartRoot.matrixWorld);
    _frontLeftTireWorld.copy(LOCAL_FRONT_LEFT).applyMatrix4(kartRoot.matrixWorld);
    _frontRightTireWorld.copy(LOCAL_FRONT_RIGHT).applyMatrix4(kartRoot.matrixWorld);
    _centerAxleWorld.copy(LOCAL_REAR_CENTER).applyMatrix4(kartRoot.matrixWorld);
    _mtbRearTireWorld.copy(LOCAL_REAR_MTB_TIRE).applyMatrix4(kartRoot.matrixWorld);
    _mtbFrontTireWorld.copy(LOCAL_FRONT_MTB_TIRE).applyMatrix4(kartRoot.matrixWorld);

    // Calculate kart directional vectors
    if (state.tangent && state.right && state.normal) {
      _backDir.copy(state.tangent).multiplyScalar(-1);
      _rightDir.copy(state.right);
      _upDir.copy(state.normal);
    } else {
      _backDir.set(0, 0, -1).transformDirection(kartRoot.matrixWorld);
      _rightDir.set(1, 0, 0).transformDirection(kartRoot.matrixWorld);
      _upDir.set(0, 1, 0).transformDirection(kartRoot.matrixWorld);
    }

    // Determine drift direction & outside loaded tire weight transfer:
    // Left turn => body rolls right => RIGHT (+1) wheels carry higher outside cornering load!
    // Right turn => body rolls left => LEFT (-1) wheels carry higher outside cornering load!
    const isTurningLeft = steerAngle > 0.02 || steerInput < -0.15;
    const isTurningRight = steerAngle < -0.02 || steerInput > 0.15;
    const driftLateralSign = isTurningLeft ? 1.0 : (isTurningRight ? -1.0 : (Math.random() > 0.5 ? 1 : -1));

    const speedNorm = THREE.MathUtils.clamp((absSpeed - 0.04) / 0.20, 0.0, 1.0);
    const highSpeedRatio = THREE.MathUtils.clamp((absSpeed - 0.13) / 0.13, 0.0, 1.0);
    const slipNorm = THREE.MathUtils.clamp(Math.max(absSteer, absDriftSlip / 0.22), 0.0, 1.0);
    const corneringIntensity = THREE.MathUtils.clamp(
      speedNorm * (0.45 + 0.55 * slipNorm) + (isBoosting ? 0.18 : 0.0),
      0.0,
      1.0
    );

    // -----------------------------------------------------------------------
    // EMIT WHEEL DRIFT PARTICLES (Billowing Multi-Wheel Tire Smoke + Sparks)
    // -----------------------------------------------------------------------
    if (isDrifting) {
      hasActiveParticles = true;
      const isMtb = vehicleMode === 'mtb';

      // 1. Billowing Tire Smoke (scales continuously with dt & corneringIntensity for frame-rate independence)
      // At gentle speed: ~140 puffs/sec; during high-speed cornering: up to ~480 puffs/sec
      const smokeRatePerSec = 135.0 + corneringIntensity * 345.0;
      smokeEmitAccumulator += dt * smokeRatePerSec;
      const smokeCountThisFrame = Math.min(10, Math.floor(smokeEmitAccumulator));
      if (smokeCountThisFrame > 0) {
        smokeEmitAccumulator -= smokeCountThisFrame;
      }

      for (let m = 0; m < smokeCountThisFrame; m++) {
        if (isMtb) {
          // MTB: thick rear knobby tire skid cloud + front tire scrub smoke on aggressive high-speed leans
          const emitFront = corneringIntensity > 0.52 && Math.random() < 0.25;
          const origin = emitFront ? _mtbFrontTireWorld : _mtbRearTireWorld;
          emitSmoke(
            origin,
            _backDir,
            _rightDir,
            _upDir,
            driftLateralSign * (0.55 + Math.random() * 0.45),
            kScale,
            corneringIntensity,
            emitFront ? 'front' : 'rear',
            isBoosting
          );
        } else {
          // 4-Wheel Kart: bias ~62% of puffs toward the outside loaded rear wheel,
          // ~24% to the inside rear wheel, and ~14% to the loaded front scrubbing wheel at high cornering loads!
          const roll = Math.random();
          const outsideIsRight = isTurningLeft;
          let origin;
          let wheelLatSign;
          let role = 'rear';

          if (corneringIntensity > 0.36 && roll < 0.16) {
            // High-speed front scrubbing tire smoke
            role = 'front';
            const useFrontRight = outsideIsRight ? Math.random() < 0.78 : Math.random() < 0.22;
            origin = useFrontRight ? _frontRightTireWorld : _frontLeftTireWorld;
            wheelLatSign = useFrontRight ? 1.0 : -1.0;
          } else {
            // Primary dual rear tire smoke ribbons (weighted toward outside loaded wheel)
            const useRightRear = outsideIsRight
              ? (roll < 0.68)
              : (isTurningRight ? (roll < 0.32) : (m % 2 === 0));
            origin = useRightRear ? _rearRightTireWorld : _rearLeftTireWorld;
            wheelLatSign = useRightRear ? 1.0 : -1.0;
          }

          emitSmoke(
            origin,
            _backDir,
            _rightDir,
            _upDir,
            wheelLatSign * 0.45 + driftLateralSign * 0.55,
            kScale,
            corneringIntensity,
            role,
            isBoosting
          );
        }
      }

      // 2. Tire Friction Sparks (rate scales dynamically with drift speed)
      const baseCount = Math.floor(absSpeed * 22.0);
      const highSpeedBonus = Math.floor(highSpeedRatio * 10.0);
      const sparkCountThisFrame = Math.min(20, Math.max(4, baseCount + highSpeedBonus));
      const driftIntensity = 0.5 + 0.7 * highSpeedRatio;

      for (let s = 0; s < sparkCountThisFrame; s++) {
        const useLeftWheel = isTurningRight ? (Math.random() < 0.65) : (Math.random() < 0.35);
        const origin = isMtb ? _mtbRearTireWorld : (useLeftWheel ? _rearLeftTireWorld : _rearRightTireWorld);
        const latSign = isMtb ? (Math.random() - 0.5) * 0.6 : (useLeftWheel ? -1.0 : 1.0);
        emitSpark(
          origin,
          _backDir,
          _rightDir,
          _upDir,
          latSign * 0.75 + driftLateralSign * 0.6,
          kScale,
          'drift',
          driftIntensity
        );
      }

      // Ground light: warm amber at low speed, radiant gold at high speed
      groundFlickerLight.position.copy(_centerAxleWorld);
      if (highSpeedRatio > 0.4) {
        groundFlickerLight.color.setHex(0xffaa28);
      } else {
        groundFlickerLight.color.setHex(0xff7818);
      }
      const targetIntensity = (0.45 + 0.55 * highSpeedRatio) + Math.random() * 0.35;
      groundFlickerLight.intensity = THREE.MathUtils.lerp(
        groundFlickerLight.intensity,
        targetIntensity,
        Math.min(1.0, dt * 24.0)
      );
    } else {
      smokeEmitAccumulator = 0.0;
    }

    // -----------------------------------------------------------------------
    // EMIT CURB SCRUB SMOKE & TRACK BOUNDARY SPARKS
    // -----------------------------------------------------------------------
    if (isScrubbingCurb && !isDrifting) {
      hasActiveParticles = true;
      const curbSign = Math.sign(state.lateralOffset || 0.0) || 1.0;
      const origin = vehicleMode === 'mtb'
        ? _mtbRearTireWorld
        : (curbSign < 0 ? _rearLeftTireWorld : _rearRightTireWorld);
      emitSmoke(
        origin,
        _backDir,
        _rightDir,
        _upDir,
        -curbSign * 0.6,
        kScale,
        Math.min(0.85, speedNorm),
        'curb',
        false
      );
    }

    if (isHittingBoundary) {
      hasActiveParticles = true;
      const railSign = Math.sign(state.lateralOffset || 0.0) || 1.0;
      const inwardRicochetSign = -railSign;

      const flankZ = (Math.random() - 0.5) * 0.009 - 0.001;
      const flankOffset = vehicleMode === 'mtb' ? 0.0042 : 0.0068;
      _localRailContact.set(railSign * flankOffset, 0.0022, flankZ);
      _worldRailContact.copy(_localRailContact).applyMatrix4(kartRoot.matrixWorld);

      const boundarySparkCount = Math.min(22, Math.max(10, Math.floor(absSpeed * 40.0)));
      for (let g = 0; g < boundarySparkCount; g++) {
        emitSpark(
          _worldRailContact,
          _backDir,
          _rightDir,
          _upDir,
          inwardRicochetSign,
          kScale,
          'boundary',
          1.25
        );
      }

      // Rail scrub vapor puff
      if (Math.random() < 0.65) {
        emitSmoke(
          _worldRailContact,
          _backDir,
          _rightDir,
          _upDir,
          inwardRicochetSign,
          kScale,
          0.75,
          'curb',
          false
        );
      }

      groundFlickerLight.position.copy(_worldRailContact);
      groundFlickerLight.color.setHex(0xfff2b0);
      groundFlickerLight.intensity = Math.min(1.8, 0.9 + Math.random() * 0.7);
    }

    // Fade out light when neither drifting nor hitting boundary
    if (!isDrifting && !isHittingBoundary) {
      if (groundFlickerLight.intensity > 0.01) {
        groundFlickerLight.intensity = THREE.MathUtils.lerp(
          groundFlickerLight.intensity,
          0.0,
          Math.min(1.0, dt * 16.0)
        );
      }
    }

    // -----------------------------------------------------------------------
    // STEP ACTIVE PARTICLES IN 60FPS PHYSICS SIMULATION
    // -----------------------------------------------------------------------
    if (hasActiveParticles) {
      let stillActive = false;

      // 1. Step Sparks
      for (let i = 0; i < SPARK_COUNT; i++) {
        const maxAge = sparkMaxAges[i];
        if (sparkAges[i] < maxAge) {
          stillActive = true;
          sparkAges[i] += dt;
          const lifeFrac = Math.max(0.0, 1.0 - sparkAges[i] / maxAge);
          sparkAlphas[i] = lifeFrac;

          sparkPositions[i * 3 + 0] += sparkVelocities[i].x * dt;
          sparkPositions[i * 3 + 1] += sparkVelocities[i].y * dt;
          sparkPositions[i * 3 + 2] += sparkVelocities[i].z * dt;

          sparkVelocities[i].multiplyScalar(Math.max(0.85, 1.0 - 2.8 * dt));
          sparkVelocities[i].y -= 0.38 * dt;

          const coolRate = sparkCoolRates[i] || 2.2;
          sparkColors[i * 3 + 1] = Math.max(0.05, sparkColors[i * 3 + 1] - dt * coolRate);
          sparkColors[i * 3 + 2] = Math.max(0.0, sparkColors[i * 3 + 2] - dt * (coolRate * 1.5));
        } else {
          sparkAlphas[i] = 0.0;
          sparkPositions[i * 3 + 1] = -999.0;
        }
      }
      sparkGeo.attributes.position.needsUpdate = true;
      sparkGeo.attributes.aAlpha.needsUpdate = true;
      sparkGeo.attributes.aColor.needsUpdate = true;

      // 2. Step Billowing Wheel Smoke Puffs
      for (let j = 0; j < SMOKE_COUNT; j++) {
        const maxAge = smokeMaxAges[j];
        if (smokeAges[j] < maxAge) {
          stillActive = true;
          smokeAges[j] += dt;
          const ageNorm = Math.min(1.0, smokeAges[j] / maxAge);
          const lifeFrac = 1.0 - ageNorm;

          // Smooth ramp-in over first 8% of life + cubic-soft fade-out
          const fadeIn = ageNorm < 0.08 ? ageNorm / 0.08 : 1.0;
          const fadeOut = Math.pow(lifeFrac, 1.25);
          smokeAlphas[j] = smokePeakAlphas[j] * fadeIn * fadeOut;

          // Curl eddy turbulence so smoke trails roll organically in 3D space
          const curlPhase = smokeCurlPhases[j] + smokeAges[j] * 7.5;
          const curlAmp = 0.008 * kScale * dt;
          smokePositions[j * 3 + 0] += smokeVelocities[j].x * dt + Math.sin(curlPhase) * curlAmp;
          smokePositions[j * 3 + 1] += smokeVelocities[j].y * dt;
          smokePositions[j * 3 + 2] += smokeVelocities[j].z * dt + Math.cos(curlPhase) * curlAmp;

          // Billowing expansion slows gracefully as the cloud disperses
          const expandT = Math.sqrt(ageNorm);
          const expandFactor = 1.0 + expandT * (smokeExpandTargets[j] - 1.0);
          smokeSizes[j] = smokeBaseSizes[j] * expandFactor;

          // Continuous spin rotation
          smokeRotations[j] += smokeSpins[j] * dt;

          // Aerodynamic drag + gentle warm thermal buoyancy
          smokeVelocities[j].multiplyScalar(Math.max(0.84, 1.0 - 2.1 * dt));
          smokeVelocities[j].y += 0.014 * dt;

          // Subtle cooling shift from bright white tire vapor toward cool slate mist
          smokeColors[j * 3 + 0] = Math.max(0.72, smokeColors[j * 3 + 0] - dt * 0.14);
          smokeColors[j * 3 + 1] = Math.max(0.75, smokeColors[j * 3 + 1] - dt * 0.10);
          smokeColors[j * 3 + 2] = Math.max(0.80, smokeColors[j * 3 + 2] - dt * 0.05);
        } else {
          smokeAlphas[j] = 0.0;
          smokePositions[j * 3 + 1] = -999.0;
        }
      }
      smokeGeo.attributes.position.needsUpdate = true;
      smokeGeo.attributes.aAlpha.needsUpdate = true;
      smokeGeo.attributes.aSize.needsUpdate = true;
      smokeGeo.attributes.aRotation.needsUpdate = true;
      smokeGeo.attributes.aColor.needsUpdate = true;

      hasActiveParticles = stillActive;
    }
  }

  /**
   * Cleans up GPU buffers and textures
   */
  function dispose() {
    sparkGeo.dispose();
    sparkMat.dispose();
    sparkTex.dispose();
    smokeGeo.dispose();
    smokeMat.dispose();
    smokeTex.dispose();
  }

  return {
    group,
    update,
    reset,
    dispose,
    triggerBoundaryImpact,
    setVehicleMode,
    setViewportHeight,
    isDrifting: () => isDriftingActive,
    isHittingBoundary: () => isBoundaryContactActive,
    getDriftSpeed: () => currentDriftSpeed,
    getDriftIntensity: () => THREE.MathUtils.clamp((currentDriftSpeed - 0.032) / 0.20, 0.0, 1.0),
  };
}
