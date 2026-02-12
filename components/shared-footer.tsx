import Image from "next/image"

export function SharedFooter() {
  return (
    <footer className="mt-auto border-t border-border/50">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-5 py-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-4">
          <p className="text-xs text-muted-foreground">
            Dallas AI Direct
          </p>
          <span className="hidden h-3 w-px bg-border sm:block" aria-hidden="true" />
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Email never displayed
          </p>
        </div>
        <a
          href="https://v0.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
          aria-label="Built with v0 by Vercel"
        >
          <span>Built with</span>
          <Image
            src="/brand/v0-logo.jpg"
            alt="v0"
            width={16}
            height={16}
            className="rounded-sm"
          />
        </a>
      </div>
    </footer>
  )
}
