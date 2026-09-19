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
        <button type="submit">Criar conta</button>
        <p>
          Já possui uma conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </>
  )
}
