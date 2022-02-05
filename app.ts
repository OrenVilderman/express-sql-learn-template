import express, { Application, Request, Response } from 'express';
import 'dotenv/config';
import GeneralService, { ConsoleColors } from './services/general.service';
import indexRouter from './routes';

const generalService = new GeneralService();
const job = generalService.initiateNewPeopleCronJob(2);
job.start();

const PORT: number = Number(process.env.PORT) || 5000;
const app: Application = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/', (request: Request, response: Response, next) => {
  console.log(`%cReviced - ${request.method}:${request.url}`, ConsoleColors.IncomingRequest);
  next();
});
app.use('/api/V0.1', indexRouter);

app.listen(PORT, () => {
  console.log(`%cServer is running on http://localhost:${PORT}`, ConsoleColors.SystemInformation);
});

app.all('*', (request: Request, response: Response) => {
  console.log(`%cPage not found for requset: ${request.url}`, ConsoleColors.Error);
  response
    .status(404).send('<h1>Page not found</h1>');
});
