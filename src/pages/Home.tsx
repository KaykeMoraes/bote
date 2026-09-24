import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SideBar } from '../components/SideBar'
import { getNotes } from '../services/notes'
import type { Note } from '../types/note'

export const Home = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const data = await getNotes()
        setNotes(data)
      } catch (error) {
        setError('Não foi possível carregar suas notas')
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    loadNotes()
  }, [])

  return (
    <>
      <div className="flex flex-row justify-between m-4">
        <SideBar />
      </div>
      <div className="min-h-screen bg-gray-50 px-6 pt-10 pb-16 pl-28 text-neutral-950 transition-colors dark:bg-neutral-950 dark:text-gray-50">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome to your notes home
            </h1>
            <Link
              to="/notes/new"
              className="rounded-lg bg-neutral-600 px-5 py-2.5 font-medium text-white transition hover:bg-neutral-700 dark:border dark:border-neutral-400 dark:bg-neutral-950 dark:hover:bg-neutral-900"
            >
              + Criar nota
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {loading && (
              <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                Carregando notas...
              </p>
            )}

            {!loading && error && (
              <p className="text-center text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            {!loading && !error && notes.length === 0 && (
              <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                Você ainda não tem nenhuma nota.
              </p>
            )}

            {notes.map((note) => (
              <div
                key={note.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-900 dark:bg-neutral-950"
              >
                <h2 className="text-lg font-semibold">{note.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}