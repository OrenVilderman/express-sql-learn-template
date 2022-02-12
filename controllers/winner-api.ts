import 'dotenv/config';
import { Request, Response } from 'express';
import {
  PeopleAPIService, QueryAPIService, WinnerAPIService,
} from '../services/index';

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
  const peopleAPIService = new PeopleAPIService();

  const winners = await peopleAPIService.getFromTableByID('winners', Number(id));

  if (typeof winners[0] === 'object' && winners[0] != null) {
    response.status(200).send(winners);
  } else {
    response.status(404).send(`Winner with id of: ${Number(id)}, not found!`);
  }
};

export const createNewWinner = async (request: Request, response: Response) => {
  const winnerAPIService = new WinnerAPIService();

  const winners = await winnerAPIService.createNewWinner();

  if (typeof winners[0] === 'object' && winners[0] != null) {
    response.status(201).send(winners);
  } else {
    response.status(500).send('Create new winner Error!');
  }
};

export const updateLuckyNumber = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { luckyNumber } = request.body;
  const queryAPIService = new QueryAPIService();
  await queryAPIService.initiateSQLite();

  let winner = [];
  if (!Number.isNaN(Number(luckyNumber))) {
    winner = await queryAPIService.selectByQuery(
      'SELECT * FROM '
      + 'winners '
      + 'WHERE '
      + `id=${Number(id)}`,
    );
  }

  if (typeof winner[0] === 'object' && winner[0] != null) {
    const winnerAPIService = new WinnerAPIService();
    const updatedWinner = await winnerAPIService.updateLuckyNumber(winner[0], luckyNumber);
    response.status(200).send(updatedWinner);
  } else if (Number.isNaN(Number(luckyNumber))) {
    response.status(400).send(`Wrong value for lucky number: ${luckyNumber}`);
  } else {
    response.status(404).send(`Winner with id of: ${Number(id)}, not found!`);
  }
};
