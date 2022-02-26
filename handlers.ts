import { ConsoleColors, webSocket } from './services/general.service';
import server, { job } from './app';

const kill = require('kill-port');

const socketSet: any = new Set();
const PORT: number = Number(process.env.PORT) || 5000;

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
  if (webSocket) {
    webSocket.close();
  }
});

server.on('error', async (error) => {
  if (error instanceof Error) {
    if (error.message.startsWith('listen EADDRINUSE: address already in use')) {
      kill(PORT, 'tcp')
        .then(() => {
          console.log(error.message);
          server.listen(PORT, () => {
            console.log(`%cServer Restarted: Server is running on http://localhost:${PORT}`, ConsoleColors.SystemInformation);
          });
        })
        .catch(console.log);
    }
  }
});
