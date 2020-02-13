import * as effects from '#/ui/effects';

export const Initialize = () => [
  {
    clientId: null,
    players: [],
    gamepadPlayers: [],
    keyboardPlayer: null,
    addingPlayer: false,
    exit: false,
    ships: {}, },
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

export const AddGamepad = (state, { gamepad, player }) => ({
  ...state,
  players: state.players.concat(player),
  gamepadPlayers: [
    ...state.gamepadPlayers,
    { index: gamepad.index, identifier: `${state.clientId}.${player.id}` },
  ],
  addingPlayer: false,
});

export const AddKeyboard = (state, { player }) => ({
  ...state,
  players: state.players.concat(player),
  keyboardPlayer: {
    identifier: `${state.clientId}.${player.id}`,
  },
  addingPlayer: false,
});

export const LockAddingPlayer = state => ({
  ...state,
  addingPlayer: true,
});

export const UnlockAddingPlayer = state => ({
  ...state,
  addingPlayer: false,
});
