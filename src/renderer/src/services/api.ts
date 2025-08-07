/* eslint-disable prettier/prettier */
// services/api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3333/api', // Substitua com sua URL real
  headers: {
    'Content-Type': 'application/json',
  },
})