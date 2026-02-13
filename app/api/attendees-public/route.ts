import { NextResponse } from 'next/server';
import { getNeonReadClient, hasNeonDatabaseEnv } from '../../../lib/neon/server';

type AttendeePublicRow = {
  name: string;
  title: string | null;
  company: string | null;
  linkedin_url: string | null;
  ai_comfort_level: number;
  help_offered: string[] | null;
  created_at: string;
};

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!hasNeonDatabaseEnv()) {
    return NextResponse.json(
      {
        message: 'Showing demo seed data. Configure DATABASE_URL on the server for live room data.',
        rows: []
      },
      { status: 503 }
    );
  }

  try {
    const sql = getNeonReadClient();
    const rows = await sql<AttendeePublicRow[]>`
      select
        name,
        title,
        company,
        linkedin_url,
        ai_comfort_level,
        help_offered,
        created_at
      from public.attendees_public
      order by created_at desc
      limit 200
    `;

    return NextResponse.json({ rows });
  } catch {
    return NextResponse.json(
      {
        message: 'Live room data is unavailable. Showing demo seed data.',
        rows: []
      },
      { status: 503 }
    );
  }
}
