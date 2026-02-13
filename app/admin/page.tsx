"use client";

import { useEffect, useState, useCallback } from 'react';

type AdminAttendee = {
  id: string;
  name: string;
  email: string;
  title: string | null;
  company: string | null;
  display_title_company: boolean;
  ai_comfort_level: number;
  help_needed: string[];
  help_offered: string[];
  other_help_needed: string | null;
  other_help_offered: string | null;
  created_at: string;
};

export default function AdminPage() {
  const [demoMode, setDemoMode] = useState(true);
  const [seedData, setSeedData] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(5);
  const [attendees, setAttendees] = useState<AdminAttendee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/attendees', { cache: 'no-store' });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { message?: string } | null;
        setError(body?.message ?? 'Failed to load attendee data.');
        return;
      }
      const body = (await res.json()) as { rows: AdminAttendee[] };
      setAttendees(Array.isArray(body.rows) ? body.rows : []);
    } catch {
      setError('Failed to connect to admin API.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendees();
    const timer = setInterval(fetchAttendees, pollingInterval * 1000);
    return () => clearInterval(timer);
  }, [fetchAttendees, pollingInterval]);

  return (
    <section className="pageCard stack">
      <div>
        <h2 className="pageTitle">Demo Controls</h2>
        <p className="muted">Use this panel to manage demo state and view full attendee data including private fields.</p>
      </div>

      <div className="adminGrid">
        <div className="controlCard">
          <h3>Demo Mode</h3>
          <p>Toggle between demo and production behavior for environment banner display.</p>
          <div className="toggleRow">
            <span className={`statusChip ${demoMode ? 'active' : 'inactive'}`}>
              {demoMode ? 'Active' : 'Off'}
            </span>
            <button
              className="buttonSecondary"
              type="button"
              onClick={() => setDemoMode(!demoMode)}
              style={{ minHeight: 36, padding: '0 var(--space-4)', fontSize: 13 }}
            >
              Toggle
            </button>
          </div>
        </div>

        <div className="controlCard">
          <h3>Seed Dataset</h3>
          <p>Use fallback seed data instead of live database reads for the room board.</p>
          <div className="toggleRow">
            <span className={`statusChip ${seedData ? 'active' : 'inactive'}`}>
              {seedData ? 'Active' : 'Off'}
            </span>
            <button
              className="buttonSecondary"
              type="button"
              onClick={() => setSeedData(!seedData)}
              style={{ minHeight: 36, padding: '0 var(--space-4)', fontSize: 13 }}
            >
              Toggle
            </button>
          </div>
        </div>

        <div className="controlCard">
          <h3>Polling Interval</h3>
          <p>Adjust the refresh rate for the room board polling cycle.</p>
          <div className="toggleRow">
            <span className="statusChip active">{pollingInterval}s</span>
            <select
              className="buttonSecondary"
              value={pollingInterval}
              onChange={(e) => setPollingInterval(Number(e.target.value))}
              style={{ minHeight: 36, padding: '0 var(--space-4)', fontSize: 13, cursor: 'pointer' }}
            >
              <option value={2}>2s</option>
              <option value={5}>5s</option>
              <option value={10}>10s</option>
              <option value={30}>30s</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
          <h3 className="pageTitle" style={{ fontSize: 20, margin: 0 }}>
            Attendee Data ({attendees.length})
          </h3>
          <button className="buttonSecondary" type="button" onClick={fetchAttendees} disabled={loading}
            style={{ minHeight: 36, padding: '0 var(--space-4)', fontSize: 13 }}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="privacyNotice" style={{ background: 'rgba(197, 61, 61, 0.06)', borderColor: 'rgba(197, 61, 61, 0.15)', color: 'var(--danger)', marginBottom: 'var(--space-3)' }} role="alert">
            {error}
          </div>
        )}

        {attendees.length === 0 && !loading && !error && (
          <div className="emptyState" style={{ padding: 'var(--space-6)' }}>
            <h3>No Attendees</h3>
            <p>No attendees have signed up yet. Data will appear here as signups come in.</p>
          </div>
        )}

        {attendees.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Comfort</th>
                  <th>Help Offered</th>
                  <th>Help Needed</th>
                  <th>Signed Up</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((a) => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 600 }}>{a.name}</td>
                    <td style={{ fontFamily: 'var(--font-data)', fontSize: 13 }}>{a.email}</td>
                    <td>{a.title ?? '--'}</td>
                    <td>{a.company ?? '--'}</td>
                    <td style={{ fontFamily: 'var(--font-data)', textAlign: 'center' }}>{a.ai_comfort_level}</td>
                    <td>
                      <div className="chipList">
                        {a.help_offered.map((h) => <span key={h} className="chip">{h}</span>)}
                        {a.other_help_offered && <span className="chip" title={a.other_help_offered}>Other</span>}
                      </div>
                    </td>
                    <td>
                      <div className="chipList">
                        {a.help_needed.map((h) => <span key={h} className="chip">{h}</span>)}
                        {a.other_help_needed && <span className="chip" title={a.other_help_needed}>Other</span>}
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-data)', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {new Date(a.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
