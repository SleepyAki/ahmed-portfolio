import React, { useState, useEffect } from 'react';

const AkiMoodEngine = () => {
  const [currentMood, setCurrentMood] = useState('emerald');
  const [showDangoSecret, setShowDangoSecret] = useState(false);

  // Theme Definitions
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

  // 1. Persistence & Secret Logic
  useEffect(() => {
    // Load saved mood on mount
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

  // 2. Shatter Logic
  const triggerShatter = () => {
    const body = document.body;
    body.classList.add('shatter-active');
    setTimeout(() => body.classList.remove('shatter-active'), 400);
  };

  // 3. Theme Application Logic
  const applyMood = (moodKey, shouldAnimate = true) => {
    if (shouldAnimate) triggerShatter();
    
    // Delay variable swap to mid-shatter (150ms)
    setTimeout(() => {
      const root = document.documentElement;
      const moodData = moods[moodKey];
      Object.keys(moodData).forEach((variable) => {
        root.style.setProperty(variable, moodData[variable]);
      });
      setCurrentMood(moodKey);
      localStorage.setItem('selectedMood', moodKey);
    }, shouldAnimate ? 150 : 0);
  };

  return (
    <div className="mood-engine-widget floating-widget float-medium">
      <div className="widget-header">
        <div className="icon-circle"></div>
        <span className="widget-label">AKI MOOD ENGINE</span>
      </div>
      
      <div className="mood-controls">
        <button onClick={() => applyMood('emerald')} className="mood-btn emerald" title="Default Emerald"></button>
        <button onClick={() => applyMood('clannad')} className="mood-btn clannad" title="Dango Mode"></button>
        <button onClick={() => applyMood('evergarden')} className="mood-btn evergarden" title="Memory Mode"></button>
        <button onClick={() => applyMood('gearFourth')} className="mood-btn gear-fourth" title="Haki Mode"></button>
      </div>

      {showDangoSecret && (
        <div className="dango-reveal">🍡 <span>Big Dango Family!</span></div>
      )}

      <style jsx>{`
        .mood-engine-widget {
          position: fixed;
          top: 135px; right: 30px;
          display: flex; flex-direction: column; gap: 12px;
          min-width: 180px; z-index: 1001;
          background: rgba(30, 41, 59, 0.85);
          backdrop-filter: blur(15px);
          padding: 18px; border-radius: 20px;
          border: 1px solid var(--primary);
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }
        .widget-header { display: flex; align-items: center; gap: 10px; }
        .widget-label { font-size: 0.65rem; font-weight: 900; color: var(--primary); letter-spacing: 2px; }
        .mood-controls { display: flex; justify-content: space-between; padding: 5px 5px 0; }
        .mood-btn {
          width: 28px; height: 28px; border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.1);
          cursor: pointer; transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .mood-btn:hover { transform: scale(1.3) rotate(10deg); border-color: white; }
        .mood-btn.emerald { background: #10b981; }
        .mood-btn.clannad { background: #ffb7c5; }
        .mood-btn.evergarden { background: #3b82f6; }
        .mood-btn.gear-fourth { background: #ef4444; }
        .dango-reveal {
          margin-top: 10px; font-size: 0.7rem; color: #ffb7c5;
          text-align: center; font-weight: bold; animation: popUp 0.5s ease;
        }
        @keyframes popUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default AkiMoodEngine;