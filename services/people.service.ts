import { ConsoleColors } from './general.service';
import { QueryAPIService } from './index';

export class PeopleAPIService {
  getFromDBTable = async (tableName: string): Promise<any[]> => {
    const queryAPIService = new QueryAPIService();
    await queryAPIService.initiateSQLite();
    let people = [];
    try {
      people = await queryAPIService.selectByQuery(
        'SELECT * FROM '
                + `${tableName}`,
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(`%cDB ERROR: ${error.name}, ${error.message}`, ConsoleColors.Error);
      }
    }
    return people;
  };

  getFromTableByID = async (tableName: string, id: number): Promise<any[]> => {
    const queryAPIService = new QueryAPIService();
    await queryAPIService.initiateSQLite();
    let people = [];
    try {
      people = await queryAPIService.selectByQuery(
        'SELECT * FROM '
                + `${tableName} ${
                  +'WHERE '
                }id=${Math.floor(id)}`,
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(`%cDB ERROR: ${error.name}, ${error.message}`, ConsoleColors.Error);
      }
    }
    return people;
  };

  getFromTableByUUID = async (tableName: string, uuid: string): Promise<any[]> => {
    const queryAPIService = new QueryAPIService();
    await queryAPIService.initiateSQLite();
    let people = [];
    try {
      people = await queryAPIService.selectByQuery(
        'SELECT * FROM '
                + `${tableName} ${
                  +'WHERE '
                }uuid='${uuid}'`,
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(`%cDB ERROR: ${error.name}, ${error.message}`, ConsoleColors.Error);
      }
    }
    return people;
  };
}
