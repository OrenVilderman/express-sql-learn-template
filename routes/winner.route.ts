import express, { Router, Request, Response } from 'express';
import {
  createNewWinner, exportWinnersData, getAllWinners, getWinnerByID, updateLuckyNumber,
} from '../controllers/winner-api';
import { ConsoleColors } from '../services/general.service';

const winnerRouter: Router = express.Router();

winnerRouter.get('/all', getAllWinners);

winnerRouter.get('/:id', getWinnerByID);

winnerRouter.post('/create', createNewWinner);

winnerRouter.post('/export', exportWinnersData);

winnerRouter.patch('/:id', updateLuckyNumber);

winnerRouter.all('*', (request: Request, response: Response) => {
  console.log(`%cWinner page not found for requset: ${request.url}`, ConsoleColors.Information);
  response
    .status(404).send(`<h1>Winner page not found</h1><p>For this uri: ${request.url}, with method of: ${request.method}</p>`);
});

export default winnerRouter;
