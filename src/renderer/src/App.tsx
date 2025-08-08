import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Main from './components/Main'
import { useState, useEffect } from 'react' // IMPORTANDO useEffect
import { BrowserRouter as Router } from 'react-router-dom'

declare global {
  interface Window {
    electronAPI: {
      onUpdateMessage: (callback: (message: string) => void) => void
    }
  }
}

type Page = 'scheduling' | 'rooms' | 'login' | 'dashboard' | 'home'

function App(): React.JSX.Element {
  const [status, setStatus] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [page, setPage] = useState<Page>('home')

  useEffect(() => {
    window.electronAPI.onUpdateMessage((msg) => {
      setStatus(msg)
    })
  }, [])

  return (
    <Router>
      <div className="flex flex-col h-screen">
        {/* Mensagem de update */}
        {status && (
          <div
            style={{
              marginTop: 20,
              padding: 10,
              background: '#222',
              color: '#fff',
              borderRadius: 5
            }}
          >
            {status}
          </div>
        )}

        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-1">
          <Sidebar isOpen={sidebarOpen} onNavigate={setPage} />
          <Main page={page} />
        </div>
      </div>
    </Router>
  )
}

export default App
