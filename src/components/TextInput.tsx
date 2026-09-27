import type { InputHTMLAttributes } from 'react'

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  labelClassName?: string
}

export const TextInput = ({
  id,
  label,
  labelClassName = '',
  className = '',
  ...props
}: TextInputProps) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className={`text-sm text-neutral-700 dark:text-neutral-300 ${labelClassName}`}
    >
      {label}
    </label>
    <input
      id={id}
      className={`w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-neutral-500 dark:focus:ring-neutral-800 ${className}`}
      {...props}
    />
  </div>
)
