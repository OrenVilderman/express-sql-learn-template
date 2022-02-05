import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { GeneralService, QueryAPIService } from '../services/index';

export const createNewWinner = async (request: Request, response: Response) => {
  const queryAPIService = new QueryAPIService();

  await queryAPIService.initiateSQLite();

  let personWithoutRole = await queryAPIService.selectByQuery(
    'SELECT * FROM '
    + 'people '
    + 'WHERE '
    + 'role '
    + 'IS NULL',
  );

  if (personWithoutRole[0] == undefined) {
    const generalService = new GeneralService();
    let newPerson: any = await generalService.fetchStatus(process.env.USER_API || 'https://randomuser.me/api', { method: 'GET' });
    newPerson = newPerson.Body.results[0];

    await queryAPIService.initiateSQLite();
    await queryAPIService.addOrCreateDBTableFromData([{
      uuid: uuid(),
      name: newPerson.name.first,
      gender: newPerson.gender,
      dob: newPerson.dob.date,
      picture: newPerson.picture.large,
      email: newPerson.email,
    }]);

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

  const winnersTable = await queryAPIService.selectFromTable('winners');

  response.status(201).send(winnersTable);
};