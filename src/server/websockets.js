import { Server as WebSocketServer } from 'ws';
import { middleware } from '../lib/pipe';

const websocketMessageMiddleware = [
  (payload, next) => {
    if (payload.message.type !== 'ready') {
      return next(payload);
    }
    const { id } = payload.message;

    if (!payload.clients.has(id)) {
      payload.websocket.close();
      return false;
    }

    if (!payload.game.hasJoined(id)) {
      return false;
    }

    payload.game.ready(id, payload.websocket);

    return true;
  },
];

export default (httpServer, clients, game) => {
  const socketServer = new WebSocketServer({ server: httpServer });

  socketServer.on('connection', (client) => {
    client.on('message', (raw) => {
      middleware(
        [
          ...websocketMessageMiddleware,
        ],
        {
          message: JSON.parse(raw),
          game,
          clients,
          websocket: client,
        },
      );

      console.log('PLAYERS', game.getPlayers());
    });

    client.on('close', () => {
      const clientId = game.idByWebsocket(client);
      if (!clientId) return;

      console.log('SOCKET closed, unready to ', clientId);

      game.unready(clientId);
      game.lobby();
    });
  });
}
