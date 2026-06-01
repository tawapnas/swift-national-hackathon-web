type Variant = 'solid' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface RegisterButtonProps {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  className?: string
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.98] cursor-pointer'

const variants: Record<Variant, string> = {
  solid:
    'bg-swift-orange text-white shadow-lg shadow-swift-orange/25 hover:brightness-110 hover:shadow-swift-orange/40',
  outline:
    'border border-line text-fg hover:border-swift-orange hover:text-swift-orange',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
}

export default function RegisterButton({
  children,
  variant = 'solid',
  size = 'md',
  className = '',
}: RegisterButtonProps) {
  // TODO: wire up registration form — intentionally a no-op for now.
  const handleClick = () => {}

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}
