// Simple axis-aligned rectangles (X/Z footprint only - the player's eye
// height is fixed, so this is effectively a 2D problem) blocking walking
// through the room's furniture. Coordinates measured from the actual
// model, not guessed. A small pad softens the edge so you don't feel
// like you're catching on an invisible wall exactly at the mesh surface.
export const COLLIDERS = [
  { minX: -1.42, maxX: -0.18, minZ: -0.32, maxZ: 1.98, pad: 0.12 }, // bed
  { minX: 0.05, maxX: 1.95, minZ: -1.35, maxZ: 0.08, pad: 0.12 }, // desk + chair + PC
  { minX: -1.42, maxX: -0.68, minZ: 1.55, maxZ: 2.35, pad: 0.1 }, // dresser
];

export function collides(x, z) {
  return COLLIDERS.some(
    (c) => x > c.minX - c.pad && x < c.maxX + c.pad && z > c.minZ - c.pad && z < c.maxZ + c.pad
  );
}
