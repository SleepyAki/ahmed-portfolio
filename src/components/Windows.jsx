import React, { useMemo } from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { ROOM } from "./Walls";

RectAreaLightUniformsLib.init();

// Generates an original sunset-gradient sky texture on a canvas (no
// external images, so nothing to license) for the view "outside" the
// window. Smooth multi-stop gradients + soft blurred cloud blobs instead
// of hard shapes, so it reads as a photo rather than a flat graphic.
function useSunsetTexture() {
  return useMemo(() => {
    const size = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const sky = ctx.createLinearGradient(0, 0, 0, size);
    sky.addColorStop(0, "#160f35");
    sky.addColorStop(0.3, "#3d2560");
    sky.addColorStop(0.52, "#a8456b");
    sky.addColorStop(0.68, "#e2703f");
    sky.addColorStop(0.82, "#f5a24a");
    sky.addColorStop(1, "#ffce85");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, size, size);

    // Soft blurred cloud blobs (real blur, not hard ellipses)
    ctx.filter = "blur(28px)";
    const cloudSpots = [
      [0.15, 0.28, 0.28, "rgba(70,40,90,0.55)"],
      [0.7, 0.22, 0.32, "rgba(50,30,80,0.5)"],
      [0.35, 0.42, 0.35, "rgba(220,140,120,0.4)"],
      [0.75, 0.5, 0.3, "rgba(230,160,110,0.4)"],
      [0.2, 0.58, 0.3, "rgba(240,180,120,0.35)"],
    ];
    cloudSpots.forEach(([cx, cy, r, color]) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(size * cx, size * cy, size * r, size * r * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.filter = "none";

    // Sun with soft glow
    const sunY = size * 0.66;
    const sunGlow = ctx.createRadialGradient(size / 2, sunY, 0, size / 2, sunY, size * 0.4);
    sunGlow.addColorStop(0, "rgba(255,248,220,0.95)");
    sunGlow.addColorStop(0.15, "rgba(255,220,150,0.7)");
    sunGlow.addColorStop(0.45, "rgba(255,180,110,0.3)");
    sunGlow.addColorStop(1, "rgba(255,180,110,0)");
    ctx.fillStyle = sunGlow;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#fff8e0";
    ctx.beginPath();
    ctx.arc(size / 2, sunY, size * 0.045, 0, Math.PI * 2);
    ctx.fill();

    // Distant hill silhouette, blurred edge for atmospheric depth
    ctx.filter = "blur(3px)";
    ctx.fillStyle = "#140a24";
    ctx.beginPath();
    ctx.moveTo(0, size);
    ctx.lineTo(0, size * 0.84);
    for (let x = 0; x <= size; x += size / 16) {
      ctx.lineTo(x, size * (0.82 + Math.sin(x * 0.015) * 0.025));
    }
    ctx.lineTo(size, size);
    ctx.closePath();
    ctx.fill();
    ctx.filter = "none";

    // Fine grain so it doesn't read as a flat vector gradient
    // one-time procedural texture grain generated inside useMemo -
    // Math.random here is fine since this only runs once per mount
    const imgData = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < imgData.data.length; i += 4) {
      // eslint-disable-next-line react-hooks/purity
      const n = (Math.random() - 0.5) * 8;
      imgData.data[i] += n;
      imgData.data[i + 1] += n;
      imgData.data[i + 2] += n;
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

const WINDOW_WIDTH = 0.65;
const WINDOW_HEIGHT = 0.8;
const WINDOW_Y = 1.7;
const REVEAL_DEPTH = 0.22; // how far the window is recessed into the wall
const FRAME_THICKNESS = 0.07;

const Windows = () => {
  const skyTexture = useSunsetTexture();
  const centerX = (ROOM.minX + ROOM.maxX) / 2;
  const wallZ = ROOM.maxZ;
  const glassZ = wallZ - REVEAL_DEPTH;

  return (
    <group>
      {/* Recessed reveal walls (top/bottom/left/right) connecting the room
          wall surface back to the glass, so the window reads as a real
          opening with depth instead of a picture stuck on the wall. */}
      <mesh position={[centerX, WINDOW_Y + WINDOW_HEIGHT / 2, wallZ - REVEAL_DEPTH / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[WINDOW_WIDTH, REVEAL_DEPTH]} />
        <meshStandardMaterial color="#141414" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[centerX, WINDOW_Y - WINDOW_HEIGHT / 2, wallZ - REVEAL_DEPTH / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[WINDOW_WIDTH, REVEAL_DEPTH]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[centerX - WINDOW_WIDTH / 2, WINDOW_Y, wallZ - REVEAL_DEPTH / 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[REVEAL_DEPTH, WINDOW_HEIGHT]} />
        <meshStandardMaterial color="#141414" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[centerX + WINDOW_WIDTH / 2, WINDOW_Y, wallZ - REVEAL_DEPTH / 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[REVEAL_DEPTH, WINDOW_HEIGHT]} />
        <meshStandardMaterial color="#141414" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Glass, recessed at the back of the reveal */}
      <mesh position={[centerX, WINDOW_Y, glassZ]}>
        <planeGeometry args={[WINDOW_WIDTH, WINDOW_HEIGHT]} />
        <meshBasicMaterial map={skyTexture} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      {/* 3D frame with actual depth (boxes, not flat planes) sitting proud
          of the wall on the room side */}
      {[
        [0, WINDOW_HEIGHT / 2 + FRAME_THICKNESS / 2, WINDOW_WIDTH + FRAME_THICKNESS * 2, FRAME_THICKNESS], // top
        [0, -WINDOW_HEIGHT / 2 - FRAME_THICKNESS / 2, WINDOW_WIDTH + FRAME_THICKNESS * 2, FRAME_THICKNESS], // bottom
        [-WINDOW_WIDTH / 2 - FRAME_THICKNESS / 2, 0, FRAME_THICKNESS, WINDOW_HEIGHT], // left
        [WINDOW_WIDTH / 2 + FRAME_THICKNESS / 2, 0, FRAME_THICKNESS, WINDOW_HEIGHT], // right
      ].map(([dx, dy, w, h], i) => (
        <mesh key={i} position={[centerX + dx, WINDOW_Y + dy, wallZ - REVEAL_DEPTH / 2]}>
          <boxGeometry args={[w, h, REVEAL_DEPTH + 0.03]} />
          <meshStandardMaterial color="#0d0d0d" roughness={0.6} metalness={0.15} />
        </mesh>
      ))}

      {/* Center mullion crossbar for a more window-like read */}
      <mesh position={[centerX, WINDOW_Y, wallZ - REVEAL_DEPTH / 2]}>
        <boxGeometry args={[0.035, WINDOW_HEIGHT, REVEAL_DEPTH]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.6} />
      </mesh>
      <mesh position={[centerX, WINDOW_Y, wallZ - REVEAL_DEPTH / 2]}>
        <boxGeometry args={[WINDOW_WIDTH, 0.035, REVEAL_DEPTH]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.6} />
      </mesh>

      {/* Sill jutting into the room */}
      <mesh position={[centerX, WINDOW_Y - WINDOW_HEIGHT / 2 - 0.02, wallZ - REVEAL_DEPTH - 0.06]}>
        <boxGeometry args={[WINDOW_WIDTH + 0.14, 0.04, REVEAL_DEPTH + 0.18]} />
        <meshStandardMaterial color="#161616" roughness={0.7} />
      </mesh>

      {/* Light spread across the full window opening, not one glowing spot */}
      <rectAreaLight
        position={[centerX, WINDOW_Y, wallZ - REVEAL_DEPTH - 0.02]}
        width={WINDOW_WIDTH}
        height={WINDOW_HEIGHT}
        color="#ffb877"
        intensity={30}
      />

      {/* Door, on the other side of the window from the dresser */}
      <Door x={centerX + WINDOW_WIDTH / 2 + FRAME_THICKNESS + DOOR_WIDTH / 2 + 0.15} wallZ={wallZ} />
    </group>
  );
};

const DOOR_WIDTH = 0.82;
const DOOR_HEIGHT = 1.55;

const Door = ({ x, wallZ }) => {
  const doorY = ROOM.floorY + DOOR_HEIGHT / 2;
  const doorZ = wallZ - 0.06;

  return (
    <group>
      {/* Frame */}
      {[
        [0, DOOR_HEIGHT / 2 + 0.04, DOOR_WIDTH + 0.1, 0.08], // top
        [-DOOR_WIDTH / 2 - 0.03, 0, 0.08, DOOR_HEIGHT + 0.08], // left
        [DOOR_WIDTH / 2 + 0.03, 0, 0.08, DOOR_HEIGHT + 0.08], // right
      ].map(([dx, dy, w, h], i) => (
        <mesh key={i} position={[x + dx, doorY + dy, wallZ - 0.03]}>
          <boxGeometry args={[w, h, 0.1]} />
          <meshStandardMaterial color="#3a2f22" roughness={0.5} metalness={0.2} />
        </mesh>
      ))}

      {/* Door panel */}
      <mesh position={[x, doorY, doorZ]}>
        <boxGeometry args={[DOOR_WIDTH, DOOR_HEIGHT, 0.06]} />
        <meshStandardMaterial
          color="#a8794a"
          emissive="#3a2410"
          emissiveIntensity={0.9}
          roughness={0.45}
          metalness={0.05}
        />
      </mesh>
      {/* Recessed panel detail */}
      <mesh position={[x, doorY + 0.4, doorZ + 0.031]}>
        <boxGeometry args={[DOOR_WIDTH - 0.18, 0.75, 0.015]} />
        <meshStandardMaterial color="#7a5837" roughness={0.5} />
      </mesh>
      <mesh position={[x, doorY - 0.45, doorZ + 0.031]}>
        <boxGeometry args={[DOOR_WIDTH - 0.18, 0.85, 0.015]} />
        <meshStandardMaterial color="#7a5837" roughness={0.5} />
      </mesh>
      {/* Handle */}
      <mesh position={[x + DOOR_WIDTH / 2 - 0.1, doorY, doorZ + 0.05]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial color="#b8a06a" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
};

export default Windows;
