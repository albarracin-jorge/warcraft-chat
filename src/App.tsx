
import './App.css'
import { useEffect, useState } from 'react'
import { WelcomeScreen } from '@/components/WelcomeScreen'
import { ChatView } from '@/components/ChatView'
import { fetchCsrfToken } from './lib/csrf'

function App() {
  const [playerName, setPlayerName] = useState<string | null>(null)
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  useEffect(() => {
    console.log('c ejecuta');
    
    fetchCsrfToken().then(setCsrfToken);
  }, []);
  if (!playerName) {
    return <WelcomeScreen onEnter={setPlayerName} />
  }

  return <ChatView playerName={playerName} csrfToken={csrfToken} onBack={() => setPlayerName(null)} />
}

export default App
