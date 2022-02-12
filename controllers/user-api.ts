import 'dotenv/config';
import { Request, Response } from 'express';
import { QueryAPIService, PeopleAPIService, UserAPIService } from '../services/index';

export const getAllUsers = async (request: Request, response: Response) => {
  const peopleAPIService = new PeopleAPIService();

  const users = await peopleAPIService.getFromDBTable('users');

  if (users && typeof users[0] === 'object' && users[0] != null) {
    response.status(200).send(users);
  } else {
    response.status(404).send('Users table is empty!');
  }
};

export const getUserByID = async (request: Request, response: Response) => {
  const { id } = request.params;
  const peopleAPIService = new PeopleAPIService();

  const users = await peopleAPIService.getFromTableByID('users', Number(id));

  if (users && typeof users[0] === 'object' && users[0] != null) {
    response.status(200).send(users);
  } else {
    response.status(404).send(`User with id of: ${Number(id)}, not found!`);
  }
};

export const createNewUser = async (request: Request, response: Response) => {
  const userAPIService = new UserAPIService();
  let users: any;
  try {
    users = await userAPIService.createNewUser();
  } catch (error) {
    if (error instanceof Error) {
      console.log(`%cError in Create Winner: ${error.message}`);
    }
  }

  if (users && typeof users[0] === 'object' && users[0] != null) {
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

  let users = [];
  if (typeof luck == 'boolean') {
    users = await queryAPIService.selectByQuery(
      'SELECT * FROM '
      + 'users '
      + 'WHERE '
      + `id=${Number(id)}`,
    );
  }

  if (users && typeof users[0] === 'object' && users[0] != null) {
    const userAPIService = new UserAPIService();
    const updatedUser = await userAPIService.updateLuck(users[0], luck);

    response.status(200).send(updatedUser);
  } else if (typeof luck != 'boolean') {
    response.status(400).send(`Wrong value for luck: ${luck}`);
  } else {
    response.status(404).send(`User with id of: ${Number(id)}, not found!`);
  }
};
