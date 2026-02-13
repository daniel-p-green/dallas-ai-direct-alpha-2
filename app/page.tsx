import Link from 'next/link';

function ShieldIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <>
      <section className="pageCard stack" style={{ boxShadow: 'var(--shadow-card-lg)' }}>
        <div>
          <span className="badge" style={{ marginBottom: 'var(--space-3)', display: 'inline-flex' }}>Alpha Demo</span>
          <h2 className="pageTitle" style={{ fontSize: 'clamp(26px, 3vw, 36px)' }}>
            Replace directory dependency with governed infrastructure
          </h2>
          <p className="muted" style={{ maxWidth: '65ch' }}>
            Dallas AI Direct Alpha shows a public-safe attendee board pattern with database-boundary
            access control and consent-first profile visibility. Emails are collected but never displayed publicly.
          </p>
        </div>
        <div className="ctaRow">
          <Link className="button" href="/signup">
            Join via QR
          </Link>
          <Link className="buttonSecondary" href="/room">
            View Room Board
          </Link>
        </div>
      </section>

      <div className="metrics">
        <div className="metricCard" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
          <span style={{ color: 'var(--brand-blue)', flexShrink: 0, marginTop: 2 }}><ShieldIcon /></span>
          <div>
            <p className="metricLabel">Privacy-First</p>
            <p style={{ margin: 'var(--space-1) 0 0', fontSize: 14, color: 'var(--text-secondary)' }}>
              Email stays server-side. Public views read from a restricted database projection.
            </p>
          </div>
        </div>
        <div className="metricCard" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
          <span style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: 2 }}><ZapIcon /></span>
          <div>
            <p className="metricLabel">Real-Time</p>
            <p style={{ margin: 'var(--space-1) 0 0', fontSize: 14, color: 'var(--text-secondary)' }}>
              Room board updates within 5 seconds. Signup completes in under 30 seconds.
            </p>
          </div>
        </div>
        <div className="metricCard" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
          <span style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }}><UsersIcon /></span>
          <div>
            <p className="metricLabel">Consent-Based</p>
            <p style={{ margin: 'var(--space-1) 0 0', fontSize: 14, color: 'var(--text-secondary)' }}>
              Title and company display only when attendees explicitly opt in.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
