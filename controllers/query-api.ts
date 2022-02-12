import 'dotenv/config';
import { Request, Response } from 'express';
import { QueryAPIService, PeopleAPIService } from '../services/index';

export const getAllPeople = async (request: Request, response: Response) => {
  const peopleAPIService = new PeopleAPIService();

  const people = await peopleAPIService.getFromDBTable('people');

  if (people && typeof people[0] === 'object' && people[0] != null) {
    response.status(200).send(people);
  } else {
    response.status(404).send('People table is empty!');
  }
};

export const getPersonByUUID = async (request: Request, response: Response) => {
  const { uuid } = request.params;
  const peopleAPIService = new PeopleAPIService();

  const people = await peopleAPIService.getFromPeopleByUUID(uuid);

  if (people && typeof people[0] === 'object' && people[0] != null) {
    response.status(200).send(people);
  } else {
    response.status(404).send(`Person with uuid of: ${uuid}, not found!`);
  }
};

export const getPersonByName = async (request: Request, response: Response) => {
  const name = request.query.name;
  const peopleAPIService = new PeopleAPIService();

  const people = await peopleAPIService.getFromPeopleByName(String(name));

  if (people && typeof people[0] === 'object' && people[0] != null) {
    response.status(200).send(people);
  } else {
    response.status(404).send(`Person with name of: ${name}, not found!`);
  }
};

export const createNewPerson = async (request: Request, response: Response) => {
  const peopleAPIService = new PeopleAPIService();

  const people = await peopleAPIService.createNewPerson();

  if (people && typeof people[0] === 'object' && people[0] != null) {
    response.status(201).send(people);
  } else {
    response.status(500).send('Create new person Error!');
  }
};

export const updatePerson = async (request: Request, response: Response) => {
  const { uuid } = request.params;
  const peopleAPIService = new PeopleAPIService();

  const people = await peopleAPIService.updatePerson(uuid, request.body);

  if (people && typeof people[0] === 'object' && people[0] != null) {
    response.status(200).send(people);
  } else {
    response.status(404).send(`Person with uuid of: ${uuid}, not found!`);
  }
};

export const removePerson = async (request: Request, response: Response) => {
  const { id } = request.params;
  const peopleAPIService = new PeopleAPIService();

  const people = await peopleAPIService.removePerson(Number(id));

  if (people && typeof people[0] === 'object' && people[0] != null) {
    response.status(500).send(`Person with id of: ${Number(id)}, was not removed!`);
  } else if (people.includes('Error')) {
    response.status(404).send(`Person with id of: ${id}, not found!`);
  } else {
    response.status(200).send({ deleted: true });
  }
};

export const dropDB = async (request: Request, response: Response) => {
  const { dbKey } = request.body;
  const queryAPIService = new QueryAPIService();
  await queryAPIService.initiateSQLite();
  // TODO: This is just an example site - this should never exist in a real product
  // The part: "|| dbKey == '%DB_KEY%'" is in here to allow everyone without keys to delete the DB
  if (process.env.DB_KEY == dbKey || dbKey == '%DB_KEY%') {
    await queryAPIService.dropTableByName('');
    return response.status(200).send({ deleted: true });
  }
  return response.status(401).send('Unauthorized to perform this request');
};
