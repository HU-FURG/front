/* eslint-disable prettier/prettier */
import { useState, useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Main from './components/Main'
import Login from './routers/Login'
import AppInfo from './components/AppInfo'
import { isTokenValid } from './utils/auth'

declare global {
  interface Window {
    electronAPI: {
      getAppVersion(): unknown
      onUpdateMessage: (callback: (message: string) => void) => void
      checkForUpdates: () => Promise<void>
    }
  }
}

type Page = 'scheduling' | 'rooms' | 'dashboard' | 'home'

function App(): React.JSX.Element {
  const [status, setStatus] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [page, setPage] = useState<Page>('home')
  const [login, setLogin] = useState(false)
  const [loading, setLoading] = useState(true)
  const hasCheckedUpdates = useRef(false)

  // 1️⃣ Verifica token JWT ao montar
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && isTokenValid(token)) {
      setLogin(true)
    } else {
      localStorage.removeItem('token')
      setLogin(false)
    }
    setLoading(false)
  }, [])

  // 2️⃣ Loading e atualizações do Electron (só roda se token válido)
  useEffect(() => {
    if (!login || hasCheckedUpdates.current) return

    hasCheckedUpdates.current = true
    window.electronAPI.onUpdateMessage((msg) => setStatus(msg))

    async function loadApp(): Promise<void> {
      try {
        setStatus('Carregando versão...')
        setStatus('Verificando atualizações...')

        await Promise.race([
          window.electronAPI.checkForUpdates(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
        ])

        setStatus('Atualização concluída, iniciando...')
        await new Promise(r => setTimeout(r, 1000))
      } catch {
        setStatus('Ignorando atualização por timeout ou erro')
        await new Promise(r => setTimeout(r, 1000))
      } finally {
        setStatus('')
      }
    }

    loadApp()
  }, [login])

  // 3️⃣ Logout
  const handleLogout = (): void => {
    localStorage.removeItem('token')
    setLogin(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="mb-4 text-gray-700">{status || 'Carregando...'}</div>
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>

        <style>{`
          .loader {
            border-top-color: #3498db;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
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

      {login ? (
        <>
          <Navbar
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            handleLogout={handleLogout}
          />
          <div className="flex flex-1 bg-gray-50">
            <Sidebar isOpen={sidebarOpen} onNavigate={setPage} />
            <Main page={page} />
          </div>
        </>
      ) : (
        <>
          <Login onLoginSuccess={() => setLogin(true)} />
          <AppInfo />
        </>
      )}
    </div>
  )
}

export default App
