import { useState } from 'react'

let chatLoad
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = resolve
    script.onerror = () => {
      script.remove()
      reject(new Error('Chat could not load'))
    }
    document.body.appendChild(script)
  })
}

export default function ChatLauncher() {
  const [status, setStatus] = useState('idle')
  const startChat = async () => {
    setStatus('loading')
    try {
      if (!chatLoad) {
        chatLoad = (async () => {
          if (!window.botpress) await loadScript('https://cdn.botpress.cloud/webchat/v2.2/inject.js')
          await loadScript('https://files.bpcontent.cloud/2026/01/21/10/20260121100308-TA52U22J.js')
        })().catch(error => { chatLoad = null; throw error })
      }
      await chatLoad
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'ready') return null
  return <div className="chat-launcher">
    {status === 'error' && <p role="alert">Chat couldn’t load. Retry or use the email link.</p>}
    <button type="button" onClick={startChat} disabled={status === 'loading'} aria-label="Load portfolio AI chat">
      {status === 'loading' ? 'Loading chat…' : 'AI chat'}
    </button>
  </div>
}
