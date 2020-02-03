import { Router } from 'express';

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

  router.get('/client/new', (_request, response) => {
    const id = clients.add();

    return response.status(201).json({ id }).end();
  });

  router.get('/lobby', mustHaveActiveId, (_request, response) => {
    return response.status(200).json(game.getPlayers()).end();
  });

  router.get('/lobby/join', mustHaveActiveId, (request, response) => {
    const { clientId } = request;

    if (game.joinable(clientId) && !game.hasJoined(clientId)) {
      const player = game.join(clientId);
      return response.status(201).json(player).end();
    }

    return response.status(403).end();
  });

  return router;
};
