"use client";

import Link from 'next/link';
import { type FormEvent, useState, useCallback } from 'react';

const HELP_OPTIONS = [
  'Hiring',
  'Mentoring',
  'Partnering',
  'Investing',
  'Learning',
  'Selling',
  'Other'
];

const MAX_OTHER_LENGTH = 500;

function normalizeOptionalText(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toStringArray(values: FormDataEntryValue[]) {
  return values.filter((value): value is string => typeof value === 'string');
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: 'var(--success)' }}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

type FormErrors = {
  name?: string;
  email?: string;
  ai_comfort_level?: string;
  other_help_needed?: string;
  other_help_offered?: string;
};

export default function SignupPage() {
  const [status, setStatus] = useState<{ type: 'idle' | 'submitting' | 'success' | 'error'; message?: string }>({
    type: 'idle'
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [helpNeededChecks, setHelpNeededChecks] = useState<Set<string>>(new Set());
  const [helpOfferedChecks, setHelpOfferedChecks] = useState<Set<string>>(new Set());
  const [otherHelpNeeded, setOtherHelpNeeded] = useState('');
  const [otherHelpOffered, setOtherHelpOffered] = useState('');

  const showOtherNeeded = helpNeededChecks.has('Other');
  const showOtherOffered = helpOfferedChecks.has('Other');

  const handleCheckToggle = useCallback((group: 'needed' | 'offered', value: string) => {
    const setter = group === 'needed' ? setHelpNeededChecks : setHelpOfferedChecks;
    setter(prev => {
      const next = new Set(prev);
      if (next.has(value)) { next.delete(value); } else { next.add(value); }
      return next;
    });
  }, []);

  function validateForm(payload: {
    name: string;
    email: string;
    ai_comfort_level: number;
    other_help_needed: string | null;
    other_help_offered: string | null;
  }): FormErrors {
    const e: FormErrors = {};
    if (!payload.name || payload.name.length < 1) e.name = 'Name is required.';
    else if (payload.name.length > 120) e.name = 'Name must be 120 characters or fewer.';
    if (!payload.email || !payload.email.includes('@')) e.email = 'A valid email address is required.';
    if (!Number.isInteger(payload.ai_comfort_level) || payload.ai_comfort_level < 1 || payload.ai_comfort_level > 5) {
      e.ai_comfort_level = 'Select a comfort level between 1 and 5.';
    }
    if (payload.other_help_needed && payload.other_help_needed.length > MAX_OTHER_LENGTH) {
      e.other_help_needed = `Must be ${MAX_OTHER_LENGTH} characters or fewer.`;
    }
    if (payload.other_help_offered && payload.other_help_offered.length > MAX_OTHER_LENGTH) {
      e.other_help_offered = `Must be ${MAX_OTHER_LENGTH} characters or fewer.`;
    }
    return e;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const honeypot = typeof formData.get('honeypot') === 'string' ? String(formData.get('honeypot')).trim() : '';

    if (honeypot.length > 0) {
      setStatus({ type: 'success', message: 'Thanks for joining. Your signup has been received.' });
      return;
    }

    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const aiComfortLevel = Number(formData.get('ai_comfort_level') ?? 3);
    const otherNeeded = showOtherNeeded ? normalizeOptionalText(otherHelpNeeded) : null;
    const otherOffered = showOtherOffered ? normalizeOptionalText(otherHelpOffered) : null;

    const validationErrors = validateForm({ name, email, ai_comfort_level: aiComfortLevel, other_help_needed: otherNeeded, other_help_offered: otherOffered });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const payload = {
      name,
      email,
      linkedin_url: normalizeOptionalText(formData.get('linkedin_url')),
      title: normalizeOptionalText(formData.get('title')),
      company: normalizeOptionalText(formData.get('company')),
      display_title_company: formData.get('display_title_company') === 'on',
      ai_comfort_level: aiComfortLevel,
      help_needed: toStringArray(formData.getAll('help_needed')),
      help_offered: toStringArray(formData.getAll('help_offered')),
      honeypot: '',
      other_help_needed: otherNeeded,
      other_help_offered: otherOffered
    };

    setStatus({ type: 'submitting' });

    try {
      const response = await fetch('/api/attendees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const responseBody = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        if (response.status === 409) {
          setStatus({ type: 'error', message: 'This email has already been used for signup.' });
          return;
        }
        setStatus({ type: 'error', message: responseBody?.message ?? 'Signup failed. Please try again in a moment.' });
        return;
      }

      setStatus({ type: 'success', message: 'Signup complete. You should appear on the room board shortly.' });
      form.reset();
      setHelpNeededChecks(new Set());
      setHelpOfferedChecks(new Set());
      setOtherHelpNeeded('');
      setOtherHelpOffered('');
    } catch {
      setStatus({ type: 'error', message: 'Signup failed. Please try again in a moment.' });
    }
  }

  if (status.type === 'success') {
    return (
      <section className="pageCard stack">
        <div className="successCard">
          <CheckCircleIcon />
          <h3>You are in</h3>
          <p>{status.message}</p>
          <div className="ctaRow" style={{ justifyContent: 'center' }}>
            <Link className="button" href="/room">View Room Board</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pageCard stack">
      <div>
        <h2 className="pageTitle">Attendee Signup</h2>
        <p className="muted">Complete this form to appear on the room board with public-safe fields.</p>
      </div>

      <form className="stack" onSubmit={handleSubmit} noValidate>
        {/* Honeypot field */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
          <label htmlFor="website">Website</label>
          <input id="website" name="honeypot" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {/* Required Fields */}
        <div className="gridTwo">
          <div className="field">
            <label htmlFor="name">Name <span aria-hidden="true" style={{ color: 'var(--danger)' }}>*</span></label>
            <input id="name" name="name" type="text" placeholder="Your name" required maxLength={120} aria-describedby={errors.name ? 'name-error' : undefined} />
            {errors.name && <p id="name-error" className="inlineError" role="alert">{errors.name}</p>}
          </div>
          <div className="field">
            <label htmlFor="email">Email <span aria-hidden="true" style={{ color: 'var(--danger)' }}>*</span></label>
            <input id="email" name="email" type="email" placeholder="you@company.com" required aria-describedby="email-helper" />
            {errors.email && <p className="inlineError" role="alert">{errors.email}</p>}
            <p id="email-helper" className="helper">
              <LockIcon /> Email stays private and is never displayed publicly.
            </p>
          </div>
        </div>

        <div className="gridTwo">
          <div className="field">
            <label htmlFor="comfort">AI Comfort Level <span aria-hidden="true" style={{ color: 'var(--danger)' }}>*</span></label>
            <select id="comfort" name="ai_comfort_level" defaultValue="3" required>
              <option value="1">1 - Just getting started</option>
              <option value="2">2 - Some exposure</option>
              <option value="3">3 - Comfortable</option>
              <option value="4">4 - Advanced</option>
              <option value="5">5 - Expert</option>
            </select>
            {errors.ai_comfort_level && <p className="inlineError" role="alert">{errors.ai_comfort_level}</p>}
          </div>
          <div className="field">
            <label htmlFor="linkedin">LinkedIn URL (optional)</label>
            <input id="linkedin" name="linkedin_url" type="url" placeholder="https://linkedin.com/in/..." />
          </div>
        </div>

        {/* Help Arrays */}
        <div className="gridTwo">
          <fieldset className="field">
            <legend>What help do you need?</legend>
            {HELP_OPTIONS.map((opt) => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, minHeight: 32, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="help_needed"
                  value={opt}
                  checked={helpNeededChecks.has(opt)}
                  onChange={() => handleCheckToggle('needed', opt)}
                />
                {opt}
              </label>
            ))}
            {showOtherNeeded && (
              <div className="otherTextField">
                <textarea
                  name="other_help_needed_text"
                  placeholder="Describe what other help you need..."
                  maxLength={MAX_OTHER_LENGTH}
                  value={otherHelpNeeded}
                  onChange={(e) => setOtherHelpNeeded(e.target.value)}
                  aria-label="Other help needed details"
                />
                <div className="charCount">{otherHelpNeeded.length}/{MAX_OTHER_LENGTH}</div>
                {errors.other_help_needed && <p className="inlineError" role="alert">{errors.other_help_needed}</p>}
              </div>
            )}
          </fieldset>
          <fieldset className="field">
            <legend>What help can you offer?</legend>
            {HELP_OPTIONS.map((opt) => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, minHeight: 32, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="help_offered"
                  value={opt}
                  checked={helpOfferedChecks.has(opt)}
                  onChange={() => handleCheckToggle('offered', opt)}
                />
                {opt}
              </label>
            ))}
            {showOtherOffered && (
              <div className="otherTextField">
                <textarea
                  name="other_help_offered_text"
                  placeholder="Describe what other help you can offer..."
                  maxLength={MAX_OTHER_LENGTH}
                  value={otherHelpOffered}
                  onChange={(e) => setOtherHelpOffered(e.target.value)}
                  aria-label="Other help offered details"
                />
                <div className="charCount">{otherHelpOffered.length}/{MAX_OTHER_LENGTH}</div>
                {errors.other_help_offered && <p className="inlineError" role="alert">{errors.other_help_offered}</p>}
              </div>
            )}
          </fieldset>
        </div>

        {/* Optional Profile */}
        <div className="gridTwo">
          <div className="field">
            <label htmlFor="title">Title (optional)</label>
            <input id="title" name="title" type="text" placeholder="Your job title" />
          </div>
          <div className="field">
            <label htmlFor="company">Company (optional)</label>
            <input id="company" name="company" type="text" placeholder="Your company" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="displayTitleCompany" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input id="displayTitleCompany" name="display_title_company" type="checkbox" defaultChecked={false} />
            Display my title and company on the public room board.
          </label>
        </div>

        {/* Status Messages */}
        {status.type === 'error' && (
          <div className="privacyNotice" style={{ background: 'rgba(197, 61, 61, 0.06)', borderColor: 'rgba(197, 61, 61, 0.15)', color: 'var(--danger)' }} role="alert">
            {status.message}
          </div>
        )}

        {status.type === 'submitting' && (
          <p className="helper" role="status" aria-live="polite">Submitting...</p>
        )}

        {/* Actions */}
        <div className="ctaRow" style={{ alignItems: 'center' }}>
          <button className="button" type="submit" disabled={status.type === 'submitting'}>
            {status.type === 'submitting' ? 'Submitting...' : 'Submit Signup'}
          </button>
          <Link className="buttonSecondary" href="/room">
            View the Room
          </Link>
          <span className="privacyNotice">
            <LockIcon />
            Private data stays server-side only.
          </span>
        </div>
      </form>
    </section>
  );
}
