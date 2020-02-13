import { Router } from 'express';
import ships from './ships';

export default (clients, game) => {
  const router = Router();

  const mustHaveActiveId = (request, response, next) => {
    const clientId = request.headers['X-CLIENT-ID'];

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
    return response.status(200).json(game.getPlayers()).end();
  });

  router.get('/lobby/players/create', mustHaveActiveId, (request, response) => {
    const { clientId } = request;
    const player = game.lobby.playerAdd(clientId);
    return response.status(200).json(player).end();
  });

  router.get('/lobby/players/:identifier/delete', mustHaveActiveId, (request, response) => {
    game.lobby.playerRemove(request.params.identifier);
    return response.status(204).end();
  });

  return router;
};
