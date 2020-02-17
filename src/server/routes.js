import { Router } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import ships from './ships';

export default (node) => {
  const { clients } = node;
  const router = Router();

  router.use(morgan('combined'));

  const mustHaveActiveId = (request, response, next) => {
    const clientId = request.headers['x-client-id'];

    if (!clients.touch(clientId)) {
      return response.status(401).json({
        message: 'Your id is no longer active, get a fresh id from /client/new to continue',
        clientId,
      }).end();
    }

    request.clientId = clientId;

    next();
  };

  router.get('/client/create', (_request, response) => {
    const id = clients.add();

    return response.status(201).json({
      id,
      ships,
    }).end();
  });

  router.get('/lobby', mustHaveActiveId, (_request, response) => {
    return response
      .status(200)
      .json(node.players.map(p => p.toPublicJson()))
      .end();
  });

  router.get('/lobby/players/create', mustHaveActiveId, (request, response) => {
    const { clientId } = request;
    const player = node.addPlayer(clientId);
    node.broadcast({ type: 'lobby:update' });
    return response
      .status(200)
      .json(player.toPublicJson())
      .end();
  });

  router.get('/lobby/players/:identifier/delete', mustHaveActiveId, (request, response) => {
    const identifier = request.params.identifier.split('.');
    const [clientId, playerId] = identifier;

    if (clientId !== request.clientId) {
      return response
        .status(401)
        .end();
    }

    node.removePlayer(clientId, playerId);
    node.broadcast({ type: 'lobby:update' });
    return response.status(204).end();
  });

  router.post('/lobby/players/:identifier', mustHaveActiveId, bodyParser.json(), (request, response) => {
    const identifier = request.params.identifier.split('.');
    const [clientId, playerId] = identifier;

    const player = node.getPlayer(clientId, playerId);

    if (clientId !== request.clientId || !player) {
      return response
        .status(401)
        .end();
    }

    player.update(request.body);
    node.broadcast({ type: 'lobby:update' });
    return response
      .status(200)
      .json(player.toPublicJson())
      .end();
  });

  return router;
};
