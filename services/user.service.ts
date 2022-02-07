import { PeopleAPIService, QueryAPIService } from './index';

export class UserAPIService {
  createNewUser = async (): Promise<any[]> => {
    const queryAPIService = new QueryAPIService();
    await queryAPIService.initiateSQLite();

    let personWithoutRole = await queryAPIService.selectByQuery(
      'SELECT * FROM '
            + 'people '
            + 'WHERE '
            + 'role '
            + 'IS NULL',
    );

    const peopleAPIService = new PeopleAPIService();
    if (personWithoutRole[0] == undefined) {
      await peopleAPIService.createNewPerson();

      personWithoutRole = await queryAPIService.selectByQuery(
        'SELECT * FROM '
                + 'people '
                + 'WHERE '
                + 'role '
                + 'IS NULL',
      );
    }

    await queryAPIService.addOrCreateDBTableFromData([{
      id: personWithoutRole[0].id,
      joinDate: new Date(Date.now()).toISOString() as any,
      luck: false,
    }]);

    await queryAPIService.insertOrReplaceRow([{
      id: personWithoutRole[0].id,
      uuid: personWithoutRole[0].uuid,
      name: personWithoutRole[0].name,
      gender: personWithoutRole[0].gender,
      dob: personWithoutRole[0].dob,
      picture: personWithoutRole[0].picture,
      email: personWithoutRole[0].email,
      role: 'user',
    }]);

    return await peopleAPIService.getFromTableByID('users', personWithoutRole[0].id);
  };

  updateLuck = async (user: any, luck: boolean): Promise<any[]> => {
    const queryAPIService = new QueryAPIService();
    await queryAPIService.initiateSQLite();

    await queryAPIService.insertOrReplaceRow([{
      id: user.id,
      luck: Boolean(luck),
      joinDate: user.join_date,
    }]);

    return await queryAPIService.selectByQuery(
      'SELECT * FROM '
            + 'users '
            + 'WHERE '
            + `id=${Number(user.id)}`,
    );
  };
}
