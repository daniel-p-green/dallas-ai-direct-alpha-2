"use client";

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

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="6" cy="6" r="1.4" fill="currentColor" />
      <path d="M11 18v-5.2c0-1.4 1.1-2.5 2.5-2.5S16 11.4 16 12.8V18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ComfortDots({ level }: { level: number }) {
  return (
    <span className="comfort" aria-label={`Comfort level ${level}`}>
      {[1, 2, 3, 4, 5].map((v) => (
        <span key={v} className={`dot ${v <= level ? 'active' : ''}`} data-level={String(v)} />
      ))}
      <span>{level}</span>
    </span>
  );
}

export default function RoomPage() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);

  const attendees = useMemo(
    () => [...seed].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    []
  );

  const updatedAgo = Math.max(1, Math.floor((Date.now() - now) / 1000));
  const avgComfort = (attendees.reduce((n, a) => n + a.ai_comfort_level, 0) / attendees.length).toFixed(1);
  const highPct = Math.round((attendees.filter((a) => a.ai_comfort_level >= 4).length / attendees.length) * 100);

  return (
    <section className="pageCard stack">
      <div className="roomHeader">
        <div>
          <h2 className="pageTitle" style={{ marginBottom: 4 }}>Who is in the room?</h2>
          <span className="badge">Public view – emails excluded</span>
        </div>
        <span className="updatedAt">Updated {updatedAgo}s ago</span>
      </div>

      <div className="metrics">
        <div className="metricCard">
          <p className="metricLabel">Total attendees</p>
          <p className="metricValue">{attendees.length}</p>
        </div>
        <div className="metricCard">
          <p className="metricLabel">Average comfort</p>
          <p className="metricValue">{avgComfort}</p>
        </div>
        <div className="metricCard">
          <p className="metricLabel">Comfort 4-5</p>
          <p className="metricValue">{highPct}%</p>
        </div>
      </div>

      <div className="attendeeList">
        {attendees.map((a) => {
          const justJoined = Date.now() - new Date(a.created_at).getTime() <= 5000;
          return (
            <article key={`${a.name}-${a.created_at}`} className={`attendeeRow ${justJoined ? 'justJoined' : ''}`}>
              <div className="nameBlock">
                <strong>{a.name}</strong>
                <span>{[a.title, a.company].filter(Boolean).join(' · ') || 'Profile private'}</span>
              </div>
              <ComfortDots level={a.ai_comfort_level} />
              <span className="muted">{a.help_offered.join(', ')}</span>
              <a className="iconButton" href={a.linkedin_url || '#'} target="_blank" rel="noreferrer" aria-label="Open LinkedIn profile">
                <LinkedInIcon />
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
