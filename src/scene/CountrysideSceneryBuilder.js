import * as THREE from 'three';

/**
 * Builds handcrafted miniature countryside scenery (rustic wooden fences,
 * miniature model pine & deciduous trees, wildflower bushes, golden hay bales,
 * cute wooden milestones, and a rustic red-roof cottage) for the Country Meadow circuit.
 * Designed to evoke a charming pastoral miniature HO-scale landscape on the desk.
 */
export function buildCountrysideScenery(splineData) {
  const sceneryGroup = new THREE.Group();
  sceneryGroup.name = 'CountrysideSceneryGroup';

  const samples = splineData.samples;
  const N = samples.length;
  if (!samples || N === 0) return sceneryGroup;

  // -------------------------------------------------------------------------
  // SHARED MATERIALS (Warm Rustic Natural Palette)
  // -------------------------------------------------------------------------
  const darkWoodMat = new THREE.MeshStandardMaterial({
    color: 0x5a3825,
    roughness: 0.88,
    metalness: 0.05,
  });

  const lightWoodMat = new THREE.MeshStandardMaterial({
    color: 0x8d5b38,
    roughness: 0.82,
    metalness: 0.04,
  });

  const pineDarkMat = new THREE.MeshStandardMaterial({
    color: 0x1d4d2b,
    roughness: 0.85,
    metalness: 0.0,
  });

  const pineMedMat = new THREE.MeshStandardMaterial({
    color: 0x2e6b3c,
    roughness: 0.82,
    metalness: 0.0,
  });

  const meadowLeafMat = new THREE.MeshStandardMaterial({
    color: 0x488a38,
    roughness: 0.78,
    metalness: 0.0,
  });

  const autumnGoldMat = new THREE.MeshStandardMaterial({
    color: 0xd49b35,
    roughness: 0.80,
    metalness: 0.0,
  });

  const hayBaleMat = new THREE.MeshStandardMaterial({
    color: 0xcca052,
    roughness: 0.92,
    metalness: 0.0,
  });

  const hayTieMat = new THREE.MeshStandardMaterial({
    color: 0x4a321a,
    roughness: 0.90,
  });

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x8a8e94,
    roughness: 0.90,
    metalness: 0.1,
  });

  const cottageWallMat = new THREE.MeshStandardMaterial({
    color: 0xd8c8b0,
    roughness: 0.86,
    metalness: 0.05,
  });

  const cottageRoofMat = new THREE.MeshStandardMaterial({
    color: 0xa8382c, // Country barn terra cotta red
    roughness: 0.70,
    metalness: 0.1,
  });

  const cottageWindowMat = new THREE.MeshStandardMaterial({
    color: 0xffe890,
    emissive: new THREE.Color(0xffd060),
    emissiveIntensity: 0.65,
    roughness: 0.3,
  });

  // Helper to find underlying desk/surface elevation at any (x, z)
  function getSurfaceElevation(x, z) {
    if (x < -0.23 && x > -0.49 && z < 0.04 && z > -0.18) {
      return 0.005; // Around laptop base
    }
    if (x > 0.155 && x < 0.495 && z > 0.002 && z < 0.268) {
      return 0.003; // Mouse pad
    }
    return 0.0; // Desk surface
  }

  // -------------------------------------------------------------------------
  // 1. RUSTIC POST-AND-RAIL WOODEN FENCES ALONG SCENIC ROAD CURVES
  // -------------------------------------------------------------------------
  const fenceGroup = new THREE.Group();
  fenceGroup.name = 'CountryWoodenFences';

  const fencePostGeo = new THREE.CylinderGeometry(0.00075, 0.00085, 0.0085, 6);
  const fenceRailGeo = new THREE.CylinderGeometry(0.00045, 0.00045, 1.0, 5);

  // Define segments along the spline where fences line the roadside
  // Sectors 2, 3, and 5 bends (indices around [80..220], [280..380], [480..580])
  const fenceRanges = [
    { start: 70, end: 230, step: 12, side: 1, offset: 0.017 },
    { start: 260, end: 410, step: 13, side: 1, offset: 0.018 },
    { start: 470, end: 600, step: 12, side: 1, offset: 0.017 },
    { start: 630, end: 710, step: 14, side: -1, offset: 0.017 },
  ];

  for (const range of fenceRanges) {
    const postPositions = [];

    for (let i = range.start; i <= range.end; i += range.step) {
      const idx = i % N;
      const s = samples[idx];
      const p = new THREE.Vector3(...s.position);
      const r = new THREE.Vector3(...s.right);

      const postPos = p.clone().addScaledVector(r, range.side * range.offset);
      const groundY = getSurfaceElevation(postPos.x, postPos.z);
      // Place post on the ground or matching road height
      const postBaseY = Math.min(postPos.y - 0.002, Math.max(groundY, postPos.y - 0.004));
      postPos.y = postBaseY + 0.0042; // Center of post

      const postMesh = new THREE.Mesh(fencePostGeo, darkWoodMat);
      postMesh.position.copy(postPos);
      // Slight natural tilt for rustic feel
      postMesh.rotation.z = (Math.sin(i * 1.7) * 0.06);
      postMesh.rotation.x = (Math.cos(i * 2.1) * 0.06);
      postMesh.castShadow = true;
      fenceGroup.add(postMesh);

      postPositions.push(postPos);
    }

    // Connect posts with two horizontal split rails
    for (let j = 0; j < postPositions.length - 1; j++) {
      const pA = postPositions[j];
      const pB = postPositions[j + 1];
      const dir = new THREE.Vector3().subVectors(pB, pA);
      const len = dir.length();
      if (len > 0.05 || len < 0.005) continue; // Avoid jumps

      const mid = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
      const rot = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.clone().normalize()
      );

      // Top rail
      const railTop = new THREE.Mesh(fenceRailGeo, lightWoodMat);
      railTop.scale.set(1, len, 1);
      railTop.position.copy(mid).add(new THREE.Vector3(0, 0.0016, 0));
      railTop.quaternion.copy(rot);
      railTop.castShadow = true;
      fenceGroup.add(railTop);

      // Bottom rail
      const railBot = new THREE.Mesh(fenceRailGeo, lightWoodMat);
      railBot.scale.set(1, len, 1);
      railBot.position.copy(mid).add(new THREE.Vector3(0, -0.0016, 0));
      railBot.quaternion.copy(rot);
      railBot.castShadow = true;
      fenceGroup.add(railBot);
    }
  }

  sceneryGroup.add(fenceGroup);

  // -------------------------------------------------------------------------
  // 2. MINIATURE PINE & DECIDUOUS TREES ALONG THE COUNTRYSIDE
  // -------------------------------------------------------------------------
  const treeGroup = new THREE.Group();
  treeGroup.name = 'CountryMiniTrees';

  const trunkGeo = new THREE.CylinderGeometry(0.0009, 0.0013, 0.016, 6);
  const pineConeGeo1 = new THREE.ConeGeometry(0.0068, 0.011, 7);
  const pineConeGeo2 = new THREE.ConeGeometry(0.0052, 0.009, 7);
  const pineConeGeo3 = new THREE.ConeGeometry(0.0036, 0.007, 7);

  const leafSphereGeo1 = new THREE.SphereGeometry(0.0062, 7, 6);
  const leafSphereGeo2 = new THREE.SphereGeometry(0.0048, 7, 6);

  // Tree locations defined relative to spline samples with scenic offsets
  const treeSpecs = [
    // Sector 1: Near Start Line
    { sampleIdx: 30, side: 1, dist: 0.026, type: 'pine', scale: 1.1 },
    { sampleIdx: 50, side: -1, dist: 0.024, type: 'deciduous', scale: 0.95 },

    // Sector 2: Meadow Hillock
    { sampleIdx: 95, side: 1, dist: 0.028, type: 'pine', scale: 1.25 },
    { sampleIdx: 130, side: 1, dist: 0.026, type: 'autumn', scale: 1.0 },
    { sampleIdx: 160, side: 1, dist: 0.030, type: 'pine', scale: 1.3 },
    { sampleIdx: 190, side: 1, dist: 0.025, type: 'deciduous', scale: 1.1 },

    // Sector 3: Pasture corner (dense tree copse)
    { sampleIdx: 250, side: 1, dist: 0.028, type: 'pine', scale: 1.35 },
    { sampleIdx: 275, side: 1, dist: 0.034, type: 'pine', scale: 1.2 },
    { sampleIdx: 305, side: 1, dist: 0.026, type: 'autumn', scale: 1.15 },
    { sampleIdx: 330, side: 1, dist: 0.032, type: 'deciduous', scale: 1.25 },
    { sampleIdx: 360, side: 1, dist: 0.027, type: 'pine', scale: 1.4 },

    // Sector 4: Creek bend
    { sampleIdx: 410, side: 1, dist: 0.025, type: 'deciduous', scale: 1.05 },
    { sampleIdx: 445, side: 1, dist: 0.028, type: 'pine', scale: 1.15 },
    { sampleIdx: 475, side: 1, dist: 0.026, type: 'pine', scale: 1.2 },

    // Sector 5: Village bypass
    { sampleIdx: 510, side: 1, dist: 0.027, type: 'autumn', scale: 1.0 },
    { sampleIdx: 540, side: 1, dist: 0.025, type: 'pine', scale: 1.25 },
    { sampleIdx: 575, side: 1, dist: 0.028, type: 'deciduous', scale: 1.1 },

    // Sector 6: Return to village
    { sampleIdx: 640, side: 1, dist: 0.025, type: 'pine', scale: 1.1 },
    { sampleIdx: 680, side: -1, dist: 0.024, type: 'deciduous', scale: 1.0 },
  ];

  for (const spec of treeSpecs) {
    const s = samples[spec.sampleIdx % N];
    const p = new THREE.Vector3(...s.position);
    const r = new THREE.Vector3(...s.right);

    const rootPos = p.clone().addScaledVector(r, spec.side * spec.dist);
    const groundY = getSurfaceElevation(rootPos.x, rootPos.z);
    rootPos.y = groundY;

    const singleTree = new THREE.Group();
    singleTree.position.copy(rootPos);
    singleTree.scale.setScalar(spec.scale);

    // Trunk
    const trunk = new THREE.Mesh(trunkGeo, darkWoodMat);
    trunk.position.set(0, 0.008, 0);
    trunk.castShadow = true;
    singleTree.add(trunk);

    if (spec.type === 'pine') {
      const mat = spec.sampleIdx % 2 === 0 ? pineDarkMat : pineMedMat;
      const c1 = new THREE.Mesh(pineConeGeo1, mat);
      c1.position.set(0, 0.014, 0);
      c1.castShadow = true;

      const c2 = new THREE.Mesh(pineConeGeo2, mat);
      c2.position.set(0, 0.019, 0);
      c2.castShadow = true;

      const c3 = new THREE.Mesh(pineConeGeo3, mat);
      c3.position.set(0, 0.024, 0);
      c3.castShadow = true;

      singleTree.add(c1, c2, c3);
    } else {
      const mat = spec.type === 'autumn' ? autumnGoldMat : meadowLeafMat;
      const sphere1 = new THREE.Mesh(leafSphereGeo1, mat);
      sphere1.position.set(0, 0.018, 0);
      sphere1.castShadow = true;

      const sphere2 = new THREE.Mesh(leafSphereGeo2, mat);
      sphere2.position.set(0.0018, 0.022, 0.0012);
      sphere2.castShadow = true;

      singleTree.add(sphere1, sphere2);
    }

    treeGroup.add(singleTree);
  }

  sceneryGroup.add(treeGroup);

  // -------------------------------------------------------------------------
  // 3. GOLDEN HAY BALES (Stacked in Pasture & roadside clearings)
  // -------------------------------------------------------------------------
  const hayGroup = new THREE.Group();
  hayGroup.name = 'CountryHayBales';

  const baleGeo = new THREE.CylinderGeometry(0.0032, 0.0032, 0.0058, 10);
  baleGeo.rotateZ(Math.PI / 2);

  const tieGeo = new THREE.TorusGeometry(0.0033, 0.00022, 6, 12);
  tieGeo.rotateY(Math.PI / 2);

  function createHayBale(x, y, z, yawDeg = 0) {
    const bale = new THREE.Group();
    bale.position.set(x, y, z);
    bale.rotation.y = THREE.MathUtils.degToRad(yawDeg);

    const body = new THREE.Mesh(baleGeo, hayBaleMat);
    body.castShadow = true;
    bale.add(body);

    const tie1 = new THREE.Mesh(tieGeo, hayTieMat);
    tie1.position.set(-0.0016, 0, 0);
    const tie2 = new THREE.Mesh(tieGeo, hayTieMat);
    tie2.position.set(0.0016, 0, 0);
    bale.add(tie1, tie2);

    return bale;
  }

  // Hay bale cluster 1: Pasture Sector 3 near trees (X: -0.34, Z: -0.19)
  const gY1 = getSurfaceElevation(-0.34, -0.19);
  hayGroup.add(createHayBale(-0.338, gY1 + 0.0032, -0.188, 15));
  hayGroup.add(createHayBale(-0.332, gY1 + 0.0032, -0.194, 25));
  hayGroup.add(createHayBale(-0.335, gY1 + 0.0088, -0.191, 18)); // Stacked on top!

  // Hay bale cluster 2: Sector 5 clearing (X: 0.41, Z: 0.12)
  const gY2 = getSurfaceElevation(0.41, 0.12);
  hayGroup.add(createHayBale(0.412, gY2 + 0.0032, 0.118, -40));
  hayGroup.add(createHayBale(0.418, gY2 + 0.0032, 0.124, -32));

  // Hay bale cluster 3: Near Start/Finish in Sector 1 (X: -0.18, Z: 0.26)
  const gY3 = getSurfaceElevation(-0.18, 0.26);
  hayGroup.add(createHayBale(-0.178, gY3 + 0.0032, 0.258, 6));
  hayGroup.add(createHayBale(-0.184, gY3 + 0.0032, 0.264, 12));

  sceneryGroup.add(hayGroup);

  // -------------------------------------------------------------------------
  // 4. MINIATURE RUSTIC RED-ROOF COTTAGE & FLOWER GARDEN
  // -------------------------------------------------------------------------
  const cottageGroup = new THREE.Group();
  cottageGroup.name = 'CountryMiniCottage';
  cottageGroup.position.set(-0.38, getSurfaceElevation(-0.38, -0.13), -0.13);
  cottageGroup.rotation.y = THREE.MathUtils.degToRad(35);

  // Cottage main body
  const cottageBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.018, 0.012, 0.014),
    cottageWallMat
  );
  cottageBody.position.set(0, 0.006, 0);
  cottageBody.castShadow = true;
  cottageGroup.add(cottageBody);

  // Gable roof
  const roofGeo = new THREE.ConeGeometry(0.0135, 0.0085, 4);
  roofGeo.rotateY(Math.PI / 4);
  const cottageRoof = new THREE.Mesh(roofGeo, cottageRoofMat);
  cottageRoof.position.set(0, 0.0155, 0);
  cottageRoof.scale.set(1.15, 1.0, 0.95);
  cottageRoof.castShadow = true;
  cottageGroup.add(cottageRoof);

  // Chimney
  const chimney = new THREE.Mesh(
    new THREE.BoxGeometry(0.0022, 0.006, 0.0022),
    stoneMat
  );
  chimney.position.set(0.0045, 0.017, 0.002);
  chimney.castShadow = true;
  cottageGroup.add(chimney);

  // Warm glowing cottage window
  const window1 = new THREE.Mesh(
    new THREE.PlaneGeometry(0.0035, 0.0035),
    cottageWindowMat
  );
  window1.position.set(0, 0.0065, 0.0071);
  cottageGroup.add(window1);

  // Door
  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(0.0032, 0.006),
    darkWoodMat
  );
  door.position.set(-0.005, 0.004, 0.0071);
  cottageGroup.add(door);

  sceneryGroup.add(cottageGroup);

  // -------------------------------------------------------------------------
  // 5. WOODEN ROADSIDE SIGNPOST ("MEADOW WAY 🌾") & STONE MILESTONES
  // -------------------------------------------------------------------------
  const signsGroup = new THREE.Group();
  signsGroup.name = 'CountryRoadSigns';

  // Start signpost
  const signpost = new THREE.Group();
  signpost.position.set(0.035, getSurfaceElevation(0.035, 0.255), 0.255);
  signpost.rotation.y = THREE.MathUtils.degToRad(-10);

  const signPostPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.0006, 0.0007, 0.012, 6),
    darkWoodMat
  );
  signPostPole.position.set(0, 0.006, 0);
  signPostPole.castShadow = true;
  signpost.add(signPostPole);

  const signBoard = new THREE.Mesh(
    new THREE.BoxGeometry(0.009, 0.0035, 0.0008),
    lightWoodMat
  );
  signBoard.position.set(0.002, 0.010, 0);
  signBoard.castShadow = true;
  signpost.add(signBoard);

  signsGroup.add(signpost);

  // Stone milestones at Sector 3 and Sector 5
  for (const stonePos of [
    { x: -0.22, z: -0.19, text: 'M1' },
    { x: 0.36, z: -0.06, text: 'M2' },
  ]) {
    const stone = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0016, 0.0022, 0.0045, 7),
      stoneMat
    );
    stone.position.set(stonePos.x, getSurfaceElevation(stonePos.x, stonePos.z) + 0.0022, stonePos.z);
    stone.castShadow = true;
    signsGroup.add(stone);
  }

  sceneryGroup.add(signsGroup);

  return sceneryGroup;
}
