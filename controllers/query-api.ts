import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { QueryAPIService } from '../services/index';

export const addPeople = async (request: Request, response: Response) => {
  const queryAPIService = new QueryAPIService();

  await queryAPIService.initiateSQLite();

  await queryAPIService.addOrCreateDBTableFromData([{
    id: 1,
    joinDate: new Date('2020/01/15'),
    name: 'oren',
    uuid: uuid(),
    gender: 'X',
    picture: 'http://no',
    email: 'a@B.com',
  }]);

  const peopleTable = await queryAPIService.selectFromTable('people');

  response.status(200).send(peopleTable);
};
