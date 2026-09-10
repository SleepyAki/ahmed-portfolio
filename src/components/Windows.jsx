import { useTexture } from '@react-three/drei';
import { DoubleSide, SRGBColorSpace } from 'three';
import { ROOM, WINDOW } from '../roomLayout';

export default function Windows() {
  const sunset = useTexture('/sunset-landscape.jpg', texture => { texture.colorSpace = SRGBColorSpace; });
  const { x, y, width: w, height: h, depth } = WINDOW;
  const z = ROOM.maxZ;
  return <group>
    {/* The backdrop sits outside a real opening, behind the deep reveals. */}
    <mesh position={[x, y + 0.06, z + 0.24]} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={[2.35, 2.35/1.5]} />
      <meshBasicMaterial map={sunset} color="#ded3d0" toneMapped={false} />
    </mesh>
    {[-1, 1].map(side => <group key={side}>
      <mesh position={[x + side*w/2, y, z + depth/2]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[depth, h]} /><meshStandardMaterial color="#5e4639" side={DoubleSide} roughness={0.85} />
      </mesh>
      <mesh position={[x, y + side*h/2, z + depth/2]} rotation={[Math.PI/2, 0, 0]}>
        <planeGeometry args={[w, depth]} /><meshStandardMaterial color="#5e4639" side={DoubleSide} roughness={0.85} />
      </mesh>
    </group>)}
    {[
      [0, h/2 + 0.037, w + 0.15, 0.075],
      [0, -h/2 - 0.037, w + 0.15, 0.075],
      [-w/2 - 0.037, 0, 0.075, h],
      [w/2 + 0.037, 0, 0.075, h],
    ].map(([dx,dy,width,height],i) => <mesh key={i} castShadow receiveShadow position={[x+dx,y+dy,z-0.026]}>
      <boxGeometry args={[width,height,0.10]} /><meshStandardMaterial color="#976e4b" roughness={0.66} />
    </mesh>)}
    {/* A slim asymmetric mullion leaves the sunset unobstructed. */}
    <mesh castShadow position={[x+w*0.24,y,z+0.045]}>
      <boxGeometry args={[0.024,h,0.042]} /><meshStandardMaterial color="#2a292d" roughness={0.5} metalness={0.15} />
    </mesh>
    <mesh receiveShadow position={[x,y-h/2-0.06,z-0.06]}>
      <boxGeometry args={[w+0.24,0.065,0.32]} /><meshStandardMaterial color="#b48b62" roughness={0.8} />
    </mesh>
    <mesh position={[x+w*0.24-0.03,y-0.14,z+0.016]}>
      <boxGeometry args={[0.015,0.095,0.025]} /><meshStandardMaterial color="#b09572" roughness={0.4} metalness={0.5} />
    </mesh>
    <Door x={1.56} wallZ={z} />
  </group>;
}

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
          emissiveIntensity={0.08}
          roughness={0.45}
          metalness={0.05}
        />
      </mesh>
      {/* Recessed panel detail */}
      <mesh position={[x, doorY + 0.34, doorZ - 0.039]}>
        <boxGeometry args={[DOOR_WIDTH - 0.18, 0.55, 0.015]} />
        <meshStandardMaterial color="#7a5837" roughness={0.5} />
      </mesh>
      <mesh position={[x, doorY - 0.34, doorZ - 0.039]}>
        <boxGeometry args={[DOOR_WIDTH - 0.18, 0.55, 0.015]} />
        <meshStandardMaterial color="#7a5837" roughness={0.5} />
      </mesh>
      {/* Handle */}
      <mesh position={[x + DOOR_WIDTH / 2 - 0.1, doorY, doorZ - 0.065]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial color="#b8a06a" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
};
