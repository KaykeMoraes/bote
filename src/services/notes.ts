import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { auth, db } from './firebase'
import type { Note } from '../types/note'

export const createNote = async (title: string, content: string) => {
  const user = auth.currentUser

  if (!user) {
    throw new Error('Usuário não está autenticado')
  }

  const notesRef = collection(db, 'users', user.uid, 'notes')

  const docRef = await addDoc(notesRef, {
    title,
    content,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return docRef.id
}

export const getNotes = async () => {
  const user = auth.currentUser

  if (!user) {
    throw new Error('Usuário não está autenticado')
  }

  const notesRef = collection(db, 'users', user.uid, 'notes')

  const q = query(notesRef, orderBy('updatedAt', 'desc'))

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Note[]
}

export const updatedNote = async (
  noteId: string,
  title: string,
  content: string
) => {
  const user = auth.currentUser

  if (!user) {
    throw new Error('Usuário não está autenticado')
  }

  const noteRef = doc(db, 'users', user.uid, 'notes', noteId)

  await updateDoc(noteRef, {
    title,
    content,
    updatedAt: serverTimestamp(),
  })
}

export const deleteNote = async (noteId: string) => {
  const user = auth.currentUser

  if (!user) {
    throw new Error('Usuário não está autenticado')
  }

  const noteRef = doc(db, 'users', user.uid, 'notes', noteId)

  await deleteDoc(noteRef)
}
