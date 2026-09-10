// The window and wall opening share these measurements so no wall covers the view.
export const ROOM = {
  minX: -1.426, maxX: 2.411,
  minZ: -1.327, maxZ: 2.509,
  floorY: 0.542, ceilY: 3.116,
};
export const WINDOW = { x: 0.1, y: 1.9, width: 1.4, height: 1.12, depth: 0.16 };
export function frontWallSections() {
  const left = WINDOW.x - WINDOW.width / 2;
  const right = WINDOW.x + WINDOW.width / 2;
  const bottom = WINDOW.y - WINDOW.height / 2;
  const top = WINDOW.y + WINDOW.height / 2;
  return [
    [ROOM.minX, left, ROOM.floorY, ROOM.ceilY],
    [right, ROOM.maxX, ROOM.floorY, ROOM.ceilY],
    [left, right, ROOM.floorY, bottom],
    [left, right, top, ROOM.ceilY],
  ].map(([x1, x2, y1, y2]) => ({ position: [(x1+x2)/2, (y1+y2)/2, ROOM.maxZ], size: [x2-x1, y2-y1] }));
}
