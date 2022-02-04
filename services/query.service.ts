import {
  openDB, closeDB, sqLiteExec, sqLiteGet,
} from '../db/tmp/sqlite-db';
import { ConsoleColors } from './general.service';

export interface PeopleData {
  id: number,
  name: string,
  uuid: string,
  joinDate: Date,
}

export interface WinnerData {
  id: number,
  name: string,
  luckyNumber: number,
  uuid: string,
  joinDate: Date,
}

export interface UserData {
  id: number,
  name: string,
  luck: boolean,
  uuid: string,
  joinDate: Date,
}

export default class QueryAPIService {
  private db: any;

  constructor() {
    this.db = '';
  }

  /**
     * Initiation does not promise table exist
     * Existing table names will be printed to logs
     */
  initiateSQLite = async () => {
    if (this.db == '') {
      this.db = await openDB();
      const tableArr = await this.getAll("SELECT name FROM sqlite_master WHERE type='table'");
      console.log(`%cDB Total Table Count: ${tableArr.length}, Table Names: ${JSON.stringify([...tableArr])}`, ConsoleColors.Information);
    } else {
      console.log('%cDB already initiated', ConsoleColors.Information);
    }
  };

  /**
     * Drop table from DB, empty string will remove all the existing tables
     */
  dropTableByName = async (tableName: string) => {
    if (this.db != '') {
      if (tableName == '') {
        const tableArr = await this.getAll("SELECT name FROM sqlite_master WHERE type='table'");
        console.log(`%cDB Total Table Count: ${tableArr.length}, Table Names: ${JSON.stringify([...tableArr])}`, ConsoleColors.Information);
        for (let i = 0; i < tableArr.length; i++) {
          const table = tableArr[i];
          await sqLiteExec(this.db, `DROP TABLE ${table.name}`);
        }
      } else if (await this.isAsyncTableExist(tableName)) {
        await sqLiteExec(this.db, `DROP TABLE ${tableName}`);
      }
    } else {
      throw new Error('DB not initiated');
    }
  };

  /**
     * This terminate the DB service and will not allow to use the functions in it before initiating the service
     */
  quitSQLite = async (): Promise<void> => {
    if (this.db != '') {
      await closeDB(this.db);
      this.db = '';
    } else {
      throw new Error('DB not initiated');
    }
  };

  createDBTableFromData = async (data: PeopleData[] | WinnerData[] | UserData[]) => {
    let tableName = 'people';
    if ('luckyNumber' in data[0]) {
      tableName = 'winners';
    } else if ('luck' in data[0]) {
      tableName = 'users';
    }
    if (this.db != '') {
      if (!await this.isAsyncTableExist(tableName)) {
        await sqLiteExec(this.db, `CREATE TABLE ${tableName} (id INTEGER PRIMARY KEY, uuid TEXT, name TEXT, join_date DATE)`);
        for (let i = 0; i < data.length; i++) {
          const person = data[i];
          await sqLiteExec(this.db, `INSERT INTO ${tableName} VALUES (${person.id},'${person.uuid}','${person.name}','${person.joinDate}')`);
        }
      } else {
        throw new Error('Table already exist in DB');
      }
    } else {
      throw new Error('DB not initiated');
    }
  };

  getAllFromTable = async (tableName: string): Promise<PeopleData[] | WinnerData[] | UserData[]> => {
    if (this.db != '') {
      return await sqLiteGet(this.db, `SELECT * FROM ${tableName}`);
    }
    throw new Error('DB not initiated');
  };

  getAll = async (query: string): Promise<PeopleData[] | WinnerData[] | UserData[]> => {
    if (this.db != '') {
      return await sqLiteGet(this.db, query);
    }
    throw new Error('DB not initiated');
  };

  async isAsyncTableExist(tableName: string): Promise<boolean> {
    const tableArr = await this.getAll(`SELECT name FROM sqlite_master WHERE type='table'AND name='${tableName}'`);
    if (tableArr.length > 0) {
      return true;
    }
    return false;
  }
}
