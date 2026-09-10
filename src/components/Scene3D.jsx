import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Room from "./Room";
import StudioLighting from "./StudioLighting";
import StudioDetails from "./StudioDetails";
import "./Room.css";
import Walls from "./Walls";
import Windows from "./Windows";
import Player from "./Player";
import HotspotManager from "./HotspotManager";
import RoomLoader from "./RoomLoader";
import RoomHUD from "./RoomHUD";
import InfoModal from "./InfoModal";
import MobileControls from "./MobileControls";

const isTouchDevice = () =>
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0) &&
  window.matchMedia("(pointer: coarse)").matches;

const Scene3D = () => {
  const isMobile = useMemo(() => isTouchDevice(), []);
  const [locked, setLocked] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const [hasEnteredOnce, setHasEnteredOnce] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [openPanel, setOpenPanel] = useState(null);

  const mobileMoveRef = useRef({ x: 0, y: 0 });
  const mobileLookRef = useRef({ dx: 0, dy: 0 });

  const handleLockChange = useCallback((isLocked) => {
    setLocked(isLocked);
    if (isLocked) {
      setHasEnteredOnce((already) => {
        if (!already) window.dispatchEvent(new Event("room-entered"));
        return true;
      });
    }
  }, []);

  const requestLock = useCallback(() => {
    if (isMobile) {
      handleLockChange(true);
      // Best-effort landscape lock - most mobile browsers only allow the
      // Screen Orientation API inside fullscreen, and neither is
      // guaranteed to exist, so every step here is allowed to silently
      // fail; the CSS rotate-device prompt is the real fallback.
      document.documentElement.requestFullscreen?.().catch(() => {});
      screen.orientation?.lock?.("landscape").catch(() => {});
      return;
    }
    // PointerLockControls listens for a click on the canvas/document to
    // engage; we just need a user gesture to originate it.
    document.body.requestPointerLock?.();
  }, [isMobile, handleLockChange]);

  const activeIdRef = useRef(null);
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const openActivePanel = useCallback(() => {
    if (!activeIdRef.current) return;
    setOpenPanel(activeIdRef.current);
    if (!isMobile) {
      // Release the mouse lock so the (now visible) cursor can actually
      // click buttons inside the modal - clicking without a visible
      // cursor is otherwise impossible on desktop.
      document.exitPointerLock?.();
    }
  }, [isMobile]);

  // Listens on the whole window and checks document.pointerLockElement
  // directly, rather than relying on a click landing on the exact canvas
  // DOM node (drei's <Html> hotspot labels sit on top of it) or on React
  // state that lags one render behind the real lock/unlock event.
  useEffect(() => {
    if (isMobile) return undefined;
    const onPointerDown = (e) => {
      if (e.button !== 0) return;
      if (!document.pointerLockElement) return;
      openActivePanel();
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [isMobile, openActivePanel]);

  const closePanel = useCallback(() => setOpenPanel(null), []);

  // Authoritative lock-state detection, straight from the browser's own
  // event - independent of Player's internal controls wrapper, so a bug
  // there can't silently leave "locked" stuck false (which was blocking
  // both the interact prompt and the music autoplay tied to it).
  useEffect(() => {
    if (isMobile) return undefined;
    const onChange = () => handleLockChange(!!document.pointerLockElement);
    document.addEventListener("pointerlockchange", onChange);
    return () => document.removeEventListener("pointerlockchange", onChange);
  }, [isMobile, handleLockChange]);

  // Press "C" any time to toggle the cursor on/off (desktop only).
  useEffect(() => {
    if (isMobile) return;
    const onKeyDown = (e) => {
      if (e.code !== "KeyC" || openPanel || e.target.closest?.("input, textarea, select, button, [contenteditable]")) return;
      if (document.pointerLockElement) {
        document.exitPointerLock?.();
      } else {
        document.body.requestPointerLock?.();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobile, openPanel]);

  return (
    <div className="scene3d-container">
      <Canvas
        shadows
        dpr={[1, isMobile ? 1.25 : 1.5]}
        gl={{ antialias: true, toneMappingExposure: 1.05 }}
        camera={{ fov: 70, near: 0.05, far: 100 }}
      >
        <color attach="background" args={["#05060a"]} />
        <StudioLighting isMobile={isMobile} />


        <Suspense fallback={<RoomLoader />}>
          <Room reducedMotion={reducedMotion} />
          <Walls />
          <Windows />
          <StudioDetails />
          <HotspotManager
            locked={locked && !openPanel}
            activeId={activeId}
            onActiveChange={setActiveId}
            hidden={!!openPanel || !locked}
            reducedMotion={reducedMotion}
          />
        </Suspense>

        <Player
          locked={locked && !openPanel}
          isMobile={isMobile}
          mobileMoveRef={mobileMoveRef}
          mobileLookRef={mobileLookRef}
        />
      </Canvas>

      <RoomHUD
        locked={locked}
        activeId={activeId}
        panelOpen={!!openPanel}
        hasEnteredOnce={hasEnteredOnce}
        isMobile={isMobile}
        onEnter={requestLock}
      />

      {isMobile && locked && !openPanel && (
        <MobileControls
          moveRef={mobileMoveRef}
          lookRef={mobileLookRef}
          onTap={openActivePanel}
          hotspotActive={!!activeId}
        />
      )}

      <InfoModal panelId={openPanel} onClose={closePanel} />

      <div className="rotate-device-overlay">
        <div className="rotate-device-icon">📱</div>
        <p>Rotate your device to landscape to walk through the room.</p>
      </div>
    </div>
  );
};

export default Scene3D;
