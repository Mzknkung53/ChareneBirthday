import postgres from 'postgres';

let sql: ReturnType<typeof postgres> | null = null;

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  if (!sql) {
    sql = postgres(url, { ssl: 'require', prepare: false });
  }
  return sql;
}

export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);
