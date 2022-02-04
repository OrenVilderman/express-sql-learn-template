import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { QueryAPIService } from '../services/index';

export const addWinner = async (request: Request, response: Response) => {
  const queryAPIService = new QueryAPIService();

  await queryAPIService.initiateSQLite();

  await queryAPIService.dropTableByName('winners');

  await queryAPIService.createDBTableFromData([{
    id: 1,
    joinDate: new Date('2020/01/15'),
    luckyNumber: 1,
    name: 'super oren',
    uuid: uuid(),
  }]);

  const winnersTable = await queryAPIService.getAllFromTable('winners');

  response.status(200).send(winnersTable);
};
