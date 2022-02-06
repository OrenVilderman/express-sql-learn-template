import { v4 as uuid } from 'uuid';
import { ConsoleColors } from './general.service';
import { GeneralService, QueryAPIService } from './index';

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
        + `${tableName} ${'WHERE '
        }id=${Math.floor(id)}`,
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(`%cDB ERROR: ${error.name}, ${error.message}`, ConsoleColors.Error);
      }
    }
    return people;
  };

  getFromPeopleByUUID = async (uuid: string): Promise<any[]> => {
    const queryAPIService = new QueryAPIService();
    await queryAPIService.initiateSQLite();
    let people = [];
    try {
      people = await queryAPIService.selectByQuery(
        'SELECT * FROM '
        + 'people '
        + 'WHERE '
        + `uuid='${uuid}'`,
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(`%cDB ERROR: ${error.name}, ${error.message}`, ConsoleColors.Error);
      }
    }
    return people;
  };

  getFromPeopleByName = async (name: string): Promise<any[]> => {
    const queryAPIService = new QueryAPIService();
    await queryAPIService.initiateSQLite();
    let people = [];
    try {
      people = await queryAPIService.selectByQuery(
        'SELECT * FROM '
        + 'people '
        + 'WHERE '
        + `name='${name}'`,
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(`%cDB ERROR: ${error.name}, ${error.message}`, ConsoleColors.Error);
      }
    }
    return people;
  };

  createNewPerson = async (): Promise<any[]> => {
    const queryAPIService = new QueryAPIService();
    await queryAPIService.initiateSQLite();
    let person: any = [];
    try {
      const generalService = new GeneralService();
      let newPerson: any = await generalService.fetchStatus(process.env.USER_API || 'https://randomuser.me/api', { method: 'GET' });
      newPerson = newPerson.Body.results[0];

      const queryAPIService = new QueryAPIService();
      await queryAPIService.initiateSQLite();

      const newPersonUUID = uuid();
      await queryAPIService.addOrCreateDBTableFromData([{
        uuid: newPersonUUID,
        name: newPerson.name.first,
        gender: newPerson.gender,
        dob: newPerson.dob.date,
        picture: newPerson.picture.large,
        email: newPerson.email,
      }]);

      person = await this.getFromPeopleByUUID(newPersonUUID);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`%cPerson Creation Error: ${error.name}, ${error.message}`, ConsoleColors.Error);
      }
    }
    return person;
  };
}
