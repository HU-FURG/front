/* eslint-disable @typescript-eslint/ban-ts-comment */
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// APIs customizadas para o renderer
const api = {}

// Expondo APIs padrão do electron-toolkit
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
}

// Expor listener para mensagens de update
contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateMessage: (callback: (message: string) => void) => {
    ipcRenderer.on('update-message', (_, message) => callback(message))
  }
})
