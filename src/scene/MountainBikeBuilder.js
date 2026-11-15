import * as THREE from 'three';

/**
 * Procedural 1:87 HO-Scale Trail / Enduro Mountain Bike (산악자전거) + Articulated Cyclist Rider.
 * Designed to fit the exact same millimeter-scale track footprint as the Micro-Kart:
 *  - Wheelbase: 12.2mm (Rear axle z=-0.0060, Front axle z=+0.0062)
 *  - 29" Knobby MTB Tires (radius 0.0028m), alloy rims, crossed spokes, stainless disc brake rotors
 *  - Hydroformed full-suspension trail frame, gold Kashima stanchion fork & rear shock absorber
 *  - Steerable front fork + wide flat MTB handlebars + stem + brake levers
 *  - Rotating crankset & chainring driving articulated left/right cyclist legs & shoes
 *  - Trail cyclist with helmet + peak visor + tinted goggles + jersey + hydration pack
 *  - Supports physical PBR mode and holographic cyan Ghost mode (`options.isGhost`)
 */
export function buildMountainBike(options = {}) {
  const isGhost = Boolean(options.isGhost);
  const bikeRoot = new THREE.Group();
  bikeRoot.name = isGhost ? 'GhostMountainBikeRoot' : 'MountainBikeRoot';

  // -------------------------------------------------------------------------
  // MATERIALS (PBR Physical vs Holographic Ghost)
  // -------------------------------------------------------------------------
  const ghostMaterials = [];
  function regGhost(mat) {
    if (isGhost) ghostMaterials.push(mat);
    return mat;
  }

  const frameMat = regGhost(
    isGhost
      ? new THREE.MeshStandardMaterial({
          color: 0x00f0ff,
          emissive: 0x0088cc,
          emissiveIntensity: 0.72,
          roughness: 0.18,
          metalness: 0.55,
          transparent: true,
          opacity: 0.54,
          depthWrite: false,
        })
      : new THREE.MeshStandardMaterial({
          color: 0xe63928, // Seorak Crimson Trail Red
          roughness: 0.24,
          metalness: 0.42,
        })
  );

  const carbonDarkMat = regGhost(
    isGhost
      ? new THREE.MeshStandardMaterial({
          color: 0x0b3448,
          emissive: 0x004d6e,
          emissiveIntensity: 0.5,
          roughness: 0.35,
          metalness: 0.5,
          transparent: true,
          opacity: 0.52,
          depthWrite: false,
        })
      : new THREE.MeshStandardMaterial({
          color: 0x1a1e26,
          roughness: 0.46,
          metalness: 0.35,
        })
  );

  const kashimaGoldMat = regGhost(
    isGhost
      ? new THREE.MeshStandardMaterial({
          color: 0x7df9ff,
          emissive: 0x00d8ff,
          emissiveIntensity: 0.9,
          roughness: 0.15,
          metalness: 0.85,
          transparent: true,
          opacity: 0.60,
          depthWrite: false,
        })
      : new THREE.MeshStandardMaterial({
          color: 0xd99b26, // Kashima gold suspension stanchions
          roughness: 0.20,
          metalness: 0.88,
        })
  );

  const alloySilverMat = regGhost(
    isGhost
      ? new THREE.MeshStandardMaterial({
          color: 0x90f5ff,
          emissive: 0x00bfff,
          emissiveIntensity: 0.8,
          roughness: 0.2,
          metalness: 0.85,
          transparent: true,
          opacity: 0.58,
          depthWrite: false,
        })
      : new THREE.MeshStandardMaterial({
          color: 0xcbd5e1,
          roughness: 0.22,
          metalness: 0.90,
        })
  );

  const rubberTireMat = regGhost(
    isGhost
      ? new THREE.MeshStandardMaterial({
          color: 0x082230,
          emissive: 0x005577,
          emissiveIntensity: 0.45,
          roughness: 0.4,
          transparent: true,
          opacity: 0.48,
          depthWrite: false,
        })
      : new THREE.MeshStandardMaterial({
          color: 0x15171c,
          roughness: 0.88,
          metalness: 0.04,
        })
  );

  const jerseyMat = regGhost(
    isGhost
      ? frameMat
      : new THREE.MeshStandardMaterial({
          color: 0x0f766e, // Alpine Forest Teal Trail Jersey
          roughness: 0.68,
          metalness: 0.05,
        })
  );

  const shortsMat = regGhost(
    isGhost
      ? carbonDarkMat
      : new THREE.MeshStandardMaterial({
          color: 0x222630,
          roughness: 0.78,
          metalness: 0.02,
        })
  );

  const skinMat = regGhost(
    isGhost
      ? frameMat
      : new THREE.MeshStandardMaterial({
          color: 0xf1c29b,
          roughness: 0.62,
          metalness: 0.0,
        })
  );

  const helmetMat = regGhost(
    isGhost
      ? kashimaGoldMat
      : new THREE.MeshStandardMaterial({
          color: 0xf8fafc, // Crisp Alpine White MTB Helmet
          roughness: 0.24,
          metalness: 0.12,
        })
  );

  const goggleMat = regGhost(
    isGhost
      ? new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.85,
          depthWrite: false,
        })
      : new THREE.MeshStandardMaterial({
          color: 0xff7b00, // Iridescent Amber Trail Goggles
          roughness: 0.12,
          metalness: 0.75,
        })
  );

  // -------------------------------------------------------------------------
  // 1. NARROW BICYCLE GROUND CONTACT SHADOW DECAL (Physical bike only)
  // -------------------------------------------------------------------------
  let shadowQuad = null;
  if (!isGhost) {
    const sCanvas = document.createElement('canvas');
    sCanvas.width = 128;
    sCanvas.height = 256;
    const sCtx = sCanvas.getContext('2d');
    sCtx.save();
    sCtx.translate(64, 128);
    sCtx.scale(0.38, 1.0);
    const sGrad = sCtx.createRadialGradient(0, 0, 10, 0, 0, 118);
    sGrad.addColorStop(0.0, 'rgba(2, 2, 5, 0.90)');
    sGrad.addColorStop(0.55, 'rgba(3, 3, 7, 0.62)');
    sGrad.addColorStop(1.0, 'rgba(4, 4, 8, 0.0)');
    sCtx.fillStyle = sGrad;
    sCtx.beginPath();
    sCtx.arc(0, 0, 118, 0, Math.PI * 2);
    sCtx.fill();
    sCtx.restore();

    const sTex = new THREE.CanvasTexture(sCanvas);
    shadowQuad = new THREE.Mesh(
      new THREE.PlaneGeometry(0.0085, 0.022),
      new THREE.MeshBasicMaterial({
        map: sTex,
        transparent: true,
        opacity: 0.90,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -8,
        polygonOffsetUnits: -8,
      })
    );
    shadowQuad.rotation.x = -Math.PI / 2;
    shadowQuad.position.set(0, 0.00072, 0.0001);
    bikeRoot.add(shadowQuad);
  }

  // -------------------------------------------------------------------------
  // 2. KNOBBY 29" MTB WHEEL FACTORY
  // -------------------------------------------------------------------------
  const wheelRadius = 0.0028;
  function createMtbWheel() {
    const wheel = new THREE.Group();

    // Knobby tire torus
    const tire = new THREE.Mesh(
      new THREE.TorusGeometry(0.00242, 0.00038, 10, 22),
      rubberTireMat
    );
    tire.rotation.y = Math.PI / 2;
    wheel.add(tire);

    // Knobby tread lugs around tire circumference
    const lugGeo = new THREE.BoxGeometry(0.00056, 0.00018, 0.00030);
    const numLugs = 14;
    for (let i = 0; i < numLugs; i++) {
      const ang = (i / numLugs) * Math.PI * 2;
      const lug = new THREE.Mesh(lugGeo, rubberTireMat);
      lug.position.set(0, Math.cos(ang) * 0.00278, Math.sin(ang) * 0.00278);
      lug.rotation.x = -ang;
      wheel.add(lug);
    }

    // Alloy rim
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(0.00208, 0.00014, 8, 20),
      carbonDarkMat
    );
    rim.rotation.y = Math.PI / 2;
    wheel.add(rim);

    // Hub axle
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.00038, 0.00038, 0.0009, 10),
      frameMat
    );
    hub.rotation.z = Math.PI / 2;
    wheel.add(hub);

    // Stainless disc brake rotor (left side)
    const rotor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.00105, 0.00105, 0.00012, 14),
      alloySilverMat
    );
    rotor.rotation.z = Math.PI / 2;
    rotor.position.x = -0.00042;
    wheel.add(rotor);

    // 6 Metallic Spokes
    const spokeGeo = new THREE.CylinderGeometry(0.000045, 0.000045, 0.0041, 4);
    for (let s = 0; s < 6; s++) {
      const spoke = new THREE.Mesh(spokeGeo, alloySilverMat);
      spoke.rotation.x = (s / 6) * Math.PI;
      wheel.add(spoke);
    }

    return wheel;
  }

  // Helper to orient a cylinder between two 3D points
  function createTubeSegment(p1, p2, rTop, rBot, mat) {
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(rTop, rBot, len, 8),
      mat
    );
    mesh.position.copy(p1).addScaledVector(dir, 0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    return mesh;
  }

  // Key Frame Node Coordinates (Y = 0 is road contact, wheel radius = 0.0028)
  const ptRearAxle = new THREE.Vector3(0, 0.0028, -0.0060);
  const ptBottomBracket = new THREE.Vector3(0, 0.0029, -0.0004);
  const ptSeatCluster = new THREE.Vector3(0, 0.0064, -0.0018);
  const ptHeadTubeTop = new THREE.Vector3(0, 0.0072, 0.0036);
  const ptHeadTubeBot = new THREE.Vector3(0, 0.0059, 0.0041);
  const ptFrontAxle = new THREE.Vector3(0, 0.0028, 0.0062);

  // -------------------------------------------------------------------------
  // 3. HYDROFORMED FULL-SUSPENSION MTB FRAME & REAR WHEEL
  // -------------------------------------------------------------------------
  const frameGroup = new THREE.Group();
  frameGroup.name = 'MtbFrameGroup';
  bikeRoot.add(frameGroup);

  // Top tube, Down tube, Seat tube, Head tube
  frameGroup.add(createTubeSegment(ptSeatCluster, ptHeadTubeTop, 0.00036, 0.00038, frameMat));
  frameGroup.add(createTubeSegment(ptBottomBracket, ptHeadTubeBot, 0.00044, 0.00046, frameMat));
  frameGroup.add(createTubeSegment(ptBottomBracket, ptSeatCluster, 0.00038, 0.00040, frameMat));
  frameGroup.add(createTubeSegment(ptHeadTubeBot, ptHeadTubeTop, 0.00044, 0.00044, carbonDarkMat));

  // Rear Triangle Stays (Left & Right chainstays + seatstays)
  for (const sx of [-0.00055, 0.00055]) {
    const pRearSide = ptRearAxle.clone().add(new THREE.Vector3(sx, 0, 0));
    const pBbSide = ptBottomBracket.clone().add(new THREE.Vector3(sx * 0.7, 0, 0));
    const pSeatSide = ptSeatCluster.clone().add(new THREE.Vector3(sx * 0.6, -0.0005, 0));
    frameGroup.add(createTubeSegment(pBbSide, pRearSide, 0.00024, 0.00020, carbonDarkMat));
    frameGroup.add(createTubeSegment(pSeatSide, pRearSide, 0.00020, 0.00018, frameMat));
  }

  // Rear Suspension Shock Absorber (Kashima gold cylinder inside main triangle)
  const ptShockTop = new THREE.Vector3(0, 0.0062, 0.0003);
  const ptShockBot = new THREE.Vector3(0, 0.0040, -0.0010);
  frameGroup.add(createTubeSegment(ptShockBot, ptShockTop, 0.00034, 0.00026, kashimaGoldMat));

  // Seatpost & Trail Saddle
  const ptSaddle = new THREE.Vector3(0, 0.0075, -0.0023);
  frameGroup.add(createTubeSegment(ptSeatCluster, ptSaddle, 0.00026, 0.00026, carbonDarkMat));
  const saddle = new THREE.Mesh(
    new THREE.BoxGeometry(0.0016, 0.00055, 0.0032),
    carbonDarkMat
  );
  saddle.position.copy(ptSaddle).add(new THREE.Vector3(0, 0.0002, -0.0002));
  saddle.rotation.x = 0.06;
  frameGroup.add(saddle);

  // Rear Wheel
  const rearWheelMesh = createMtbWheel();
  rearWheelMesh.position.copy(ptRearAxle);
  bikeRoot.add(rearWheelMesh);

  // -------------------------------------------------------------------------
  // 4. STEERABLE FRONT FORK, WIDE HANDLEBARS & FRONT WHEEL
  // -------------------------------------------------------------------------
  const frontForkPivot = new THREE.Group();
  frontForkPivot.name = 'MtbFrontForkPivot';
  frontForkPivot.position.copy(ptHeadTubeTop);
  bikeRoot.add(frontForkPivot);

  // Convert world front fork points into frontForkPivot local space
  const localAxle = ptFrontAxle.clone().sub(ptHeadTubeTop);
  const localCrown = ptHeadTubeBot.clone().sub(ptHeadTubeTop);

  // Fork Crown Bridge
  const forkCrown = new THREE.Mesh(
    new THREE.BoxGeometry(0.0020, 0.0005, 0.0007),
    carbonDarkMat
  );
  forkCrown.position.copy(localCrown);
  frontForkPivot.add(forkCrown);

  // Dual Suspension Fork Legs (Upper Kashima Gold + Lower Carbon Sliders)
  for (const sx of [-0.00065, 0.00065]) {
    const topLeg = localCrown.clone().add(new THREE.Vector3(sx, 0, 0));
    const botLeg = localAxle.clone().add(new THREE.Vector3(sx, 0, 0));
    const midLeg = topLeg.clone().lerp(botLeg, 0.45);
    frontForkPivot.add(createTubeSegment(topLeg, midLeg, 0.00024, 0.00024, kashimaGoldMat));
    frontForkPivot.add(createTubeSegment(midLeg, botLeg, 0.00030, 0.00028, carbonDarkMat));
  }

  // Stem & Wide Trail Handlebars
  const stem = new THREE.Mesh(
    new THREE.BoxGeometry(0.00065, 0.00055, 0.0014),
    carbonDarkMat
  );
  stem.position.set(0, 0.0006, 0.0005);
  frontForkPivot.add(stem);

  const handlebar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.00022, 0.00022, 0.0084, 8),
    carbonDarkMat
  );
  handlebar.rotation.z = Math.PI / 2;
  handlebar.position.set(0, 0.0009, 0.0011);
  frontForkPivot.add(handlebar);

  // Grips on bar ends
  for (const sx of [-0.0036, 0.0036]) {
    const grip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.00030, 0.00030, 0.0016, 8),
      frameMat
    );
    grip.rotation.z = Math.PI / 2;
    grip.position.set(sx, 0.0009, 0.0011);
    frontForkPivot.add(grip);
  }

  // Compact Handlebar Trail LED Headlamp
  if (!isGhost) {
    const trailLamp = new THREE.Mesh(
      new THREE.BoxGeometry(0.0011, 0.0008, 0.0009),
      new THREE.MeshBasicMaterial({ color: 0xfff8e0, toneMapped: false })
    );
    trailLamp.position.set(0, 0.0012, 0.0016);
    frontForkPivot.add(trailLamp);
  }

  // Front Wheel attached to steerable fork pivot
  const frontWheelMesh = createMtbWheel();
  frontWheelMesh.position.copy(localAxle);
  frontForkPivot.add(frontWheelMesh);

  // -------------------------------------------------------------------------
  // 5. ROTATING CRANKSET, CHAINRING & PEDALS
  // -------------------------------------------------------------------------
  const crankPivot = new THREE.Group();
  crankPivot.name = 'MtbCrankset';
  crankPivot.position.copy(ptBottomBracket);
  bikeRoot.add(crankPivot);

  const chainring = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0011, 0.0011, 0.00025, 14),
    alloySilverMat
  );
  chainring.rotation.z = Math.PI / 2;
  chainring.position.x = 0.00065;
  crankPivot.add(chainring);

  const crankArmR = new THREE.Mesh(
    new THREE.BoxGeometry(0.00025, 0.0018, 0.0004),
    alloySilverMat
  );
  crankArmR.position.set(0.00085, 0.00075, 0);
  crankPivot.add(crankArmR);

  const crankArmL = new THREE.Mesh(
    new THREE.BoxGeometry(0.00025, 0.0018, 0.0004),
    alloySilverMat
  );
  crankArmL.position.set(-0.00085, -0.00075, 0);
  crankPivot.add(crankArmL);

  const rightPedalPivot = new THREE.Group();
  rightPedalPivot.position.set(0.0013, 0.0015, 0);
  const pedalGeo = new THREE.BoxGeometry(0.0009, 0.00022, 0.0009);
  rightPedalPivot.add(new THREE.Mesh(pedalGeo, carbonDarkMat));
  crankPivot.add(rightPedalPivot);

  const leftPedalPivot = new THREE.Group();
  leftPedalPivot.position.set(-0.0013, -0.0015, 0);
  leftPedalPivot.add(new THREE.Mesh(pedalGeo, carbonDarkMat));
  crankPivot.add(leftPedalPivot);

  // -------------------------------------------------------------------------
  // 6. ARTICULATED TRAIL CYCLIST RIDER (산악자전거 라이더)
  // -------------------------------------------------------------------------
  const riderGroup = new THREE.Group();
  riderGroup.name = 'MtbCyclistRider';
  bikeRoot.add(riderGroup);

  const riderBodyGroup = new THREE.Group();
  riderBodyGroup.position.set(0, 0.0080, -0.0020);
  riderGroup.add(riderBodyGroup);

  // Pelvis / Trail Shorts
  const pelvis = new THREE.Mesh(
    new THREE.BoxGeometry(0.0026, 0.0016, 0.0024),
    shortsMat
  );
  pelvis.position.set(0, 0.0005, 0);
  riderBodyGroup.add(pelvis);

  // Athletic Forward-Leaning Torso in Trail Jersey
  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.0028, 0.0044, 0.0022),
    jerseyMat
  );
  torso.position.set(0, 0.0028, 0.0016);
  torso.rotation.x = 0.58; // Attack leaning posture toward handlebars
  riderBodyGroup.add(torso);

  // Hydration Trail Backpack
  const backpack = new THREE.Mesh(
    new THREE.BoxGeometry(0.0022, 0.0032, 0.0012),
    carbonDarkMat
  );
  backpack.position.set(0, 0.0034, 0.0002);
  backpack.rotation.x = 0.58;
  riderBodyGroup.add(backpack);

  // Arms reaching forward to the MTB handlebars
  const shoulderCenterY = 0.0045;
  const shoulderCenterZ = 0.0030;
  for (const sx of [-1, 1]) {
    const pShoulder = new THREE.Vector3(sx * 0.0015, shoulderCenterY, shoulderCenterZ);
    const pElbow = new THREE.Vector3(sx * 0.0026, shoulderCenterY - 0.0012, shoulderCenterZ + 0.0016);
    const pGrip = new THREE.Vector3(sx * 0.0035, 0.0001, 0.0067); // Relative to riderBodyGroup
    riderBodyGroup.add(createTubeSegment(pShoulder, pElbow, 0.00048, 0.00042, jerseyMat));
    riderBodyGroup.add(createTubeSegment(pElbow, pGrip, 0.00042, 0.00034, skinMat));

    // Trail gloves on bar grips
    const glove = new THREE.Mesh(new THREE.SphereGeometry(0.00045, 7, 6), frameMat);
    glove.position.copy(pGrip);
    riderBodyGroup.add(glove);
  }

  // Articulated Pedaling Legs (Driven dynamically in update!)
  function createLegAssembly(sideSign) {
    const hip = new THREE.Group();
    hip.position.set(sideSign * 0.0012, 0.0004, 0.0004);

    const thighMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.00056, 0.00046, 0.0032, 8),
      shortsMat
    );
    thighMesh.position.y = -0.0015;
    hip.add(thighMesh);

    const kneePivot = new THREE.Group();
    kneePivot.position.set(0, -0.0030, 0);
    hip.add(kneePivot);

    const calfMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.00042, 0.00032, 0.0030, 8),
      skinMat
    );
    calfMesh.position.y = -0.0014;
    kneePivot.add(calfMesh);

    const shoeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.00085, 0.0006, 0.0016),
      frameMat
    );
    shoeMesh.position.set(0, -0.0029, 0.0004);
    kneePivot.add(shoeMesh);

    riderBodyGroup.add(hip);
    return { hip, kneePivot };
  }

  const leftLeg = createLegAssembly(-1);
  const rightLeg = createLegAssembly(1);

  // Cyclist Head, MTB Trail Helmet, Visor & Amber Goggles
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.0056, 0.0036);
  riderBodyGroup.add(headGroup);

  const headSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.00145, 12, 10),
    skinMat
  );
  headGroup.add(headSphere);

  // Aero MTB Helmet Shell
  const helmetShell = new THREE.Mesh(
    new THREE.SphereGeometry(0.00165, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.65),
    helmetMat
  );
  helmetShell.position.set(0, 0.00025, -0.0001);
  helmetShell.rotation.x = -0.18;
  headGroup.add(helmetShell);

  // MTB Peak Visor
  const helmetVisor = new THREE.Mesh(
    new THREE.BoxGeometry(0.0022, 0.00025, 0.0014),
    frameMat
  );
  helmetVisor.position.set(0, 0.0011, 0.0013);
  helmetVisor.rotation.x = 0.25;
  headGroup.add(helmetVisor);

  // Trail Goggles
  const goggles = new THREE.Mesh(
    new THREE.BoxGeometry(0.0021, 0.00065, 0.0008),
    goggleMat
  );
  goggles.position.set(0, 0.00025, 0.0013);
  headGroup.add(goggles);

  // -------------------------------------------------------------------------
  // 7. RUNTIME ANIMATION & STEERING KINEMATICS (Zero GC)
  // -------------------------------------------------------------------------
  let crankAngle = 0.0;
  let cockpitRoadOnly = false;

  function setCockpitRoadOnly(isRoadOnly) {
    cockpitRoadOnly = Boolean(isRoadOnly);
    bikeRoot.visible = !cockpitRoadOnly;
  }

  function update(dt, speed = 0, steerAngle = 0, state = null, elapsedTime = 0) {
    const targetSteer = THREE.MathUtils.clamp(steerAngle, -0.52, 0.52);

    // 1. Spin 29" knobby front & rear wheels accurately to linear speed
    const wheelSpinDelta = (speed / wheelRadius) * dt;
    rearWheelMesh.rotation.x += wheelSpinDelta;
    frontWheelMesh.rotation.x += wheelSpinDelta;

    // 2. Steer front fork + handlebars + front wheel smoothly
    frontForkPivot.rotation.y = THREE.MathUtils.lerp(
      frontForkPivot.rotation.y,
      targetSteer,
      Math.min(1, dt * 16)
    );

    // 3. Spin Crankset & drive articulated Cyclist Pedaling Legs
    const pedalRate = Math.abs(speed) > 0.01 ? (speed / 0.045) * Math.PI * 2 : 0.0;
    crankAngle += pedalRate * dt;
    crankPivot.rotation.x = crankAngle;

    // Keep pedals horizontal while orbiting crank
    rightPedalPivot.rotation.x = -crankAngle;
    leftPedalPivot.rotation.x = -crankAngle;

    // Synchronize thigh & knee flexion with crank rotation (zero allocations!)
    const rightPhase = crankAngle;
    const leftPhase = crankAngle + Math.PI;
    rightLeg.hip.rotation.x = -0.55 - Math.sin(rightPhase) * 0.42;
    rightLeg.kneePivot.rotation.x = 0.88 + Math.cos(rightPhase) * 0.48;

    leftLeg.hip.rotation.x = -0.55 - Math.sin(leftPhase) * 0.42;
    leftLeg.kneePivot.rotation.x = 0.88 + Math.cos(leftPhase) * 0.48;

    // 4. Subtle Rider Body & Head Dynamics (Looks into corner + trail cadence bob)
    const trailBob = Math.abs(speed) > 0.02 ? Math.sin(crankAngle * 2.0) * 0.00028 : 0.0;
    const suspensionBounce =
      state && state.curbRumble > 0.1
        ? Math.sin(elapsedTime * 42.0) * 0.0004
        : 0.0;

    riderBodyGroup.position.y = 0.0080 + trailBob + suspensionBounce;
    riderBodyGroup.rotation.z = THREE.MathUtils.lerp(
      riderBodyGroup.rotation.z,
      targetSteer * 0.14,
      Math.min(1, dt * 12)
    );

    headGroup.rotation.y = targetSteer * 0.48;
    headGroup.rotation.z = -targetSteer * 0.22;
  }

  function setGhostOpacity(opacity) {
    for (const m of ghostMaterials) {
      m.opacity = opacity;
    }
  }

  return {
    bikeRoot,
    frontForkPivot,
    frontWheelMesh,
    rearWheelMesh,
    headGroup,
    riderBodyGroup,
    shadowQuad,
    update,
    setCockpitRoadOnly,
    setGhostOpacity,
  };
}
