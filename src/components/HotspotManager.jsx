import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Hotspot from "./Hotspot";
import { HOTSPOTS } from "../hotspots";

const INTERACT_DISTANCE = 3.6;
const INTERACT_ANGLE_COS = Math.cos(THREE.MathUtils.degToRad(16));

// Pointer Lock hides the cursor, so instead of DOM click targets we raycast
// from the camera's forward direction every frame (crosshair-style, like a
// first-person game) and report whichever hotspot is both close enough and
// within a tight cone in front of the player.
const HotspotManager = ({ locked, activeId, onActiveChange, hidden }) => {
  const { camera } = useThree();
  const forward = useRef(new THREE.Vector3());
  const toHotspot = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!locked || hidden) {
      if (activeId !== null) onActiveChange(null);
      return;
    }

    camera.getWorldDirection(forward.current);

    let best = null;
    let bestDot = INTERACT_ANGLE_COS;

    for (const spot of HOTSPOTS) {
      toHotspot.current
        .set(...spot.position)
        .sub(camera.position);
      const distance = toHotspot.current.length();
      if (distance > INTERACT_DISTANCE) continue;

      toHotspot.current.normalize();
      const dot = toHotspot.current.dot(forward.current);
      if (dot > bestDot) {
        bestDot = dot;
        best = spot.id;
      }
    }

    if (best !== activeId) onActiveChange(best);
  });

  // Don't render hotspot markers/labels at all while a modal is open -
  // drei's <Html> renders through a portal with a very high default
  // z-index (for 3D depth sorting) that sits above normal page content
  // regardless of CSS z-index on the modal, so it would otherwise show
  // through the popup.
  if (hidden) return null;

  return (
    <>
      {HOTSPOTS.map((spot) => (
        <Hotspot key={spot.id} hotspot={spot} active={spot.id === activeId} />
      ))}
    </>
  );
};

export default HotspotManager;
