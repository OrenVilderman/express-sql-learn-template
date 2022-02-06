import 'dotenv/config';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { GeneralService, QueryAPIService, PeopleAPIService } from '../services/index';

export const getAllPeople = async (request: Request, response: Response) => {
  const peopleAPIService = new PeopleAPIService();

  const people = await peopleAPIService.getFromDBTable('people');

  if (typeof people[0] === 'object' && people[0] != null) {
    response.status(200).send(people);
  } else {
    response.status(404).send('People table is empty!');
  }
};

export const getPersonByUUID = async (request: Request, response: Response) => {
  const { uuid } = request.params;
  const queryAPIService = new QueryAPIService();
  await queryAPIService.initiateSQLite();

  const person = await queryAPIService.selectByQuery(
    'SELECT * FROM '
    + 'people '
    + 'WHERE '
    + `uuid='${uuid}'`,
  );

  if (typeof person[0] === 'object' && person[0] != null) {
    response.status(200).send(person);
  } else {
    response.status(404).send(`Person with uuid of: ${uuid}, not found!`);
  }
};

export const getPersonByName = async (request: Request, response: Response) => {
  const name = request.query.name;
  const queryAPIService = new QueryAPIService();
  await queryAPIService.initiateSQLite();
  const person = await queryAPIService.selectByQuery(
    'SELECT * FROM '
    + 'people '
    + 'WHERE '
    + `name='${name}'`,
  );
  if (typeof person[0] === 'object' && person[0] != null) {
    response.status(200).send(person);
  } else {
    response.status(404).send(`Person with name of: ${name}, not found!`);
  }
};

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

export const updatePerson = async (request: Request, response: Response) => {
  const { uuid } = request.params;
  const {
    name, gender, picture, email, role,
  } = request.body;
  const queryAPIService = new QueryAPIService();
  await queryAPIService.initiateSQLite();

  const person = await queryAPIService.selectByQuery(
    'SELECT * FROM '
    + 'people '
    + 'WHERE '
    + `uuid='${uuid}'`,
  );

  if (typeof person[0] === 'object' && person[0] != null) {
    await queryAPIService.insertOrReplaceRow([{
      id: person[0].id,
      uuid: person[0].uuid,
      name: name || person[0].name,
      gender: gender || person[0].gender,
      dob: person[0].dob,
      picture: picture || person[0].picture,
      email: email || person[0].email,
      role: role || person[0].role,
    }]);

    const updatedPerson = await queryAPIService.selectByQuery(
      'SELECT * FROM '
      + 'people '
      + 'WHERE '
      + `uuid='${uuid}'`,
    );

    response.status(200).send(updatedPerson);
  } else {
    response.status(404).send(`Person with uuid of: ${uuid}, not found!`);
  }
};

export const removePerson = async (request: Request, response: Response) => {
  const { id } = request.params;
  const queryAPIService = new QueryAPIService();
  await queryAPIService.initiateSQLite();

  const personToDelete = await queryAPIService.selectByQuery(
    'SELECT * FROM '
    + 'people '
    + 'WHERE '
    + `id=${Number(id)}`,
  );

  if (personToDelete[0].role == 'user') {
    await queryAPIService.deleteRowFromTableById('users', Number(id));
  } else if (personToDelete[0].role == 'winner') {
    await queryAPIService.deleteRowFromTableById('winners', Number(id));
  }
  await queryAPIService.deleteRowFromTableById('people', Number(id));

  const person = await queryAPIService.selectByQuery(
    'SELECT * FROM '
    + 'people '
    + 'WHERE '
    + `id=${Number(id)}`,
  );

  if (typeof person[0] === 'object' && person[0] != null) {
    response.status(500).send(`Person with id of: ${Number(id)}, was not removed!`);
  } else {
    response.status(200).send({ deleted: true });
  }
};

export const dropDB = async (request: Request, response: Response) => {
  const { dbKey } = request.body;
  const queryAPIService = new QueryAPIService();
  await queryAPIService.initiateSQLite();
  if (process.env.DB_KEY == dbKey) {
    await queryAPIService.dropTableByName('');
  }
  response.status(200).send({ deleted: true });
};
