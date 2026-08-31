import React from "react";
import * as THREE from "three";

// The model only ships a back wall and a left wall (it's an open corner).
// These two fill in the missing right/front walls. Positions and the
// dark wall color were measured directly from the two existing walls in
// room.glb so they line up flush and match visually.
const ROOM = {
  minX: -1.426,
  maxX: 2.411,
  minZ: -1.327,
  maxZ: 2.509,
  floorY: 0.542,
  ceilY: 3.116,
};

const WALL_COLOR = "#050505"; // measured from the model's existing wall material

const Walls = () => {
  const width = ROOM.maxX - ROOM.minX;
  const depth = ROOM.maxZ - ROOM.minZ;
  const height = ROOM.ceilY - ROOM.floorY;
  const centerY = (ROOM.floorY + ROOM.ceilY) / 2;

  return (
    <group>
      {/* Right wall (+X side) */}
      <mesh position={[ROOM.maxX, centerY, (ROOM.minZ + ROOM.maxZ) / 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.85} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Front wall (+Z side) */}
      <mesh position={[(ROOM.minX + ROOM.maxX) / 2, centerY, ROOM.maxZ]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.85} metalness={0} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export default Walls;
export { ROOM };
