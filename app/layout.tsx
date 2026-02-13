import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Dallas AI Direct Alpha',
  description: 'Live demo shell for Dallas AI Direct Alpha – private attendee signal for in-room demo moments.'
};

export const viewport = {
  themeColor: '#0D1B2A',
  width: 'device-width',
  initialScale: 1
};

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function EnvironmentBanner() {
  return (
    <div className="envBanner" role="status" aria-label="environment banner">
      <span>Alpha Demo</span>
      <span>Env: Stage</span>
      <span><LockIcon /> Public View Safe</span>
    </div>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <EnvironmentBanner />
        <header className="header">
          <div className="brandLockup">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/dallas-ai-logo-color.jpg"
              alt="Dallas AI"
              width={148}
              height={40}
              className="brandLogo"
            />
          </div>
          <h1>Dallas AI Direct Alpha</h1>
          <p>Fast, private attendee signal for in-room demo moments.</p>
        </header>
        <main className="main">{children}</main>
        <footer className="footer">
          <LockIcon />
          Email stays private and is never displayed publicly on the room board.
        </footer>
      </body>
    </html>
  );
}
