import { useState } from 'react'
import { login } from '../services/auth'
import { Link, useNavigate } from 'react-router-dom'
import { FirebaseError } from 'firebase/app'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    try {
      await login(email, password)
      navigate('/notes')
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-credential':
            setError('E-mail ou senha incorretos')
            break
          case 'auth/invalid-email':
            setError('O email digitado está em um formato inválido')
            break
          case 'auth/user-not-found':
            setError('Nenhum usuário com essas credencias foi encontrado')
            break
          default:
            setError('Erro ao fazer login')
        }
      } else {
        setError('Ocorreu um erro ao tentar seu login')
      }
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-24 flex w-full max-w-sm flex-col gap-4 rounded-xl border border-gray-200 bg-white p-8 shadow-lg"
      >
        <input
          type="email"
          placeholder="email@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        <input
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none"
        >
          Entrar
        </button>
        <p className="text-center text-sm text-gray-600">
          Não possui uma conta?{' '}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </form>
    </>
  )
}