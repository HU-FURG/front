/* eslint-disable prettier/prettier */

import { api } from './api'

export type LoginCredenciais = {
  login: string
  senha: string
}

export type LoginResposta = {
  token: string
}

// Função para realizar login
export const handleLogin = async (
  credenciais: LoginCredenciais
): Promise<LoginResposta> => {
  try {
    const response = await api.post<LoginResposta>('/login', credenciais)
    console.log('Login realizado com sucesso:', response.data)
    // Aqui você pode salvar o token no localStorage ou estado global
    localStorage.setItem('token', response.data.token)
    return response.data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Erro ao fazer login:', error.response?.data || error.message)
    throw error
  }
}
