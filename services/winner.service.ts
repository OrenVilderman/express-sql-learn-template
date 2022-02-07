import { PeopleAPIService, QueryAPIService } from './index';

export class WinnerAPIService {
  createNewWinner = async (): Promise<any[]> => {
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
      luckyNumber: Math.floor(Math.random() * 99),
    }]);

    await queryAPIService.insertOrReplaceRow([{
      id: personWithoutRole[0].id,
      uuid: personWithoutRole[0].uuid,
      name: personWithoutRole[0].name,
      gender: personWithoutRole[0].gender,
      dob: personWithoutRole[0].dob,
      picture: personWithoutRole[0].picture,
      email: personWithoutRole[0].email,
      role: 'winner',
    }]);

    return await peopleAPIService.getFromTableByID('winners', personWithoutRole[0].id);
  };

  updateLuckyNumber = async (winner: any, luckyNumber: number): Promise<any[]> => {
    const queryAPIService = new QueryAPIService();
    await queryAPIService.initiateSQLite();

    await queryAPIService.insertOrReplaceRow([{
      id: winner.id,
      luckyNumber: Math.floor(luckyNumber),
      joinDate: winner.join_date,
    }]);

    return await queryAPIService.selectByQuery(
      'SELECT * FROM '
            + 'winners '
            + 'WHERE '
            + `id=${Number(winner.id)}`,
    );
  };
}
