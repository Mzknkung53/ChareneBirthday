import postgres from 'postgres';
import { readFileSync } from 'fs';

const env = readFileSync('.env.local', 'utf8');
const match = env.match(/^DATABASE_URL=(.+)$/m);
const url = match?.[1]?.trim();
if (!url) {
  console.error('No DATABASE_URL in .env.local');
  process.exit(1);
}

const sql = postgres(url, { ssl: 'require', prepare: false });
try {
  const rows = await sql`select 1 as ok`;
  console.log('DB connection OK:', rows[0]?.ok === 1 ? 'yes' : rows);
  const tables = await sql`
    select table_name from information_schema.tables
    where table_schema = 'public' and table_name in ('wishes', 'admin_users')
    order by table_name
  `;
  console.log('Tables:', tables.map((t) => t.table_name).join(', ') || '(none — run supabase/schema.sql)');
} catch (e) {
  console.error('DB connection failed:', e instanceof Error ? e.message : e);
  process.exit(1);
} finally {
  await sql.end();
}
