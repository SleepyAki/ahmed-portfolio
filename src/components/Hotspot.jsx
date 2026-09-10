import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Html } from '@react-three/drei';
import * as THREE from 'three';

function Label({ hotspot, active, position }) {
  return <Html center distanceFactor={3} position={position} zIndexRange={[10, 0]}>
    <div className={`hotspot-label ${active ? 'hotspot-label--active' : ''}`}>
      <span className="hotspot-icon" aria-hidden="true">{hotspot.icon}</span>
      <span className="hotspot-text">{hotspot.label}</span>
    </div>
  </Html>;
}

function OrbHotspot({ hotspot, active, reducedMotion }) {
  const ring = useRef();

  useFrame(({ clock }) => {
    if (!ring.current) return;
    ring.current.scale.setScalar((active ? 1.15 : 1) + (reducedMotion ? 0 : Math.sin(clock.elapsedTime * 1.8) * 0.04));
  });
  return <group position={hotspot.position}>
    <Billboard>
      <mesh ref={ring}>
        <ringGeometry args={[0.044, 0.055, 32]} />
        <meshBasicMaterial color={active ? '#fff0ce' : '#8bd3e2'} transparent opacity={active ? 1 : 0.65} side={THREE.DoubleSide} />
      </mesh>
      <mesh><circleGeometry args={[0.013, 16]} /><meshBasicMaterial color="#e7faff" /></mesh>
    </Billboard>
    {active && <Label hotspot={hotspot} active={active} position={[0, -0.13, 0]} />}
  </group>;
}

function PosterHotspot({ hotspot, active }) {

  return <group position={hotspot.position} rotation={[0, Math.PI / 2, 0]}>
    {[
      { position: [0, 0.315, 0.024], size: [0.49, 0.008, 0.008] },
      { position: [0, -0.315, 0.024], size: [0.49, 0.008, 0.008] },
      { position: [-0.245, 0, 0.024], size: [0.008, 0.63, 0.008] },
      { position: [0.245, 0, 0.024], size: [0.008, 0.63, 0.008] },
    ].map((edge, i) => <mesh key={i} position={edge.position}>
      <boxGeometry args={edge.size} /><meshBasicMaterial color={active ? '#fff0ce' : '#91bac5'} transparent opacity={active ? 0.95 : 0.45} />
    </mesh>)}
    {active && <Label hotspot={hotspot} active={active} position={[0, -0.41, 0.035]} />}
  </group>;
}

export default function Hotspot(props) {
  return props.hotspot.variant === 'poster' ? <PosterHotspot {...props} /> : <OrbHotspot {...props} />;
}
