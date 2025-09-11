/* eslint-disable prettier/prettier */
import { useState, useEffect, JSX } from 'react'
import Sidebar from './components/Sidebar'
import Main from './components/Main'
import Login from './routers/Login'
import { handleLogout } from './services/UserRequests'
import { isTokenValid } from './utils/auth'
import logo from './assets/logo.png'

const isDev = !window.electronAPI.getAppVersion || process.env.NODE_ENV === "development"

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
  const [status, setStatus] = useState("Inicializando...")
  const [isReady, setIsReady] = useState(false) // controla atualização
  const [page, setPage] = useState<Page>('home')
  const [login, setLogin] = useState(false) // começa falso
  const [checkedToken, setCheckedToken] = useState(false) // controla token

  // Estado para exibir pop-up de atualização baixada
  const [updateDownloaded, setUpdateDownloaded] = useState(false)

  // 1. Recebe mensagens de status do autoUpdater
  useEffect(() => {
    window.electronAPI.onUpdateMessage((msg) => {
      setStatus(msg)
      if (msg.toLowerCase().includes("baixada")) {
        setUpdateDownloaded(true)
      }
    })
  }, [])

  // 2. Checa updates antes de qualquer coisa
useEffect(() => {
  async function initApp(): Promise<void> {
    try {
      if (isDev) {
        console.log("Skip checkForUpdates because app is in dev mode")
        setStatus("Modo dev: atualização ignorada")
        await new Promise(r => setTimeout(r, 3000))
        setStatus('')
      } else {
        setStatus("Verificando atualizações...")
        window.electronAPI.checkForUpdates()
        setStatus("Aplicativo pronto! Download da atualização, se houver, em background...")
        await new Promise(r => setTimeout(r, 1000))
        setStatus('')
      }
    } catch (err) {
      console.error(err)
      setStatus("Erro ao verificar atualização. Iniciando app...")
      await new Promise(r => setTimeout(r, 1000))
    } finally {
      setIsReady(true)
    }
  }

  initApp()
}, [])
  // download verificação
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null)

  useEffect(() => {
    window.electronAPI.onUpdateMessage((msg) => {
      setStatus(msg)
      if (msg.toLowerCase().includes("baixando")) {
        // Extrai o número da mensagem, ex: "Baixando atualização... 35%"
        const match = msg.match(/(\d+)%/)
        if (match) setDownloadProgress(Number(match[1]))
      } else if (msg.toLowerCase().includes("baixada")) {
        setDownloadProgress(100)
        setUpdateDownloaded(true)
      }
    })
  }, [])



  // 3. Só depois do update validar token
  useEffect(() => {
    if (!isReady) return
    const token = localStorage.getItem('token')
    if (token && isTokenValid(token)) {
      setLogin(true)
    } else {
      localStorage.removeItem('token')
      setLogin(false)
    }
    setCheckedToken(true)
  }, [isReady])

  // 4. Tela de loading inicial
  if (!isReady || !checkedToken) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-green-50">
        {/* Ícone no topo */}
        <div className="mb-4">
          <img src={logo} alt="Ícone do App" className="w-16 h-16" />
        </div>

        {/* Status */}
        <div className="mb-4 text-green-900 font-medium">{status || 'Carregando...'}</div>

        {/* Loader verde */}
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-green-200 h-12 w-12"></div>

        {/* Estilo do loader */}
        <style>{`
          .loader {
            border-top-color: #00A86B;
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

  // 5. Pop-up de atualização baixada
  const UpdatePopup = ():JSX.Element => (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded shadow-lg z-50">
      Atualização baixada! Reinicie o app para aplicar.
      <button
        className="ml-4 bg-green-900 px-2 py-1 rounded"
        onClick={() => setUpdateDownloaded(false)}
      >
        Fechar
      </button>
    </div>
  )

  // 6. App normal
  return (
    <div className="relative flex flex-col h-screen bg-gray-50">
      {status && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black text-white rounded z-50">
          {status}
        </div>
      )}

      {login ? (
        <>
          <div className="absolute inset-0 z-0 bg-gray-400 backdrop-blur-sm"></div>
          <div className="relative z-10 flex flex-1 max-w-[1400px] w-full mx-auto xl:my-4 shadow-lg overflow-hidden bg-[var(--background)]">
            <Sidebar onNavigate={setPage} handleLogout={()=>handleLogout(setLogin)} activePage={page} />
            <Main page={page} />
          </div>
        </>
      ) : (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          <Login onLoginSuccess={() => setLogin(true)} />
        </div>
      )}

      {updateDownloaded && <UpdatePopup />}
      {downloadProgress !== null && downloadProgress < 100 && (
        <div className="w-64 h-4 bg-gray-200 rounded mt-2">
          <div
            className="h-4 bg-green-600 rounded"
            style={{ width: `${downloadProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  )
}



export default App
