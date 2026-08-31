import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// Poster panels in the model are mounted on the wall at x ~ -1.31, facing
// +X into the room, and measure roughly 0.6 (height) x 0.46 (width).
const POSTER_SIZE = [0.46, 0.6];

// drei's <Html> doesn't clip against the camera the way real 3D geometry
// does - a hotspot behind the player can still misproject onto whatever
// IS in front of them (reported as labels "appearing on the door/window"
// until turning to face the real one). This hook hides the label whenever
// its anchor point is behind the camera's view direction.
function useInFrontOfCamera(position) {
  const { camera } = useThree();
  const [inFront, setInFront] = useState(true);
  const wasInFront = useRef(true);
  const toPoint = useRef(new THREE.Vector3());
  const forward = useRef(new THREE.Vector3());

  useFrame(() => {
    toPoint.current.set(...position).sub(camera.position);
    camera.getWorldDirection(forward.current);
    const nowInFront = toPoint.current.dot(forward.current) > 0;
    if (nowInFront !== wasInFront.current) {
      wasInFront.current = nowInFront;
      setInFront(nowInFront);
    }
  });

  return inFront;
}

const OrbHotspot = ({ hotspot, active }) => {
  const ringRef = useRef();
  const inFront = useInFrontOfCamera(hotspot.position);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      const t = clock.getElapsedTime();
      const pulse = 1 + Math.sin(t * 3) * 0.08;
      ringRef.current.scale.setScalar(active ? pulse * 1.25 : pulse);
      ringRef.current.rotation.z = t * 0.6;
    }
  });

  return (
    <group position={hotspot.position}>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.09, 0.13, 32]} />
        <meshBasicMaterial
          color={active ? "#7dd3fc" : "#facc15"}
          transparent
          opacity={active ? 1 : 0.75}
          side={THREE.DoubleSide}
        />
      </mesh>
      {inFront && (
        <Html center distanceFactor={6} occlude={false}>
          <div className={`hotspot-label ${active ? "hotspot-label--active" : ""}`}>
            <span className="hotspot-icon">{hotspot.icon}</span>
            <span className="hotspot-text">{hotspot.label}</span>
          </div>
        </Html>
      )}
    </group>
  );
};

const PosterHotspot = ({ hotspot, active }) => {
  const frameRef = useRef();
  const [w, h] = POSTER_SIZE;
  const inFront = useInFrontOfCamera(hotspot.position);

  useFrame(({ clock }) => {
    if (frameRef.current) {
      const t = clock.getElapsedTime();
      const glow = active ? 0.8 + Math.sin(t * 4) * 0.2 : 0.35;
      frameRef.current.material.opacity = glow;
    }
  });

  return (
    // Posters sit on the x ~ -1.31 wall facing +X; rotate the plane's
    // default +Z-facing normal to point into the room.
    <group position={hotspot.position} rotation={[0, Math.PI / 2, 0]}>
      {/* Glowing frame outline, sized to match the poster panel */}
      <mesh ref={frameRef} position={[0, 0, 0.01]}>
        <planeGeometry args={[w + 0.04, h + 0.04]} />
        <meshBasicMaterial
          color={active ? "#7dd3fc" : "#facc15"}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          wireframe
        />
      </mesh>
      <mesh>
        <ringGeometry args={[0.02, 0.05, 4]} />
        <meshBasicMaterial color={active ? "#7dd3fc" : "#facc15"} />
      </mesh>
      {inFront && (
        <Html center distanceFactor={6} occlude={false} position={[0, -h / 2 - 0.12, 0]}>
          <div className={`hotspot-label hotspot-label--poster ${active ? "hotspot-label--active" : ""}`}>
            <span className="hotspot-icon">{hotspot.icon}</span>
            <span className="hotspot-text">{hotspot.label}</span>
          </div>
        </Html>
      )}
    </group>
  );
};

const Hotspot = ({ hotspot, active }) => {
  if (hotspot.variant === "poster") {
    return <PosterHotspot hotspot={hotspot} active={active} />;
  }
  return <OrbHotspot hotspot={hotspot} active={active} />;
};

export default Hotspot;
