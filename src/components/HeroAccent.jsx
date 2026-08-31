import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

// Small decorative wireframe accent for the classic site's hero - a nod
// to the 3D-web identity without pulling the whole room into a "basic"
// 2D page. Deliberately tiny in scope: one shape, one light, no controls.
const Wireframe = () => {
  const meshRef = useRef();
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.22;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.6, 1]} />
      <meshBasicMaterial color="#5b8def" wireframe transparent opacity={0.55} />
    </mesh>
  );
};

const HeroAccent = () => (
  <Canvas
    className="cx-hero-canvas"
    camera={{ position: [0, 0, 5], fov: 45 }}
    dpr={[1, 1.5]}
    gl={{ alpha: true }}
  >
    <Wireframe />
  </Canvas>
);

export default HeroAccent;
