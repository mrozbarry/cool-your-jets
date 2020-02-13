import * as effects from '#/ui/effects';

export const Initialize = () => [
  {
    clientId: null,
    players: [],
    gamepadPlayers: [],
    hasKeyboard: false,
    addingPlayer: false,
    exit: false,
    ships: {},
  },
  effects.Init({
    onClientId: SetClientId,
    onShips: SetShips,
  }),
];

export const SetClientId = (state, { clientId }) => ({
  ...state,
  clientId,
});

export const SetShips = (state, { ships }) => ({
  ...state,
  ships,
});

export const UpdatePlayersFromLobby = (state, { players }) => ({
  ...state,
  players,
});

export const AddGamepad = (state, { index, identifier }) => ({
  ...state,
  gamepadPlayers: [
    ...state.gamepadPlayers,
    { index, identifier },
  ],
  addingPlayer: false,
});

export const LockAddingPlayer = state => ({
  ...state,
  addingPlayer: true,
});
