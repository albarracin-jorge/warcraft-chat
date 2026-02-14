
import './App.css'
import { useState } from 'react'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { ChatView } from '@/components/ChatView'

function App() {
  const [playerName, setPlayerName] = useState<string | null>(null)

  if (!playerName) {
    return <WelcomeScreen onEnter={setPlayerName} />
  }

  return <ChatView playerName={playerName} onBack={() => setPlayerName(null)} />
}

export default App
