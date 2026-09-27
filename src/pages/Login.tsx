import { useState } from 'react'
import { login } from '../services/auth'
import { Link, useNavigate } from 'react-router-dom'
import { FirebaseError } from 'firebase/app'
import { DarkModeButton } from '../components/DarkModeButton'
import { Button } from '../components/Button'
import { TextInput } from '../components/TextInput'
import { Brand } from '../components/Brand'

export const Login = () => {
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
      await login(email, password)
      navigate('/')
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-credential':
            setError('E-mail ou senha incorretos')
            break
          case 'auth/invalid-email':
            setError('O e-mail informado está em um formato inválido.')
            break
          case 'auth/user-not-found':
            setError('Nenhum usuário com essas credenciais foi encontrado.')
            break
          default:
            setError('Erro ao entrar na conta.')
        }
      } else {
        setError('Ocorreu um erro ao tentar entrar na sua conta.')
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-neutral-950 dark:bg-neutral-950 dark:text-gray-50">
      <div className="absolute top-4 right-4">
        <DarkModeButton />
      </div>
      <Brand className="mb-6" />
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-lg flex-col gap-4 rounded-xl border border-gray-200 bg-white p-8 shadow-lg dark:border-neutral-900 dark:shadow-2xl dark:shadow-neutral-900 dark:bg-neutral-950"
      >
        <TextInput
          id="email"
          label="E-mail"
          type="email"
          placeholder="email@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <TextInput
          id="password"
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {error && (
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full">
          Entrar
        </Button>
        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          Não possui uma conta?{' '}
          <Link
            to="/register"
            className="font-medium text-neutral-900 hover:underline dark:text-neutral-100"
          >
            Criar conta
          </Link>
        </p>
      </form>
    </main>
  )
}
