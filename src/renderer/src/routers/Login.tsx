/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { handleLogin, LoginCredenciais, autoLogin } from '@renderer/services/UserRequests'
import logo from '../assets/logo.png'
import AppInfo from '@renderer/components/AppInfo'

type LoginProps = {
  onLoginSuccess: () => void
}

function Login({ onLoginSuccess }: LoginProps): React.JSX.Element {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError('')

    const credenciais: LoginCredenciais = {
      login,
      senha: password,
      remember: rememberMe
    }

    try {
      setLoading(true) 
      await handleLogin(credenciais)
      onLoginSuccess()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.error || 'Email ou senha inválidos')
    }
  }
  useEffect(() => {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const tryAutoLogin = async () => {
    const storedUser = localStorage.getItem('user'); 
    if (!storedUser) return;
    try {
      const loggedIn = await autoLogin(); 
      if (loggedIn) {
        onLoginSuccess(); 
      }
    } catch (err) {
      console.warn('Auto login falhou', err);
      localStorage.removeItem('user'); 
    } finally {
      setLoading(false)
    }
  };

  tryAutoLogin();
}, [onLoginSuccess]);

  return (
    <div className="flex flex-col w-full justify-center items-center h-screen bg-gray-100">
      <img src={logo} alt="" className='w-[150px] mt-[-10vh]'/>
      <div className="flex items-center justify-center w-[100vw]">
        <form 
          onSubmit={handleSubmit} 
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
        >
          <h2 className="text-xl font-semibold text-center">Entrar na sua conta</h2>
          <p className="text-center text-gray-600">
            Digite suas credenciais para acessar o sistema
          </p>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600" htmlFor="email">
              Email
            </label>
            <input
              id="login"
              type="text"
              className="w-full p-2 mb-6 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={login}
              onChange={e => setLogin(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>
          <div className="space-y-1 mt-2">
            <label className="block mb-2 font-medium text-gray-600" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-2 mb-6 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error? (
            <div className="text-red-700 p-2 rounded text-center">
              {error}
            </div> 
          ): <div className='p-4'></div>}
          
          <div className="flex flex-col items-center justify-between text-sm space-y-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-11 rounded text-white font-medium transition ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-400 hover:bg-emerald-700'
              }`}
            >
              Entrar
            </button>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" 
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              <span className="text-gray-600">Lembrar de mim</span>
            </label>
          </div>
        </form>
      </div>
      <AppInfo/>
    </div>
  )
}

export default Login
