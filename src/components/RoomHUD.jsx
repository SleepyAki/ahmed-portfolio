import React from "react";
import { HOTSPOTS } from "../hotspots";

const RoomHUD = ({ locked, activeId, panelOpen, hasEnteredOnce, isMobile, onEnter }) => {
  const activeHotspot = HOTSPOTS.find((h) => h.id === activeId);

  return (
    <>
      {locked && !panelOpen && (
        <>
          <div className="crosshair" data-active={!!activeHotspot} />
          {activeHotspot && (
            <div className="interact-prompt">
              {isMobile ? "Tap to open " : "Click to open "}
              <strong>{activeHotspot.label}</strong>
            </div>
          )}
          {!isMobile && (
            <div className="room-controls-hint">
              WASD to walk · Mouse to look · Esc or C to release cursor
            </div>
          )}
        </>
      )}

      {/* Full intro splash - only ever shown once per visit */}
      {!locked && !panelOpen && !hasEnteredOnce && (
        <div className="room-start-overlay" onClick={onEnter} onTouchEnd={onEnter}>
          <div className="room-start-card">
            <h2>Step Into My Room</h2>
            <p>
              {isMobile
                ? "Drag to look around, use the joystick to walk, and tap the glowing markers to learn more about me."
                : "Walk around with WASD, look with your mouse, and click the glowing markers to learn more about me."}
            </p>
            <button className="cta-button">{isMobile ? "Tap to Enter" : "Click to Enter"}</button>
          </div>
        </div>
      )}

      {/* After the first entry, losing the cursor (desktop) never shows the
          big splash again - just a small unobtrusive bar to resume. */}
      {!locked && !panelOpen && hasEnteredOnce && !isMobile && (
        <div className="room-resume-bar" onClick={onEnter}>
          Click to resume walking
        </div>
      )}
    </>
  );
};

export default RoomHUD;
