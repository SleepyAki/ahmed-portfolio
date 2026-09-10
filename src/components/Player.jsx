import React, { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls as PointerLockControlsImpl } from "three/examples/jsm/controls/PointerLockControls.js";
import * as THREE from "three";
import { ROOM_BOUNDS, SPAWN } from "../hotspots";
import { collides } from "../colliders";

const WALK_SPEED = 2.4;
const TOUCH_LOOK_SENSITIVITY = 0.0035;
const PITCH_LIMIT = Math.PI / 2 - 0.05;

const Player = ({ locked, isMobile, mobileMoveRef, mobileLookRef }) => {
  const { camera } = useThree();
  const keys = useRef({});
  const vectors = useMemo(() => ({ forward: new THREE.Vector3(), right: new THREE.Vector3(), move: new THREE.Vector3() }), []);
  useEffect(() => { if (!locked) keys.current = {}; }, [locked]);
  const initialized = useRef(false);
  const yaw = useRef(SPAWN.yaw);
  const pitch = useRef(0);

  // Set spawn position/orientation once
  useEffect(() => {
    if (!initialized.current) {
      camera.position.set(...SPAWN.position);
      camera.rotation.set(0, SPAWN.yaw, 0);
      yaw.current = SPAWN.yaw;
      pitch.current = 0;
      initialized.current = true;
    }
  }, [camera]);

  useEffect(() => {
    if (isMobile) return; // no physical keyboard on mobile
    const onKeyDown = (e) => {
      if (!document.pointerLockElement) return;
      keys.current[e.code] = true;
      if (e.code.startsWith('Arrow')) e.preventDefault();
    };
    const reset = () => { keys.current = {}; };
    window.addEventListener('blur', reset);
    const onKeyUp = (e) => {
      keys.current[e.code] = false;
      // Debug helper: press P to log current camera position for tuning
      // hotspots.js / ROOM_BOUNDS.
      if (e.code === "KeyP") {
        const p = camera.position;
        console.log(
          `[camera position] [${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}]`
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("blur", reset);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [camera, isMobile]);

  // Managed by hand (instead of drei's <PointerLockControls>) because that
  // wrapper's connect/disconnect cycle doesn't survive React StrictMode's
  // double-invoke of effects in dev - the second connect() call runs
  // against an element the first disconnect() already tore down. Owning
  // the instance directly lets us guard against exactly that. This object
  // is also what drives mouse-look (it patches camera.quaternion on
  // mousemove internally) - lock state itself is tracked independently by
  // Scene3D via the browser's own pointerlockchange event.
  useEffect(() => {
    if (isMobile) return undefined;
    const controls = new PointerLockControlsImpl(camera, document.body);
    return () => {
      if (document.pointerLockElement) controls.unlock();
      controls.dispose();
    };
  }, [camera, isMobile]);

  useFrame((_, delta) => {
    if (!locked) return;

    /* eslint-disable react-hooks/immutability -- mutating camera transform
       directly inside useFrame is the standard, performant R3F pattern
       (recommended over setState to avoid a re-render every frame) */

    if (isMobile) {
      // Touch look: accumulated drag deltas from MobileControls, applied
      // and drained here each frame.
      yaw.current -= mobileLookRef.current.dx * TOUCH_LOOK_SENSITIVITY;
      pitch.current -= mobileLookRef.current.dy * TOUCH_LOOK_SENSITIVITY;
      pitch.current = THREE.MathUtils.clamp(pitch.current, -PITCH_LIMIT, PITCH_LIMIT);
      mobileLookRef.current.dx = 0;
      mobileLookRef.current.dy = 0;
      camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");
    }

    const { forward, right, move } = vectors;
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();


    right.crossVectors(forward, camera.up).normalize();

    move.set(0, 0, 0);
    if (isMobile) {
      const { x, y } = mobileMoveRef.current;
      move.addScaledVector(forward, -y);
      move.addScaledVector(right, x);
    } else {
      if (keys.current["KeyW"] || keys.current["ArrowUp"]) move.add(forward);
      if (keys.current["KeyS"] || keys.current["ArrowDown"]) move.sub(forward);
      if (keys.current["KeyD"] || keys.current["ArrowRight"]) move.add(right);
      if (keys.current["KeyA"] || keys.current["ArrowLeft"]) move.sub(right);
    }

    if (move.lengthSq() > 1) move.normalize();
    if (move.lengthSq() > 0) {
      move.multiplyScalar(WALK_SPEED * Math.min(delta, 0.05));

      const curX = camera.position.x;
      const curZ = camera.position.z;
      const nextX = curX + move.x;
      const nextZ = curZ + move.z;

      if (!collides(nextX, nextZ)) {
        camera.position.x = nextX;
        camera.position.z = nextZ;
      } else if (!collides(nextX, curZ)) {
        camera.position.x = nextX; // slide along Z-blocking furniture
      } else if (!collides(curX, nextZ)) {
        camera.position.z = nextZ; // slide along X-blocking furniture
      }
    }

    // Simple soft-boundary clamp so you can't walk through walls the
    // model doesn't collide against. Tune ROOM_BOUNDS in hotspots.js.
    camera.position.x = THREE.MathUtils.clamp(
      camera.position.x,
      ROOM_BOUNDS.minX,
      ROOM_BOUNDS.maxX
    );
    camera.position.z = THREE.MathUtils.clamp(
      camera.position.z,
      ROOM_BOUNDS.minZ,
      ROOM_BOUNDS.maxZ
    );
    camera.position.y = ROOM_BOUNDS.eyeHeight;
    /* eslint-enable react-hooks/immutability */
  });

  return null; // this component only drives the camera; no JSX of its own
};

export default Player;
