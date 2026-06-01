import { footer } from '../data/content'

export default function Footer() {
  return (
    <footer className="bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <img src="/swift-mark.svg" alt="" className="h-9 w-9" />
          <div>
            <p className="font-bold">{footer.org}</p>
            <p className="text-sm text-muted">{footer.blurb}</p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
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
        <p className="mx-auto max-w-6xl px-6 py-6 text-sm text-muted">
          {footer.copyright}
        </p>
      </div>
    </footer>
  )
}
