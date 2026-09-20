import React, { useState } from 'react'
import { register } from '../services/auth'
import { Link } from 'react-router-dom'
import { FirebaseError } from 'firebase/app'

export const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await register(email, password)
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
      console.log(error)
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
          Criar conta
        </button>
        <p className="text-center text-sm text-gray-600">
          Já possui uma conta?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Entrar
          </Link>
        </p>
      </form>
    </>
  )
}