import * as THREE from 'three';

const GHOST_STORAGE_KEY = 'desk_racer_ghost_v1';
const RECORD_INTERVAL_SEC = 1 / 30; // 30Hz keyframe recording (interpolated at 60/120Hz for buttery smooth playback)

export function createGhostSystem(ghostKart, totalTrackLength = 3.8371) {
  let isGhostEnabled = true;
  let bestLapData = null; // { lapTime: number, frames: Array<{ t, p, q, s, v, d }> }
  let currentLapFrames = [];
  let lastRecordTime = -1;

  // Reusable Three.js math objects for zero-allocation runtime interpolation
  const _vPosA = new THREE.Vector3();
  const _vPosB = new THREE.Vector3();
  const _vGhostPos = new THREE.Vector3();
  const _qRotA = new THREE.Quaternion();
  const _qRotB = new THREE.Quaternion();
  const _qGhostRot = new THREE.Quaternion();

  // State exposed to main & HUD
  let currentGhostPose = null; // { position: Vector3, quaternion: Quaternion, speed, steer, s }
  let currentDeltaSec = null; // null if no ghost or out of bounds, else number in seconds (e.g. -0.25 = 0.25s ahead)
  let ghostFinishedThisLap = false;

  let onRecordChangeCallback = null;

  // 1. Load saved ghost from localStorage
  try {
    const raw = localStorage.getItem(GHOST_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        typeof parsed.lapTime === 'number' &&
        parsed.lapTime > 2.0 &&
        Array.isArray(parsed.frames) &&
        parsed.frames.length > 10
      ) {
        bestLapData = parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load ghost lap from localStorage:', err);
  }

  function saveGhostToStorage() {
    if (!bestLapData) return;
    try {
      localStorage.setItem(GHOST_STORAGE_KEY, JSON.stringify(bestLapData));
    } catch (err) {
      console.warn('Failed to save ghost lap to localStorage:', err);
    }
  }

  function clearGhostRecord() {
    bestLapData = null;
    currentLapFrames = [];
    currentGhostPose = null;
    currentDeltaSec = null;
    try {
      localStorage.removeItem(GHOST_STORAGE_KEY);
    } catch (_e) {}
    ghostKart.setVisible(false);
    if (onRecordChangeCallback) {
      onRecordChangeCallback(null);
    }
  }

  function setGhostEnabled(val) {
    isGhostEnabled = Boolean(val);
    if (!isGhostEnabled) {
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
    lastRecordTime = -1;
    ghostFinishedThisLap = false;
  }

  // 2. Step Recording & Playback each animation frame
  let replayCursor = 0;

  function update(dt, elapsedTime, playerState) {
    if (!playerState) return;

    const isManualRace =
      !playerState.autopilot &&
      !playerState.countdownLocked &&
      playerState.raceClockActive &&
      !playerState.raceFinished;

    const lapTime = playerState.currentLapTime || 0.0;

    // Reset recording buffer when a new lap or countdown starts
    if (lapTime < 0.05 && currentLapFrames.length > 5) {
      resetCurrentLapRecording();
    }

    // A. RECORD CURRENT LAP TELEMETRY (if racing in manual time-trial mode)
    if (isManualRace && lapTime > 0.0) {
      if (lastRecordTime < 0 || lapTime - lastRecordTime >= RECORD_INTERVAL_SEC) {
        lastRecordTime = lapTime;
        currentLapFrames.push({
          t: Number(lapTime.toFixed(3)),
          p: [
            Number(playerState.position.x.toFixed(4)),
            Number(playerState.position.y.toFixed(4)),
            Number(playerState.position.z.toFixed(4)),
          ],
          q: [
            Number(playerState.quaternion.x.toFixed(4)),
            Number(playerState.quaternion.y.toFixed(4)),
            Number(playerState.quaternion.z.toFixed(4)),
            Number(playerState.quaternion.w.toFixed(4)),
          ],
          s: Number((playerState.steerAngle || 0).toFixed(3)),
          v: Number((playerState.speed || 0).toFixed(3)),
          d: Number(((playerState.s % totalTrackLength + totalTrackLength) % totalTrackLength).toFixed(4)),
        });
      }
    }

    // B. REPLAY SAVED BEST LAP GHOST
    const shouldReplay =
      isGhostEnabled &&
      Boolean(bestLapData && bestLapData.frames && bestLapData.frames.length >= 2) &&
      !playerState.autopilot &&
      !playerState.victoryCruise;

    if (!shouldReplay) {
      ghostKart.setVisible(false);
      currentGhostPose = null;
      currentDeltaSec = null;
      return;
    }

    const frames = bestLapData.frames;
    const ghostLapDuration = bestLapData.lapTime;

    // Evaluate ghost at player's current lap time
    const t = lapTime;

    if (t > ghostLapDuration) {
      // Ghost finished this lap! Fade out or hold at finish
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

    // Find keyframes surrounding time t
    if (t <= frames[0].t) {
      replayCursor = 0;
    } else {
      while (replayCursor < frames.length - 2 && frames[replayCursor + 1].t < t) {
        replayCursor++;
      }
      while (replayCursor > 0 && frames[replayCursor].t > t) {
        replayCursor--;
      }
    }

    const f0 = frames[replayCursor];
    const f1 = frames[Math.min(replayCursor + 1, frames.length - 1)];

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

    // Apply to 3D Ghost Model
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

    // C. COMPUTE LIVE TIME DELTA (Player vs Ghost)
    // Find when ghost was at player's current track distance (playerState.s)
    const playerS = ((playerState.s % totalTrackLength) + totalTrackLength) % totalTrackLength;
    if (isManualRace && lapTime > 0.3) {
      // Find ghost keyframe with closest distance d
      let bestDistDiff = Infinity;
      let matchedGhostTime = null;

      // Sample a window around current time or scan nearby frames
      const windowStart = Math.max(0, replayCursor - 40);
      const windowEnd = Math.min(frames.length, replayCursor + 40);
      for (let i = windowStart; i < windowEnd; i++) {
        const frameD = frames[i].d;
        let diff = Math.abs(frameD - playerS);
        // Handle periodic wrap-around
        if (diff > totalTrackLength * 0.5) {
          diff = totalTrackLength - diff;
        }
        if (diff < bestDistDiff) {
          bestDistDiff = diff;
          matchedGhostTime = frames[i].t;
        }
      }

      // If within 0.35m of track arc, compute authentic time delta (negative = ahead of ghost!)
      if (matchedGhostTime !== null && bestDistDiff < 0.35) {
        currentDeltaSec = lapTime - matchedGhostTime;
      } else {
        // Fallback: compare distances at same timestamp
        const distDiff = playerS - ghostS;
        const refSpeed = Math.max(0.12, Math.abs(playerState.speed));
        currentDeltaSec = -distDiff / refSpeed;
      }
    } else {
      currentDeltaSec = null;
    }
  }

  // 3. Called when a lap is completed
  function onLapComplete(lapTime) {
    if (!lapTime || lapTime <= 2.0 || currentLapFrames.length < 10) {
      resetCurrentLapRecording();
      return { isNewRecord: false };
    }

    const previousBest = bestLapData ? bestLapData.lapTime : null;
    const isNewRecord = previousBest === null || lapTime < previousBest - 0.005;

    if (isNewRecord) {
      // Ensure the final frame reaches lapTime
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
        frames: currentLapFrames.slice(),
      };

      saveGhostToStorage();

      if (onRecordChangeCallback) {
        onRecordChangeCallback(bestLapData);
      }
    }

    resetCurrentLapRecording();
    return {
      isNewRecord,
      previousBest,
      newBest: bestLapData ? bestLapData.lapTime : lapTime,
    };
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
    clearGhostRecord,
    resetCurrentLapRecording,
    setGhostEnabled,
    toggleGhostEnabled,
    getBestLapTime,
    hasGhost,
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
  };
}
