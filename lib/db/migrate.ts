import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const runMigrate = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  // const connection = postgres(process.env.DATABASE_URL, { max: 1 });
  const connection = postgres(
    'postgres://postgres.ldybjbywqunzgbqdxlnn:xNCJmYwl4VAqmpUP@aws-0-eu-central-1.pooler.supabase.com:5432/postgres',
    { max: 1 }
  );

  const db = drizzle(connection);

  console.log('⏳ Running migrations...');

  const start = Date.now();

  await migrate(db, { migrationsFolder: 'lib/db/migrations' });

  const end = Date.now();

  console.log('✅ Migrations completed in', end - start, 'ms');

  process.exit(0);
};

runMigrate().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});