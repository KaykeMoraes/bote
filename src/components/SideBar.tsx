import { useState } from 'react'
import { DarkModeButton } from './DarkModeButton'

export const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div
        className={`
          fixed top-4 left-4 z-50
          h-[calc(100vh-2rem)]
          bg-neutral-50 dark:bg-neutral-950
          border border-neutral-200 dark:border-neutral-800
          rounded-2xl shadow-xl p-4
          flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-20'}
        `}
      >
        <div className="flex items-center justify-between w-full">
          {isOpen && (
            <span className="font-bold text-neutral-800 dark:text-neutral-200 ml-2 animate-fade-in">
              Menu
            </span>
          )}

          {!isOpen ? (
            <button
              className="rounded-md bg-neutral-50 border border-neutral-300 px-3 py-2 transition-colors duration-150 hover:bg-neutral-200 hover:cursor-pointer dark:bg-neutral-950 dark:border-neutral-800 dark:hover:bg-neutral-900"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          ) : (
            <button
              className="rounded-md bg-neutral-50 border border-neutral-300 px-3 py-2 transition-colors duration-150 hover:bg-neutral-200 hover:cursor-pointer dark:bg-neutral-950 dark:border-neutral-800 dark:hover:bg-neutral-900"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Content Section (Links go here) */}
        {isOpen && (
          <div className="mt-8 flex flex-col gap-2 overflow-y-auto">
            <div className="p-3 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-900 rounded-xl cursor-pointer">
              Dashboard
            </div>
            <div className="p-3 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-900 rounded-xl cursor-pointer">
              Profile
            </div>
            <div className="p-3 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-900 rounded-xl cursor-pointer">
              Settings
            </div>
          </div>
        )}
        <div className="w-full flex justify-center pt-4 border-t border-neutral-200/50 dark:border-neutral-800/50">
          <DarkModeButton />
        </div>
      </div>
    </>
  )
}
