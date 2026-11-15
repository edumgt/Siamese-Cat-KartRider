import * as THREE from 'three';

function getGhostStorageKey(trackId) {
  return `desk_racer_ghost_${trackId || 'classic'}`;
}

function getReplayStorageKey(trackId) {
  return `desk_racer_replay_${trackId || 'classic'}`;
}

const LAP_RECORD_INTERVAL_SEC = 1 / 30; // 30Hz keyframe recording for Best Lap Ghost
const RUN_RECORD_INTERVAL_SEC = 1 / 25; // 25Hz keyframe recording for Full Race Replay
const MAX_RUN_FRAMES = 5400; // ~3.6 minutes at 25Hz

export function createGhostSystem(
  ghostKart,
  initialTrackLength = 3.8371,
  initialTrackId = 'classic'
) {
  let isGhostEnabled = true;
  let activeTrackId = initialTrackId;
  let totalTrackLength = initialTrackLength;

  // 1. Best single-lap ghost (persisted per track, runs live alongside player)
  let bestLapData = null; // { lapTime, date, vehicleMode, characterId, frames }
  let currentLapFrames = [];
  let lastLapRecordTime = -1;

  // 2. Full race / latest run coordinate recording (persisted per track, used for Race Replay viewer)
  let lastRunData = null; // { duration, lapCount, date, vehicleMode, characterId, frames }
  let currentRunFrames = [];
  let lastRunRecordTime = -1;
  let runStartTime = null;
  let activeRunVehicleMeta = { vehicleMode: 'kart', characterId: 'siamese' };

  // 3. Replay Playback Controller state
  const replay = {
    active: false,
    playing: true,
    source: 'run', // 'run' | 'best'
    currentTime: 0.0,
    duration: 0.0,
    playbackRate: 1.0,
    cursor: 0,
    vehicleMode: 'kart',
    characterId: 'siamese',
  };

  // Reusable Three.js math objects for zero-allocation runtime interpolation
  const _vPosA = new THREE.Vector3();
  const _vPosB = new THREE.Vector3();
  const _vGhostPos = new THREE.Vector3();
  const _qRotA = new THREE.Quaternion();
  const _qRotB = new THREE.Quaternion();
  const _qGhostRot = new THREE.Quaternion();

  // Pre-allocated replay physics-compatible state snapshot (zero GC per frame)
  const _replayTangent = new THREE.Vector3(0, 0, 1);
  const _replayNormal = new THREE.Vector3(0, 1, 0);
  const _replayRight = new THREE.Vector3(-1, 0, 0);
  const _replayStateOut = {
    position: new THREE.Vector3(),
    quaternion: new THREE.Quaternion(),
    tangent: _replayTangent,
    normal: _replayNormal,
    right: _replayRight,
    speed: 0.0,
    steerAngle: 0.0,
    steerInput: 0.0,
    s: 0.0,
    bankDeg: 0.0,
    downforceG: 1.0,
    isDrifting: false,
    driftDir: 0,
    driftAngle: 0.0,
    boostActive: 0.0,
    hopHeight: 0.0,
    railImpactActive: false,
    lapCount: 1,
    currentLapTime: 0.0,
    totalRaceTime: 0.0,
    autopilot: false,
    victoryCruise: false,
    raceFinished: false,
    countdownLocked: false,
    raceClockActive: false,
  };

  // State exposed to main & HUD
  let currentGhostPose = null;
  let currentDeltaSec = null;
  let ghostFinishedThisLap = false;

  let onRecordChangeCallback = null;
  let onReplayStateChangeCallback = null;

  function notifyReplayUi() {
    if (onReplayStateChangeCallback) {
      onReplayStateChangeCallback(getReplayStatus());
    }
  }

  function isValidRecording(parsed, timeField) {
    return (
      parsed &&
      typeof parsed[timeField] === 'number' &&
      parsed[timeField] > 0.4 &&
      Array.isArray(parsed.frames) &&
      parsed.frames.length >= 6
    );
  }

  function loadTrackDataFromStorage(trackId) {
    bestLapData = null;
    lastRunData = null;
    try {
      const rawGhost = localStorage.getItem(getGhostStorageKey(trackId));
      if (rawGhost) {
        const parsed = JSON.parse(rawGhost);
        if (isValidRecording(parsed, 'lapTime') && parsed.lapTime > 2.0) {
          bestLapData = parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load ghost lap from localStorage:', err);
    }

    try {
      const rawReplay = localStorage.getItem(getReplayStorageKey(trackId));
      if (rawReplay) {
        const parsed = JSON.parse(rawReplay);
        if (isValidRecording(parsed, 'duration')) {
          lastRunData = parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load race replay from localStorage:', err);
    }

    if (onRecordChangeCallback) {
      onRecordChangeCallback(bestLapData ? bestLapData.lapTime : null);
    }
  }

  loadTrackDataFromStorage(activeTrackId);

  function saveGhostToStorage() {
    if (!bestLapData) return;
    try {
      localStorage.setItem(getGhostStorageKey(activeTrackId), JSON.stringify(bestLapData));
    } catch (err) {
      console.warn('Failed to save ghost lap to localStorage:', err);
    }
  }

  function saveReplayToStorage() {
    if (!lastRunData || !lastRunData.frames || lastRunData.frames.length < 6) return;
    try {
      let payload = lastRunData;
      // If recording is very long, stride to <= 2200 frames for localStorage budget while keeping full memory copy
      if (payload.frames.length > 2200) {
        const step = Math.ceil(payload.frames.length / 2200);
        const compacted = [];
        for (let i = 0; i < payload.frames.length; i += step) {
          compacted.push(payload.frames[i]);
        }
        const lastFrame = payload.frames[payload.frames.length - 1];
        if (compacted[compacted.length - 1] !== lastFrame) {
          compacted.push(lastFrame);
        }
        payload = { ...payload, frames: compacted };
      }
      localStorage.setItem(getReplayStorageKey(activeTrackId), JSON.stringify(payload));
    } catch (err) {
      console.warn('Failed to save race replay to localStorage:', err);
    }
  }

  function buildFrameRecord(tVal, playerState, totalLen) {
    return {
      t: Number(tVal.toFixed(3)),
      p: [
        Number(playerState.position.x.toFixed(5)),
        Number(playerState.position.y.toFixed(5)),
        Number(playerState.position.z.toFixed(5)),
      ],
      q: [
        Number(playerState.quaternion.x.toFixed(4)),
        Number(playerState.quaternion.y.toFixed(4)),
        Number(playerState.quaternion.z.toFixed(4)),
        Number(playerState.quaternion.w.toFixed(4)),
      ],
      s: Number((playerState.steerAngle || 0).toFixed(3)),
      v: Number((playerState.speed || 0).toFixed(4)),
      d: Number((((playerState.s % totalLen) + totalLen) % totalLen).toFixed(4)),
      lap: Math.max(1, Math.min(3, playerState.lapCount || 1)),
      dr: playerState.isDrifting ? 1 : 0,
      bs: (playerState.boostActive || 0) > 0 ? 1 : 0,
      bk: Number((playerState.bankDeg || 0).toFixed(1)),
    };
  }

  function setTrack(newTrackId, newTotalLength) {
    if (replay.active) {
      stopReplay();
    }
    activeTrackId = newTrackId;
    if (newTotalLength) {
      totalTrackLength = newTotalLength;
    }
    currentLapFrames = [];
    currentRunFrames = [];
    lastLapRecordTime = -1;
    lastRunRecordTime = -1;
    runStartTime = null;
    currentGhostPose = null;
    currentDeltaSec = null;
    ghostFinishedThisLap = false;
    ghostKart.setVisible(false);
    loadTrackDataFromStorage(activeTrackId);
    return bestLapData ? bestLapData.lapTime : null;
  }

  function clearGhostRecord() {
    bestLapData = null;
    lastRunData = null;
    currentLapFrames = [];
    currentRunFrames = [];
    lastLapRecordTime = -1;
    lastRunRecordTime = -1;
    runStartTime = null;
    currentGhostPose = null;
    currentDeltaSec = null;
    try {
      localStorage.removeItem(getGhostStorageKey(activeTrackId));
      localStorage.removeItem(getReplayStorageKey(activeTrackId));
    } catch (_e) {}
    ghostKart.setVisible(false);
    if (replay.active) {
      stopReplay();
    }
    if (onRecordChangeCallback) {
      onRecordChangeCallback(null);
    }
  }

  function setGhostEnabled(val) {
    isGhostEnabled = Boolean(val);
    if (!isGhostEnabled && !replay.active) {
      ghostKart.setVisible(false);
      currentGhostPose = null;
      currentDeltaSec = null;
    }
  }

  function toggleGhostEnabled() {
    setGhostEnabled(!isGhostEnabled);
    return isGhostEnabled;
  }

  function resetCurrentLapRecording() {
    currentLapFrames = [];
    lastLapRecordTime = -1;
    ghostFinishedThisLap = false;
  }

  function resetFullRunRecording() {
    currentRunFrames = [];
    lastRunRecordTime = -1;
    runStartTime = null;
  }

  function resetAllRecordings() {
    resetCurrentLapRecording();
    resetFullRunRecording();
  }

  function snapshotCurrentRun(vehicleMeta = activeRunVehicleMeta) {
    if (currentRunFrames.length < 6) {
      return false;
    }
    const lastFrame = currentRunFrames[currentRunFrames.length - 1];
    const duration = lastFrame ? lastFrame.t : 0.0;
    if (duration < 0.4) {
      return false;
    }
    lastRunData = {
      duration: Number(duration.toFixed(3)),
      lapCount: lastFrame.lap || 1,
      date: Date.now(),
      vehicleMode: vehicleMeta?.vehicleMode || activeRunVehicleMeta.vehicleMode || 'kart',
      characterId: vehicleMeta?.characterId || activeRunVehicleMeta.characterId || 'siamese',
      frames: currentRunFrames.slice(),
    };
    saveReplayToStorage();
    return true;
  }

  // -------------------------------------------------------------------------
  // LIVE RECORDING + LIVE OPPONENT GHOST PLAYBACK (DURING NORMAL RACING)
  // -------------------------------------------------------------------------
  let liveReplayCursor = 0;

  function update(dt, elapsedTime, playerState, vehicleMeta) {
    if (replay.active) return;
    if (!playerState) return;

    if (vehicleMeta) {
      activeRunVehicleMeta = vehicleMeta;
    }

    const isManualRace =
      !playerState.autopilot &&
      !playerState.countdownLocked &&
      playerState.raceClockActive &&
      !playerState.raceFinished;

    const lapTime = playerState.currentLapTime || 0.0;
    const raceTime =
      playerState.totalRaceTime !== undefined ? playerState.totalRaceTime : lapTime;

    // Reset lap buffer when a new lap clock begins
    if (lapTime < 0.05 && currentLapFrames.length > 5) {
      resetCurrentLapRecording();
    }

    // A1. Record Best-Lap Candidate Frames (30Hz)
    if (isManualRace && lapTime > 0.0) {
      if (lastLapRecordTime < 0 || lapTime - lastLapRecordTime >= LAP_RECORD_INTERVAL_SEC) {
        lastLapRecordTime = lapTime;
        currentLapFrames.push(buildFrameRecord(lapTime, playerState, totalTrackLength));
      }

      // A2. Record Full Race Run Coordinates (25Hz)
      if (runStartTime === null) {
        runStartTime = raceTime;
      }
      const relRunTime = Math.max(0.0, raceTime - runStartTime);
      if (
        currentRunFrames.length < MAX_RUN_FRAMES &&
        (lastRunRecordTime < 0 || relRunTime - lastRunRecordTime >= RUN_RECORD_INTERVAL_SEC)
      ) {
        lastRunRecordTime = relRunTime;
        currentRunFrames.push(buildFrameRecord(relRunTime, playerState, totalTrackLength));
      }
    }

    // B. Replay Saved Best Lap as Live Ghost Car Opponent
    const shouldReplayLiveGhost =
      isGhostEnabled &&
      Boolean(bestLapData && bestLapData.frames && bestLapData.frames.length >= 2) &&
      !playerState.autopilot &&
      !playerState.victoryCruise;

    if (!shouldReplayLiveGhost) {
      ghostKart.setVisible(false);
      currentGhostPose = null;
      currentDeltaSec = null;
      return;
    }

    const frames = bestLapData.frames;
    const ghostLapDuration = bestLapData.lapTime;
    const t = lapTime;

    if (t > ghostLapDuration) {
      const overTime = t - ghostLapDuration;
      ghostFinishedThisLap = true;
      if (overTime > 2.0) {
        ghostKart.setVisible(false);
        currentGhostPose = null;
        currentDeltaSec = null;
        return;
      }
      ghostKart.setOpacity(Math.max(0.0, 0.52 * (1.0 - overTime / 2.0)));
    } else {
      ghostFinishedThisLap = false;
      ghostKart.setOpacity(0.52);
    }

    if (t <= frames[0].t) {
      liveReplayCursor = 0;
    } else {
      while (liveReplayCursor < frames.length - 2 && frames[liveReplayCursor + 1].t < t) {
        liveReplayCursor++;
      }
      while (liveReplayCursor > 0 && frames[liveReplayCursor].t > t) {
        liveReplayCursor--;
      }
    }

    const f0 = frames[liveReplayCursor];
    const f1 = frames[Math.min(liveReplayCursor + 1, frames.length - 1)];

    let alpha = 0.0;
    const span = f1.t - f0.t;
    if (span > 0.0001) {
      alpha = THREE.MathUtils.clamp((t - f0.t) / span, 0.0, 1.0);
    }

    _vPosA.fromArray(f0.p);
    _vPosB.fromArray(f1.p);
    _vGhostPos.lerpVectors(_vPosA, _vPosB, alpha);

    _qRotA.fromArray(f0.q);
    _qRotB.fromArray(f1.q);
    _qGhostRot.slerpQuaternions(_qRotA, _qRotB, alpha);

    const ghostSpeed = THREE.MathUtils.lerp(f0.v, f1.v, alpha);
    const ghostSteer = THREE.MathUtils.lerp(f0.s, f1.s, alpha);
    const ghostS = THREE.MathUtils.lerp(f0.d, f1.d, alpha);

    ghostKart.ghostRoot.position.copy(_vGhostPos);
    ghostKart.ghostRoot.quaternion.copy(_qGhostRot);
    ghostKart.updateWheels(dt, ghostSpeed, ghostSteer);
    ghostKart.updateGhostVisuals(dt, elapsedTime, true);

    currentGhostPose = {
      position: _vGhostPos,
      quaternion: _qGhostRot,
      speed: ghostSpeed,
      steer: ghostSteer,
      s: ghostS,
    };

    // C. Compute Live Time Delta (Player vs Ghost)
    const playerS = ((playerState.s % totalTrackLength) + totalTrackLength) % totalTrackLength;
    if (isManualRace && lapTime > 0.3) {
      let bestDistDiff = Infinity;
      let matchedGhostTime = null;

      const windowStart = Math.max(0, liveReplayCursor - 40);
      const windowEnd = Math.min(frames.length, liveReplayCursor + 40);
      for (let i = windowStart; i < windowEnd; i++) {
        const frameD = frames[i].d;
        let diff = Math.abs(frameD - playerS);
        if (diff > totalTrackLength * 0.5) {
          diff = totalTrackLength - diff;
        }
        if (diff < bestDistDiff) {
          bestDistDiff = diff;
          matchedGhostTime = frames[i].t;
        }
      }

      if (matchedGhostTime !== null && bestDistDiff < 0.35) {
        currentDeltaSec = lapTime - matchedGhostTime;
      } else {
        const distDiff = playerS - ghostS;
        const refSpeed = Math.max(0.12, Math.abs(playerState.speed));
        currentDeltaSec = -distDiff / refSpeed;
      }
    } else {
      currentDeltaSec = null;
    }
  }

  function onLapComplete(lapTime, vehicleMeta = activeRunVehicleMeta) {
    if (!lapTime || lapTime <= 2.0 || currentLapFrames.length < 10) {
      resetCurrentLapRecording();
      return { isNewRecord: false };
    }

    const previousBest = bestLapData ? bestLapData.lapTime : null;
    const isNewRecord = previousBest === null || lapTime < previousBest - 0.005;

    if (isNewRecord) {
      const lastF = currentLapFrames[currentLapFrames.length - 1];
      if (lastF && lastF.t < lapTime) {
        currentLapFrames.push({
          ...lastF,
          t: Number(lapTime.toFixed(3)),
        });
      }

      bestLapData = {
        lapTime: Number(lapTime.toFixed(3)),
        date: Date.now(),
        vehicleMode: vehicleMeta?.vehicleMode || activeRunVehicleMeta.vehicleMode || 'kart',
        characterId: vehicleMeta?.characterId || activeRunVehicleMeta.characterId || 'siamese',
        frames: currentLapFrames.slice(),
      };

      saveGhostToStorage();
      if (onRecordChangeCallback) {
        onRecordChangeCallback(bestLapData);
      }
    }

    // Also update lastRunData snapshot at each lap completion so full-run replay stays current
    snapshotCurrentRun(vehicleMeta);

    resetCurrentLapRecording();
    return {
      isNewRecord,
      previousBest,
      newBest: bestLapData ? bestLapData.lapTime : lapTime,
    };
  }

  function onRaceComplete(totalTime, vehicleMeta = activeRunVehicleMeta) {
    if (currentRunFrames.length < 6) {
      return false;
    }
    const lastF = currentRunFrames[currentRunFrames.length - 1];
    const finalDur =
      typeof totalTime === 'number' && totalTime > (lastF?.t || 0) ? totalTime : lastF.t;
    if (lastF && finalDur > lastF.t) {
      currentRunFrames.push({
        ...lastF,
        t: Number(finalDur.toFixed(3)),
      });
    }
    const ok = snapshotCurrentRun(vehicleMeta);
    resetFullRunRecording();
    return ok;
  }

  // -------------------------------------------------------------------------
  // DEDICATED RACE REPLAY VIEWER CONTROLLER
  // -------------------------------------------------------------------------
  function getActiveReplayRecording(preferredSource = replay.source) {
    if (preferredSource === 'best' && bestLapData && bestLapData.frames?.length >= 6) {
      return { key: 'best', data: bestLapData, duration: bestLapData.lapTime };
    }
    if (preferredSource === 'run' && lastRunData && lastRunData.frames?.length >= 6) {
      return { key: 'run', data: lastRunData, duration: lastRunData.duration };
    }
    if (lastRunData && lastRunData.frames?.length >= 6) {
      return { key: 'run', data: lastRunData, duration: lastRunData.duration };
    }
    if (bestLapData && bestLapData.frames?.length >= 6) {
      return { key: 'best', data: bestLapData, duration: bestLapData.lapTime };
    }
    return null;
  }

  function hasBestLap() {
    return Boolean(bestLapData && bestLapData.frames && bestLapData.frames.length >= 6);
  }

  function hasLastRun() {
    return Boolean(
      (lastRunData && lastRunData.frames && lastRunData.frames.length >= 6) ||
        currentRunFrames.length >= 10
    );
  }

  function hasAnyReplay() {
    return hasBestLap() || hasLastRun();
  }

  function startReplay(preferredSource = 'auto', vehicleMeta = activeRunVehicleMeta) {
    // Capture any active live-drive coordinates before starting replay
    if (currentRunFrames.length >= 10) {
      snapshotCurrentRun(vehicleMeta);
    }

    const src =
      preferredSource === 'best' || preferredSource === 'run' ? preferredSource : 'run';
    const picked = getActiveReplayRecording(src);
    if (!picked) {
      return false;
    }

    replay.active = true;
    replay.playing = true;
    replay.source = picked.key;
    replay.currentTime = 0.0;
    replay.duration = picked.duration;
    replay.cursor = 0;
    replay.vehicleMode = picked.data.vehicleMode || vehicleMeta?.vehicleMode || 'kart';
    replay.characterId = picked.data.characterId || vehicleMeta?.characterId || 'siamese';

    if (ghostKart.setVehicleMode) {
      ghostKart.setVehicleMode(replay.vehicleMode);
    }
    if (ghostKart.setDriverCharacter) {
      ghostKart.setDriverCharacter(replay.characterId);
    }
    ghostKart.setOpacity(0.72);
    ghostKart.setVisible(true);

    notifyReplayUi();
    return true;
  }

  function stopReplay() {
    if (!replay.active) return;
    replay.active = false;
    replay.playing = false;
    replay.currentTime = 0.0;
    replay.cursor = 0;
    currentGhostPose = null;
    ghostKart.setOpacity(0.52);
    ghostKart.setVisible(false);
    notifyReplayUi();
  }

  function setReplaySource(source) {
    const picked = getActiveReplayRecording(source);
    if (!picked) return false;
    replay.source = picked.key;
    replay.duration = picked.duration;
    replay.currentTime = 0.0;
    replay.cursor = 0;
    replay.playing = true;
    replay.vehicleMode = picked.data.vehicleMode || 'kart';
    replay.characterId = picked.data.characterId || 'siamese';
    if (ghostKart.setVehicleMode) {
      ghostKart.setVehicleMode(replay.vehicleMode);
    }
    if (ghostKart.setDriverCharacter) {
      ghostKart.setDriverCharacter(replay.characterId);
    }
    notifyReplayUi();
    return true;
  }

  function setReplayPlaying(val) {
    if (!replay.active) return;
    replay.playing = Boolean(val);
    if (replay.playing && replay.currentTime >= replay.duration - 0.02) {
      replay.currentTime = 0.0;
      replay.cursor = 0;
    }
    notifyReplayUi();
  }

  function toggleReplayPlaying() {
    setReplayPlaying(!replay.playing);
    return replay.playing;
  }

  function seekReplay(timeSec) {
    if (!replay.active) return;
    replay.currentTime = THREE.MathUtils.clamp(timeSec, 0.0, replay.duration);
    replay.cursor = 0;
    notifyReplayUi();
  }

  function setReplayRate(rate) {
    replay.playbackRate = THREE.MathUtils.clamp(rate || 1.0, 0.25, 4.0);
    notifyReplayUi();
  }

  function getReplayTrailFrames() {
    if (!replay.active) return null;
    const picked = getActiveReplayRecording(replay.source);
    return picked ? picked.data.frames : null;
  }

  function getReplayStatus() {
    const picked = getActiveReplayRecording(replay.source);
    return {
      active: replay.active,
      playing: replay.playing,
      source: replay.source,
      currentTime: replay.currentTime,
      duration: replay.duration,
      playbackRate: replay.playbackRate,
      frameCount: picked ? picked.data.frames.length : 0,
      hasBestLap: hasBestLap(),
      hasLastRun: Boolean(lastRunData && lastRunData.frames?.length >= 6),
      vehicleMode: replay.vehicleMode,
      characterId: replay.characterId,
    };
  }

  function stepReplay(dt, elapsedTime, hideGhostMesh = false) {
    if (!replay.active) return null;

    const picked = getActiveReplayRecording(replay.source);
    if (!picked || !picked.data.frames || picked.data.frames.length < 2) {
      stopReplay();
      return null;
    }

    const frames = picked.data.frames;
    const duration = Math.max(0.05, picked.duration || frames[frames.length - 1].t);
    replay.duration = duration;

    if (replay.playing) {
      replay.currentTime += dt * replay.playbackRate;
      if (replay.currentTime >= duration) {
        replay.currentTime = duration;
        replay.playing = false;
        notifyReplayUi();
      }
    }

    const t = THREE.MathUtils.clamp(replay.currentTime, 0.0, duration);

    if (t <= frames[0].t) {
      replay.cursor = 0;
    } else {
      while (replay.cursor < frames.length - 2 && frames[replay.cursor + 1].t < t) {
        replay.cursor++;
      }
      while (replay.cursor > 0 && frames[replay.cursor].t > t) {
        replay.cursor--;
      }
    }

    const f0 = frames[replay.cursor];
    const f1 = frames[Math.min(replay.cursor + 1, frames.length - 1)];

    let alpha = 0.0;
    const span = f1.t - f0.t;
    if (span > 0.0001) {
      alpha = THREE.MathUtils.clamp((t - f0.t) / span, 0.0, 1.0);
    }

    _vPosA.fromArray(f0.p);
    _vPosB.fromArray(f1.p);
    _vGhostPos.lerpVectors(_vPosA, _vPosB, alpha);

    _qRotA.fromArray(f0.q);
    _qRotB.fromArray(f1.q);
    _qGhostRot.slerpQuaternions(_qRotA, _qRotB, alpha);

    const ghostSpeed = THREE.MathUtils.lerp(f0.v || 0, f1.v || 0, alpha);
    const ghostSteer = THREE.MathUtils.lerp(f0.s || 0, f1.s || 0, alpha);
    const ghostS = THREE.MathUtils.lerp(f0.d || 0, f1.d || 0, alpha);
    const ghostBank = THREE.MathUtils.lerp(f0.bk || 0, f1.bk || 0, alpha);
    const isDrifting = Boolean((alpha < 0.5 ? f0.dr : f1.dr) === 1 && Math.abs(ghostSpeed) > 0.032);
    const isBoost = (alpha < 0.5 ? f0.bs : f1.bs) === 1;
    const lapNum = alpha < 0.5 ? f0.lap || 1 : f1.lap || 1;

    // Reconstruct orthonormal basis vectors directly from recorded quaternion (zero allocations)
    _replayTangent.set(0, 0, 1).applyQuaternion(_qGhostRot).normalize();
    _replayNormal.set(0, 1, 0).applyQuaternion(_qGhostRot).normalize();
    _replayRight.set(-1, 0, 0).applyQuaternion(_qGhostRot).normalize();

    ghostKart.ghostRoot.position.copy(_vGhostPos);
    ghostKart.ghostRoot.quaternion.copy(_qGhostRot);
    if (replay.playing) {
      ghostKart.updateWheels(dt * replay.playbackRate, ghostSpeed, ghostSteer);
    }
    ghostKart.setOpacity(0.72);
    ghostKart.updateGhostVisuals(dt, elapsedTime, !hideGhostMesh);

    _replayStateOut.position.copy(_vGhostPos);
    _replayStateOut.quaternion.copy(_qGhostRot);
    _replayStateOut.speed = ghostSpeed;
    _replayStateOut.steerAngle = ghostSteer;
    _replayStateOut.steerInput = THREE.MathUtils.clamp(-ghostSteer / 0.45, -1, 1);
    _replayStateOut.s = ghostS;
    _replayStateOut.bankDeg = ghostBank;
    _replayStateOut.downforceG =
      1.0 +
      (ghostSpeed * ghostSpeed) / 0.26 +
      Math.abs(Math.sin(THREE.MathUtils.degToRad(ghostBank))) * 0.65;
    _replayStateOut.isDrifting = isDrifting && replay.playing;
    _replayStateOut.driftDir = isDrifting ? Math.sign(_replayStateOut.steerInput) || 1 : 0;
    _replayStateOut.driftAngle = isDrifting ? -_replayStateOut.driftDir * 0.20 : 0.0;
    _replayStateOut.boostActive = isBoost ? 1.0 : 0.0;
    _replayStateOut.lapCount = lapNum;
    _replayStateOut.currentLapTime = t;
    _replayStateOut.totalRaceTime = t;

    currentGhostPose = {
      position: _vGhostPos,
      quaternion: _qGhostRot,
      speed: ghostSpeed,
      steer: ghostSteer,
      s: ghostS,
    };

    return _replayStateOut;
  }

  function getBestLapTime() {
    return bestLapData ? bestLapData.lapTime : null;
  }

  function hasGhost() {
    return Boolean(bestLapData && bestLapData.frames && bestLapData.frames.length > 5);
  }

  return {
    update,
    onLapComplete,
    onRaceComplete,
    snapshotCurrentRun,
    clearGhostRecord,
    resetCurrentLapRecording,
    resetFullRunRecording,
    resetAllRecordings,
    setGhostEnabled,
    toggleGhostEnabled,
    getBestLapTime,
    hasGhost,
    hasBestLap,
    hasLastRun,
    hasAnyReplay,
    setTrack,
    startReplay,
    stopReplay,
    setReplaySource,
    setReplayPlaying,
    toggleReplayPlaying,
    seekReplay,
    setReplayRate,
    stepReplay,
    getReplayTrailFrames,
    getReplayStatus,
    isReplayActive: () => replay.active,
    get isEnabled() {
      return isGhostEnabled;
    },
    get currentGhostPose() {
      return currentGhostPose;
    },
    get currentDeltaSec() {
      return currentDeltaSec;
    },
    get ghostFinishedThisLap() {
      return ghostFinishedThisLap;
    },
    onRecordChange: (cb) => {
      onRecordChangeCallback = cb;
    },
    onReplayStateChange: (cb) => {
      onReplayStateChangeCallback = cb;
    },
  };
}
