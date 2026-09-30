import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Timestamp } from 'firebase/firestore'
import { Button } from '../components/Button'
import { Brand } from '../components/Brand'
import { DarkModeButton } from '../components/DarkModeButton'
import { MarkdownPreview } from '../components/MarkdownPreview'
import { TextInput } from '../components/TextInput'
import {
  createNote,
  deleteNote,
  getNoteById,
  updatedNote,
} from '../services/notes'
import type { Note } from '../types/note'

type EditorMode = 'edit' | 'preview' | 'split'

export const NotePage = () => {
  const { noteId } = useParams()
  const navigate = useNavigate()
  const [note, setNote] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mode, setMode] = useState<EditorMode>('edit')
  const [loading, setLoading] = useState(Boolean(noteId))
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [error, setError] = useState('')
  const [selection, setSelection] = useState({ start: 0, end: 0 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isDirty = note
    ? title !== note.title || content !== note.content
    : Boolean(title || content)

  useEffect(() => {
    let active = true

    const loadNote = async () => {
      if (!noteId) {
        setNote(null)
        setTitle('')
        setContent('')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')
      try {
        const data = await getNoteById(noteId)
        if (!active) return
        if (!data) {
          setError('Nota não encontrada.')
          return
        }
        setNote(data)
        setTitle(data.title)
        setContent(data.content)
      } catch (loadError) {
        if (!active) return
        setError('Não foi possível carregar esta nota.')
        console.error(loadError)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadNote()
    return () => {
      active = false
    }
  }, [noteId])

  const saveNote = useCallback(async () => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError('Dê um título para a sua nota antes de salvar.')
      return
    }
    if (saving) return

    setSaving(true)
    setError('')
    setSaveMessage('')
    try {
      if (note) {
        await updatedNote(note.id, trimmedTitle, content)
        const updated = {
          ...note,
          title: trimmedTitle,
          content,
          updatedAt: Timestamp.now(),
        }
        setNote(updated)
        setTitle(trimmedTitle)
      } else {
        const newNoteId = await createNote(trimmedTitle, content)
        navigate(`/notes/${newNoteId}`, { replace: true })
        return
      }
      setSaveMessage('Salva')
    } catch (saveError) {
      setError('Não foi possível salvar sua nota. Tente novamente.')
      console.error(saveError)
    } finally {
      setSaving(false)
    }
  }, [content, navigate, note, saving, title])

  useEffect(() => {
    if (!note || !isDirty || saving) return

    const timeout = window.setTimeout(() => {
      void saveNote()
    }, 900)
    return () => window.clearTimeout(timeout)
  }, [isDirty, note, saveNote, saving])

  const handleDeleteNote = async () => {
    if (!note) return

    const confirmed = window.confirm(
      'Excluir esta nota? Essa ação não pode ser desfeita.'
    )
    if (!confirmed) return

    setDeleting(true)
    setError('')
    try {
      await deleteNote(note.id)
      navigate('/', { replace: true })
    } catch (deleteError) {
      setError('Não foi possível excluir a nota.')
      console.error(deleteError)
      setDeleting(false)
    }
  }

  const insertMarkdown = (
    before: string,
    after = before,
    placeholder = 'text'
  ) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.slice(start, end) || placeholder
    setContent(
      content.slice(0, start) +
        before +
        selectedText +
        after +
        content.slice(end)
    )
    window.requestAnimationFrame(() => {
      textarea.focus()
      const selectionStart = start + before.length
      textarea.setSelectionRange(
        selectionStart,
        selectionStart + selectedText.length
      )
    })
  }

  const isMarkerActive = (marker: string) => {
    const { start, end } = selection
    const selected = content.slice(start, end)
    const wrappedSelection =
      selected.length >= marker.length * 2 &&
      selected.startsWith(marker) &&
      selected.endsWith(marker)
    const before = content.slice(Math.max(0, start - marker.length), start)
    const after = content.slice(end, end + marker.length)
    return wrappedSelection || (before === marker && after === marker)
  }

  const toggleMarkdown = (marker: string, placeholder = 'texto') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.slice(start, end)

    if (
      selected.length >= marker.length * 2 &&
      selected.startsWith(marker) &&
      selected.endsWith(marker)
    ) {
      const unwrapped = selected.slice(
        marker.length,
        selected.length - marker.length
      )
      setContent(content.slice(0, start) + unwrapped + content.slice(end))
      window.requestAnimationFrame(() => {
        textarea.focus()
        textarea.setSelectionRange(start, start + unwrapped.length)
      })
      return
    }

    const before = content.slice(Math.max(0, start - marker.length), start)
    const after = content.slice(end, end + marker.length)
    if (before === marker && after === marker) {
      setContent(
        content.slice(0, start - marker.length) +
          selected +
          content.slice(end + marker.length)
      )
      window.requestAnimationFrame(() => {
        textarea.focus()
        textarea.setSelectionRange(start - marker.length, end - marker.length)
      })
      return
    }

    const textToWrap = selected || placeholder
    setContent(
      content.slice(0, start) +
        marker +
        textToWrap +
        marker +
        content.slice(end)
    )
    window.requestAnimationFrame(() => {
      textarea.focus()
      const selectionStart = start + marker.length
      textarea.setSelectionRange(
        selectionStart,
        selectionStart + textToWrap.length
      )
    })
  }

  const updateSelection = () => {
    const textarea = textareaRef.current
    if (!textarea) return
    setSelection({
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
    })
  }

  const handleEditorKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
      event.preventDefault()
      void saveNote()
    }
  }

  const displayTitle = title.trim() || 'Sem título'

  return (
    <main className="flex min-h-screen flex-col bg-neutral-100 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 md:flex-row">
      <section className="flex min-h-screen min-w-0 flex-1 flex-col bg-white dark:bg-neutral-950">
        <header className="flex min-h-14 items-center justify-between gap-4 border-b border-neutral-200 bg-neutral-50 px-5 dark:border-neutral-800 dark:bg-transparent md:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <Brand className="shrink-0" />
            <span
              aria-hidden="true"
              className="hidden h-5 border-l border-neutral-200 dark:border-neutral-800 sm:block"
            />
            <span className="truncate text-sm text-neutral-500 dark:text-neutral-400">
              {noteId ? 'Minhas notas' : 'Nova nota'} / {displayTitle}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden text-xs text-neutral-400 sm:inline">
              {saving
                ? 'Salvando...'
                : saveMessage ||
                  (note
                    ? isDirty
                      ? 'Alterações não salvas'
                      : 'Todas as alterações salvas'
                    : isDirty
                      ? 'Nota não salva'
                      : '')}
            </span>
            {note && (
              <Button
                variant="secondary"
                onClick={() => void handleDeleteNote()}
                disabled={deleting || saving}
                className="px-3 py-1.5 text-xs !text-red-600 hover:!bg-red-50 hover:!text-red-700 dark:!text-red-400 dark:hover:!bg-red-950/40 dark:hover:!text-red-300"
              >
                {deleting ? 'Excluindo' : 'Excluir'}
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => void saveNote()}
              disabled={saving || deleting || (!isDirty && note !== null)}
              className="px-3 py-1.5 text-xs"
            >
              {saving ? 'Salvando' : 'Salvar'}
            </Button>
            <DarkModeButton />
          </div>
        </header>

        <div className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-neutral-50 px-5 py-2.5 dark:border-neutral-900 dark:bg-transparent md:px-8">
          <div className="flex min-w-0 items-center gap-1 overflow-x-auto">
            <ToolbarButton
              label="Título"
              onClick={() => insertMarkdown('## ', '', 'Título')}
            >
              H
            </ToolbarButton>
            <ToolbarButton
              label="Negrito"
              active={isMarkerActive('**')}
              onClick={() => toggleMarkdown('**')}
            >
              <strong>B</strong>
            </ToolbarButton>
            <ToolbarButton
              label="Itálico"
              active={isMarkerActive('*')}
              onClick={() => toggleMarkdown('*', 'texto')}
            >
              <em>I</em>
            </ToolbarButton>
            <ToolbarButton
              label="Código em linha"
              onClick={() => insertMarkdown('`')}
            >
              {'</>'}
            </ToolbarButton>
            <span className="mx-1 h-5 border-l border-neutral-200 dark:border-neutral-800" />
            <ToolbarButton
              label="Lista com marcadores"
              onClick={() => insertMarkdown('- ', '', 'Item da lista')}
            >
              •
            </ToolbarButton>
            <ToolbarButton
              label="Link"
              onClick={() => insertMarkdown('[', '](url)', 'texto do link')}
            >
              ↗
            </ToolbarButton>
          </div>

          <div
            className="flex shrink-0 rounded-lg border border-neutral-200 p-0.5 dark:border-neutral-800"
            aria-label="Modo de edição"
          >
            {(['edit', 'split', 'preview'] as const).map((editorMode) => (
              <button
                type="button"
                key={editorMode}
                onClick={() => setMode(editorMode)}
                aria-pressed={mode === editorMode}
                className={`rounded-md px-2.5 py-1 text-xs capitalize transition ${
                  mode === editorMode
                    ? 'bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                {editorMode === 'edit'
                  ? 'Editar'
                  : editorMode === 'split'
                    ? 'Dividido'
                    : 'Visualizar'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="flex flex-1 items-center justify-center text-sm text-neutral-500">
            Carregando nota...
          </p>
        ) : error && !note ? (
          <p
            role="alert"
            className="m-8 text-sm text-neutral-700 dark:text-neutral-300"
          >
            {error}
          </p>
        ) : (
          <div
            className={`grid min-h-0 flex-1 ${
              mode === 'split' ? 'grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {mode !== 'preview' && (
              <div className="flex min-h-[60vh] flex-col px-5 pt-8 pb-4 md:px-8 lg:px-12">
                <TextInput
                  id="note-title"
                  label="Título da nota"
                  labelClassName="sr-only"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value)
                    setSaveMessage('')
                  }}
                  placeholder="Sem título"
                  className="mb-6 border-0 bg-transparent px-0 py-0 text-3xl font-semibold tracking-tight placeholder:text-neutral-300 focus:border-transparent focus:ring-0 dark:bg-transparent dark:placeholder:text-neutral-700 md:text-4xl"
                />
                <label className="sr-only" htmlFor="note-content">
                  Conteúdo da nota em Markdown
                </label>
                <textarea
                  ref={textareaRef}
                  id="note-content"
                  value={content}
                  onChange={(event) => {
                    setContent(event.target.value)
                    setSaveMessage('')
                  }}
                  onKeyDown={handleEditorKeyDown}
                  onSelect={updateSelection}
                  placeholder={
                    'Comece a escrever em Markdown...\n\n# Uma nova ideia\n\nUse **negrito**, *itálico* ou crie uma lista.'
                  }
                  spellCheck
                  className="min-h-[50vh] w-full flex-1 resize-none bg-transparent text-[15px] leading-7 text-neutral-700 outline-none placeholder:text-neutral-300 dark:text-neutral-300 dark:placeholder:text-neutral-700"
                />
              </div>
            )}

            {mode !== 'edit' && (
              <MarkdownPreview
                title={displayTitle}
                content={content}
                className={`min-h-[60vh] overflow-y-auto px-5 pt-8 pb-10 md:px-8 lg:px-12 ${
                  mode === 'split'
                    ? 'border-l border-neutral-100 dark:border-neutral-900'
                    : 'mx-auto w-full max-w-3xl'
                }`}
              />
            )}
          </div>
        )}

        <footer className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-5 py-2.5 text-xs text-neutral-400 dark:border-neutral-900 dark:bg-transparent md:px-8">
          <div className="flex items-center gap-4">
            <span>
              {content.trim() ? content.trim().split(/\s+/).length : 0}{' '}
              palavras
            </span>
            <span>Markdown</span>
          </div>
          <span>{note ? 'Nota' : 'Nova nota'}</span>
        </footer>

        {error && note && (
          <div
            role="alert"
            className="fixed right-5 bottom-12 max-w-sm rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-800 shadow-lg dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
          >
            {error}
          </div>
        )}
      </section>
    </main>
  )
}

type ToolbarButtonProps = {
  label: string
  onClick: () => void
  active?: boolean
  children: React.ReactNode
}

const ToolbarButton = ({
  label,
  onClick,
  active = false,
  children,
}: ToolbarButtonProps) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    aria-pressed={active}
    onClick={onClick}
    className={`grid size-8 shrink-0 place-items-center rounded-md text-sm transition ${
      active
        ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
        : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100'
    }`}
  >
    {children}
  </button>
)