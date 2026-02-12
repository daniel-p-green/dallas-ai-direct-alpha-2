import postgres from 'postgres';

type SqlClient = ReturnType<typeof postgres>;

declare global {
  // eslint-disable-next-line no-var
  var __dallasNeonWriteClient: SqlClient | undefined;
  // eslint-disable-next-line no-var
  var __dallasNeonReadClient: SqlClient | undefined;
}

function createClient(connectionString: string): SqlClient {
  return postgres(connectionString, {
    // Route handlers are short-lived; keep connections conservative for demo workloads.
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false
  });
}

function requireEnv(name: 'NEON_DATABASE_URL'): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

export function hasNeonDatabaseEnv() {
  return Boolean(process.env.NEON_DATABASE_URL);
}

export function getNeonWriteClient() {
  if (!globalThis.__dallasNeonWriteClient) {
    globalThis.__dallasNeonWriteClient = createClient(requireEnv('NEON_DATABASE_URL'));
  }
  return globalThis.__dallasNeonWriteClient;
}

export function getNeonReadClient() {
  if (!globalThis.__dallasNeonReadClient) {
    const connectionString = process.env.NEON_DATABASE_URL_READONLY ?? requireEnv('NEON_DATABASE_URL');
    globalThis.__dallasNeonReadClient = createClient(connectionString);
  }
  return globalThis.__dallasNeonReadClient;
}
