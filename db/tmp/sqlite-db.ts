import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { ConsoleColors } from '../../services/general.service';

export async function openDB() {
  const db = await open({
    filename: 'db/tmp/database.db',
    driver: sqlite3.cached.Database,
  });
  return db;
}

export async function sqLiteExec(db: any, queryString: string) {
  const start = performance.now();
  return await db.exec(queryString)
    .then(async (response = {} as any) => {
      const end = performance.now();
      console.log(
        `%cQuery: ${queryString}, took ${(end - start).toFixed(2)} milliseconds`,
        `${ConsoleColors.SqlQuery}`,
      );
      return response;
    }).catch((err: any) => {
      const end = performance.now();
      console.log(
        `%cError: ${err.message}, Query ${queryString}, took ${(end - start).toFixed(2)} milliseconds`,
        `${ConsoleColors.Error}`,
      );
      throw new Error(err);
    });
}

export async function sqLiteGet(db: any, queryString: string) {
  const start = performance.now();
  return await db.all(queryString)
    .then(async (response = {} as any) => {
      const end = performance.now();
      console.log(
        `%cQuery: ${queryString}, took ${(end - start).toFixed(2)} milliseconds`,
        `${ConsoleColors.SqlQuery}`,
      );
      return response;
    }).catch((err: any) => {
      const end = performance.now();
      console.log(
        `%cError: ${err.message}, Query ${queryString}, took ${(end - start).toFixed(2)} milliseconds`,
        `${ConsoleColors.Error}`,
      );
      throw new Error(err);
    });
}

export async function closeDB(db: any) {
  return await db.close();
}
