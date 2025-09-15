/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'

let mainWindow: BrowserWindow | null = null

// lista de hosts permitidos (apenas esses terão certificados aceitos)
const ALLOWED_HOSTS = ['precious-reyna-hu-furg-b9ddc9e2.koyeb.app']

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = true

function sendStatusToWindow(message: string) {
  if (mainWindow) {
    mainWindow.webContents.send('update-message', message)
  }
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 670,
    icon: join(__dirname, '../../resources/icon.png'),
    title: 'HU_FURG',
    minWidth: 1000,
    minHeight: 670,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.loadURL('https://precious-reyna-hu-furg-b9ddc9e2.koyeb.app/')
  mainWindow.setTitle('HU_FURG App')

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  autoUpdater.on('download-progress', (progress) => {
    const percent = Math.round(progress.percent)
    mainWindow?.webContents.send('update-message', `Baixando atualização... ${percent}%`)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.setName('HU_FURG App')

// intercepta erros de certificado
app.on('certificate-error', (event, _webContents, url, _error, _certificate, callback) => {
  try {
    const { hostname } = new URL(url)
    if (ALLOWED_HOSTS.includes(hostname)) {
      event.preventDefault()
      callback(true) // aceita só para o host da lista
      console.log(`✅ Certificado aceito para: ${hostname}`)
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // se URL inválida -> não confiar
  }
  console.warn(`❌ Certificado rejeitado para: ${url}`)
  callback(false)
})

ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

ipcMain.handle('check-for-updates', () => {
  return new Promise<void>((resolve, reject) => {
    function cleanup() {
      autoUpdater.removeListener('error', onError)
      autoUpdater.removeListener('update-available', onUpdateAvailable)
      autoUpdater.removeListener('update-not-available', onUpdateNotAvailable)
      autoUpdater.removeListener('update-downloaded', onUpdateDownloaded)
    }

    function onError(err: Error) {
      cleanup()
      sendStatusToWindow(`Erro no update: ${err.message || 'desconhecido'}`)
      reject(err)
    }

    function onUpdateAvailable() {
      mainWindow?.webContents.send('update-message', 'Update disponível! Iniciando download...')
      autoUpdater.downloadUpdate()
    }

    function onUpdateNotAvailable() {
      cleanup()
      sendStatusToWindow(`Nenhuma atualização disponível. Versão atual: ${app.getVersion()}`)
      resolve()
    }

    function onUpdateDownloaded() {
      cleanup()
      sendStatusToWindow(`Atualização baixada. Instalando agora ...`)
      autoUpdater.quitAndInstall()
    }

    autoUpdater.once('error', onError)
    autoUpdater.once('update-available', onUpdateAvailable)
    autoUpdater.once('update-not-available', onUpdateNotAvailable)
    autoUpdater.once('update-downloaded', onUpdateDownloaded)

    sendStatusToWindow(`Verificando atualizações... Versão atual: ${app.getVersion()}`)
    autoUpdater.checkForUpdates()
  })
})

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  sendStatusToWindow(`Verificando atualizações... Versão atual: ${app.getVersion()}`)

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
