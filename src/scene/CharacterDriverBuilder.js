import * as THREE from 'three';

/**
 * Procedural 3D Character Driver Builder for Desk Racer.
 * Generates 5 adorable 1:87 HO-scale animal racers:
 * 1. 'siamese'   - Siamese Cat with retro brass goggles and sapphire eyes
 * 2. 'shiba'     - Shiba Inu with urajiro cheeks, eyebrow dots & curly doughnut tail
 * 3. 'otter'     - Baby River/Sea Otter with rounded shell ears & rudder tail
 * 4. 'retriever' - Golden Retriever with wind-flapping floppy ears & wagging tail
 * 5. 'panda'     - Baby Panda with black eye patches, round button ears & bamboo leaf
 *
 * Supports physical PBR mode and translucent cyan holographic Ghost mode.
 */
export function buildCharacterDriver(characterId = 'siamese', options = {}) {
  const isGhost = Boolean(options.isGhost);
  const driverRoot = new THREE.Group();
  driverRoot.name = isGhost ? `GhostDriver_${characterId}` : `Driver_${characterId}`;

  // -------------------------------------------------------------------------
  // 1. MATERIAL PALETTE (Physical vs Ghost Hologram)
  // -------------------------------------------------------------------------
  let mats = {};

  if (isGhost) {
    const holoCyan = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x0088cc,
      emissiveIntensity: 0.65,
      roughness: 0.2,
      metalness: 0.5,
      transparent: true,
      opacity: 0.52,
      depthWrite: false,
    });
    const holoDark = new THREE.MeshStandardMaterial({
      color: 0x0a384c,
      emissive: 0x005577,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.6,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const holoBright = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    const holoWhite = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });

    mats = {
      primary: holoCyan,
      secondary: holoDark,
      accent: holoDark,
      innerEar: holoCyan,
      eye: holoBright,
      pupil: holoWhite,
      nose: holoDark,
      tongue: holoCyan,
      collar: holoDark,
      charm: holoBright,
      accessory: holoCyan,
      accessoryAccent: holoBright,
      whisker: holoBright,
    };
  } else {
    // Distinct PBR colorways per species
    if (characterId === 'shiba') {
      mats = {
        primary: new THREE.MeshStandardMaterial({ color: 0xd97c2b, roughness: 0.68, metalness: 0.02 }), // Warm golden sesame tan
        secondary: new THREE.MeshStandardMaterial({ color: 0xfff8ee, roughness: 0.62, metalness: 0.02 }), // Creamy white urajiro
        accent: new THREE.MeshStandardMaterial({ color: 0xb55a16, roughness: 0.70 }), // Darker back tone
        innerEar: new THREE.MeshStandardMaterial({ color: 0xfdbab8, roughness: 0.55 }), // Soft pink
        eye: new THREE.MeshStandardMaterial({ color: 0x22130c, roughness: 0.12, metalness: 0.4 }), // Sparkling dark button eyes
        pupil: new THREE.MeshBasicMaterial({ color: 0x06080d }),
        nose: new THREE.MeshStandardMaterial({ color: 0x121418, roughness: 0.35 }), // Shiny black nose
        tongue: new THREE.MeshStandardMaterial({ color: 0xfb7185, roughness: 0.35 }), // Pink tongue
        collar: new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.35, metalness: 0.1 }), // Japanese emerald green bandana
        charm: new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.2, metalness: 0.9 }), // Golden round tag
        accessory: new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 }),
        accessoryAccent: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }),
        whisker: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }),
      };
    } else if (characterId === 'otter') {
      mats = {
        primary: new THREE.MeshStandardMaterial({ color: 0x563828, roughness: 0.65, metalness: 0.04 }), // Sleek river chestnut brown
        secondary: new THREE.MeshStandardMaterial({ color: 0xf1dfc8, roughness: 0.62, metalness: 0.02 }), // Warm buff cream cheeks/throat
        accent: new THREE.MeshStandardMaterial({ color: 0x43281a, roughness: 0.68 }),
        innerEar: new THREE.MeshStandardMaterial({ color: 0xecd5bc, roughness: 0.50 }), // Cream ear interior
        eye: new THREE.MeshStandardMaterial({ color: 0x1e1208, roughness: 0.08, metalness: 0.5 }), // Glossy dark brown inquisitive eyes
        pupil: new THREE.MeshBasicMaterial({ color: 0x050608 }),
        nose: new THREE.MeshStandardMaterial({ color: 0x181a1f, roughness: 0.25 }), // Shiny wet black button nose
        tongue: new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.35 }),
        collar: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35, metalness: 0.1 }), // Aquatic sky blue collar
        charm: new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.25, metalness: 0.8 }), // Shell / star medallion
        accessory: new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.2, metalness: 0.3 }), // Water goggles / headband
        accessoryAccent: new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, transparent: true, opacity: 0.8 }),
        whisker: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 }),
      };
    } else if (characterId === 'retriever') {
      mats = {
        primary: new THREE.MeshStandardMaterial({ color: 0xebbb68, roughness: 0.65, metalness: 0.02 }), // Honey golden coat
        secondary: new THREE.MeshStandardMaterial({ color: 0xfff0d0, roughness: 0.62, metalness: 0.02 }), // Cream muzzle & chest
        accent: new THREE.MeshStandardMaterial({ color: 0xd9a44c, roughness: 0.70 }),
        innerEar: new THREE.MeshStandardMaterial({ color: 0xdeb36c, roughness: 0.60 }),
        eye: new THREE.MeshStandardMaterial({ color: 0x27170e, roughness: 0.10, metalness: 0.4 }), // Warm affectionate dark eyes
        pupil: new THREE.MeshBasicMaterial({ color: 0x070709 }),
        nose: new THREE.MeshStandardMaterial({ color: 0x14161a, roughness: 0.32 }), // Wet black nose
        tongue: new THREE.MeshStandardMaterial({ color: 0xf87171, roughness: 0.35 }), // Bright happy pink panting tongue
        collar: new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.35, metalness: 0.1 }), // Royal blue collar
        charm: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.9 }), // Silver bone tag
        accessory: new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4 }),
        accessoryAccent: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }),
        whisker: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 }),
      };
    } else if (characterId === 'panda') {
      mats = {
        primary: new THREE.MeshStandardMaterial({ color: 0xfcfcfc, roughness: 0.65, metalness: 0.02 }), // Snow white fur
        secondary: new THREE.MeshStandardMaterial({ color: 0x1c1d22, roughness: 0.58, metalness: 0.04 }), // Deep charcoal / black patches
        accent: new THREE.MeshStandardMaterial({ color: 0x1c1d22, roughness: 0.58 }),
        innerEar: new THREE.MeshStandardMaterial({ color: 0x25262c, roughness: 0.60 }),
        eye: new THREE.MeshStandardMaterial({ color: 0x111216, roughness: 0.10, metalness: 0.4 }), // Dark eyes inside black patches
        pupil: new THREE.MeshBasicMaterial({ color: 0x040406 }),
        nose: new THREE.MeshStandardMaterial({ color: 0x16171b, roughness: 0.35 }), // Black triangular nose
        tongue: new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.35 }),
        collar: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35, metalness: 0.1 }), // Traditional red festival ribbon
        charm: new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.35, metalness: 0.1 }), // Fresh green bamboo leaf tag
        accessory: new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.35 }), // Bamboo leaf tucked by ear
        accessoryAccent: new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.25 }),
        whisker: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 }),
      };
    } else {
      // Default: 'siamese' Cat
      mats = {
        primary: new THREE.MeshStandardMaterial({ color: 0xf5ebd9, roughness: 0.68, metalness: 0.02 }), // Pale fawn / cream
        secondary: new THREE.MeshStandardMaterial({ color: 0x2e1c14, roughness: 0.58, metalness: 0.05 }), // Dark chocolate seal point
        accent: new THREE.MeshStandardMaterial({ color: 0x2e1c14, roughness: 0.58 }),
        innerEar: new THREE.MeshStandardMaterial({ color: 0xfcb0bf, roughness: 0.50 }), // Soft pink
        eye: new THREE.MeshStandardMaterial({ color: 0x1076f8, emissive: 0x0a40a0, emissiveIntensity: 0.45, roughness: 0.08, metalness: 0.4 }), // Deep sapphire blue
        pupil: new THREE.MeshBasicMaterial({ color: 0x06080d }),
        nose: new THREE.MeshStandardMaterial({ color: 0xfc8ca0, roughness: 0.4 }), // Pink nose
        tongue: new THREE.MeshStandardMaterial({ color: 0xfc8ca0, roughness: 0.4 }),
        collar: new THREE.MeshStandardMaterial({ color: 0xe61f24, roughness: 0.35, metalness: 0.1 }), // Red racing collar
        charm: new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.2, metalness: 0.9 }), // Golden bell
        accessory: new THREE.MeshStandardMaterial({ color: 0xcca044, roughness: 0.25, metalness: 0.85 }), // Vintage brass goggle rims
        accessoryAccent: new THREE.MeshStandardMaterial({ color: 0x66c8ff, roughness: 0.05, metalness: 0.95, transparent: true, opacity: 0.75 }), // Blue glass
        whisker: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 }),
      };
    }
  }

  // -------------------------------------------------------------------------
  // 2. TORSO & RACING COLLAR / ACCESSORY
  // -------------------------------------------------------------------------
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.0048, -0.0010);
  torsoGroup.rotation.x = 0.16;

  const torsoBody = new THREE.Mesh(
    new THREE.BoxGeometry(
      characterId === 'panda' || characterId === 'otter' ? 0.0042 : 0.0038,
      0.0042,
      characterId === 'panda' ? 0.0034 : 0.0030
    ),
    characterId === 'panda' ? mats.secondary : mats.primary
  );
  torsoGroup.add(torsoBody);

  // Chest / Throat patch for shiba, otter, retriever, panda
  if (characterId === 'shiba' || characterId === 'otter' || characterId === 'retriever') {
    const chestBib = new THREE.Mesh(
      new THREE.PlaneGeometry(0.0028, 0.0032),
      mats.secondary
    );
    chestBib.position.set(0, 0.0002, 0.00155);
    torsoGroup.add(chestBib);
  } else if (characterId === 'panda') {
    // White belly band
    const pandaBelly = new THREE.Mesh(
      new THREE.BoxGeometry(0.0040, 0.0022, 0.0032),
      mats.primary
    );
    pandaBelly.position.set(0, -0.0010, 0.0002);
    torsoGroup.add(pandaBelly);
  }

  // Racing Collar
  const collarMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0020, 0.0021, 0.0006, 14),
    mats.collar
  );
  collarMesh.position.set(0, 0.0020, 0.0002);
  torsoGroup.add(collarMesh);

  // Collar Charm (bell for cat, gold tag for shiba, shell for otter, bone for retriever, bamboo for panda)
  let charmMesh;
  if (characterId === 'retriever') {
    charmMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.0009, 0.0005, 0.0003),
      mats.charm
    );
  } else if (characterId === 'panda') {
    charmMesh = new THREE.Mesh(
      new THREE.ConeGeometry(0.0006, 0.0012, 4),
      mats.charm
    );
    charmMesh.rotation.z = Math.PI / 4;
  } else {
    charmMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.00045, 8, 8),
      mats.charm
    );
  }
  charmMesh.position.set(0, 0.0018, 0.0020);
  torsoGroup.add(charmMesh);

  driverRoot.add(torsoGroup);

  // -------------------------------------------------------------------------
  // 3. ARMS & PAWS (Gripping the Steering Wheel)
  // -------------------------------------------------------------------------
  const armMat = characterId === 'panda' ? mats.secondary : mats.primary;
  const pawMat =
    characterId === 'siamese' || characterId === 'panda'
      ? mats.secondary
      : characterId === 'shiba'
        ? mats.secondary
        : mats.primary;

  for (const [sideSign, armName] of [[-1, 'ArmL'], [1, 'ArmR']]) {
    const armNode = new THREE.Group();
    armNode.name = armName;
    armNode.position.set(sideSign * 0.0016, 0.0054, -0.0006);

    const armMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.00062, 0.00072, 0.0034, 8),
      armMat
    );
    armMesh.rotation.x = -1.15;
    armMesh.rotation.z = sideSign * 0.35;
    armMesh.position.set(0, -0.0004, 0.0014);
    armNode.add(armMesh);

    const pawMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.00075, 8, 8),
      pawMat
    );
    pawMesh.position.set(sideSign * 0.0007, -0.0002, 0.0033);
    armNode.add(pawMesh);

    driverRoot.add(armNode);
  }

  // -------------------------------------------------------------------------
  // 4. SPECIES-SPECIFIC TAILS
  // -------------------------------------------------------------------------
  const tailRoot = new THREE.Group();
  tailRoot.name = 'DriverTailRoot';
  tailRoot.position.set(0, 0.0032, -0.0028);

  let tailChild = null;

  if (characterId === 'shiba') {
    // Curled Doughnut Tail: spiraling upward with white tip
    const donutTail = new THREE.Group();
    const tSeg1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0005, 0.0007, 0.0022, 8),
      mats.primary
    );
    tSeg1.rotation.x = -1.2;
    tSeg1.position.set(0, 0.0008, -0.0008);
    donutTail.add(tSeg1);

    const tCurl = new THREE.Mesh(
      new THREE.TorusGeometry(0.0014, 0.00048, 8, 14, Math.PI * 1.35),
      mats.primary
    );
    tCurl.rotation.y = Math.PI / 2;
    tCurl.rotation.z = 0.4;
    tCurl.position.set(0.0002, 0.0022, -0.0015);
    donutTail.add(tCurl);

    const tTip = new THREE.Mesh(
      new THREE.SphereGeometry(0.00052, 7, 7),
      mats.secondary // White tip!
    );
    tTip.position.set(0.0004, 0.0032, -0.0006);
    donutTail.add(tTip);

    tailRoot.add(donutTail);
    tailChild = donutTail;
  } else if (characterId === 'otter') {
    // Thick flattened muscular rudder tail
    const otterTail = new THREE.Group();
    const oSeg1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0007, 0.00095, 0.0036, 8),
      mats.primary
    );
    oSeg1.scale.set(1.35, 1.0, 0.65); // Flattened vertically
    oSeg1.rotation.x = -0.65;
    oSeg1.position.set(0, 0.0012, -0.0014);
    otterTail.add(oSeg1);

    const oSeg2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.00035, 0.0007, 0.0032, 8),
      mats.primary
    );
    oSeg2.scale.set(1.25, 1.0, 0.55);
    oSeg2.rotation.x = -0.25;
    oSeg2.position.set(0, 0.0024, -0.0030);
    otterTail.add(oSeg2);

    tailRoot.add(otterTail);
    tailChild = otterTail;
  } else if (characterId === 'retriever') {
    // Bushy feathery tail wagging rapidly
    const retTail = new THREE.Group();
    const rSeg1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.00065, 0.0008, 0.0032, 8),
      mats.primary
    );
    rSeg1.rotation.x = -0.85;
    rSeg1.position.set(0, 0.0010, -0.0012);
    retTail.add(rSeg1);

    const rSeg2 = new THREE.Mesh(
      new THREE.ConeGeometry(0.0009, 0.0034, 8),
      mats.primary
    );
    rSeg2.rotation.x = 0.25;
    rSeg2.position.set(0, 0.0026, -0.0024);
    retTail.add(rSeg2);

    tailRoot.add(retTail);
    tailChild = retTail;
  } else if (characterId === 'panda') {
    // Cute stubby round ball tail
    const pandaTail = new THREE.Mesh(
      new THREE.SphereGeometry(0.00085, 8, 8),
      mats.secondary // Black tail on white rear
    );
    pandaTail.position.set(0, 0.0008, -0.0012);
    tailRoot.add(pandaTail);
    tailChild = pandaTail;
  } else {
    // Siamese Cat: slender multi-segmented swishing tail
    const catTail = new THREE.Group();
    const cSeg1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.00052, 0.00065, 0.0028, 8),
      mats.secondary
    );
    cSeg1.rotation.x = -0.75;
    cSeg1.position.set(0, 0.0010, -0.0010);
    catTail.add(cSeg1);

    const cSeg2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.00042, 0.00052, 0.0030, 8),
      mats.secondary
    );
    cSeg2.rotation.x = -0.15;
    cSeg2.position.set(0, 0.0024, -0.0020);
    catTail.add(cSeg2);

    const cTip = new THREE.Mesh(
      new THREE.SphereGeometry(0.00048, 8, 8),
      mats.secondary
    );
    cTip.position.set(0, 0.0038, -0.0018);
    catTail.add(cTip);

    tailRoot.add(catTail);
    tailChild = catTail;
  }

  driverRoot.add(tailRoot);

  // -------------------------------------------------------------------------
  // 5. ARTICULATED HEAD & FACIAL ANATOMY
  // -------------------------------------------------------------------------
  const headGroup = new THREE.Group();
  headGroup.name = 'DriverHeadGroup';
  headGroup.position.set(0, 0.0080, -0.0002);

  // Skull Base
  const skullGeo = new THREE.SphereGeometry(
    characterId === 'panda' ? 0.0025 : characterId === 'otter' ? 0.0022 : 0.0023,
    16,
    14
  );
  if (characterId === 'shiba' || characterId === 'panda') {
    skullGeo.scale(1.10, 0.96, 1.02); // Chubby cheeks!
  } else if (characterId === 'otter') {
    skullGeo.scale(1.08, 0.90, 1.12); // Streamlined otter skull
  } else if (characterId === 'retriever') {
    skullGeo.scale(1.02, 1.02, 1.06); // Friendly canine skull
  } else {
    skullGeo.scale(1.05, 0.98, 1.0); // Cat
  }
  const skull = new THREE.Mesh(skullGeo, mats.primary);
  headGroup.add(skull);

  // Species Facial Masks & Cheeks
  if (characterId === 'siamese') {
    // Diamond Seal-point mask
    const maskGeo = new THREE.SphereGeometry(0.0020, 14, 12);
    maskGeo.scale(0.85, 0.78, 0.65);
    const faceMask = new THREE.Mesh(maskGeo, mats.secondary);
    faceMask.position.set(0, -0.0002, 0.0010);
    headGroup.add(faceMask);
  } else if (characterId === 'shiba') {
    // Chubby White Urajiro Cheeks (Left & Right)
    for (const cx of [-0.00095, 0.00095]) {
      const cheek = new THREE.Mesh(
        new THREE.SphereGeometry(0.0012, 10, 10),
        mats.secondary
      );
      cheek.scale.set(0.9, 0.85, 0.8);
      cheek.position.set(cx, -0.0005, 0.0014);
      headGroup.add(cheek);
    }
  } else if (characterId === 'otter') {
    // Cream Throat & Chubby Muzzle Pad
    const muzzleBuff = new THREE.Mesh(
      new THREE.SphereGeometry(0.0014, 12, 10),
      mats.secondary
    );
    muzzleBuff.scale.set(1.15, 0.75, 0.85);
    muzzleBuff.position.set(0, -0.0006, 0.0014);
    headGroup.add(muzzleBuff);
  } else if (characterId === 'retriever') {
    // Golden-cream muzzle
    const muzzleRet = new THREE.Mesh(
      new THREE.SphereGeometry(0.0013, 12, 10),
      mats.secondary
    );
    muzzleRet.scale.set(0.95, 0.85, 1.05);
    muzzleRet.position.set(0, -0.0005, 0.0015);
    headGroup.add(muzzleRet);
  } else if (characterId === 'panda') {
    // White muzzle
    const pandaMuzzle = new THREE.Mesh(
      new THREE.SphereGeometry(0.0012, 10, 10),
      mats.primary
    );
    pandaMuzzle.scale.set(1.0, 0.8, 0.85);
    pandaMuzzle.position.set(0, -0.0006, 0.0016);
    headGroup.add(pandaMuzzle);

    // Iconic Black Panda Eye Patches (oval, tilted outwards)
    for (const [px, rotZ] of [[-0.00095, 0.35], [0.00095, -0.35]]) {
      const patch = new THREE.Mesh(
        new THREE.SphereGeometry(0.00095, 10, 10),
        mats.secondary
      );
      patch.scale.set(0.85, 1.15, 0.45);
      patch.position.set(px, 0.0003, 0.0018);
      patch.rotation.z = rotZ;
      headGroup.add(patch);
    }
  }

  // Muzzle Pads & Nose
  const noseMesh = new THREE.Mesh(
    new THREE.SphereGeometry(
      characterId === 'retriever' || characterId === 'shiba' ? 0.00045 : 0.00035,
      8,
      8
    ),
    mats.nose
  );
  noseMesh.scale.set(1.2, 0.85, 1.0);
  noseMesh.position.set(0, -0.0003, characterId === 'otter' ? 0.0022 : 0.0024);
  headGroup.add(noseMesh);

  // Smiling mouth & tongue for happy dogs!
  let tongueMesh = null;
  if (characterId === 'shiba' || characterId === 'retriever') {
    const mouthCut = new THREE.Mesh(
      new THREE.BoxGeometry(0.0009, 0.00035, 0.0006),
      mats.pupil
    );
    mouthCut.position.set(0, -0.0009, 0.0021);
    headGroup.add(mouthCut);

    tongueMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.0006, 0.0003, 0.0008),
      mats.tongue
    );
    tongueMesh.position.set(0, -0.0010, 0.0024);
    tongueMesh.rotation.x = 0.35;
    headGroup.add(tongueMesh);
  }

  // Eyes (Striking, species-appropriate)
  for (const ex of [-0.00095, 0.00095]) {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(ex, 0.00035, 0.00195);
    eyeGroup.rotation.y = ex > 0 ? 0.20 : -0.20;

    const eyeRadius = characterId === 'otter' || characterId === 'retriever' ? 0.00068 : 0.00062;
    const eyeBall = new THREE.Mesh(
      new THREE.SphereGeometry(eyeRadius, 10, 8),
      mats.eye
    );
    eyeBall.scale.set(1.05, 0.95, 0.55);
    eyeGroup.add(eyeBall);

    // Pupil: Slit for cat, round for dogs/otter/panda
    if (characterId === 'siamese') {
      const pupil = new THREE.Mesh(
        new THREE.BoxGeometry(0.00015, 0.0008, 0.0002),
        mats.pupil
      );
      pupil.position.set(0, 0, 0.00038);
      eyeGroup.add(pupil);
    } else {
      const pupil = new THREE.Mesh(
        new THREE.SphereGeometry(0.00035, 6, 6),
        mats.pupil
      );
      pupil.position.set(0, 0, 0.00032);
      eyeGroup.add(pupil);
    }

    // Cute white glint / twinkle
    const glint = new THREE.Mesh(
      new THREE.PlaneGeometry(0.00020, 0.00020),
      mats.whisker
    );
    glint.position.set(ex > 0 ? 0.00020 : -0.00020, 0.00020, 0.00040);
    eyeGroup.add(glint);

    headGroup.add(eyeGroup);
  }

  // Shiba White Eyebrow Dots ("마로눈썹")
  if (characterId === 'shiba') {
    for (const bx of [-0.00085, 0.00085]) {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.00038, 8, 8),
        mats.secondary
      );
      dot.scale.set(1.0, 0.8, 0.35);
      dot.position.set(bx, 0.00115, 0.0019);
      headGroup.add(dot);
    }
  }

  // Whiskers (for cat, otter)
  if (characterId === 'siamese' || characterId === 'otter') {
    for (const side of [-1, 1]) {
      for (let w = -1; w <= 1; w++) {
        const whisker = new THREE.Mesh(
          new THREE.PlaneGeometry(characterId === 'otter' ? 0.0016 : 0.0022, 0.00012),
          mats.whisker
        );
        whisker.position.set(side * 0.0016, -0.00045 + w * 0.00025, 0.0020);
        whisker.rotation.z = side * (0.08 + w * 0.14);
        whisker.rotation.y = -side * 0.35;
        headGroup.add(whisker);
      }
    }
  }

  // -------------------------------------------------------------------------
  // 6. DISTINCTIVE EARS WITH PER-SPECIES PHYSICS
  // -------------------------------------------------------------------------
  const earL = new THREE.Group();
  earL.name = 'DriverEarL';
  const earR = new THREE.Group();
  earR.name = 'DriverEarR';

  if (characterId === 'shiba') {
    // Upright triangular perky ears
    for (const [earNode, sideSign] of [[earL, -1], [earR, 1]]) {
      earNode.position.set(sideSign * 0.00135, 0.0019, 0.0002);
      earNode.rotation.z = sideSign * 0.22;
      earNode.rotation.y = sideSign * -0.12;

      const outer = new THREE.Mesh(
        new THREE.ConeGeometry(0.00095, 0.0019, 5),
        mats.primary
      );
      outer.scale.set(0.75, 1.0, 1.1);
      outer.position.set(0, 0.0008, 0);
      earNode.add(outer);

      const inner = new THREE.Mesh(
        new THREE.ConeGeometry(0.00065, 0.0014, 4),
        mats.secondary
      );
      inner.scale.set(0.55, 1.0, 0.85);
      inner.position.set(0, 0.0007, 0.00022);
      earNode.add(inner);
      headGroup.add(earNode);
    }
  } else if (characterId === 'otter') {
    // Tiny cute rounded shell ears
    for (const [earNode, sideSign] of [[earL, -1], [earR, 1]]) {
      earNode.position.set(sideSign * 0.0019, 0.0008, -0.0002);
      earNode.rotation.z = sideSign * 0.55;
      earNode.rotation.y = sideSign * -0.35;

      const shell = new THREE.Mesh(
        new THREE.SphereGeometry(0.00055, 8, 8),
        mats.primary
      );
      shell.scale.set(0.65, 1.1, 0.85);
      earNode.add(shell);

      const shellIn = new THREE.Mesh(
        new THREE.SphereGeometry(0.00035, 6, 6),
        mats.innerEar
      );
      shellIn.position.set(0, 0, 0.00015);
      earNode.add(shellIn);
      headGroup.add(earNode);
    }
  } else if (characterId === 'retriever') {
    // Large floppy puppy ears drooping down the sides
    for (const [earNode, sideSign] of [[earL, -1], [earR, 1]]) {
      earNode.position.set(sideSign * 0.0016, 0.0012, -0.0002);
      earNode.rotation.z = sideSign * -0.15;

      const flap = new THREE.Mesh(
        new THREE.ConeGeometry(0.0010, 0.0034, 7),
        mats.primary
      );
      flap.rotation.x = Math.PI; // Drooping down!
      flap.rotation.z = sideSign * 0.25;
      flap.scale.set(1.15, 1.0, 0.55);
      flap.position.set(sideSign * 0.0006, -0.0012, 0.0002);
      earNode.add(flap);
      headGroup.add(earNode);
    }
  } else if (characterId === 'panda') {
    // Round black button ears
    for (const [earNode, sideSign] of [[earL, -1], [earR, 1]]) {
      earNode.position.set(sideSign * 0.0016, 0.0019, -0.0002);

      const roundEar = new THREE.Mesh(
        new THREE.SphereGeometry(0.00085, 10, 10),
        mats.secondary // Black
      );
      roundEar.scale.set(1.0, 1.0, 0.65);
      earNode.add(roundEar);
      headGroup.add(earNode);
    }
  } else {
    // Siamese Cat: Pointed ears
    for (const [earNode, sideSign] of [[earL, -1], [earR, 1]]) {
      earNode.position.set(sideSign * 0.00135, 0.00185, 0.0002);
      earNode.rotation.z = sideSign * 0.28;
      earNode.rotation.y = sideSign * -0.15;

      const earOuter = new THREE.Mesh(
        new THREE.ConeGeometry(0.00095, 0.0021, 5),
        mats.secondary
      );
      earOuter.scale.set(0.65, 1.0, 1.15);
      earOuter.position.set(0, 0.0008, 0);
      earNode.add(earOuter);

      const earInner = new THREE.Mesh(
        new THREE.ConeGeometry(0.00065, 0.0015, 4),
        mats.innerEar
      );
      earInner.scale.set(0.45, 1.0, 0.9);
      earInner.position.set(0, 0.0007, 0.00025);
      earNode.add(earInner);
      headGroup.add(earNode);
    }
  }

  // -------------------------------------------------------------------------
  // 7. ACCESSORIES
  // -------------------------------------------------------------------------
  if (characterId === 'siamese') {
    // Vintage Brass Racing Goggles
    const gogglesGroup = new THREE.Group();
    gogglesGroup.position.set(0, 0.0012, 0.0012);
    gogglesGroup.rotation.x = -0.42;

    const strap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0024, 0.0024, 0.00042, 14, 1, true),
      mats.secondary
    );
    strap.rotation.x = Math.PI / 2;
    gogglesGroup.add(strap);

    for (const gx of [-0.00115, 0.00115]) {
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(0.00085, 0.00022, 8, 14),
        mats.accessory
      );
      rim.position.set(gx, 0, 0.0021);
      gogglesGroup.add(rim);

      const lens = new THREE.Mesh(
        new THREE.CircleGeometry(0.00075, 12),
        mats.accessoryAccent
      );
      lens.position.set(gx, 0, 0.0021);
      gogglesGroup.add(lens);
    }
    headGroup.add(gogglesGroup);
  } else if (characterId === 'otter') {
    // Cute Cyan Dive Goggles on forehead
    const otterGoggles = new THREE.Group();
    otterGoggles.position.set(0, 0.0012, 0.0013);
    otterGoggles.rotation.x = -0.35;

    const oStrap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0023, 0.0023, 0.00040, 14, 1, true),
      mats.accessory
    );
    oStrap.rotation.x = Math.PI / 2;
    otterGoggles.add(oStrap);

    for (const gx of [-0.00105, 0.00105]) {
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(0.00080, 0.00020, 8, 14),
        mats.accessory
      );
      rim.position.set(gx, 0, 0.0020);
      otterGoggles.add(rim);

      const lens = new THREE.Mesh(
        new THREE.CircleGeometry(0.00070, 10),
        mats.accessoryAccent
      );
      lens.position.set(gx, 0, 0.0020);
      otterGoggles.add(lens);
    }
    headGroup.add(otterGoggles);
  } else if (characterId === 'panda') {
    // Green Bamboo Leaf tucked in ear
    const leaf = new THREE.Mesh(
      new THREE.ConeGeometry(0.0008, 0.0024, 4),
      mats.accessory
    );
    leaf.scale.set(1.4, 1.0, 0.25);
    leaf.position.set(0.0016, 0.0022, 0.0008);
    leaf.rotation.z = -0.75;
    leaf.rotation.x = 0.35;
    headGroup.add(leaf);
  }

  driverRoot.add(headGroup);

  // -------------------------------------------------------------------------
  // 8. UPDATE ANIMATION FUNCTION (60FPS Dynamic Physics & Expression)
  // -------------------------------------------------------------------------
  function update(dt, speed = 0.0, steerAngle = 0.0, elapsedTime = 0.0) {
    // 1. Dynamic Head Lean & Turn into corners
    const targetTurnY = steerAngle * 0.65;
    const targetTiltZ = -steerAngle * 0.45;
    headGroup.rotation.y = THREE.MathUtils.lerp(
      headGroup.rotation.y,
      targetTurnY,
      Math.min(1, dt * 14)
    );
    headGroup.rotation.z = THREE.MathUtils.lerp(
      headGroup.rotation.z,
      targetTiltZ,
      Math.min(1, dt * 12)
    );

    const speedRatio = THREE.MathUtils.clamp(Math.abs(speed) / 0.22, 0.0, 1.0);

    // 2. Ear Physics (Floppy vs Perky vs Bouncing)
    if (characterId === 'retriever') {
      // Golden Retriever floppy ears lift and flap back dramatically with speed!
      const flapWave = Math.sin(elapsedTime * 22.0) * speedRatio * 0.18;
      const liftBack = speedRatio * 0.55;
      earL.rotation.x = liftBack + flapWave;
      earR.rotation.x = liftBack - flapWave;
      earL.rotation.y = speedRatio * -0.22 - steerAngle * 0.35;
      earR.rotation.y = speedRatio * 0.22 - steerAngle * 0.35;
    } else if (characterId === 'shiba' || characterId === 'siamese') {
      // Perky ear twitches and aero pinning
      const twitchA = Math.sin(elapsedTime * 9.0) * 0.05 * (1.0 - speedRatio);
      const twitchB = Math.cos(elapsedTime * 11.5) * 0.05 * (1.0 - speedRatio);
      earL.rotation.x = -speedRatio * 0.18 + twitchA;
      earR.rotation.x = -speedRatio * 0.18 + twitchB;
    } else if (characterId === 'panda') {
      // Panda ears bounce gently with kart vibration
      const bounce = Math.sin(elapsedTime * 16.0) * 0.06 * speedRatio;
      earL.rotation.z = bounce;
      earR.rotation.z = -bounce;
    } else if (characterId === 'otter') {
      // Streamlined otter ears pin back slightly in wind
      earL.rotation.y = -0.35 - speedRatio * 0.20;
      earR.rotation.y = 0.35 + speedRatio * 0.20;
    }

    // 3. Tail Physics (Species-Specific Kinematics)
    if (characterId === 'retriever') {
      // Fast joyful tail wagging!
      const wagFreq = 16.0 + speedRatio * 14.0;
      const wagAngle = Math.sin(elapsedTime * wagFreq) * 0.42;
      tailRoot.rotation.y = wagAngle;
    } else if (characterId === 'shiba') {
      // High-frequency doughnut tail wiggle
      const shibaWiggle = Math.sin(elapsedTime * 12.0) * (0.12 + speedRatio * 0.20);
      tailRoot.rotation.y = shibaWiggle;
    } else if (characterId === 'otter') {
      // Smooth hydrodynamic rudder sway
      const otterSway =
        Math.sin(elapsedTime * 7.0 + speed * 10.0) * 0.22 - steerAngle * 0.45;
      tailRoot.rotation.y = THREE.MathUtils.lerp(
        tailRoot.rotation.y,
        otterSway,
        Math.min(1, dt * 10)
      );
    } else if (characterId === 'panda') {
      // Small cotton ball bob
      const pandaBob = Math.sin(elapsedTime * 14.0) * 0.08 * speedRatio;
      tailRoot.rotation.x = pandaBob;
    } else {
      // Siamese cat swish
      const tailSwish =
        Math.sin(elapsedTime * 6.5 + speed * 15.0) * (0.15 + speedRatio * 0.28) -
        steerAngle * 0.55;
      tailRoot.rotation.y = THREE.MathUtils.lerp(
        tailRoot.rotation.y,
        tailSwish,
        Math.min(1, dt * 10)
      );
    }

    // 4. Tongue bobble for happy dogs
    if (tongueMesh) {
      tongueMesh.rotation.x = 0.35 + Math.sin(elapsedTime * 18.0) * 0.08 * (0.4 + speedRatio * 0.6);
    }
  }

  return {
    root: driverRoot,
    headGroup,
    earL,
    earR,
    tailRoot,
    update,
    characterId,
  };
}
