import ParcelBundler from 'parcel-bundler';
import * as http from 'http';
import Express from 'express';
import path from 'path';
import Clients from './models/Clients';
import Node from './models/Node';
import routes from './routes';
import websocketServer from './websockets';

function useParcelBundler(expressApp, entryPoint) {
  const options = (void 0);
  const entryWithPath = path.resolve(__dirname, '..', '..', entryPoint);
  const bundler = new ParcelBundler(entryWithPath, options);
  expressApp.use(bundler.middleware());
}

function connectWebsocketServer(httpServer, node) {
  websocketServer(httpServer, node);
}

function addGameRoutes(expressApp, clients, game) {
  expressApp.use('/api', routes(clients, game));
}

function runServer(httpServer, port, host) {
  httpServer.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}`);
  });
}

const app = Express();
const server = http.createServer(app);

const clients = new Clients();
const node = new Node(clients);

connectWebsocketServer(server, node);
addGameRoutes(app, node);

useParcelBundler(app, process.argv.slice(-1)[0]);
runServer(server, 1234, '0.0.0.0');

const GAME_WAIT = 10000;

let lobby = {
  gameStartsIn: null,
  handle: null,
};

node.on('player:add', () => {
  if (node.players.length >= 2 && lobby.gameStartsIn === null) {
    lobby.gameStartsIn = Date.now() + GAME_WAIT;
    lobby.handle = setTimeout(() => {
      node.setLocked(true);
      node.broadcast({
        type: 'game:start',
      });
    }, GAME_WAIT);
  }
  node.broadcast({
    type: 'game:wait',
    time: lobby.gameStartsIn,
  });
});

node.on('player:remove', () => {
  if (node.players.length < 2) {
    clearTimeout(lobby.handle);
    lobby.gameStartsIn = null;
    lobby.handle = null;
  }
  node.broadcast({
    type: 'game:wait',
    time: lobby.gameStartsIn,
  });
});
