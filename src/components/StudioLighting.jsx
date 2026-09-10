import { Environment, Lightformer } from '@react-three/drei';
import { ROOM } from './Walls';

// A local, once-rendered lighting environment keeps the mirror independent
// of third-party HDR downloads. Only the key light renders a shadow map.
export default function StudioLighting({ isMobile }) {
  const cx = (ROOM.minX + ROOM.maxX) / 2;
  const cz = (ROOM.minZ + ROOM.maxZ) / 2;
  return <group>
    <hemisphereLight args={['#bcd9ff', '#906746', 1.1]} />
    <ambientLight intensity={0.22} />
    <directionalLight position={[0.3, 2.9, 2.1]} color="#ffddb0" intensity={2.1}
      castShadow shadow-mapSize={[isMobile ? 512 : 1024, isMobile ? 512 : 1024]}
      shadow-camera-left={-3} shadow-camera-right={3} shadow-camera-top={3} shadow-camera-bottom={-3}
      shadow-camera-near={0.1} shadow-camera-far={9} shadow-normalBias={0.035} shadow-bias={-0.0001} />
    <pointLight position={[-0.88, 1.87, -0.79]} color="#ffb767" intensity={4} distance={4} decay={2} />
    <pointLight position={[0.8, 1.65, -0.7]} color="#77d7ff" intensity={1.6} distance={2.8} decay={2} />
    <pointLight position={[0.05, 2.65, -0.96]} color="#b9b9ff" intensity={1.3} distance={3} decay={2} />
    <pointLight position={[1.9, 1.15, 1.35]} color="#7aadeb" intensity={1} distance={3} decay={2} />
    <Environment resolution={64} frames={1} environmentIntensity={0.5}>
      <color attach="background" args={['#6e8094']} />
      <Lightformer position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[6, 6, 1]} intensity={2} color="#ffe0b2" />
      <Lightformer position={[0, 0, 5]} rotation={[0, Math.PI, 0]} scale={[4, 3, 1]} intensity={2} color="#a4d9ff" />
      <Lightformer position={[-4, 1, 0]} rotation={[0, Math.PI / 2, 0]} scale={[2, 4, 1]} intensity={1.5} color="#ffbc7b" />
    </Environment>
    {/* Cove rails follow the existing architecture, leaving the walking area clear. */}
    {[
      { position: [cx, 3.015, -1.19], size: [3.52, 0.022, 0.026], color: '#ffce8e' },
      { position: [-1.28, 3.015, cz], size: [0.026, 0.022, 3.55], color: '#ffce8e' },
      { position: [2.34, 3.015, cz], size: [0.026, 0.022, 3.55], color: '#8bc8ef' },
      { position: [cx, 3.015, 2.44], size: [3.52, 0.022, 0.026], color: '#8bc8ef' },
      { position: [0.86, 1.143, -0.48], size: [1.68, 0.018, 0.018], color: '#70d9ed' },
    ].map((rail, i) => <mesh key={i} position={rail.position}>
      <boxGeometry args={rail.size} /><meshStandardMaterial color={rail.color} emissive={rail.color} emissiveIntensity={2} roughness={0.4} />
    </mesh>)}
  </group>;
}
