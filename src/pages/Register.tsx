import React, { useState } from 'react'
import { register } from '../services/auth'
import { Link, useNavigate } from 'react-router-dom'
import { FirebaseError } from 'firebase/app'
import { DarkModeButton } from '../components/DarkModeButton'

export const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Por favor, preencha todos os campos')
      return
    }

    try {
      await register(email, password)
      navigate('/')
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            setError('Um usuário com esse email já existe')
            break
          default:
            setError('Ocorreu um erro ao tentar criar sua conta')
        }
      } else {
        setError('Um erro ocorreu ao tentar registrar o usuário')
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-neutral-950 dark:bg-neutral-950 dark:text-gray-50">
      <div className="absolute top-4 right-4">
        <DarkModeButton />
      </div>
      <h1 className="mb-6 text-3xl">Bote</h1>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-lg flex-col gap-4 rounded-xl border border-gray-200 bg-white p-8 shadow-lg dark:border-neutral-900 dark:shadow-2xl dark:shadow-neutral-900 dark:bg-neutral-950"
      >
        <div>
          <label
            htmlFor="email"
            className="text-sm text-neutral-700 dark:text-neutral-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-neutral-950 placeholder-gray-400 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-neutral-400 dark:bg-neutral-950 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-neutral-400 dark:focus:ring-neutral-700"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="text-sm text-neutral-700 dark:text-neutral-300"
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-neutral-950 placeholder-gray-400 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-neutral-400 dark:bg-neutral-950 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-neutral-400 dark:focus:ring-neutral-700"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        <button
          type="submit"
          className="w-full cursor-pointer rounded-lg bg-neutral-600 px-4 py-2 font-medium text-white transition hover:bg-neutral-700 focus:ring-2 focus:outline-none dark:bg-neutral-950 dark:hover:bg-neutral-900 dark:border dark:border-neutral-400 dark:focus:ring-neutral-700"
        >
          Criar conta
        </button>
        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          Já possui uma conta?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Entrar
          </Link>
        </p>
      </form>
    </main>
  )
}
