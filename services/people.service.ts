import { v4 as uuid } from 'uuid';
import { ConsoleColors, exportFormat } from './general.service';
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

  exportPeopleData = async (tableName: string, where: string, format: exportFormat): Promise<string> => {
    const queryAPIService = new QueryAPIService();
    await queryAPIService.initiateSQLite();
    let people = [];
    try {
      people = await queryAPIService.selectByQuery(
        'SELECT * FROM '
        + `${tableName
        }${where ? ` WHERE ${where}` : ''}`,
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(`%cDB ERROR: ${error.name}, ${error.message}`, ConsoleColors.Error);
      }
    }
    let dataToExport = '';
    if (people && typeof people[0] === 'object' && people[0] != null) {
      const generalService = new GeneralService();
      try {
        dataToExport = await generalService.exportDataAsFile(people, format);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`%cData Export Error: ${error.name}, ${error.message}`, ConsoleColors.Error);
          dataToExport = error.message;
        }
      }
    } else {
      dataToExport = undefined as any;
    }
    return dataToExport;
  };

  updatePerson = async (uuid: string, data: any): Promise<any[]> => {
    const {
      name, gender, picture, email, role,
    } = data;

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

      if (typeof people[0] === 'object' && people[0] != null) {
        await queryAPIService.insertOrReplaceRow([{
          id: people[0].id,
          uuid: people[0].uuid,
          name: name || people[0].name,
          gender: gender || people[0].gender,
          dob: people[0].dob,
          picture: picture || people[0].picture,
          email: email || people[0].email,
          role: role || people[0].role,
        }]);

        people = await queryAPIService.selectByQuery(
          'SELECT * FROM '
          + 'people '
          + 'WHERE '
          + `uuid='${uuid}'`,
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`%cPerson Creation Error: ${error.name}, ${error.message}`, ConsoleColors.Error);
      }
    }
    return people;
  };

  removePerson = async (id: number): Promise<any[]> => {
    const queryAPIService = new QueryAPIService();
    await queryAPIService.initiateSQLite();

    let people = [];
    try {
      const queryAPIService = new QueryAPIService();
      await queryAPIService.initiateSQLite();

      people = await queryAPIService.selectByQuery(
        'SELECT * FROM '
        + 'people '
        + 'WHERE '
        + `id=${id}`,
      );

      if (people[0].role == 'user') {
        await queryAPIService.deleteRowFromTableById('users', id);
      } else if (people[0].role == 'winner') {
        await queryAPIService.deleteRowFromTableById('winners', id);
      }
      await queryAPIService.deleteRowFromTableById('people', id);

      people = await queryAPIService.selectByQuery(
        'SELECT * FROM '
        + 'people '
        + 'WHERE '
        + `id=${id}`,
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error(`%cPerson Creation Error: ${error.name}, ${error.message}`, ConsoleColors.Error);
        people = 'Person Creation Error' as any;
      }
    }
    return people;
  };
}
