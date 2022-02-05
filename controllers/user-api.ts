import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { QueryAPIService } from '../services/index';

export const addUser = async (request: Request, response: Response) => {
  const queryAPIService = new QueryAPIService();

  await queryAPIService.initiateSQLite();

  // await queryAPIService.dropTableByName('users');

  await queryAPIService.addOrCreateDBTableFromData([{
    joinDate: new Date('2020/01/15'),
    luck: false,
    name: 'no oren',
    uuid: uuid(),
  }]);

  const usersTable = await queryAPIService.selectFromTable('users');

  response.status(200).send(usersTable);
};
