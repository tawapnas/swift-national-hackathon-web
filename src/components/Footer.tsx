import { footer } from '../data/content'

export default function Footer() {
  return (
    <footer className="bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-12 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <img src="/logo.svg" alt={footer.org} className="h-6 w-auto" />

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-start">
          {footer.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-6 py-6 text-center text-sm text-muted md:text-left">
          {footer.copyright}
        </p>
      </div>
    </footer>
  )
}
