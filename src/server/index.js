import ParcelBundler from 'parcel-bundler';
import * as http from 'http';
import Express from 'express';
import path from 'path';
import { Server as WebSocketServer } from 'ws';
import Game from './models/Game';
import Clients from './models/Clients';
import { middleware } from '../lib/pipe';

function useParcelBundler(expressApp, entryPoint) {
  const options = (void 0);
  const entryWithPath = path.resolve(__dirname, '..', '..', entryPoint);
  const bundler = new ParcelBundler(entryWithPath, options);
  expressApp.use(bundler.middleware());
}

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

function connectWebsocketServer(httpServer, clients, game) {
  const socketServer = new WebSocketServer({ server: httpServer });

  socketServer.on('connection', (client) => {
    client.on('message', (raw) => {
      middleware(
        websocketMessageMiddleware,
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
    });
  });

  return socketServer;
}

function addGameRoutes(expressApp, clients, game) {
  const router = Express.Router();

  router.get('/client/new', (request, response) => {
    const id = clients.add();

    return response.status(201).json({ id }).end();
  });

  const activeIdMiddleware = (request, response, next) => {
    const clientId = request.params.id;

    if (!clients.touch(clientId)) {
      return response.status(401).json({
        message: 'Your id is no longer active, get a fresh id from /client/new to continue',
        clientId,
      }).end();
    }

    next();
  };

  router.get('/client/:id/join', activeIdMiddleware, (request, response) => {
    const clientId = request.params.id;

    if (game.joinable(clientId) && !game.hasJoined(clientId)) {
      const player = game.join(clientId);
      return response.status(201).json(player).end();
    }

    return response.status(403).end();
  });

  router.get('/client/:id/lobby', activeIdMiddleware, (request, response) => {
    console.log('REQ get lobby');
    return response.status(200).json(game.getPlayers()).end();
  });

  expressApp.use('/api', router);
}

function runServer(httpServer, port) {
  httpServer.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

const app = Express();
const server = http.createServer(app);

const game = new Game();
const clients = new Clients();

const websocketServer = connectWebsocketServer(server, clients, game);
addGameRoutes(app, clients, game);

useParcelBundler(app, process.argv.slice(-1)[0]);
runServer(server, 1234);

