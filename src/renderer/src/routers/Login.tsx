/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { handleLogin, LoginCredenciais } from '@renderer/services/UserRequests'

type LoginProps = {
  onLoginSuccess: () => void
}

function Login({ onLoginSuccess }: LoginProps): React.JSX.Element {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError('')

    const credenciais: LoginCredenciais = {
      login,
      senha: password,
    }

    try {
      await handleLogin(credenciais)
      onLoginSuccess()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.error || 'Email ou senha inválidos')
    }
    return
  }


  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-center">
            {error}
          </div>
        )}

        <label className="block mb-2 font-medium text-gray-700" htmlFor="email">
          Email
        </label>
        <input
          id="login"
          type="text"
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={login}
          onChange={e => setLogin(e.target.value)}
          placeholder="user@example.com"
          required
        />

        <label className="block mb-2 font-medium text-gray-700" htmlFor="password">
          Senha
        </label>
        <input
          id="password"
          type="password"
          className="w-full p-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
        >
          Entrar
        </button>
      </form>
    </div>
  )
}

export default Login
