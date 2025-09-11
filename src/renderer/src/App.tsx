/* eslint-disable prettier/prettier */
import { useState, useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar'
import Main from './components/Main'
import Login from './routers/Login'
import { handleLogout } from './services/UserRequests'
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

type Page = 'scheduling' | 'rooms' | 'dashboard' | 'home' | 'accounts' | 'reservations'


function App(): React.JSX.Element {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState<Page>('home')
  const [login, setLogin] = useState(true)
  const [loading, setLoading] = useState(true)
  const hasCheckedUpdates = useRef(false)

  // Verifica token JWT ao montar
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

  // Loading e atualizações do Electron
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
    <div className="relative flex flex-col h-screen bg-gray-50">
      {/* Status global */}
      {status && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black text-white rounded z-50">
          {status}
        </div>
      )}

      {login ? (
        <>
          {/* Fundo borrado quando a tela for maior que o conteúdo */}
          <div className="absolute inset-0 z-0 bg-gray-400 backdrop-blur-sm"></div>

          {/* Conteúdo centralizado */}
          <div className="relative z-10 flex flex-1 max-w-[1400px] w-full mx-auto xl:my-4 shadow-lg overflow-hidden bg-[var(--background)]">
            <Sidebar onNavigate={setPage} handleLogout={()=>handleLogout(setLogin)} activePage={page} />
            <Main page={page} />
          </div>
        </>
      ) : (
        <>
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
            <Login onLoginSuccess={() => setLogin(true)} />
          </div>
        </>
      )}
    </div>
  )
}

export default App
