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
 * Creates a procedural soft billowing smoke puff texture for tire friction smoke (zero 404 dependencies).
 */
function createSmokeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0.0, 'rgba(240, 244, 250, 0.82)');
  gradient.addColorStop(0.32, 'rgba(215, 222, 232, 0.52)');
  gradient.addColorStop(0.62, 'rgba(180, 188, 198, 0.24)');
  gradient.addColorStop(0.85, 'rgba(150, 160, 170, 0.07)');
  gradient.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * High-performance Three.js Particle System:
 *  1. Drift Tire Sparks: Hot luminous friction embers from rear wheel contact patches.
 *     At higher drift speeds, emission rate, particle size, scatter arc, and luminous HDR glow increase.
 *  2. Track Boundary Sparks: High-velocity metallic ricochet sparks when grinding or impacting track rails/curbs.
 *  3. Expanding Tire Smoke: Soft billowing vapor puffs rolling off sliding rear tires.
 *  4. Dynamic Ground & Rail Lighting: Dynamic PointLight casting interactive glow onto the track and curbs.
 */
export function createKartDriftParticleSystem() {
  const group = new THREE.Group();
  group.name = 'KartDriftParticleSystem';

  const sparkTex = createSparkTexture();
  const smokeTex = createSmokeTexture();

  // -------------------------------------------------------------------------
  // 1. GLOWING SPARKS BUFFER (720 particles cyclic pool)
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
    },
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
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
        float pSize = (aSize * 440.0) / max(0.035, -mvPosition.z);
        gl_PointSize = clamp(pSize, 0.0, 48.0);
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
  group.add(sparkPoints);

  // -------------------------------------------------------------------------
  // 2. VOLUMETRIC TIRE SMOKE (Expanding tire friction smoke puffs)
  // -------------------------------------------------------------------------
  const SMOKE_COUNT = 200;
  const smokeGeo = new THREE.BufferGeometry();
  const smokePositions = new Float32Array(SMOKE_COUNT * 3);
  const smokeColors = new Float32Array(SMOKE_COUNT * 3);
  const smokeSizes = new Float32Array(SMOKE_COUNT);
  const smokeAlphas = new Float32Array(SMOKE_COUNT);

  const smokeVelocities = [];
  const smokeAges = new Float32Array(SMOKE_COUNT);
  const smokeMaxAges = new Float32Array(SMOKE_COUNT);
  const smokeBaseSizes = new Float32Array(SMOKE_COUNT);

  for (let i = 0; i < SMOKE_COUNT; i++) {
    smokePositions[i * 3 + 1] = -999.0;
    smokeVelocities.push(new THREE.Vector3());
    smokeAges[i] = 999.0;
    smokeMaxAges[i] = 0.55;
    smokeAlphas[i] = 0.0;
    smokeSizes[i] = 0.008;
    smokeBaseSizes[i] = 0.008;
    smokeColors[i * 3 + 0] = 0.92;
    smokeColors[i * 3 + 1] = 0.94;
    smokeColors[i * 3 + 2] = 0.98;
  }

  smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));
  smokeGeo.setAttribute('aColor', new THREE.BufferAttribute(smokeColors, 3));
  smokeGeo.setAttribute('aSize', new THREE.BufferAttribute(smokeSizes, 1));
  smokeGeo.setAttribute('aAlpha', new THREE.BufferAttribute(smokeAlphas, 1));

  const smokeMat = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: smokeTex },
    },
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.NormalBlending,
    vertexShader: /* glsl */ `
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
        float pSize = (aSize * 360.0) / max(0.04, -mvPosition.z);
        gl_PointSize = clamp(pSize, 0.0, 56.0);
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
        gl_FragColor = vec4(vColor * texColor.rgb, alpha);
      }
    `,
  });

  const smokePoints = new THREE.Points(smokeGeo, smokeMat);
  smokePoints.frustumCulled = false;
  group.add(smokePoints);

  // -------------------------------------------------------------------------
  // 3. DYNAMIC GROUND / RAIL FRICTION LIGHT
  // -------------------------------------------------------------------------
  const groundFlickerLight = new THREE.PointLight(0xff7818, 0.0, 0.09, 1.6);
  groundFlickerLight.castShadow = false;
  group.add(groundFlickerLight);

  // Internal ring cursor counters
  let sparkCursor = 0;
  let smokeCursor = 0;
  let hasActiveParticles = false;
  let isDriftingActive = false;
  let currentDriftSpeed = 0.0;
  let isBoundaryContactActive = false;

  // Reusable math vectors (zero garbage collection in 60fps render loop)
  const _leftTireWorld = new THREE.Vector3();
  const _rightTireWorld = new THREE.Vector3();
  const _centerAxleWorld = new THREE.Vector3();
  const _localRailContact = new THREE.Vector3();
  const _worldRailContact = new THREE.Vector3();
  const _backDir = new THREE.Vector3();
  const _rightDir = new THREE.Vector3();
  const _upDir = new THREE.Vector3();
  const _spawnPoint = new THREE.Vector3();

  // Local coordinates of Left & Right rear tire contact patches
  const LOCAL_REAR_LEFT = new THREE.Vector3(-0.0059, 0.0003, -0.0054);
  const LOCAL_REAR_RIGHT = new THREE.Vector3(0.0059, 0.0003, -0.0054);
  const LOCAL_REAR_CENTER = new THREE.Vector3(0.0, 0.0012, -0.0054);

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

    // Velocity:
    // Drift: sprayed backward with centrifugal fling
    // Boundary: violent metallic ricochet bouncing off the rail toward inside track
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

    // Size: higher drift speed or boundary collision creates larger incandescent embers
    const baseSize = isBoundary
      ? (0.0065 + Math.random() * 0.0065)
      : (0.0045 + Math.random() * (isSupercharged ? 0.0075 : 0.0055));
    sparkSizes[idx] = baseSize * kScale * (0.85 + 0.35 * intensity);

    // Glowing Colors:
    // Boundary collision: metallic white-hot & brilliant gold-yellow arcs
    // High-speed drift: superheated white core with electric cyan/amber fringe
    // Normal drift: blazing warm gold to fiery orange
    if (isBoundary) {
      // Brilliant white-hot metallic rail sparks
      const isWhiteHot = Math.random() < 0.65;
      sparkColors[idx * 3 + 0] = 1.0;
      sparkColors[idx * 3 + 1] = isWhiteHot ? 0.94 : 0.72;
      sparkColors[idx * 3 + 2] = isWhiteHot ? 0.78 : 0.15;
    } else if (isSupercharged && Math.random() < 0.35) {
      // High-speed electric blue-white friction sparks
      sparkColors[idx * 3 + 0] = 0.88;
      sparkColors[idx * 3 + 1] = 0.96;
      sparkColors[idx * 3 + 2] = 1.0;
    } else {
      // Blazing incandescent gold-orange embers
      const rG = 0.42 + Math.random() * (isSupercharged ? 0.52 : 0.44);
      sparkColors[idx * 3 + 0] = 1.0;
      sparkColors[idx * 3 + 1] = rG;
      sparkColors[idx * 3 + 2] = rG > 0.75 ? 0.38 : 0.05;
    }
  }

  /**
   * Spawns a single tire friction smoke puff from a specific wheel origin
   */
  function emitSmoke(origin, backDir, rightDir, upDir, lateralSign, kScale) {
    const idx = smokeCursor % SMOKE_COUNT;
    smokeCursor++;

    _spawnPoint
      .copy(origin)
      .addScaledVector(rightDir, (Math.random() - 0.5) * 0.0018 * kScale)
      .addScaledVector(backDir, (0.001 + Math.random() * 0.002) * kScale)
      .addScaledVector(upDir, 0.0006 * kScale);

    smokePositions[idx * 3 + 0] = _spawnPoint.x;
    smokePositions[idx * 3 + 1] = _spawnPoint.y;
    smokePositions[idx * 3 + 2] = _spawnPoint.z;

    // Trailing drift velocity
    smokeVelocities[idx]
      .copy(backDir)
      .multiplyScalar((0.025 + Math.random() * 0.05) * kScale)
      .addScaledVector(rightDir, lateralSign * (0.015 + Math.random() * 0.035) * kScale)
      .addScaledVector(upDir, (0.010 + Math.random() * 0.025) * kScale);

    smokeAges[idx] = 0.0;
    smokeMaxAges[idx] = 0.38 + Math.random() * 0.28;
    smokeAlphas[idx] = 0.42 + Math.random() * 0.20;
    smokeBaseSizes[idx] = (0.006 + Math.random() * 0.005) * kScale;
    smokeSizes[idx] = smokeBaseSizes[idx];

    // Soft white/light-grey smoke
    const tint = 0.88 + Math.random() * 0.10;
    smokeColors[idx * 3 + 0] = tint;
    smokeColors[idx * 3 + 1] = tint * 0.98;
    smokeColors[idx * 3 + 2] = tint * 0.96;
  }

  /**
   * Explicitly triggers an explosive shower of metallic sparks when hitting the track boundary
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

    // Determine world coordinates of the impacting rail/curb flank
    if (kartRoot) {
      kartRoot.updateMatrixWorld(true);
      _localRailContact.set(railSign * 0.0068, 0.0022, -0.001);
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

    // Spawn 28 - 48 explosive ricochet sparks
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

    // Flash ground/rail light brightly on impact
    groundFlickerLight.position.copy(_worldRailContact);
    groundFlickerLight.color.setHex(0xfff0aa); // Brilliant white-gold flash
    groundFlickerLight.intensity = Math.min(2.2, 1.2 + severity * 0.8);
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

    // Drift trigger condition: steering with A or D while moving
    const isSteeringHard = Math.abs(steerInput) > 0.16 || Math.abs(steerAngle) > 0.06;
    const isMoving = absSpeed > 0.032;

    const isDrifting =
      (state.isDrifting || isSteeringHard || (state.boostActive && state.boostActive > 0)) &&
      isMoving;

    // Track boundary collision / rail grinding condition:
    // Triggered when rail impact is active or lateral offset is at the guardrail/curb boundary
    const absLat = Math.abs(state.lateralOffset || 0.0);
    const isHittingBoundary =
      (state.railImpactActive || absLat >= 0.0083) && isMoving;

    isDriftingActive = isDrifting;
    currentDriftSpeed = isDrifting ? absSpeed : 0.0;
    isBoundaryContactActive = isHittingBoundary;

    const kScale = kartRoot.scale.x || 0.38;

    // Ensure kart world matrix is fresh
    kartRoot.updateMatrixWorld(true);

    // Calculate exact world positions of Left & Right rear tire contact patches
    _leftTireWorld.copy(LOCAL_REAR_LEFT).applyMatrix4(kartRoot.matrixWorld);
    _rightTireWorld.copy(LOCAL_REAR_RIGHT).applyMatrix4(kartRoot.matrixWorld);
    _centerAxleWorld.copy(LOCAL_REAR_CENTER).applyMatrix4(kartRoot.matrixWorld);

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

    // Determine drift direction
    const isTurningLeft = steerAngle > 0.02 || steerInput < -0.15;
    const isTurningRight = steerAngle < -0.02 || steerInput > 0.15;
    const driftLateralSign = isTurningLeft ? 1.0 : (isTurningRight ? -1.0 : (Math.random() > 0.5 ? 1 : -1));

    // High drift speed ratio: scales from normal drift (~0.12 m/s) to high speed (~0.24+ m/s)
    const highSpeedRatio = THREE.MathUtils.clamp((absSpeed - 0.13) / 0.13, 0.0, 1.0);

    // -----------------------------------------------------------------------
    // EMIT DRIFT PARTICLES (Tire friction sparks + smoke puffs)
    // -----------------------------------------------------------------------
    if (isDrifting) {
      hasActiveParticles = true;

      // Rate: Scales dynamically with drift speed!
      // At low speed: 4-6 sparks/frame.
      // At higher drift speeds: up to 14-20 intense glowing sparks/frame!
      const baseCount = Math.floor(absSpeed * 22.0);
      const highSpeedBonus = Math.floor(highSpeedRatio * 10.0);
      const sparkCountThisFrame = Math.min(20, Math.max(4, baseCount + highSpeedBonus));

      const driftIntensity = 0.5 + 0.7 * highSpeedRatio;

      for (let s = 0; s < sparkCountThisFrame; s++) {
        // Distribute across both rear wheels with more on outside loaded tire
        const useLeftWheel = isTurningRight ? (Math.random() < 0.65) : (Math.random() < 0.35);
        const origin = useLeftWheel ? _leftTireWorld : _rightTireWorld;
        const latSign = useLeftWheel ? -1.0 : 1.0;
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

      // Rate: 2-5 smoke puffs per frame
      const smokeCountThisFrame = Math.min(5, Math.max(2, Math.floor(absSpeed * 14.0)));
      for (let m = 0; m < smokeCountThisFrame; m++) {
        const useLeftWheel = m % 2 === 0;
        const origin = useLeftWheel ? _leftTireWorld : _rightTireWorld;
        const latSign = useLeftWheel ? -1.0 : 1.0;
        emitSmoke(origin, _backDir, _rightDir, _upDir, latSign * 0.5 + driftLateralSign * 0.5, kScale);
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
    }

    // -----------------------------------------------------------------------
    // EMIT TRACK BOUNDARY SPARKS (Continuous grinding on rails/curbs)
    // -----------------------------------------------------------------------
    if (isHittingBoundary) {
      hasActiveParticles = true;
      const railSign = Math.sign(state.lateralOffset || 0.0) || 1.0;
      const inwardRicochetSign = -railSign;

      // Position along the side flank contacting the boundary
      // Vary Z slightly along the length of the chassis to simulate multiple scrape points
      const flankZ = (Math.random() - 0.5) * 0.009 - 0.001;
      _localRailContact.set(railSign * 0.0068, 0.0022, flankZ);
      _worldRailContact.copy(_localRailContact).applyMatrix4(kartRoot.matrixWorld);

      // Continuous rail grind: 12 - 22 sparks per frame
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

      // Bright white-hot flash on the contacted rail
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

          // Integrate position
          sparkPositions[i * 3 + 0] += sparkVelocities[i].x * dt;
          sparkPositions[i * 3 + 1] += sparkVelocities[i].y * dt;
          sparkPositions[i * 3 + 2] += sparkVelocities[i].z * dt;

          // Air drag + subtle gravity pull
          sparkVelocities[i].multiplyScalar(Math.max(0.85, 1.0 - 2.8 * dt));
          sparkVelocities[i].y -= 0.38 * dt;

          // Thermal cooling decay
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

      // 2. Step Smoke Puffs
      for (let j = 0; j < SMOKE_COUNT; j++) {
        const maxAge = smokeMaxAges[j];
        if (smokeAges[j] < maxAge) {
          stillActive = true;
          smokeAges[j] += dt;
          const lifeFrac = Math.max(0.0, 1.0 - smokeAges[j] / maxAge);

          // Smooth fade out
          smokeAlphas[j] = Math.min(0.55, lifeFrac * 0.7);

          // Integrate position
          smokePositions[j * 3 + 0] += smokeVelocities[j].x * dt;
          smokePositions[j * 3 + 1] += smokeVelocities[j].y * dt;
          smokePositions[j * 3 + 2] += smokeVelocities[j].z * dt;

          // Smoke expands as it rises
          const expandFactor = 1.0 + (smokeAges[j] / maxAge) * 3.2;
          smokeSizes[j] = smokeBaseSizes[j] * expandFactor;

          // Air drag and gentle upward thermal rise
          smokeVelocities[j].multiplyScalar(Math.max(0.88, 1.0 - 1.6 * dt));
          smokeVelocities[j].y += 0.012 * dt;
        } else {
          smokeAlphas[j] = 0.0;
          smokePositions[j * 3 + 1] = -999.0;
        }
      }
      smokeGeo.attributes.position.needsUpdate = true;
      smokeGeo.attributes.aAlpha.needsUpdate = true;
      smokeGeo.attributes.aSize.needsUpdate = true;

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
    dispose,
    triggerBoundaryImpact,
    isDrifting: () => isDriftingActive,
    isHittingBoundary: () => isBoundaryContactActive,
    getDriftSpeed: () => currentDriftSpeed,
    getDriftIntensity: () => THREE.MathUtils.clamp((currentDriftSpeed - 0.032) / 0.20, 0.0, 1.0),
  };
}
