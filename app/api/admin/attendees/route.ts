import { NextResponse } from 'next/server';
import { getNeonReadClient, hasNeonDatabaseEnv } from '../../../../lib/neon/server';

type AdminAttendeeRow = {
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

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!hasNeonDatabaseEnv()) {
    return NextResponse.json(
      { message: 'Database not configured. Admin data unavailable.', rows: [] },
      { status: 503 }
    );
  }

  try {
    const sql = getNeonReadClient();
    const rows = await sql<AdminAttendeeRow[]>`
      select
        id,
        name,
        email,
        title,
        company,
        display_title_company,
        ai_comfort_level,
        help_needed,
        help_offered,
        other_help_needed,
        other_help_offered,
        created_at
      from public.attendees
      order by created_at desc
      limit 500
    `;

    return NextResponse.json({ rows });
  } catch {
    return NextResponse.json(
      { message: 'Failed to load attendee data.', rows: [] },
      { status: 500 }
    );
  }
}
