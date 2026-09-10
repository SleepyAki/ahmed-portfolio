import { DoubleSide } from 'three';
import { ROOM, frontWallSections } from '../roomLayout';

const WALL_COLOR = '#344555';
const sections = frontWallSections();
export default function Walls() {
  const width = ROOM.maxX - ROOM.minX;
  const depth = ROOM.maxZ - ROOM.minZ;
  const height = ROOM.ceilY - ROOM.floorY;
  return <group>
    <mesh receiveShadow position={[ROOM.maxX, (ROOM.floorY + ROOM.ceilY)/2, (ROOM.minZ + ROOM.maxZ)/2]} rotation={[0, Math.PI/2, 0]}>
      <planeGeometry args={[depth, height]} /><meshStandardMaterial color={WALL_COLOR} roughness={0.96} side={DoubleSide} />
    </mesh>
    {sections.map((part, i) => <mesh key={i} castShadow receiveShadow position={part.position}>
      <planeGeometry args={part.size} /><meshStandardMaterial color={WALL_COLOR} roughness={0.96} side={DoubleSide} />
    </mesh>)}
    <mesh position={[(ROOM.minX+ROOM.maxX)/2, ROOM.ceilY, (ROOM.minZ+ROOM.maxZ)/2]} rotation={[Math.PI/2,0,0]}>
      <planeGeometry args={[width,depth]} /><meshStandardMaterial color="#59616f" roughness={1} side={DoubleSide} />
    </mesh>
  </group>;
}
