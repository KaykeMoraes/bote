import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'cursor-pointer bg-neutral-900 text-white hover:bg-neutral-700 focus-visible:outline-neutral-500 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300',
  secondary:
    'cursor-pointer border border-neutral-200 text-neutral-700 hover:bg-neutral-100 focus-visible:outline-neutral-400 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900',
  ghost:
    'cursor-pointer text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-neutral-400 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-neutral-100',
}

export const Button = ({
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles[variant]} ${className}`}
    {...props}
  />
)
