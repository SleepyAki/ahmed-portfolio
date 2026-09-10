import React, { useEffect, useRef, useState } from "react";
import { PLAYLIST } from "../playlist";

// Self-hosted, native <audio> player. Deliberately simple: no third-party
// embed, no DRM, no cross-origin autoplay rules to fight - just a real
// audio element, which is what makes play/pause/next/previous/looping
// actually reliable.
const MusicPlayer = () => {
  const audioRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const wantsAutoplay = useRef(false);

  const next = () => setIndex((i) => (i + 1) % PLAYLIST.length);
  const prev = () => setIndex((i) => (i - 1 + PLAYLIST.length) % PLAYLIST.length);

  // Load whichever track `index` points to whenever it changes, and keep
  // playing across the change if we were already playing.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const wasPlaying = playing || wantsAutoplay.current;
    audio.src = PLAYLIST[index].src;
    if (wasPlaying) {
      audio.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Autoplay tied to the "enter the room" click (a real user gesture),
  // via a plain window event so it keeps working across switching to the
  // classic site and back.
  useEffect(() => {
    const onEnter = () => {
      wantsAutoplay.current = true;
      audioRef.current?.play().catch(() => {});
    };
    window.addEventListener("room-entered", onEnter);
    return () => window.removeEventListener("room-entered", onEnter);
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  };

  const track = PLAYLIST[index];

  return (
    <div className={`music-player ${expanded ? "music-player--expanded" : ""}`}>
      <audio
        ref={audioRef} preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={next}
        loop={PLAYLIST.length === 1}
      />

      {expanded ? (
        <>
          <div className="music-player-info">
            <div className="music-player-eq" data-playing={playing}>
              <span /><span /><span />
            </div>
            <div>
              <div className="music-player-title">{track.title}</div>
              <div className="music-player-artist">{track.artist}</div>
            </div>
          </div>
          <div className="music-player-controls">
            <button onClick={prev} aria-label="Previous track">⏮</button>
            <button onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
              {playing ? "⏸" : "▶"}
            </button>
            <button onClick={next} aria-label="Next track">⏭</button>
            <button onClick={() => setExpanded(false)} aria-label="Collapse player" className="music-player-collapse">
              ✕
            </button>
          </div>
        </>
      ) : (
        <button
          className="music-toggle"
          onClick={() => setExpanded(true)}
          aria-label="Open music player"
          title="Music"
        >
          {playing ? "🔊" : "🔈"}
        </button>
      )}
    </div>
  );
};

export default MusicPlayer;
