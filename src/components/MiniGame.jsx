import React, { useEffect, useRef, useState } from "react";

const GAME_SECONDS = 30;
const LEADERBOARD_KEY = "room-game-leaderboard";
const LEADERBOARD_SIZE = 10;

const DIFFICULTIES = {
  easy: { label: "Easy", spawnMs: 1100, lifetimeMs: 1900, targetSize: 42 },
  normal: { label: "Normal", spawnMs: 850, lifetimeMs: 1400, targetSize: 34 },
  hard: { label: "Hard", spawnMs: 600, lifetimeMs: 950, targetSize: 26 },
};

const loadLeaderboard = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

const saveLeaderboard = (list) => {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list));
  } catch {
    // ignore storage errors
  }
};

// Small original "click the target before it fades" reaction game - no
// external assets. Difficulty changes spawn rate/target lifetime/size;
// a top-10 leaderboard (per difficulty) is kept in localStorage.
const MiniGame = () => {
  const [phase, setPhase] = useState("menu"); // menu | playing | ended
  const [difficulty, setDifficulty] = useState("normal");
  const [targets, setTargets] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [leaderboard, setLeaderboard] = useState(loadLeaderboard);
  const [nameInput, setNameInput] = useState("");
  const [savedThisRound, setSavedThisRound] = useState(false);

  const spawnTimer = useRef(null);
  const countdownTimer = useRef(null);
  const idCounter = useRef(0);

  const settings = DIFFICULTIES[difficulty];

  const boardFor = (diff) =>
    leaderboard.filter((e) => e.difficulty === diff).sort((a, b) => b.score - a.score).slice(0, LEADERBOARD_SIZE);

  const currentBoard = boardFor(difficulty);
  const qualifiesForTop10 = score > 0 && (currentBoard.length < LEADERBOARD_SIZE || score > currentBoard[currentBoard.length - 1].score);

  const start = () => {
    setScore(0);
    setTimeLeft(GAME_SECONDS);
    setTargets([]);
    setSavedThisRound(false);
    setNameInput("");
    setPhase("playing");
  };

  useEffect(() => {
    if (phase !== "playing") return undefined;

    spawnTimer.current = setInterval(() => {
      const id = idCounter.current++;
      const x = 8 + Math.random() * 80;
      const y = 8 + Math.random() * 78;
      setTargets((prev) => [...prev, { id, x, y }]);
      setTimeout(() => {
        setTargets((prev) => prev.filter((t) => t.id !== id));
      }, settings.lifetimeMs);
    }, settings.spawnMs);

    countdownTimer.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(spawnTimer.current);
          clearInterval(countdownTimer.current);
          setTargets([]);
          setPhase("ended");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(spawnTimer.current);
      clearInterval(countdownTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const hit = (id) => {
    setTargets((prev) => prev.filter((t) => t.id !== id));
    setScore((s) => s + 1);
  };

  const submitScore = () => {
    const name = nameInput.trim().slice(0, 16) || "Anonymous";
    const entry = { name, score, difficulty, date: Date.now() };
    const updated = [...leaderboard, entry];
    setLeaderboard(updated);
    saveLeaderboard(updated);
    setSavedThisRound(true);
  };

  return (
    <div className="minigame">
      {phase === "menu" && (
        <div className="minigame-menu">
          <p className="minigame-menu-label">Choose difficulty</p>
          <div className="minigame-difficulty-row">
            {Object.entries(DIFFICULTIES).map(([key, d]) => (
              <button
                key={key}
                className={`minigame-diff-btn ${difficulty === key ? "minigame-diff-btn--active" : ""}`}
                onClick={() => setDifficulty(key)}
              >
                {d.label}
              </button>
            ))}
          </div>
          <button className="cta-button" onClick={start}>Start</button>

          {currentBoard.length > 0 && (
            <div className="minigame-leaderboard">
              <h4>Top 10 - {settings.label}</h4>
              <ol>
                {currentBoard.map((e, i) => (
                  <li key={i}>
                    <span>{e.name}</span>
                    <span>{e.score}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {phase !== "menu" && (
        <>
          <div className="minigame-hud">
            <span>Score: {score}</span>
            <span>{settings.label}</span>
            <span>{phase === "playing" ? `${timeLeft}s` : "Done"}</span>
          </div>

          <div className="minigame-field">
            {targets.map((t) => (
              <button
                key={t.id}
                className="minigame-target"
                style={{ left: `${t.x}%`, top: `${t.y}%`, width: settings.targetSize, height: settings.targetSize }}
                onClick={() => hit(t.id)}
              />
            ))}

            {phase === "ended" && (
              <div className="minigame-overlay">
                <p className="minigame-final-score">Final score: {score}</p>

                {qualifiesForTop10 && !savedThisRound && (
                  <div className="minigame-name-entry">
                    <p>Top 10! Enter your name:</p>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Your name"
                      maxLength={16}
                      onKeyDown={(e) => e.key === "Enter" && submitScore()}
                    />
                    <button className="cta-button" onClick={submitScore}>Save</button>
                  </div>
                )}

                <div className="minigame-end-actions">
                  <button className="cta-button" onClick={start}>Play Again</button>
                  <button className="cx-btn" onClick={() => setPhase("menu")}>Menu</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MiniGame;
