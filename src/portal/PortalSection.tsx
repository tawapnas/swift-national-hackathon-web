// Portal content block styled like the marketing sections: a heading over a
// top divider (except the first), no boxed surface card.

interface PortalSectionProps {
  heading: string
  // The first section skips the top divider so it sits flush under the header.
  first?: boolean
  children: React.ReactNode
}

export default function PortalSection({ heading, first = false, children }: PortalSectionProps) {
  return (
    <section className={first ? '' : 'mt-12 border-t border-line pt-12'}>
      <h2 className="text-2xl font-bold md:text-3xl">{heading}</h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}
