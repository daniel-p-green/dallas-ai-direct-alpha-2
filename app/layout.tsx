import type { ReactNode } from 'react';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata = {
  title: 'Dallas AI Direct Alpha',
  description: 'Live demo shell for Dallas AI Direct Alpha'
};

function EnvironmentBanner() {
  return (
    <div className="envBanner" role="status" aria-label="environment banner">
      <span>ALPHA DEMO</span>
      <span>ENV: STAGE</span>
      <span>PUBLIC VIEW SAFE</span>
    </div>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={GeistSans.className}>
        <EnvironmentBanner />
        <header className="header">
          <h1>Dallas AI Direct Alpha</h1>
          <p>Fast, private attendee signal for in-room demo moments.</p>
        </header>
        <main className="main">{children}</main>
        <footer className="footer">Email stays private and never appears on the public board.</footer>
      </body>
    </html>
  );
}
