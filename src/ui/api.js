export const getClientId = () => fetch(
  '/api/client/create',
)
  .then(r => r.json());

const fetchWithClientId = (clientId, url) => fetch(
  url,
  {
    headers: {
      'X-Client-Id': clientId,
    },
  },
);

export const getLobbyPlayers = clientId => fetchWithClientId(
  clientId,
  '/api/lobby',
)
  .then(r => r.json());

export const addPlayer = clientId => fetchWithClientId(
  clientId,
  '/api/lobby/players/create',
)
  .then(r => r.json());

export const removePlayer = (clientId, player) => fetchWithClientId(
  clientId,
  `/api/lobby/players/${player.identifier}/delete`,
);
