import express, { Router, Request, Response } from 'express';
import { addWinner } from '../controllers/winner-api';
import { ConsoleColors } from '../services/general.service';

const winnerRouter: Router = express.Router();

winnerRouter.get('/add', addWinner);

winnerRouter.all('*', (request: Request, response: Response) => {
  console.log(`%cWinner page not found for requset: ${request.url}`, ConsoleColors.Information);
  response
    .status(404).send(`<h1>Winner page not found</h1><p>For this uri: ${request.url}</p>`);
});

export default winnerRouter;
