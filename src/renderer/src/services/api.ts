/* eslint-disable prettier/prettier */
// services/api.ts
import axios from 'axios'

// export const api = axios.create({
//   baseURL: 'http://localhost:3333/api', 
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })
export const api = axios.create({
  baseURL: 'https://precious-reyna-hu-furg-b9ddc9e2.koyeb.app/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de resposta: se JWT inválido, desloga
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 403)) {
      localStorage.removeItem("user"); 
      window.location.reload() 
    }
    return Promise.reject(error)
  }
)