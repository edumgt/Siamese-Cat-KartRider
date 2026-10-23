import * as THREE from 'three';
import { buildSiameseCatDriver } from './SiameseCatDriver.js';

/**
 * Builds the 1:87 Scale Holographic Ghost Car for Time-Trial Lap Replays.
 * Features:
 * - Semi-transparent ethereal cyan/ice-blue holographic body & driver
 * - Hologram pulse & scanline energy wave
 * - Under-chassis glowing holographic projection ring
 * - 4 spinning wheels & steerable front pivots
 * - GLB clone conversion support (transforms glb meshes into glowing transparent hologram)
 */
export function buildGhostKart() {
  const ghostRoot = new THREE.Group();
  ghostRoot.name = 'GhostKartRoot';
  ghostRoot.visible = false; // Hidden until ghost data is available

  const chassisGroup = new THREE.Group();
  chassisGroup.name = 'GhostChassisBody';
  ghostRoot.add(chassisGroup);

  // Holographic Siamese Cat Driver
  const ghostCatDriver = buildSiameseCatDriver({ isGhost: true });
  chassisGroup.add(ghostCatDriver.root);

  let currentOpacity = 0.52;
  const ghostMaterials = [];

  function registerMat(mat) {
    ghostMaterials.push(mat);
    return mat;
  }

  // 1. Holographic Materials
  const cyanHoloBodyMat = registerMat(
    new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x0088cc,
      emissiveIntensity: 0.65,
      roughness: 0.15,
      metalness: 0.6,
      transparent: true,
      opacity: currentOpacity,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  );

  const cyanAccentMat = registerMat(
    new THREE.MeshStandardMaterial({
      color: 0x80ffff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.95,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: currentOpacity * 1.15,
      depthWrite: false,
    })
  );

  const holoDarkMat = registerMat(
    new THREE.MeshStandardMaterial({
      color: 0x0c3044,
      emissive: 0x003355,
      emissiveIntensity: 0.5,
      roughness: 0.4,
      metalness: 0.4,
      transparent: true,
      opacity: currentOpacity * 0.9,
      depthWrite: false,
    })
  );

  const holoWheelMat = registerMat(
    new THREE.MeshStandardMaterial({
      color: 0x061e2c,
      emissive: 0x004d66,
      emissiveIntensity: 0.45,
      roughness: 0.35,
      metalness: 0.5,
      transparent: true,
      opacity: currentOpacity * 0.88,
      depthWrite: false,
    })
  );

  const holoRimMat = registerMat(
    new THREE.MeshStandardMaterial({
      color: 0x5ce6ff,
      emissive: 0x00bfff,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.85,
      transparent: true,
      opacity: currentOpacity * 1.05,
      depthWrite: false,
    })
  );

  const holoGlowVisorMat = registerMat(
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    })
  );

  // 2. Holographic Ground Projection Decal
  const projCanvas = document.createElement('canvas');
  projCanvas.width = 128;
  projCanvas.height = 128;
  const pCtx = projCanvas.getContext('2d');
  const pGrad = pCtx.createRadialGradient(64, 64, 8, 64, 64, 60);
  pGrad.addColorStop(0.0, 'rgba(0, 240, 255, 0.45)');
  pGrad.addColorStop(0.5, 'rgba(0, 200, 255, 0.20)');
  pGrad.addColorStop(0.85, 'rgba(0, 160, 255, 0.08)');
  pGrad.addColorStop(1.0, 'rgba(0, 100, 255, 0.0)');
  pCtx.fillStyle = pGrad;
  pCtx.beginPath();
  pCtx.arc(64, 64, 60, 0, Math.PI * 2);
  pCtx.fill();

  // Subtle cyan ring
  pCtx.strokeStyle = 'rgba(0, 255, 255, 0.55)';
  pCtx.lineWidth = 3;
  pCtx.beginPath();
  pCtx.arc(64, 64, 48, 0, Math.PI * 2);
  pCtx.stroke();

  const projTex = new THREE.CanvasTexture(projCanvas);
  const projQuad = new THREE.Mesh(
    new THREE.PlaneGeometry(0.022, 0.028),
    new THREE.MeshBasicMaterial({
      map: projTex,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  projQuad.rotation.x = -Math.PI / 2;
  projQuad.position.set(0, 0.0008, 0);
  ghostRoot.add(projQuad);

  // 3. Procedural Ghost Chassis Elements (Floorpan, Nose, Pods, Wing)
  const proceduralGroup = new THREE.Group();
  proceduralGroup.name = 'ProceduralGhostGroup';
  chassisGroup.add(proceduralGroup);

  const floorPan = new THREE.Mesh(
    new THREE.BoxGeometry(0.0082, 0.0009, 0.0155),
    holoDarkMat
  );
  floorPan.position.set(0, 0.0014, 0);
  proceduralGroup.add(floorPan);

  const noseCone = new THREE.Mesh(
    new THREE.BoxGeometry(0.0086, 0.0021, 0.0044),
    cyanHoloBodyMat
  );
  noseCone.position.set(0, 0.0023, 0.0068);
  noseCone.rotation.x = 0.22;
  proceduralGroup.add(noseCone);

  const nosePlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.0048, 0.0004, 0.0028),
    cyanAccentMat
  );
  nosePlate.position.set(0, 0.0033, 0.0066);
  nosePlate.rotation.x = 0.22;
  proceduralGroup.add(nosePlate);

  for (const sx of [-0.0044, 0.0044]) {
    const sidePod = new THREE.Mesh(
      new THREE.BoxGeometry(0.0024, 0.0024, 0.0076),
      cyanHoloBodyMat
    );
    sidePod.position.set(sx, 0.0024, -0.0004);
    proceduralGroup.add(sidePod);
  }

  const rearWing = new THREE.Mesh(
    new THREE.BoxGeometry(0.0096, 0.0007, 0.0024),
    cyanAccentMat
  );
  rearWing.position.set(0, 0.0068, -0.0076);
  rearWing.rotation.x = -0.18;
  proceduralGroup.add(rearWing);

  // Procedural Wheels
  const wheelMeshes = [];
  const frontPivots = [];
  const wheelPositions = [
    { x: -0.0058, y: 0.0024, z: 0.0052, isFront: true },
    { x: 0.0058, y: 0.0024, z: 0.0052, isFront: true },
    { x: -0.0058, y: 0.0028, z: -0.0054, isFront: false },
    { x: 0.0058, y: 0.0028, z: -0.0054, isFront: false },
  ];

  for (const wp of wheelPositions) {
    const wheelRadius = wp.isFront ? 0.0024 : 0.0028;
    const wheelWidth = wp.isFront ? 0.0018 : 0.0024;
    const tireGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 14);
    tireGeo.rotateZ(Math.PI / 2);

    const tireMesh = new THREE.Mesh(tireGeo, holoWheelMat);
    tireMesh.name = wp.isFront ? (wp.x < 0 ? 'GhostWheel_FL' : 'GhostWheel_FR') : (wp.x < 0 ? 'GhostWheel_RL' : 'GhostWheel_RR');

    const rimMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(wheelRadius * 0.58, wheelRadius * 0.58, wheelWidth * 1.05, 10),
      holoRimMat
    );
    rimMesh.rotateZ(Math.PI / 2);
    tireMesh.add(rimMesh);

    if (wp.isFront) {
      const pivot = new THREE.Group();
      pivot.position.set(wp.x, wp.y, wp.z);
      pivot.add(tireMesh);
      proceduralGroup.add(pivot);
      frontPivots.push(pivot);
    } else {
      tireMesh.position.set(wp.x, wp.y, wp.z);
      proceduralGroup.add(tireMesh);
    }
    wheelMeshes.push(tireMesh);
  }

  // 4. Update Wheels (Steering & Spin)
  function updateWheels(dt, speed, steerAngle) {
    const spinSpeed = (speed / 0.0026) * dt;
    for (const w of wheelMeshes) {
      w.rotation.x += spinSpeed;
    }
    for (const p of frontPivots) {
      p.rotation.y = steerAngle || 0;
    }
    ghostCatDriver.update(dt, speed, steerAngle, performance.now() * 0.001);
  }

  // 5. Update Visual Effects (Hologram pulse & ethereal flicker)
  function updateGhostVisuals(dt, elapsedTime, isVisible) {
    if (!isVisible) {
      ghostRoot.visible = false;
      return;
    }
    ghostRoot.visible = true;

    // Subtle sinusoidal hologram pulse (45% to 58% opacity)
    const pulse = Math.sin(elapsedTime * 4.5);
    const targetOpacity = currentOpacity * (0.88 + 0.16 * pulse);
    for (const m of ghostMaterials) {
      m.opacity = targetOpacity;
    }

    // Hologram projection disc slow rotation & breathing
    if (projQuad) {
      projQuad.rotation.z += dt * 0.8;
      const s = 1.0 + 0.08 * Math.sin(elapsedTime * 3.2);
      projQuad.scale.set(s, s, 1.0);
    }
  }

  // 6. Attach GLB Kart Clone for 1:1 Mesh Fidelity
  function attachGlbGhost(glbScene) {
    if (!glbScene) return;
    const clone = glbScene.clone(true);
    clone.name = 'GlbGhostKartClone';

    const glbAllWheels = [];
    const glbFrontWheels = [];

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        const cName = (child.name || '').toLowerCase();
        if (cName.includes('helmet') || cName.includes('driver') || cName.includes('head') || cName.includes('suit') || cName.includes('visor')) {
          child.visible = false;
          return;
        }

        const origMat = child.material;
        const isRimOrTrim =
          (child.name && (child.name.includes('rim') || child.name.includes('wing') || child.name.includes('stripe'))) ||
          (origMat && origMat.name && (origMat.name.includes('rim') || origMat.name.includes('stripe') || origMat.name.includes('white')));

        const isWheel =
          (child.name && (child.name.includes('wheel') || child.name.includes('tire') || child.name.includes('Wheel'))) ||
          (origMat && origMat.name && (origMat.name.includes('rubber') || origMat.name.includes('tire')));

        const targetMat = isWheel ? holoWheelMat : isRimOrTrim ? cyanAccentMat : cyanHoloBodyMat;
        child.material = targetMat;
      }

      if (child.name === 'Wheel_FL' || child.name === 'Wheel_FR') {
        glbFrontWheels.push(child);
        glbAllWheels.push(child);
      } else if (child.name === 'Wheel_RL' || child.name === 'Wheel_RR') {
        glbAllWheels.push(child);
      }
    });

    // Hide procedural meshes once GLB ghost is ready, keeping ghostCatDriver visible
    proceduralGroup.visible = false;
    ghostCatDriver.root.visible = true;
    chassisGroup.add(clone);

    if (glbAllWheels.length > 0) {
      wheelMeshes.push(...glbAllWheels);
    }
    if (glbFrontWheels.length > 0) {
      frontPivots.push(...glbFrontWheels);
    }
  }

  function setVisible(val) {
    ghostRoot.visible = Boolean(val);
  }

  function setOpacity(val) {
    currentOpacity = THREE.MathUtils.clamp(val, 0.1, 0.95);
    for (const m of ghostMaterials) {
      m.opacity = currentOpacity;
    }
  }

  return {
    ghostRoot,
    chassisGroup,
    updateWheels,
    updateGhostVisuals,
    attachGlbGhost,
    setVisible,
    setOpacity,
  };
}
