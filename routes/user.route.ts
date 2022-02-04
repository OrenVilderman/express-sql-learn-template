import express, { Router, Request, Response } from 'express';
import { addUser } from '../controllers/user-api';
import { ConsoleColors } from '../services/general.service';

const userRouter: Router = express.Router();

userRouter.get('/add', addUser);

userRouter.all('*', (request: Request, response: Response) => {
  console.log(`%cUser page not found for requset: ${request.url}`, ConsoleColors.Information);
  response
    .status(404).send(`<h1>User page not found</h1><p>For this uri: ${request.url}</p>`);
});

export default userRouter;
