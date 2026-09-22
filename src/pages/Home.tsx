import { DarkModeButton } from '../components/DarkModeButton'

export const Home = () => {
  return (
    <main className="min-h-screen bg-gray-50 p-4 text-neutral-900 dark:bg-neutral-950 dark:text-gray-100">
      <DarkModeButton />
      <p className="mt-4">Welcome to your notes home</p>
    </main>
  )
}
