import assert from 'node:assert/strict';
import { integrationDatabaseUrl } from './database-safety';
import { closeDatabaseConnection, getDatabase } from '../../lib/db/client';
import { sql } from 'drizzle-orm';

async function main(){
  if(!integrationDatabaseUrl()){console.log('Integration suite skipped: set AURELIA_RUN_INTEGRATION=1 with an isolated test/dev database.');return;}
  const db=getDatabase();
  try{
    const database=await db.execute(sql`select current_database() as name, exists(select 1 from pg_extension where extname='btree_gist') as btree_gist`);
    assert.match(String(database.rows[0].name),/(test|dev)/i);
    assert.equal(database.rows[0].btree_gist,true);
    const constraints=await db.execute(sql`select conname from pg_constraint where conname in ('appointments_practitioner_no_overlap','encounters_appointment_unique')`);
    assert.ok(constraints.rows.length>=2);
    console.log('PostgreSQL integration safety and critical constraints passed.');
  }finally{await closeDatabaseConnection()}
}
main().catch(async error=>{console.error(error);await closeDatabaseConnection();process.exitCode=1});
