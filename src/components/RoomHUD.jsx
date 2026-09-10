import { useProgress } from '@react-three/drei';
import { HOTSPOTS } from '../hotspots';

export default function RoomHUD({ locked, activeId, panelOpen, hasEnteredOnce, isMobile, onEnter }) {
  const activeHotspot = HOTSPOTS.find(h => h.id === activeId);
  const { active: loading, progress } = useProgress();
  return <>
    {!panelOpen && <div className="studio-caption"><span>AHMED'S ROOM</span><span>A little corner of my world.</span></div>}
    {locked && !panelOpen && <>
      <div className="crosshair" data-active={!!activeHotspot} />
      {activeHotspot && <div className="interact-prompt">{isMobile ? 'Tap to explore' : 'Click to explore'} <strong>{activeHotspot.label}</strong></div>}
      {!isMobile && <div className="room-controls-hint"><span><kbd>W A S D</kbd> Walk</span><span>Mouse to look</span><span><kbd>ESC</kbd> Release cursor</span></div>}
    </>}
    {!locked && !panelOpen && !hasEnteredOnce && <div className="room-start-overlay">
      <div className="room-start-card">
        <p className="room-eyebrow">WELCOME TO MY SPACE</p>
        <h2>Make yourself<br />at home.</h2>
        <p>{isMobile ? 'Use the joystick to walk, drag to look around, and tap a marker to explore.' : 'Walk around, take a closer look, and discover the work behind the objects.'}</p>
        {!isMobile && <div className="room-start-controls"><span><kbd>W A S D</kbd> Move</span><span><kbd>MOUSE</kbd> Look</span></div>}
        <button className="room-enter-button" onClick={onEnter} disabled={loading}>{loading ? `Preparing the room… ${Math.round(progress)}%` : 'Take a look around'} <span aria-hidden="true">→</span></button>
        <span className="room-start-note">The posters, desk, and mirror have a story to tell.</span>
      </div>
    </div>}
    {!locked && !panelOpen && hasEnteredOnce && !isMobile && <button className="room-resume-bar" onClick={onEnter}>Resume exploring <span aria-hidden="true">→</span></button>}
  </>;
}
