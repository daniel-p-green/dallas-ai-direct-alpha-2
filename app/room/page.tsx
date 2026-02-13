"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Attendee = {
  name: string;
  title?: string;
  company?: string;
  linkedin_url?: string;
  ai_comfort_level: number;
  help_offered: string[];
  created_at: string;
};

const seed: Attendee[] = [
  {
    name: 'Attendee One',
    title: 'Engineering Lead',
    company: 'Community Co',
    linkedin_url: 'https://linkedin.com',
    ai_comfort_level: 4,
    help_offered: ['Mentoring'],
    created_at: new Date(Date.now() - 10_000).toISOString()
  },
  {
    name: 'Attendee Two',
    linkedin_url: 'https://linkedin.com',
    ai_comfort_level: 3,
    help_offered: ['Hiring'],
    created_at: new Date(Date.now() - 3_000).toISOString()
  }
];

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function ComfortDots({ level }: { level: number }) {
  return (
    <span className="comfort" aria-label={`Comfort level ${level}`}>
      {[1, 2, 3, 4, 5].map((v) => (
        <span key={v} className={`dot ${v <= level ? 'active' : ''}`} data-level={String(v)} />
      ))}
      <span className="comfortLabel">{level}</span>
    </span>
  );
}

function EmptyState() {
  return (
    <div className="emptyState">
      <h3>No Attendees Yet</h3>
      <p>Be the first to join the room. Scan the QR code or click below to sign up.</p>
      <Link className="button" href="/signup">Join via QR</Link>
    </div>
  );
}

export default function RoomPage() {
  const fallbackAttendees = useMemo(
    () => [...seed].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    []
  );
  const [attendees, setAttendees] = useState<Attendee[]>(fallbackAttendees);
  const [dataMode, setDataMode] = useState<'live' | 'fallback'>('fallback');
  const [loadMessage, setLoadMessage] = useState<string | null>(null);
  const [lastPollAt, setLastPollAt] = useState(Date.now());
  const [mounted, setMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadAttendees = async () => {
      if (isActive) setIsRefreshing(true);
      try {
        const response = await fetch('/api/attendees-public', { cache: 'no-store' });
        const responseBody = (await response.json().catch(() => null)) as
          | { message?: string; rows?: Attendee[] }
          | null;

        if (!response.ok) {
          if (isActive) {
            setDataMode('fallback');
            setLoadMessage(responseBody?.message ?? 'Live room data is unavailable. Showing demo seed data.');
            setAttendees(fallbackAttendees);
            setLastPollAt(Date.now());
          }
          return;
        }

        const rows = Array.isArray(responseBody?.rows) ? responseBody.rows : [];
        const mapped: Attendee[] = rows.map((row) => ({
          name: typeof row.name === 'string' && row.name.trim().length > 0 ? row.name : 'Attendee',
          title: typeof row.title === 'string' ? row.title : undefined,
          company: typeof row.company === 'string' ? row.company : undefined,
          linkedin_url: typeof row.linkedin_url === 'string' ? row.linkedin_url : undefined,
          ai_comfort_level: typeof row.ai_comfort_level === 'number' ? row.ai_comfort_level : 1,
          help_offered: Array.isArray(row.help_offered)
            ? row.help_offered.filter((value): value is string => typeof value === 'string')
            : [],
          created_at: typeof row.created_at === 'string' ? row.created_at : new Date().toISOString()
        }));

        if (isActive) {
          setDataMode(mapped.length > 0 || rows.length === 0 ? 'live' : 'fallback');
          setLoadMessage(null);
          setAttendees(mapped.length > 0 ? mapped : fallbackAttendees);
          setLastPollAt(Date.now());
        }
      } catch {
        if (isActive) {
          setDataMode('fallback');
          setLoadMessage('Live room data is unavailable. Showing demo seed data.');
          setAttendees(fallbackAttendees);
          setLastPollAt(Date.now());
        }
      } finally {
        if (isActive) setIsRefreshing(false);
      }
    };

    setMounted(true);
    loadAttendees();
    const timer = setInterval(loadAttendees, 5000);
    return () => {
      isActive = false;
      clearInterval(timer);
    };
  }, [fallbackAttendees]);

  const attendeeCount = attendees.length;
  const avgComfort =
    attendeeCount > 0 ? (attendees.reduce((n, a) => n + a.ai_comfort_level, 0) / attendeeCount).toFixed(1) : '0.0';
  const highPct =
    attendeeCount > 0 ? Math.round((attendees.filter((a) => a.ai_comfort_level >= 4).length / attendeeCount) * 100) : 0;

  const formatUpdated = () => {
    if (!mounted) return 'Loading...';
    const seconds = Math.max(1, Math.floor((Date.now() - lastPollAt) / 1000));
    return `Updated ${seconds}s ago`;
  };

  return (
    <section className="pageCard stack">
      <div className="roomHeader">
        <div>
          <h2 className="pageTitle" style={{ marginBottom: 4 }}>Who Is in the Room?</h2>
          <span className="badge">Public view - emails excluded</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {isRefreshing && (
            <span className="statusDot live" style={{ animation: 'none' }} aria-label="Refreshing data" />
          )}
          <span className="updatedAt">{formatUpdated()}</span>
        </div>
      </div>

      <div className="dataModeBanner" aria-live="polite">
        <span className={`statusDot ${dataMode === 'live' ? 'live' : 'fallback'}`} />
        {dataMode === 'live' ? 'Live attendees_public feed' : 'Fallback demo seed data'}
      </div>

      {loadMessage && <p className="helper">{loadMessage}</p>}

      <div className="metrics">
        <div className="metricCard">
          <p className="metricLabel">Total Attendees</p>
          <p className="metricValue">{attendeeCount}</p>
        </div>
        <div className="metricCard">
          <p className="metricLabel">Average Comfort</p>
          <p className="metricValue">{avgComfort}</p>
        </div>
        <div className="metricCard">
          <p className="metricLabel">Comfort 4-5</p>
          <p className="metricValue">{highPct}%</p>
        </div>
      </div>

      {attendees.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="attendeeList">
          {attendees.map((a) => {
            const justJoined = mounted && Date.now() - new Date(a.created_at).getTime() <= 5000;
            return (
              <article key={`${a.name}-${a.created_at}`} className={`attendeeRow ${justJoined ? 'justJoined' : ''}`}>
                <div className="nameBlock">
                  <strong>{a.name}</strong>
                  <span>{[a.title, a.company].filter(Boolean).join(' at ') || 'Profile private'}</span>
                </div>
                <ComfortDots level={a.ai_comfort_level} />
                <div className="chipList">
                  {a.help_offered.length > 0 ? (
                    a.help_offered.map((h) => (
                      <span key={h} className="chip">{h}</span>
                    ))
                  ) : (
                    <span className="muted" style={{ fontSize: 13 }}>--</span>
                  )}
                </div>
                {a.linkedin_url ? (
                  <a
                    className="iconButton"
                    href={a.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${a.name} LinkedIn profile`}
                  >
                    <LinkedinIcon size={16} />
                  </a>
                ) : (
                  <span className="iconButton" style={{ opacity: 0.3, cursor: 'default' }} aria-hidden="true">
                    <LinkedinIcon size={16} />
                  </span>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
