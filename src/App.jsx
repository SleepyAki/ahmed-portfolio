import { Component, lazy, Suspense, useRef, useState } from 'react'
import './index.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import ClassicSite from './components/ClassicSite'
import MusicPlayer from './components/MusicPlayer'
import ChatLauncher from './components/ChatLauncher'

const Scene3D = lazy(() => import('./components/Scene3D'))

class RoomBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <div className="room-status" role="alert"><h1>The room couldn't load.</h1><p>You can still explore all my work in the portfolio.</p><button onClick={this.props.onBack}>Back to portfolio</button></div>
    return this.props.children
  }
}

function App() {
  const [view, setView] = useState('classic')
  const scrollPosition = useRef(0)
  const enterRoom = () => {
    scrollPosition.current = window.scrollY
    setView('room')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  const leaveRoom = () => {
    document.exitPointerLock?.()
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
    screen.orientation?.unlock?.()
    setView('classic')
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollPosition.current, behavior: 'instant' })
      document.querySelector('.room-link')?.focus({ preventScroll: true })
    })
  }
  return (
    <>
      {view === 'room' ? <>
        <RoomBoundary onBack={leaveRoom}>
          <Suspense fallback={<div className="room-status" role="status"><h1>Opening the room…</h1><p>Loading the interactive experience.</p></div>}><Scene3D /></Suspense>
        </RoomBoundary>
        <button className="classic-toggle-btn" onClick={leaveRoom}>← Back to portfolio</button>
      </> : <ClassicSite onEnterRoom={enterRoom} />}
      <MusicPlayer />
      <ChatLauncher />
      <Analytics />
      <SpeedInsights />
    </>
  )
}
export default App
