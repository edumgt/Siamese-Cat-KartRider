import * as THREE from 'three';

/**
 * Creates the 1:87 Scale Siamese Cat ("샴 고양이") Kart Driver.
 * Features:
 * - Seal-point Siamese coloration: fawn/cream body with dark chocolate face mask, ears, paws, and tail
 * - Deep sapphire blue feline eyes with vertical pupils and glossy specular highlight
 * - Pointed ears with soft pink inner ear cartilage
 * - Paws gripping the steering wheel
 * - Articulated head that leans into turns
 * - Swishing cat tail behind the driver seat
 * - Optional cute retro leather/brass racing goggles perched on the cat's forehead
 * - Supports both normal physical rendering and holographic ghost rendering
 */
export function buildSiameseCatDriver(options = {}) {
  const isGhost = Boolean(options.isGhost);
  const driverRoot = new THREE.Group();
  driverRoot.name = isGhost ? 'GhostSiameseCatDriver' : 'SiameseCatDriver';

  // 1. Materials setup (Normal vs Ghost)
  let creamFurMat, sealPointMat, pinkEarMat, eyeBlueMat, eyePupilMat, nosePinkMat, goggleRimMat, goggleLensMat, whiskerMat, collarMat, bellGoldMat;

  if (isGhost) {
    // Ethereal translucent cyan hologram materials
    creamFurMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x0088cc,
      emissiveIntensity: 0.65,
      roughness: 0.2,
      metalness: 0.5,
      transparent: true,
      opacity: 0.52,
      depthWrite: false,
    });
    sealPointMat = new THREE.MeshStandardMaterial({
      color: 0x0a384c,
      emissive: 0x005577,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.6,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    pinkEarMat = creamFurMat;
    eyeBlueMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    eyePupilMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });
    nosePinkMat = creamFurMat;
    goggleRimMat = sealPointMat;
    goggleLensMat = eyeBlueMat;
    whiskerMat = new THREE.MeshBasicMaterial({
      color: 0x88ffff,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    collarMat = sealPointMat;
    bellGoldMat = eyeBlueMat;
  } else {
    // Warm natural Siamese seal-point materials
    creamFurMat = new THREE.MeshStandardMaterial({
      color: 0xf5ebd9, // Pale warm fawn/cream fur
      roughness: 0.68,
      metalness: 0.02,
    });

    sealPointMat = new THREE.MeshStandardMaterial({
      color: 0x2e1c14, // Deep chocolate / espresso seal brown
      roughness: 0.58,
      metalness: 0.05,
    });

    pinkEarMat = new THREE.MeshStandardMaterial({
      color: 0xfcb0bf, // Soft pink inner ear
      roughness: 0.5,
      metalness: 0.0,
    });

    eyeBlueMat = new THREE.MeshStandardMaterial({
      color: 0x1076f8, // Deep brilliant sapphire blue
      emissive: 0x0a40a0,
      emissiveIntensity: 0.45,
      roughness: 0.08,
      metalness: 0.4,
    });

    eyePupilMat = new THREE.MeshBasicMaterial({
      color: 0x06080d, // Black vertical slit pupil
    });

    nosePinkMat = new THREE.MeshStandardMaterial({
      color: 0xfc8ca0, // Cute small pink nose
      roughness: 0.4,
      metalness: 0.0,
    });

    goggleRimMat = new THREE.MeshStandardMaterial({
      color: 0xcca044, // Vintage brass goggle frames
      roughness: 0.25,
      metalness: 0.85,
    });

    goggleLensMat = new THREE.MeshStandardMaterial({
      color: 0x66c8ff,
      roughness: 0.05,
      metalness: 0.95,
      transparent: true,
      opacity: 0.75,
    });

    whiskerMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    });

    collarMat = new THREE.MeshStandardMaterial({
      color: 0xe61f24, // Bright red racing collar
      roughness: 0.35,
      metalness: 0.1,
    });

    bellGoldMat = new THREE.MeshStandardMaterial({
      color: 0xffcc00, // Golden bell
      roughness: 0.2,
      metalness: 0.9,
    });
  }

  // 2. Torso (Cream body sitting in bucket seat)
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.0048, -0.0010);
  torsoGroup.rotation.x = 0.16;

  const torsoBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.0038, 0.0042, 0.0030),
    creamFurMat
  );
  torsoGroup.add(torsoBody);

  // Red racing collar
  const collar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0019, 0.0020, 0.0006, 14),
    collarMat
  );
  collar.position.set(0, 0.0020, 0.0002);
  torsoGroup.add(collar);

  // Small golden bell/tag on collar
  const bell = new THREE.Mesh(
    new THREE.SphereGeometry(0.00045, 8, 8),
    bellGoldMat
  );
  bell.position.set(0, 0.0018, 0.0019);
  torsoGroup.add(bell);

  driverRoot.add(torsoGroup);

  // 3. Cat Arms & Paws gripping the steering wheel
  const armL = new THREE.Group();
  armL.position.set(-0.0016, 0.0054, -0.0006);
  const armMeshL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0006, 0.0007, 0.0034, 8),
    creamFurMat
  );
  armMeshL.rotation.x = -1.15;
  armMeshL.rotation.z = -0.35;
  armMeshL.position.set(0, -0.0004, 0.0014);
  armL.add(armMeshL);

  const pawL = new THREE.Mesh(
    new THREE.SphereGeometry(0.00075, 8, 8),
    sealPointMat
  );
  pawL.position.set(-0.0007, -0.0002, 0.0033);
  armL.add(pawL);
  driverRoot.add(armL);

  const armR = new THREE.Group();
  armR.position.set(0.0016, 0.0054, -0.0006);
  const armMeshR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0006, 0.0007, 0.0034, 8),
    creamFurMat
  );
  armMeshR.rotation.x = -1.15;
  armMeshR.rotation.z = 0.35;
  armMeshR.position.set(0, -0.0004, 0.0014);
  armR.add(armMeshR);

  const pawR = new THREE.Mesh(
    new THREE.SphereGeometry(0.00075, 8, 8),
    sealPointMat
  );
  pawR.position.set(0.0007, -0.0002, 0.0033);
  armR.add(pawR);
  driverRoot.add(armR);

  // 4. Cat Tail (Curving elegantly behind seat)
  const tailRoot = new THREE.Group();
  tailRoot.position.set(0, 0.0032, -0.0028);

  // 3 segmented curved tail sections for organic swishing
  const tailSeg1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.00055, 0.00065, 0.0028, 8),
    sealPointMat
  );
  tailSeg1.rotation.x = -0.75;
  tailSeg1.position.set(0, 0.0010, -0.0010);
  tailRoot.add(tailSeg1);

  const tailMidNode = new THREE.Group();
  tailMidNode.position.set(0, 0.0022, -0.0020);
  const tailSeg2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.00045, 0.00055, 0.0030, 8),
    sealPointMat
  );
  tailSeg2.rotation.x = -0.15;
  tailSeg2.position.set(0, 0.0012, 0.0002);
  tailMidNode.add(tailSeg2);

  const tailTip = new THREE.Mesh(
    new THREE.SphereGeometry(0.0005, 8, 8),
    sealPointMat
  );
  tailTip.position.set(0, 0.0026, 0.0004);
  tailMidNode.add(tailTip);
  tailRoot.add(tailMidNode);

  driverRoot.add(tailRoot);

  // 5. Articulated Head (Leans/turns into corners!)
  const headGroup = new THREE.Group();
  headGroup.name = 'CatDriverHeadGroup';
  headGroup.position.set(0, 0.0080, -0.0002);

  // Main Head Skull (cream fur)
  const skullGeo = new THREE.SphereGeometry(0.0023, 16, 14);
  skullGeo.scale(1.05, 0.98, 1.0);
  const skull = new THREE.Mesh(skullGeo, creamFurMat);
  headGroup.add(skull);

  // Dark Chocolate Seal-Point Face Mask (Characteristic Siamese diamond/oval mask)
  const maskGeo = new THREE.SphereGeometry(0.0020, 14, 12);
  maskGeo.scale(0.85, 0.78, 0.65);
  const faceMask = new THREE.Mesh(maskGeo, sealPointMat);
  faceMask.position.set(0, -0.0002, 0.0010);
  headGroup.add(faceMask);

  // Cute Rounded Muzzle Pads (Dark Brown)
  for (const mx of [-0.00055, 0.00055]) {
    const muzzlePad = new THREE.Mesh(
      new THREE.SphereGeometry(0.00062, 10, 8),
      sealPointMat
    );
    muzzlePad.scale.set(1.0, 0.85, 0.9);
    muzzlePad.position.set(mx, -0.00055, 0.0021);
    headGroup.add(muzzlePad);
  }

  // Pink Cat Nose (Tiny rounded inverted triangle)
  const noseMesh = new THREE.Mesh(
    new THREE.ConeGeometry(0.00035, 0.0004, 6),
    nosePinkMat
  );
  noseMesh.rotation.x = Math.PI;
  noseMesh.position.set(0, -0.0002, 0.0024);
  headGroup.add(noseMesh);

  // Striking Deep Sapphire Blue Cat Eyes
  for (const ex of [-0.00095, 0.00095]) {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(ex, 0.00035, 0.00195);
    eyeGroup.rotation.y = ex > 0 ? 0.22 : -0.22;

    // Sclera / Sapphire Iris
    const eyeBall = new THREE.Mesh(
      new THREE.SphereGeometry(0.00065, 12, 10),
      eyeBlueMat
    );
    eyeBall.scale.set(1.15, 0.92, 0.55);
    eyeGroup.add(eyeBall);

    // Vertical slit pupil
    const pupil = new THREE.Mesh(
      new THREE.BoxGeometry(0.00015, 0.0008, 0.0002),
      eyePupilMat
    );
    pupil.position.set(0, 0, 0.00038);
    eyeGroup.add(pupil);

    // Tiny white sparkle highlight
    const glint = new THREE.Mesh(
      new THREE.PlaneGeometry(0.00022, 0.00022),
      whiskerMat
    );
    glint.position.set(ex > 0 ? 0.00022 : -0.00022, 0.00022, 0.00042);
    eyeGroup.add(glint);

    headGroup.add(eyeGroup);
  }

  // Pointed Seal-Point Cat Ears with Pink Inner Cartilage
  const earL = new THREE.Group();
  earL.name = 'CatEarL';
  earL.position.set(-0.00135, 0.00185, 0.0002);
  earL.rotation.z = 0.28;
  earL.rotation.y = -0.15;

  const earOuterL = new THREE.Mesh(
    new THREE.ConeGeometry(0.00095, 0.0021, 5),
    sealPointMat
  );
  earOuterL.scale.set(0.65, 1.0, 1.15);
  earOuterL.position.set(0, 0.0008, 0);
  earL.add(earOuterL);

  const earInnerL = new THREE.Mesh(
    new THREE.ConeGeometry(0.00065, 0.0015, 4),
    pinkEarMat
  );
  earInnerL.scale.set(0.45, 1.0, 0.9);
  earInnerL.position.set(0, 0.0007, 0.00025);
  earL.add(earInnerL);
  headGroup.add(earL);

  const earR = new THREE.Group();
  earR.name = 'CatEarR';
  earR.position.set(0.00135, 0.00185, 0.0002);
  earR.rotation.z = -0.28;
  earR.rotation.y = 0.15;

  const earOuterR = new THREE.Mesh(
    new THREE.ConeGeometry(0.00095, 0.0021, 5),
    sealPointMat
  );
  earOuterR.scale.set(0.65, 1.0, 1.15);
  earOuterR.position.set(0, 0.0008, 0);
  earR.add(earOuterR);

  const earInnerR = new THREE.Mesh(
    new THREE.ConeGeometry(0.00065, 0.0015, 4),
    pinkEarMat
  );
  earInnerR.scale.set(0.45, 1.0, 0.9);
  earInnerR.position.set(0, 0.0007, 0.00025);
  earR.add(earInnerR);
  headGroup.add(earR);

  // Whiskers (3 whiskers on left, 3 on right)
  for (const side of [-1, 1]) {
    for (let w = -1; w <= 1; w++) {
      const whisker = new THREE.Mesh(
        new THREE.PlaneGeometry(0.0022, 0.00012),
        whiskerMat
      );
      whisker.position.set(side * 0.0017, -0.00045 + w * 0.00025, 0.0020);
      whisker.rotation.z = side * (0.08 + w * 0.14);
      whisker.rotation.y = -side * 0.35;
      headGroup.add(whisker);
    }
  }

  // Retro Brass Racing Goggles resting tilted on the cat's forehead
  const gogglesGroup = new THREE.Group();
  gogglesGroup.position.set(0, 0.0012, 0.0012);
  gogglesGroup.rotation.x = -0.42;

  // Leather goggle strap
  const strap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0024, 0.0024, 0.00042, 14, 1, true),
    sealPointMat
  );
  strap.rotation.x = Math.PI / 2;
  gogglesGroup.add(strap);

  for (const gx of [-0.00115, 0.00115]) {
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(0.00085, 0.00022, 8, 14),
      goggleRimMat
    );
    rim.position.set(gx, 0, 0.0021);
    gogglesGroup.add(rim);

    const lens = new THREE.Mesh(
      new THREE.CircleGeometry(0.00075, 12),
      goggleLensMat
    );
    lens.position.set(gx, 0, 0.0021);
    gogglesGroup.add(lens);
  }
  headGroup.add(gogglesGroup);

  driverRoot.add(headGroup);

  // Update animation function (called each frame)
  function update(dt, speed = 0.0, steerAngle = 0.0, elapsedTime = 0.0) {
    // 1. Dynamic Head Lean & Turn into corners
    const targetTurnY = steerAngle * 0.65;
    const targetTiltZ = -steerAngle * 0.45;
    headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, targetTurnY, Math.min(1, dt * 14));
    headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, targetTiltZ, Math.min(1, dt * 12));

    // 2. Playful Ear Twitch & High Speed Aero Pinning
    const speedRatio = THREE.MathUtils.clamp(Math.abs(speed) / 0.22, 0.0, 1.0);
    const twitchA = Math.sin(elapsedTime * 9.0) * 0.05 * (1.0 - speedRatio);
    const twitchB = Math.cos(elapsedTime * 11.5) * 0.05 * (1.0 - speedRatio);
    earL.rotation.x = -speedRatio * 0.18 + twitchA;
    earR.rotation.x = -speedRatio * 0.18 + twitchB;

    // 3. Tail Swishing with speed & lateral momentum
    const tailSwish = Math.sin(elapsedTime * 6.5 + speed * 15.0) * (0.15 + speedRatio * 0.28) - steerAngle * 0.55;
    tailRoot.rotation.y = THREE.MathUtils.lerp(tailRoot.rotation.y, tailSwish, Math.min(1, dt * 10));
    tailMidNode.rotation.y = THREE.MathUtils.lerp(tailMidNode.rotation.y, tailSwish * 0.6, Math.min(1, dt * 12));
  }

  return {
    root: driverRoot,
    headGroup,
    earL,
    earR,
    tailRoot,
    update,
  };
}
