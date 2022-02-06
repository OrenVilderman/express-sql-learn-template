import 'dotenv/config';
import { Request, Response } from 'express';
import { QueryAPIService, PeopleAPIService, UserAPIService } from '../services/index';

export const getAllUsers = async (request: Request, response: Response) => {
  const peopleAPIService = new PeopleAPIService();

  const users = await peopleAPIService.getFromDBTable('users');

  if (typeof users[0] === 'object' && users[0] != null) {
    response.status(200).send(users);
  } else {
    response.status(404).send('Users table is empty!');
  }
};

export const getUserByID = async (request: Request, response: Response) => {
  const { id } = request.params;
  const peopleAPIService = new PeopleAPIService();

  const users = await peopleAPIService.getFromTableByID('users', Number(id));

  if (typeof users[0] === 'object' && users[0] != null) {
    response.status(200).send(users);
  } else {
    response.status(404).send(`User with uuid of: ${Number(id)}, not found!`);
  }
};

export const createNewUser = async (request: Request, response: Response) => {
  const userAPIService = new UserAPIService();

  const users = await userAPIService.createNewUser();

  if (typeof users[0] === 'object' && users[0] != null) {
    response.status(201).send(users);
  } else {
    response.status(500).send('Create new user Error!');
  }
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
