import { footer } from '../data/content'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-8 text-center md:flex-row md:justify-between md:text-left">
        <p className="text-sm text-muted">{footer.copyright}</p>

        <nav className="flex items-center gap-6">
          {footer.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-label={link.label}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="opacity-70 transition-opacity hover:opacity-100"
            >
              <img src={link.icon} alt={link.label} className="h-5 w-auto" />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
