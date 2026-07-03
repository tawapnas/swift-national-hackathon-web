import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Variant = 'solid' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface RegisterButtonProps {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  className?: string
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:cursor-wait disabled:opacity-60'

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
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)

  // Signs in with Google right here (the popup opens from the click, so it
  // isn't blocked), then enters the portal. Firebase is dynamically imported
  // to keep it out of the marketing-site bundle.
  const handleClick = async () => {
    if (busy) return
    setBusy(true)
    try {
      const { auth, signInWithGoogle } = await import('../portal/firebase')
      await auth.authStateReady()
      if (!auth.currentUser) await signInWithGoogle()
      navigate('/portal')
    } catch (err) {
      // Popup closed/blocked or sign-in failed (e.g. auth/unauthorized-domain
      // on a host missing from Firebase's authorized domains) — stay on the page.
      console.error('sign-in failed:', err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}
