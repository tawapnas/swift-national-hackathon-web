// In-portal button sharing RegisterButton's visual language, but driven by an
// onClick/type/disabled (RegisterButton itself always navigates to /portal).

type Variant = 'solid' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface PortalButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: Variant
  size?: Size
  disabled?: boolean
  className?: string
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100'

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

export default function PortalButton({
  children,
  onClick,
  type = 'button',
  variant = 'solid',
  size = 'md',
  disabled = false,
  className = '',
}: PortalButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}
