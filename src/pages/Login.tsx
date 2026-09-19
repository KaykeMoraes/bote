import { useState } from 'react'
import { login } from '../services/auth'
import { Link } from 'react-router-dom'
import { FirebaseError } from 'firebase/app'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    try {
      await login(email, password)
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
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-600">{error}</p>}

        <button type="submit">Entrar</button>
        <p>
          Não possui uma conta? <Link to="/register">Criar conta</Link>
        </p>
      </form>
    </>
  )
}
