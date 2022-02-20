import { ConsoleColors, webSocket } from './services/general.service';

import server, { job } from './app';

const socketSet: any = new Set();

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
