import ParcelBundler from 'parcel-bundler';
import * as http from 'http';
import Express from 'express';
import path from 'path';
import { Server as WebSocketServer } from 'ws';

function useParcelBundler(expressApp, entryPoint) {
  const options = (void 0);
  const entryWithPath = path.resolve(__dirname, '..', '..', entryPoint);
  const bundler = new ParcelBundler(entryWithPath, options);
  expressApp.use(bundler.middleware());
}

function connectWebsocketServer(httpServer) {
  const socketServer = new WebSocketServer({ server: httpServer });
  socketServer.on('connection', (client) => {
    console.log('Got a client');
    client.on('message', (message) => {
      console.log('Got a client message', message);
    });
  });

  return socketServer;
}

function createGame(websocketServer) {
  const idBlackList = {};
  const players = {};


  // Game states: lobby, game

  return {
    joinable: (id) => {
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
      if (idBlackList[id] && idBlackList[id] < fiveMinutesAgo) {
        return false;
      }
      delete idBlackList[id];
      return true;
    },

    kick: (id) => {
      delete players[id];
      const websocket = websocketServer.clients.find(c => c.id === id);
      if (websocket) {
        websocket.close();
      }
    },

    join: (id) => {
      const hue = Math.floor(Math.random() * 360);
      const player = { hue, wins: 0, ready: false };

      players[id] = player;

      return player;
    },

    hasJoined: (id) => !!players[id],

    ready: (id, ready) => {
      if (players[id]) {
        players[id].ready = ready;
        return true;
      }
      return false;
    },

    getPlayers: () => Object.keys(players).map(id => ({ id, ...players[id] })),
  };
}

function addGameRoutes(expressApp, game) {
  const router = Express.Router();

  let activeIds = {};

  const makeId = () => {
    const id = Math.random().toString(36).slice(2)

    if (hasId(id)) return makeId();

    return id;
  };

  const touchId = (id) => {
    activeIds[id] = Date.now();
  };

  const hasId = (id) => {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    if (activeIds[id] && activeIds[id] > oneHourAgo) {
      return true;
    }
    console.log('id has timed out', { id, oneHourAgo, lastActive: activeIds[id] });
    delete activeIds[id];
    return false;
  };

  router.get('/client/new', (request, response) => {
    const id = makeId();
    touchId(id);

    return response.status(201).json({ id }).end();
  });

  const activeIdMiddleware = (request, response, next) => {
    const clientId = request.params.id;
    const isActiveId = hasId(clientId);

    if (!isActiveId) {
      return response.status(401).json({
        message: 'Your id is no longer active, get a fresh id from /client/new to continue',
        ids: Object.keys(activeIds),
        clientId,
      }).end();
    }

    touchId(clientId);
    next();
  };

  router.get('/client/:id/join', activeIdMiddleware, (request, response) => {
    const clientId = request.params.id;
    const isActiveId = hasId(clientId);

    if (game.joinable(clientId) && !game.hasJoined(clientId)) {
      const player = game.join(clientId);
      return response.status(201).json(player).end();
    }

    return response.status(403).end();
  });

  const makeReadyHandler = ready => (request, response) => {
    const clientId = request.params.id;
    const isActiveId = hasId(clientId);

    if (!isActiveId) {
      return response.status(401).json({ message: 'Your id is no longer active, get a fresh id from /client/new to continue' }).end();
    }

    if (!game.joinable(clientId)) {
      return response.status(403).json({ message: 'You cannot change your ready state when the game is not joinable' }).end();
    }

    if (game.ready(clientId, ready)) {
      return response.status(204).end();
    }

    return response.status(403).json({ message: 'Your id is active, but you have not joined the game yet' }).end();
  };

  router.get('/client/:id/ready', activeIdMiddleware, makeReadyHandler(true));
  router.get('/client/:id/unready', activeIdMiddleware, makeReadyHandler(false));

  router.get('/client/:id/lobby', activeIdMiddleware, (request, response) => {
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

const websocketServer = connectWebsocketServer(server);
const game = createGame(websocketServer);
addGameRoutes(app, game);

useParcelBundler(app, process.argv.slice(-1)[0]);
runServer(server, 1234);

