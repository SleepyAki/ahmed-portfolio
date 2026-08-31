import { useState } from 'react'
import './index.css'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import Scene3D from './components/Scene3D';
import ClassicSite from './components/ClassicSite';
import MusicPlayer from './components/MusicPlayer';

function App() {
  const [view, setView] = useState('classic'); // 'room' | 'classic'

  return (
    <>
      {view === 'room' ? (
        <>
          <Scene3D />
          <button className="classic-toggle-btn" onClick={() => setView('classic')}>
            📄 Classic Site
          </button>
        </>
      ) : (
        <ClassicSite onEnterRoom={() => setView('room')} />
      )}
      {/* Rendered here (not inside Scene3D) so it keeps playing across
          switches between the room and the classic site instead of
          restarting from a cold state each time. */}
      <MusicPlayer />
      <Analytics />
      <SpeedInsights />
    </>
  )
}

export default App
