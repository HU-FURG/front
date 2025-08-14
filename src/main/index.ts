/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'

let mainWindow: BrowserWindow | null = null

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
    minWidth: 1000,
    minHeight: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? {} : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
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

ipcMain.handle('get-app-version', () => {
  return app.getVersion()
})

ipcMain.handle('check-for-updates', () => {
  return new Promise<void>((resolve, reject) => {
    function cleanup() {
      autoUpdater.removeListener('error', onError)
      autoUpdater.removeListener('update-not-available', onUpdateNotAvailable)
      autoUpdater.removeListener('update-downloaded', onUpdateDownloaded)
    }

    function onError(err: Error) {
      cleanup()
      sendStatusToWindow(`Erro no update: ${err.message || 'desconhecido'}`)
      reject(err)
    }

    function onUpdateNotAvailable() {
      cleanup()
      sendStatusToWindow(`Nenhuma atualização disponível. Versão atual: ${app.getVersion()}`)
      resolve()
    }

    function onUpdateDownloaded() {
      cleanup()
      sendStatusToWindow(`Atualização baixada. Será instalada ao sair do app.`)
      resolve()
    }

    autoUpdater.once('error', onError)
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
