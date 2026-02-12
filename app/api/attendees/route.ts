import { NextResponse } from 'next/server';
import { getNeonWriteClient, hasNeonDatabaseEnv } from '../../../lib/neon/server';

const MAX_TEXT_LENGTH = 500;
const MAX_MULTI_SELECT_ITEMS = 20;

type RequestBody = {
  name?: unknown;
  email?: unknown;
  linkedin_url?: unknown;
  title?: unknown;
  company?: unknown;
  display_title_company?: unknown;
  ai_comfort_level?: unknown;
  help_needed?: unknown;
  help_offered?: unknown;
  honeypot?: unknown;
  other_help_needed?: unknown;
  other_help_offered?: unknown;
};

function normalizeRequiredText(value: unknown) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
}

function normalizeOptionalText(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  return trimmed.slice(0, MAX_TEXT_LENGTH);
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .slice(0, MAX_MULTI_SELECT_ITEMS);
}

function normalizeComfortLevel(value: unknown) {
  const level = typeof value === 'number' ? value : Number(value);
  return Number.isInteger(level) ? level : NaN;
}

function isDuplicateKeyError(error: unknown) {
  if (!error || typeof error !== 'object') {
    return false;
  }
  return 'code' in error && (error as { code?: unknown }).code === '23505';
}

export async function POST(request: Request) {
  if (!hasNeonDatabaseEnv()) {
    return NextResponse.json({ message: 'Signup is temporarily unavailable.' }, { status: 503 });
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const honeypot = normalizeRequiredText(body.honeypot);
  if (honeypot.length > 0) {
    return NextResponse.json({ message: 'Signup accepted.' }, { status: 202 });
  }

  const name = normalizeRequiredText(body.name);
  const email = normalizeRequiredText(body.email).toLowerCase();
  const aiComfortLevel = normalizeComfortLevel(body.ai_comfort_level);
  const helpNeeded = normalizeStringArray(body.help_needed);
  const helpOffered = normalizeStringArray(body.help_offered);

  if (!name || !email.includes('@')) {
    return NextResponse.json({ message: 'Name and valid email are required.' }, { status: 400 });
  }

  if (!Number.isInteger(aiComfortLevel) || aiComfortLevel < 1 || aiComfortLevel > 5) {
    return NextResponse.json({ message: 'AI comfort level must be between 1 and 5.' }, { status: 400 });
  }

  try {
    const sql = getNeonWriteClient();
    await sql`
      insert into public.attendees (
        name,
        email,
        linkedin_url,
        title,
        company,
        display_title_company,
        ai_comfort_level,
        help_needed,
        help_offered,
        honeypot,
        other_help_needed,
        other_help_offered
      ) values (
        ${name},
        ${email},
        ${normalizeOptionalText(body.linkedin_url)},
        ${normalizeOptionalText(body.title)},
        ${normalizeOptionalText(body.company)},
        ${body.display_title_company === true},
        ${aiComfortLevel},
        ${helpNeeded},
        ${helpOffered},
        '',
        ${normalizeOptionalText(body.other_help_needed)},
        ${normalizeOptionalText(body.other_help_offered)}
      )
    `;

    return NextResponse.json({ message: 'Signup complete.' }, { status: 201 });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return NextResponse.json({ message: 'This email has already been used for signup.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Signup failed. Please try again in a moment.' }, { status: 500 });
  }
}
