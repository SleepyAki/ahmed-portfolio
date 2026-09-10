import { useMemo } from 'react';
import { Object3D } from 'three';
import { Environment, Lightformer } from '@react-three/drei';
import { ROOM } from '../roomLayout';

export default function StudioLighting({ isMobile }) {
  const cx = (ROOM.minX + ROOM.maxX) / 2;
  const cz = (ROOM.minZ + ROOM.maxZ) / 2;
  const sunTarget = useMemo(() => {
    const target = new Object3D();
    target.position.set(0.2, 0.6, -0.3);
    return target;
  }, []);
  return <group>
    <hemisphereLight args={['#9c91b7', '#69412d', 0.38]} />
    <primitive object={sunTarget} />
    <directionalLight position={[0.05, 2.6, 3.5]} target={sunTarget} color="#ffad65" intensity={1.05}
      castShadow={!isMobile} shadow-mapSize={[512, 512]}
      shadow-camera-left={-3} shadow-camera-right={3} shadow-camera-top={3} shadow-camera-bottom={-3}
      shadow-camera-near={0.1} shadow-camera-far={10} shadow-normalBias={0.025} shadow-bias={-0.0001} />
    <pointLight position={[-0.88, 1.87, -0.79]} color="#ffa960" intensity={0.9} distance={3.2} decay={2} />
    {/* One captured reflection map; it is never re-rendered while walking. */}
    <Environment resolution={32} frames={1} environmentIntensity={0.16}>
      <color attach="background" args={['#393348']} />
      <Lightformer position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[6, 6, 1]} intensity={0.7} color="#d7b1a0" />
      <Lightformer position={[0, 0, 5]} rotation={[0, Math.PI, 0]} scale={[4, 3, 1]} intensity={1.6} color="#ffa666" />
    </Environment>
    {[
      { position: [cx, 3.015, -1.19], size: [3.52, 0.022, 0.026], color: '#dca574' },
      { position: [-1.28, 3.015, cz], size: [0.026, 0.022, 3.55], color: '#dca574' },
      { position: [2.34, 3.015, cz], size: [0.026, 0.022, 3.55], color: '#aca3c8' },
      { position: [cx, 3.015, 2.44], size: [3.52, 0.022, 0.026], color: '#dca574' },
      { position: [0.86, 1.143, -0.48], size: [1.68, 0.018, 0.018], color: '#749eaa' },
    ].map((rail, i) => <mesh key={i} position={rail.position}>
      <boxGeometry args={rail.size} /><meshBasicMaterial color={rail.color} />
    </mesh>)}
  </group>;
}
