export const getClientId = () => fetch(
  '/api/client/create',
)
  .then(r => r.json());

const fetchWithClientId = (clientId, url, options = {}) => fetch(
  url,
  {
    ...options,
    headers: {
      ...(options.headers || {}),
      'X-Client-Id': clientId,
    },
  },
);

export const getPlayers = clientId => fetchWithClientId(
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

export const updatePlayer = (clientId, player, update) => fetchWithClientId(
  clientId,
  `/api/lobby/players/${player.identifier}`,
  {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(update),
  },
);
