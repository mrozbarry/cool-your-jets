import { Server as WebSocketServer } from 'ws';
import { middleware } from '../lib/pipe';

export default (httpServer, clients, game) => {
  const socketServer = new WebSocketServer({ server: httpServer });

  socketServer.on('connection', (client) => {
    game.connect(client);

    client.on('close', () => {
      const clientId = game.idByWebsocket(client);
      if (!clientId) return;

      console.log('SOCKET closed, unready to ', clientId);

      game.unready(clientId);
      game.lobby();
    });
  });
}
