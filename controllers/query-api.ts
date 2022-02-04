import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { QueryAPIService } from '../services/index';

export const addPeople = async (request: Request, response: Response) => {
  const queryAPIService = new QueryAPIService();

  await queryAPIService.initiateSQLite();

  await queryAPIService.dropTableByName('people');

  await queryAPIService.createDBTableFromData([{
    id: 1,
    joinDate: new Date('2020/01/15'),
    name: 'oren',
    uuid: uuid(),
  }]);

  const peopleTable = await queryAPIService.getAllFromTable('people');

  response.status(200).send(peopleTable);
};
