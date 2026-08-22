import postgres from 'postgres';
import { readFileSync } from 'fs';

const env = readFileSync('.env.local', 'utf8');
const url = env.match(/^DATABASE_URL=(.+)$/m)?.[1]?.trim();
if (!url) {
  console.error('No DATABASE_URL');
  process.exit(1);
}

const sql = postgres(url, { ssl: 'require', prepare: false });

const admins = await sql`select user_id, email from public.admin_users order by created_at`;
console.log('admin_users:');
for (const row of admins) {
  console.log(`  ${row.email} → ${row.user_id}`);
}

const wishes = await sql`select count(*)::int as n from public.wishes`;
console.log(`\nwishes in DB: ${wishes[0]?.n ?? 0}`);

await sql.end();
