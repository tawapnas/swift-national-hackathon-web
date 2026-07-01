// Centered spinner on the page background. Shared loading visual for the portal.

export default function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-line border-t-swift-orange" />
    </div>
  )
}
