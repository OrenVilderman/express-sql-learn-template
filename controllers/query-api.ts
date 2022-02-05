import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { GeneralService, QueryAPIService } from '../services/index';

export const createNewPerson = async (request: Request, response: Response) => {
  const generalService = new GeneralService();
  let newPerson: any = await generalService.fetchStatus(process.env.USER_API || 'https://randomuser.me/api', { method: 'GET' });
  newPerson = newPerson.Body.results[0];

  const queryAPIService = new QueryAPIService();
  await queryAPIService.initiateSQLite();
  await queryAPIService.addOrCreateDBTableFromData([{
    uuid: uuid(),
    name: newPerson.name.first,
    gender: newPerson.gender,
    dob: newPerson.dob.date,
    picture: newPerson.picture.large,
    email: newPerson.email,
  }]);

  const peopleTable = await queryAPIService.selectFromTable('people');

  response.status(201).send(peopleTable);
};
