import 'dotenv/config';
import { Request, Response } from 'express';
import {
  PeopleAPIService, QueryAPIService, WinnerAPIService,
} from '../services/index';

export const getAllWinners = async (request: Request, response: Response) => {
  const peopleAPIService = new PeopleAPIService();

  const winners = await peopleAPIService.getFromDBTable('winners');

  if (winners && typeof winners[0] === 'object' && winners[0] != null) {
    response.status(200).send(winners);
  } else {
    response.status(404).send('Winners table is empty!');
  }
};

export const getWinnerByID = async (request: Request, response: Response) => {
  const { id } = request.params;
  const peopleAPIService = new PeopleAPIService();

  const winners = await peopleAPIService.getFromTableByID('winners', Number(id));

  if (winners && typeof winners[0] === 'object' && winners[0] != null) {
    response.status(200).send(winners);
  } else {
    response.status(404).send(`Winner with id of: ${Number(id)}, not found!`);
  }
};

export const createNewWinner = async (request: Request, response: Response) => {
  const winnerAPIService = new WinnerAPIService();
  let winners: any;
  try {
    winners = await winnerAPIService.createNewWinner();
  } catch (error) {
    if (error instanceof Error) {
      console.log(`%cError in Create Winner: ${error.message}`);
    }
  }
  if (winners && typeof winners[0] === 'object' && winners[0] != null) {
    response.status(201).send(winners);
  } else {
    response.status(500).send('Create new winner Error!');
  }
};

export const exportWinnersData = async (request: Request, response: Response) => {
  const { type, where } = request.body;
  const peopleAPIService = new PeopleAPIService();

  const winners = await peopleAPIService.exportPeopleData('winners', where, type);

  if (winners && typeof winners === 'string') {
    response.status(200).sendFile(winners);
  } else {
    response.status(500).send('Error: Export winners failed!');
  }
};

export const updateLuckyNumber = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { luckyNumber } = request.body;
  const queryAPIService = new QueryAPIService();
  await queryAPIService.initiateSQLite();

  let winners = [];
  if (!Number.isNaN(Number(luckyNumber))) {
    winners = await queryAPIService.selectByQuery(
      'SELECT * FROM '
      + 'winners '
      + 'WHERE '
      + `id=${Number(id)}`,
    );
  }

  if (winners && typeof winners[0] === 'object' && winners[0] != null) {
    const winnerAPIService = new WinnerAPIService();
    const updatedWinner = await winnerAPIService.updateLuckyNumber(winners[0], luckyNumber);
    response.status(200).send(updatedWinner);
  } else if (Number.isNaN(Number(luckyNumber))) {
    response.status(400).send(`Wrong value for lucky number: ${luckyNumber}`);
  } else {
    response.status(404).send(`Winner with id of: ${Number(id)}, not found!`);
  }
};
