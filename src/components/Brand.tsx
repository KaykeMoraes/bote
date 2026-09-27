import { Link } from 'react-router-dom'

type BrandProps = {
  className?: string
}

export const Brand = ({ className = '' }: BrandProps) => (
  <Link
    to="/"
    aria-label="Página inicial"
    className={`inline-flex items-center gap-3 ${className}`}
  >
    <img src="/logo.svg" alt="" className="h-9 w-10 object-contain grayscale" />
    <span className="text-base font-semibold tracking-tight">Bote</span>
  </Link>
)
