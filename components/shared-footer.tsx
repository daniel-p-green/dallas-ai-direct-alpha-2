export function SharedFooter() {
  return (
    <footer className="mt-auto border-t border-border/50">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-5">
        <p className="text-xs text-muted-foreground">
          Dallas AI Direct
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Email never displayed
        </p>
      </div>
    </footer>
  )
}
