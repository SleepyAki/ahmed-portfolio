import React, { useState, useEffect } from 'react';

const AkiMoodEngine = () => {
  const [currentMood, setCurrentMood] = useState('emerald');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDangoSecret, setShowDangoSecret] = useState(false);

  const moods = {
    emerald: {
      "--bg": "#0f172a", "--card-bg": "#1e293b", "--primary": "#10b981",
      "--secondary": "#2dd4bf", "--primary-glow": "rgba(16, 185, 129, 0.4)", "--text": "#f1f5f9"
    },
    clannad: {
      "--bg": "#1a0f14", "--card-bg": "#2d1b24", "--primary": "#ffb7c5",
      "--secondary": "#f472b6", "--primary-glow": "rgba(255, 183, 197, 0.4)", "--text": "#ffd1dc"
    },
    evergarden: {
      "--bg": "#0a1128", "--card-bg": "#16224f", "--primary": "#3b82f6",
      "--secondary": "#fbbf24", "--primary-glow": "rgba(59, 130, 246, 0.4)", "--text": "#e0e7ff"
    },
    gearFourth: {
      "--bg": "#1a0505", "--card-bg": "#2d0b0b", "--primary": "#ef4444",
      "--secondary": "#f59e0b", "--primary-glow": "rgba(239, 68, 68, 0.4)", "--text": "#fee2e2"
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('selectedMood');
    if (saved && moods[saved]) applyMood(saved, false);

    let timer;
    if (currentMood === 'clannad') {
      timer = setTimeout(() => setShowDangoSecret(true), 60000); 
    } else {
      setShowDangoSecret(false);
      if (timer) clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [currentMood]);

  const triggerShatter = () => {
    document.body.classList.add('shatter-active');
    setTimeout(() => document.body.classList.remove('shatter-active'), 450);
  };

  const applyMood = (moodKey, shouldAnimate = true) => {
    if (shouldAnimate) triggerShatter();
    
    setTimeout(() => {
      const root = document.documentElement;
      const moodData = moods[moodKey];
      Object.keys(moodData).forEach((variable) => {
        root.style.setProperty(variable, moodData[variable]);
      });
      setCurrentMood(moodKey);
      localStorage.setItem('selectedMood', moodKey);
      // Optional: Auto-collapse after selection
      if (shouldAnimate) setIsExpanded(false);
    }, shouldAnimate ? 150 : 0);
  };

  return (
    <div className={`mood-engine-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button className="main-toggle" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? '✕' : '✨'}
      </button>

      <div className="mood-controls">
        <button onClick={() => applyMood('emerald')} className="mood-btn emerald" title="Emerald"></button>
        <button onClick={() => applyMood('clannad')} className="mood-btn clannad" title="Dango"></button>
        <button onClick={() => applyMood('evergarden')} className="mood-btn evergarden" title="Memory"></button>
        <button onClick={() => applyMood('gearFourth')} className="mood-btn gear-fourth" title="Haki"></button>
      </div>

      {showDangoSecret && isExpanded && (
        <div className="dango-reveal">🍡</div>
      )}

      <style jsx>{`
        .mood-engine-container {
          position: fixed;
          bottom: 30px;
          left: 30px;
          z-index: 9998;
          display: flex;
          align-items: center;
          background: rgba(30, 41, 59, 0.85);
          backdrop-filter: blur(15px);
          border: 1px solid var(--primary);
          border-radius: 50px;
          padding: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          overflow: hidden;
        }

        .collapsed { width: 50px; height: 50px; }
        .expanded { width: 240px; height: 50px; gap: 12px; padding: 8px 15px; }

        .main-toggle {
          background: none; border: none; color: var(--primary);
          font-size: 1.2rem; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          min-width: 34px; height: 34px; z-index: 2;
        }

        .mood-controls {
          display: flex; gap: 12px; opacity: 0; transform: translateX(-20px);
          transition: all 0.3s ease; pointer-events: none;
        }

        .expanded .mood-controls {
          opacity: 1; transform: translateX(0); pointer-events: auto;
        }

        .mood-btn {
          width: 28px; height: 28px; border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.1);
          cursor: pointer; transition: 0.3s ease;
        }

        .mood-btn:hover { transform: scale(1.2); border-color: white; }
        .mood-btn.emerald { background: #10b981; }
        .mood-btn.clannad { background: #ffb7c5; }
        .mood-btn.evergarden { background: #3b82f6; }
        .mood-btn.gear-fourth { background: #ef4444; }

        .dango-reveal { margin-left: 5px; font-size: 1rem; }

        @media (max-width: 768px) {
          .mood-engine-container { bottom: 20px; left: 20px; }
          .expanded { width: 220px; }
        }
      `}</style>
    </div>
  );
};

export default AkiMoodEngine;