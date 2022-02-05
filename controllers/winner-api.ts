import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { QueryAPIService } from '../services/index';

export const addWinner = async (request: Request, response: Response) => {
  const queryAPIService = new QueryAPIService();

  await queryAPIService.initiateSQLite();

  await queryAPIService.addOrCreateDBTableFromData([{
    joinDate: new Date('2020/01/15'),
    luckyNumber: 1,
    name: 'super oren',
    uuid: uuid(),
  }]);

  await queryAPIService.insertOrReplaceRow([{
    id: 1,
    joinDate: new Date('2020/01/15'),
    luckyNumber: 1,
    name: 'super oren',
    uuid: uuid(),
  },
  {
    id: 3,
    joinDate: new Date('2020/01/17'),
    luckyNumber: 1,
    name: 'second super oren',
    uuid: uuid(),
  }]);
  const winnersTable = await queryAPIService.selectFromTable('winners');

  response.status(200).send(winnersTable);
};
