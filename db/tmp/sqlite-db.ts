import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { ConsoleColors } from '../../services/service.general';

export async function openDB() {
  const db = await open({
    filename: 'db/tmp/database.db',
    driver: sqlite3.cached.Database
  })
  return db;
}

export async function sqLiteExec(db: any, queryString: string) {
  console.log(`%c${queryString}`, ConsoleColors.SqlQuery)
  await db.exec(queryString)
}

export async function sqLiteGet(db: any, queryString: string) {
  console.log(`%c${queryString}`, ConsoleColors.SqlQuery)
  return await db.all(queryString)
}

export async function closeDB(db: any) {
  return await db.close()
}