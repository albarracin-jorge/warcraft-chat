
import './App.css'
import { useEffect, useState } from 'react'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { ChatView } from '@/components/ChatView'
import { LoadingScreen } from '@/components/LoadingScreen'
import { fetchCsrfToken } from './lib/csrf'
import type { Race } from './lib/races'

function App() {
  const [playerName, setPlayerName] = useState<string | null>(null)
  const [playerRace, setPlayerRace] = useState<Race>("orc")
  const [chatRace, setChatRace] = useState<Race>("orc")
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    fetchCsrfToken().then(setCsrfToken);
  }, []);

  if (!csrfToken) {
    return <LoadingScreen />
  }

  if (!playerName) {
    return (
      <WelcomeScreen
        onEnter={(name, race, npcRace) => {
          setPlayerName(name)
          setPlayerRace(race)
          setChatRace(npcRace)
        }}
      />
    )
  }

  return (
    <ChatView
      playerName={playerName}
      playerRace={playerRace}
      chatRace={chatRace}
      csrfToken={csrfToken}
      onBack={() => setPlayerName(null)}
    />
  )
}

export default App
