import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Brand } from '../components/Brand'
import { DarkModeButton } from '../components/DarkModeButton'
import { getNotes } from '../services/notes'
import type { Note } from '../types/note'

const formatUpdatedAt = (note: Note) => {
  const date = note.updatedAt?.toDate()
  if (!date) return 'Atualizada recentemente'

  return new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export const Home = () => {
  const navigate = useNavigate()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadNotes = async () => {
      try {
        const data = await getNotes()
        if (active) setNotes(data)
      } catch (loadError) {
        if (active) setError('Não foi possível carregar suas notas.')
        console.error(loadError)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadNotes()
    return () => {
      active = false
    }
  }, [])

  return (
    <main className="min-h-screen bg-neutral-50 px-5 py-8 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 sm:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-12 flex items-center justify-between">
          <Brand />
          <div className="flex items-center gap-3">
            <Button onClick={() => navigate('/notes/new')}>Nova nota</Button>
            <DarkModeButton />
          </div>
        </header>

        <section>
          <div className="mb-8">
            <p className="mb-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Seu espaço pessoal
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Que bom ter você de volta
            </h1>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">
              Retome suas ideias de onde parou.
            </p>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Minhas notas</h2>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
            </span>
          </div>

          {loading ? (
            <p className="rounded-xl border border-neutral-200 bg-white px-5 py-8 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
              Carregando suas notas...
            </p>
          ) : error ? (
            <p
              role="alert"
              className="rounded-xl border border-neutral-200 bg-neutral-100 px-5 py-8 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
            >
              {error}
            </p>
          ) : notes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-300 px-5 py-12 text-center dark:border-neutral-700">
              <p className="font-medium">Suas notas aparecerão aqui.</p>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Crie sua primeira nota para começar.
              </p>
              <Button onClick={() => navigate('/notes/new')} className="mt-5">
                Criar uma nota
              </Button>
            </div>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {notes.map((note) => (
                <li key={note.id}>
                  <Link
                    to={`/notes/${note.id}`}
                    className="group block h-full rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-400 hover:shadow-md hover:shadow-neutral-900/5 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="truncate font-medium group-hover:text-black dark:group-hover:text-white">
                        {note.title || 'Sem título'}
                      </h3>
                      <span className="shrink-0 text-xs text-neutral-400">
                        {formatUpdatedAt(note)}
                      </span>
                    </div>
                    <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                      {note.content || 'Sem conteúdo adicional'}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
