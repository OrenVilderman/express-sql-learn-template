import {
  openDB, closeDB, sqLiteExec, sqLiteGet,
} from '../db/sqlite-db';
import { ConsoleColors } from './general.service';

export interface PeopleData {
  id?: number,
  name: string,
  uuid: string,
  dob: Date,
  email: string,
  gender: string,
  picture: string,
  role?: string
}

export interface WinnerData {
  id: number,
  luckyNumber: number,
  joinDate: Date,
}

export interface UserData {
  id: number,
  luck: boolean,
  joinDate: Date,
}

type defaultTables = 'people' | 'winners' | 'users';

export class QueryAPIService {
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
      const tableArr = await this.selectByQuery("SELECT name FROM sqlite_master WHERE type='table'");
      console.log(`%cDB Total Table Count: ${tableArr.length}, Table Names: ${JSON.stringify([...tableArr])}`, ConsoleColors.Information);
    } else {
      console.log('%cDB already initiated', ConsoleColors.Information);
    }
  };

  /**
   * Drop table from DB, empty string will remove all the existing tables
   * @param tableName
   */
  dropTableByName = async (tableName: string) => {
    if (this.db != '') {
      if (tableName == '') {
        const tableArr = await this.selectByQuery("SELECT name FROM sqlite_master WHERE type='table'");
        console.log(`%cDB Total Table Count: ${tableArr.length}, Table Names: ${JSON.stringify([...tableArr])}`, ConsoleColors.Information);
        for (let i = 0; i < tableArr.length; i++) {
          const table = tableArr[i];
          if (table.name != 'sqlite_sequence') {
            await sqLiteExec(this.db, `DROP TABLE ${table.name}`);
          }
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

  /**
   * This method help to add data to the default tables of this server
   * @param data
   */
  addOrCreateDBTableFromData = async (data: PeopleData[] | WinnerData[] | UserData[]) => {
    let tableName = 'people';
    if ('luckyNumber' in data[0]) {
      tableName = 'winners';
    } else if ('luck' in data[0]) {
      tableName = 'users';
    }
    if (this.db != '') {
      if (!await this.isAsyncTableExist(tableName)) {
        switch (tableName) {
          case 'people':
            await sqLiteExec(this.db, `CREATE TABLE ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, uuid TEXT, dob DATE, email TEXT, gender TEXT, picture TEXT, role TEXT)`);
            break;
          case 'winners':
            await sqLiteExec(this.db, `CREATE TABLE ${tableName} (id INTEGER PRIMARY KEY, lucky_number INTEGER, join_date DATE)`);
            break;
          case 'users':
          default:
            await sqLiteExec(this.db, `CREATE TABLE ${tableName} (id INTEGER PRIMARY KEY, luck BOOLEAN, join_date DATE)`);
            break;
        }
      }
      for (let i = 0; i < data.length; i++) {
        const person: any = data[i];
        switch (tableName) {
          case 'people':
            await sqLiteExec(this.db, `INSERT INTO ${tableName} VALUES (null, '${person.name}', '${person.uuid}', '${person.dob}', '${person.email}', '${person.gender}', '${person.picture}', null)`);
            break;
          case 'winners':
            await sqLiteExec(this.db, `INSERT INTO ${tableName} VALUES (${person.id}, ${person.luckyNumber}, '${person.joinDate}')`);
            break;
          case 'users':
          default:
            await sqLiteExec(this.db, `INSERT INTO ${tableName} VALUES (${person.id}, ${person.luck}, '${person.joinDate}')`);
            break;
        }
      }
    } else {
      throw new Error('DB not initiated');
    }
  };

  /**
   * This method help to modify data to the default tables of this server
   * @param data
   */
  insertOrReplaceRow = async (data: PeopleData[] | WinnerData[] | UserData[]) => {
    let tableName = 'people';
    if ('luckyNumber' in data[0]) {
      tableName = 'winners';
    } else if ('luck' in data[0]) {
      tableName = 'users';
    }
    if (this.db != '') {
      if (!await this.isAsyncTableExist(tableName)) {
        await this.createDefultDBTablesIfMissing();
      }
      for (let i = 0; i < data.length; i++) {
        const person: any = data[i];
        switch (tableName) {
          case 'people':
            await sqLiteExec(this.db, `INSERT or REPLACE INTO ${tableName} VALUES (${person.id}, '${person.name}', '${person.uuid}', '${person.dob}', '${person.email}', '${person.gender}', '${person.picture}', '${person.role}')`);
            break;
          case 'winners':
            await sqLiteExec(this.db, `INSERT or REPLACE INTO ${tableName} VALUES (${person.id}, ${person.luckyNumber}, '${person.joinDate}')`);
            break;
          case 'users':
          default:
            await sqLiteExec(this.db, `INSERT or REPLACE INTO ${tableName} VALUES (${person.id}, ${person.luck}, '${person.joinDate}')`);
            break;
        }
      }
    } else {
      throw new Error('DB not initiated');
    }
  };

  /**
 * This method is used to validate or create the defult tables for this server
 * @param data
 */
  createDefultDBTablesIfMissing = async () => {
    console.log('%cDB initiation started', ConsoleColors.SystemInformation);
    await this.initiateSQLite();
    const tableNameArr: defaultTables[] = ['people', 'users', 'winners'];
    for (let i = 0; i < tableNameArr.length; i++) {
      const tableName = tableNameArr[i];
      if (!await this.isAsyncTableExist(tableName)) {
        switch (tableName) {
          case 'people':
            await sqLiteExec(this.db, `CREATE TABLE ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, uuid TEXT, dob DATE, email TEXT, gender TEXT, picture TEXT, role TEXT)`);
            break;
          case 'winners':
            await sqLiteExec(this.db, `CREATE TABLE ${tableName} (id INTEGER PRIMARY KEY, lucky_number INTEGER, join_date DATE)`);
            break;
          case 'users':
          default:
            await sqLiteExec(this.db, `CREATE TABLE ${tableName} (id INTEGER PRIMARY KEY, luck BOOLEAN, join_date DATE)`);
            break;
        }
      }
    }
  };

  selectFromTable = async (tableName: string): Promise<PeopleData[] | WinnerData[] | UserData[]> => {
    if (this.db != '') {
      return await sqLiteGet(this.db, `SELECT * FROM ${tableName}`);
    }
    throw new Error('DB not initiated');
  };

  selectByQuery = async (query: string): Promise<any[]> => {
    if (this.db != '') {
      return await sqLiteGet(this.db, query);
    }
    throw new Error('DB not initiated');
  };

  deleteRowFromTableById = async (tableName: string, id: number): Promise<any[]> => {
    if (this.db != '') {
      return await sqLiteExec(this.db, `DELETE FROM ${tableName} WHERE id=${id}`);
    }
    throw new Error('DB not initiated');
  };

  async isAsyncTableExist(tableName: string): Promise<boolean> {
    const tableArr = await this.selectByQuery(`SELECT name FROM sqlite_master WHERE type='table'AND name='${tableName}'`);
    if (tableArr.length > 0) {
      return true;
    }
    return false;
  }
}
