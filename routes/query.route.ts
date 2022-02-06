import express, { Router, Request, Response } from 'express';
import {
  createNewPerson, dropDB, getAllPeople, getPersonByName, getPersonByUUID, removePerson, updatePerson,
} from '../controllers/query-api';
import { ConsoleColors } from '../services/general.service';

const queryRouter: Router = express.Router();

queryRouter.get('/all', getAllPeople);

queryRouter.get('/:uuid', getPersonByUUID);

queryRouter.get('/', getPersonByName);

queryRouter.post('/create', createNewPerson);

queryRouter.patch('/:uuid', updatePerson);

queryRouter.delete('/:id', removePerson);

queryRouter.delete('/', dropDB);

queryRouter.all('*', (request: Request, response: Response) => {
  console.log(`%cQuery page not found for requset: ${request.url}`, ConsoleColors.Information);
  response
    .status(404).send(`<h1>Query page not found</h1><p>For this uri: ${request.url}</p>`);
});

export default queryRouter;
