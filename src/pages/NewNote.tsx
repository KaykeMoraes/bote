import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createNote } from '../services/notes'
import { DarkModeButton } from '../components/DarkModeButton'

export const NewNote = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Dê um título para a sua nota')
      return
    }

    setSaving(true)

    try {
      await createNote(title, content)
      navigate('/')
    } catch (error) {
      setError('Ocorreu um erro ao salvar sua nota')
      console.log(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-10 text-neutral-950 transition-colors dark:bg-neutral-950 dark:text-gray-50">
      <div className="absolute top-4 right-4">
        <DarkModeButton />
      </div>
      <div className="w-full max-w-2xl">
        <Link
          to="/"
          className="mb-6 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Voltar
        </Link>
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Nova nota</h1>
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-4 rounded-xl border border-gray-200 bg-white p-8 shadow-lg dark:border-neutral-900 dark:bg-neutral-950 dark:shadow-2xl dark:shadow-neutral-900"
        >
          <div>
            <label
              htmlFor="title"
              className="text-sm text-neutral-700 dark:text-neutral-300"
            >
              Título
            </label>
            <input
              id="title"
              type="text"
              placeholder="Título da nota"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-neutral-950 placeholder-gray-400 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-neutral-400 dark:bg-neutral-950 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-neutral-400 dark:focus:ring-neutral-700"
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="text-sm text-neutral-700 dark:text-neutral-300"
            >
              Conteúdo
            </label>
            <textarea
              id="content"
              placeholder="Escreva sua nota aqui..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-2 text-neutral-950 placeholder-gray-400 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-neutral-400 dark:bg-neutral-950 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-neutral-400 dark:focus:ring-neutral-700"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="w-full cursor-pointer rounded-lg bg-neutral-600 px-4 py-2 font-medium text-white transition hover:bg-neutral-700 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border dark:border-neutral-400 dark:bg-neutral-950 dark:hover:bg-neutral-900 dark:focus:ring-neutral-700"
          >
            {saving ? 'Salvando...' : 'Salvar nota'}
          </button>
        </form>
      </div>
    </main>
  )
}