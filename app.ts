import express, { Application, Request, Response } from 'express';
import 'dotenv/config';
import { ConsoleColors, webSocket } from './services/general.service';
import indexRouter from './routes';
import { GeneralService, QueryAPIService } from './services';

const generalService = new GeneralService();
const job = generalService.initiateNewPeopleCronJob(1);
job.start();

const queryAPIService = new QueryAPIService();
queryAPIService.createDefultDBTablesIfMissing();

const socketSet: any = new Set();

const PORT: number = Number(process.env.PORT) || 5000;
const app: Application = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/', (request: Request, response: Response, next) => {
  console.log(`%cReviced - ${request.method}:${request.url}`, ConsoleColors.IncomingRequest);
  next();
});

app.use('/api/V0.1', indexRouter);

const server = app.listen(PORT, () => {
  console.log(`%cServer is running on http://localhost:${PORT}`, ConsoleColors.SystemInformation);
});

app.all('*', (request: Request, response: Response) => {
  console.log(`%cPage not found for requset: ${request.url}`, ConsoleColors.Error);
  response
    .status(404).send('<h1>Page not found</h1>');
});

process.on('SIGTERM', () => {
  console.log('%cSIGTERM signal received: closing HTTP server', ConsoleColors.Error);

  /**
   * Close the connections before calling the server close
   */
  socketSet.forEach((element: { destroy: () => void; }) => {
    element.destroy();
  });
  server.close();
});

/**
 * Store the connection to allow implemntaion of limitation
 */
server.on('connection', (socket) => {
  socketSet.add(socket);
  socket.on('close', () => {
    socketSet.delete(socket);
  });
});

server.on('close', async () => {
  console.log('%cServer Shut Down', ConsoleColors.Error);
  job.stop();
  webSocket.close();
  /**
   * Allow time to create logs in the server before closing
   */
  await new Promise((resolve) => setTimeout(resolve, 2000));
  process.exit(1);
});
