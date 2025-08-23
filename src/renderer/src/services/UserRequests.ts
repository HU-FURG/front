/* eslint-disable prettier/prettier */

import { api } from './api'

export type LoginCredenciais = {
  login: string
  senha: string
  remember: boolean
}

export type LoginResposta = {
  login: string
  hierarquia: string
}

// Função para realizar login
export const handleLogin = async (
  credenciais: LoginCredenciais
): Promise<LoginResposta> => {
  try {
    const response = await api.post<LoginResposta>('/login', credenciais)
    console.log('Login realizado com sucesso:', response.data)
    
    localStorage.setItem('user', response.data.login)
    localStorage.setItem('cargo', response.data.hierarquia)
    return response.data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Erro ao fazer login:', error.response?.data || error.message)
    throw error
  }
}

export const autoLogin = async (): Promise<boolean> => {
  try {
    const res = await api.get('/validate-token'); 
    console.log('Login automático realizado com sucesso:', res.data);
    localStorage.setItem('user', res.data.login)
    return true;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    console.warn('Sessão inválida ou expirada');
    return false;
  }
};


// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const handleLogout = async (setLogin: (value: boolean) => void) => {
  try {
    await api.post('/logout');
    setLogin(false)
    localStorage.removeItem('user');
    localStorage.removeItem('cargo');
    console.log("Logout realizado");
  } catch (err) {
    console.error("Erro ao fazer logout:", err);
  }
};



export const fetchUsers = async (): Promise<{login:string,hierarquia:string,lastLogin_at:Date}[]> => {
  const res = await api.get('/users')
  return res.data
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createUser = async (login:string, senha:string, cargo?:string) => {
  const res = await api.post('/users', { login, senha, cargo })
  return res.data
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const removeUser = async (login:string) => {
  const res = await api.delete('/users', { data: { login } })
  return res.data
}