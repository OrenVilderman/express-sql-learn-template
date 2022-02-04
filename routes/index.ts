import express, { Router, Request, Response } from 'express';
import { ConsoleColors } from '../services/general.service';

import queryRouter from './query.route';
import winnerRouter from './winner.route';
import userRouter from './user.route';

const indexRouter: Router = express.Router();

indexRouter.use('/query', queryRouter);

indexRouter.use('/winner', winnerRouter);

indexRouter.use('/user', userRouter);

indexRouter.all('*', (request: Request, response: Response) => {
  console.log(`%cPage not found for requset: ${request.url}`, ConsoleColors.Information);
  response
    .status(404).send(`<h1>Page not found</h1><p>For this uri: ${request.url}</p>`);
});

export default indexRouter;
