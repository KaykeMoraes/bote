import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button } from '../components/Button'
import { Brand } from '../components/Brand'
import { DarkModeButton } from '../components/DarkModeButton'
import { deleteNote, getNotes } from '../services/notes'
import { logout } from '../services/auth'
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

const excerptComponents: Components = {
  p: ({ children }) => <>{children} </>,
  h1: ({ children }) => <strong>{children} </strong>,
  h2: ({ children }) => <strong>{children} </strong>,
  h3: ({ children }) => <strong>{children} </strong>,
  h4: ({ children }) => <strong>{children} </strong>,
  h5: ({ children }) => <strong>{children} </strong>,
  h6: ({ children }) => <strong>{children} </strong>,
  ul: ({ children }) => <>{children}</>,
  ol: ({ children }) => <>{children}</>,
  li: ({ children }) => <>• {children} </>,
  blockquote: ({ children }) => <>{children}</>,
  pre: ({ children }) => <>{children}</>,
  code: ({ children }) => (
    <code className="rounded bg-neutral-100 px-1 py-0.5 text-[0.85em] dark:bg-neutral-800">
      {children}
    </code>
  ),
  a: ({ children }) => (
    <span className="underline underline-offset-2">{children}</span>
  ),
  img: () => null,
  hr: () => <> </>,
}

export const Home = () => {
  const navigate = useNavigate()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

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

  const handleLogout = async () => {
    try {
      await logout()
    } catch (logoutError) {
      console.error(logoutError)
    }
  }

  const handleDeleteNote = async (event: React.MouseEvent, noteId: string) => {
    event.preventDefault()
    event.stopPropagation()

    const confirmed = window.confirm(
      'Excluir esta nota? Essa ação não pode ser desfeita.'
    )
    if (!confirmed) return

    setDeletingId(noteId)
    try {
      await deleteNote(noteId)
      setNotes((current) => current.filter((note) => note.id !== noteId))
    } catch (deleteError) {
      setError('Não foi possível excluir a nota.')
      console.error(deleteError)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="min-h-screen bg-neutral-100 px-5 py-8 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 sm:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-12 flex items-center justify-between">
          <Brand />
          <div className="flex items-center gap-3">
            <Button onClick={() => navigate('/notes/new')}>Nova nota</Button>
            <Button variant="secondary" onClick={() => void handleLogout()}>
              Sair
            </Button>
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
                <li key={note.id} className="group relative">
                  <Link
                    to={`/notes/${note.id}`}
                    className="block h-full rounded-xl border border-neutral-200 bg-white p-5 transition hover:shadow-lg hover:shadow-neutral-200 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-600 dark:hover:bg-neutral-950 dark:hover:shadow-lg dark:hover:shadow-neutral-900"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3 pr-6">
                      <h3 className="truncate font-medium group-hover:text-black dark:group-hover:text-white">
                        {note.title || 'Sem título'}
                      </h3>
                      <span className="shrink-0 text-xs text-neutral-400">
                        {formatUpdatedAt(note)}
                      </span>
                    </div>
                    <div className="line-clamp-3 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                      {note.content ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={excerptComponents}
                        >
                          {note.content}
                        </ReactMarkdown>
                      ) : (
                        'Sem conteúdo adicional'
                      )}
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={(event) => void handleDeleteNote(event, note.id)}
                    disabled={deletingId === note.id}
                    aria-label={`Excluir nota ${note.title || 'sem título'}`}
                    title="Excluir nota"
                    className="cursor-pointer absolute top-3 right-3 hidden rounded-md p-1.5 text-neutral-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 group-hover:block dark:hover:bg-red-950/40 dark:hover:text-red-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
