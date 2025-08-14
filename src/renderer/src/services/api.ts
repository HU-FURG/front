/* eslint-disable prettier/prettier */
// services/api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3333/api', // Substitua com sua URL real
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar o token automaticamente
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Interceptor de resposta: se JWT inválido, desloga
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 403)) {
      // Limpa token
      localStorage.removeItem('token')
      // Opcional: recarrega a página ou dispara callback de logout global
      // window.location.reload() // força voltar pro login
    }
    return Promise.reject(error)
  }
)