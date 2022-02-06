import 'dotenv/config';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { GeneralService, PeopleAPIService, QueryAPIService } from '../services/index';

export const getAllWinners = async (request: Request, response: Response) => {
  const peopleAPIService = new PeopleAPIService();

  const winners = await peopleAPIService.getFromDBTable('winners');

  if (typeof winners[0] === 'object' && winners[0] != null) {
    response.status(200).send(winners);
  } else {
    response.status(404).send('Winners table is empty!');
  }
};

export const getWinnerByID = async (request: Request, response: Response) => {
  const { id } = request.params;
  const queryAPIService = new QueryAPIService();
  await queryAPIService.initiateSQLite();

  const winner = await queryAPIService.selectByQuery(
    'SELECT * FROM '
    + 'winners '
    + 'WHERE '
    + `id=${Number(id)}`,
  );

  if (typeof winner[0] === 'object' && winner[0] != null) {
    response.status(200).send(winner);
  } else {
    response.status(404).send(`Winner with uuid of: ${Number(id)}, not found!`);
  }
};

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

export const updateLuckyNumber = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { luckyNumber } = request.body;
  const queryAPIService = new QueryAPIService();
  await queryAPIService.initiateSQLite();

  const winner = await queryAPIService.selectByQuery(
    'SELECT * FROM '
    + 'winners '
    + 'WHERE '
    + `id=${Number(id)}`,
  );

  if (typeof winner[0] === 'object' && winner[0] != null) {
    await queryAPIService.insertOrReplaceRow([{
      id: winner[0].id,
      luckyNumber: Math.floor(luckyNumber) || winner[0].lucky_number,
      joinDate: winner[0].join_date,
    }]);

    const updatedWinner = await queryAPIService.selectByQuery(
      'SELECT * FROM '
      + 'winners '
      + 'WHERE '
      + `id=${Number(id)}`,
    );

    response.status(200).send(updatedWinner);
  } else {
    response.status(404).send(`Winner with id of: ${Number(id)}, not found!`);
  }
};
