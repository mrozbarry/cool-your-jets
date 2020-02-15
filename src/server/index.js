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

function runServer(httpServer, port) {
  httpServer.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

const app = Express();
const server = http.createServer(app);

const clients = new Clients();
const node = new Node(clients);

connectWebsocketServer(server, node);
addGameRoutes(app, node);

useParcelBundler(app, process.argv.slice(-1)[0]);
runServer(server, 1234);

