import 'dotenv/config';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { GeneralService, QueryAPIService } from '../services/index';

export const getAllUsers = async (request: Request, response: Response) => {
  const queryAPIService = new QueryAPIService();
  await queryAPIService.initiateSQLite();

  const users = await queryAPIService.selectByQuery(
    'SELECT * FROM '
    + 'users',
  );

  if (typeof users[0] === 'object' && users[0] != null) {
    response.status(200).send(users);
  } else {
    response.status(404).send('Users table is empty!');
  }
};

export const getUserByID = async (request: Request, response: Response) => {
  const { id } = request.params;
  const queryAPIService = new QueryAPIService();
  await queryAPIService.initiateSQLite();

  const user = await queryAPIService.selectByQuery(
    'SELECT * FROM '
    + 'users '
    + 'WHERE '
    + `id=${Number(id)}`,
  );

  if (typeof user[0] === 'object' && user[0] != null) {
    response.status(200).send(user);
  } else {
    response.status(404).send(`User with uuid of: ${Number(id)}, not found!`);
  }
};

export const createNewUser = async (request: Request, response: Response) => {
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

  const usersTable = await queryAPIService.selectFromTable('users');

  response.status(201).send(usersTable);
};

export const updateLuck = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { luck } = request.body;
  const queryAPIService = new QueryAPIService();
  await queryAPIService.initiateSQLite();

  const user = await queryAPIService.selectByQuery(
    'SELECT * FROM '
    + 'users '
    + 'WHERE '
    + `id=${Number(id)}`,
  );

  if (typeof user[0] === 'object' && user[0] != null) {
    await queryAPIService.insertOrReplaceRow([{
      id: user[0].id,
      luck: Boolean(luck) || user[0].luck,
      joinDate: user[0].join_date,
    }]);

    const updatedUser = await queryAPIService.selectByQuery(
      'SELECT * FROM '
      + 'users '
      + 'WHERE '
      + `id=${Number(id)}`,
    );

    response.status(200).send(updatedUser);
  } else {
    response.status(404).send(`User with id of: ${Number(id)}, not found!`);
  }
};
