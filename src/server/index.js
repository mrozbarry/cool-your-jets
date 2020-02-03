import ParcelBundler from 'parcel-bundler';
import * as http from 'http';
import Express from 'express';
import path from 'path';
import Game from './models/Game';
import Clients from './models/Clients';
import routes from './routes';
import websocketServer from './websockets';

function useParcelBundler(expressApp, entryPoint) {
  const options = (void 0);
  const entryWithPath = path.resolve(__dirname, '..', '..', entryPoint);
  const bundler = new ParcelBundler(entryWithPath, options);
  expressApp.use(bundler.middleware());
}

function connectWebsocketServer(httpServer, clients, game) {
  websocketServer(httpServer, clients, game);
}

function addGameRoutes(expressApp, clients, game) {
  expressApp.use('/api', routes(clients, game));
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

connectWebsocketServer(server, clients, game);
addGameRoutes(app, clients, game);

useParcelBundler(app, process.argv.slice(-1)[0]);
runServer(server, 1234);

