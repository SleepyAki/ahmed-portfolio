import React, { useCallback, useRef } from "react";

// Left half of the screen = move (drag direction sets a walk vector,
// like a touch joystick anchored wherever you first touch). Right half =
// look (drag to rotate the camera). Both are full-height zones rather
// than a small stick, so it's comfortable to use one-handed.
const MobileControls = ({ moveRef, lookRef, onTap, hotspotActive }) => {
  const moveTouchId = useRef(null);
  const moveOrigin = useRef({ x: 0, y: 0 });
  const moveMaxRadius = 60;

  const lookTouchId = useRef(null);
  const lookStart = useRef({ x: 0, y: 0, t: 0 });
  const lookLast = useRef({ x: 0, y: 0 });

  const handleMoveStart = useCallback((e) => {
    const touch = e.changedTouches[0];
    moveTouchId.current = touch.identifier;
    moveOrigin.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleMoveMove = useCallback((e) => {
    const touch = Array.from(e.changedTouches).find((t) => t.identifier === moveTouchId.current);
    if (!touch) return;
    e.preventDefault();

    let dx = touch.clientX - moveOrigin.current.x;
    let dy = touch.clientY - moveOrigin.current.y;
    const dist = Math.min(Math.hypot(dx, dy), moveMaxRadius);
    const angle = Math.atan2(dy, dx);
    dx = Math.cos(angle) * dist;
    dy = Math.sin(angle) * dist;

    moveRef.current.x = dx / moveMaxRadius;
    moveRef.current.y = dy / moveMaxRadius;
  }, [moveRef]);

  const handleMoveEnd = useCallback((e) => {
    const touch = Array.from(e.changedTouches).find((t) => t.identifier === moveTouchId.current);
    if (!touch) return;
    moveTouchId.current = null;
    moveRef.current.x = 0;
    moveRef.current.y = 0;
  }, [moveRef]);

  const handleLookStart = useCallback((e) => {
    const touch = e.changedTouches[0];
    lookTouchId.current = touch.identifier;
    lookStart.current = { x: touch.clientX, y: touch.clientY, t: performance.now() };
    lookLast.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleLookMove = useCallback((e) => {
    const touch = Array.from(e.changedTouches).find((t) => t.identifier === lookTouchId.current);
    if (!touch) return;
    e.preventDefault();

    const dx = touch.clientX - lookLast.current.x;
    const dy = touch.clientY - lookLast.current.y;
    lookLast.current = { x: touch.clientX, y: touch.clientY };

    lookRef.current.dx += dx;
    lookRef.current.dy += dy;
  }, [lookRef]);

  const handleLookEnd = useCallback((e) => {
    const touch = Array.from(e.changedTouches).find((t) => t.identifier === lookTouchId.current);
    if (!touch) return;
    lookTouchId.current = null;

    const dist = Math.hypot(touch.clientX - lookStart.current.x, touch.clientY - lookStart.current.y);
    const duration = performance.now() - lookStart.current.t;
    // A short, small-movement touch counts as a tap - interact with
    // whatever hotspot the crosshair is currently over.
    if (dist < 12 && duration < 350 && hotspotActive) {
      onTap();
    }
  }, [hotspotActive, onTap]);

  return (
    <>
      <div
        className="mobile-zone mobile-zone--move"
        onTouchStart={handleMoveStart}
        onTouchMove={handleMoveMove}
        onTouchEnd={handleMoveEnd}
      >
        <span className="mobile-zone-hint">MOVE</span>
      </div>
      <div
        className="mobile-zone mobile-zone--look"
        onTouchStart={handleLookStart}
        onTouchMove={handleLookMove}
        onTouchEnd={handleLookEnd}
      >
        <span className="mobile-zone-hint">LOOK / TAP</span>
      </div>
    </>
  );
};

export default MobileControls;
