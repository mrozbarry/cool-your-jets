import * as effects from '#/ui/effects';

export const Initialize = () => [
  {
    clientId: null,
    players: [],
    gamepadPlayers: [],
    keyboardPlayer: null,
    addingPlayer: false,
    exit: false,
    ships: [],
    editPlayer: {},
    gameStartsIn: null,
    gameStartsInDisplay: 0,
  },
  [
    effects.Init({
      onClientId: SetClientId,
      onShips: SetShips,
    }),
  ],
];

const serializeState = state => {
  const controls = [
    ...state.gamepadPlayers.map(gpp => ({
      identifier: gpp.identifier,
      controls: `gamepad|${gpp.index}`,
    })),
  ];
  if (state.keyboardPlayer) {
    controls.push({
      identifier: state.keyboardPlayer.identifier,
      controls: `keyboard|arrows`,
    });
  }
  return btoa(JSON.stringify(controls));
};


export const GameStartTick = (state, { remaining }) => ({
  ...state,
  gameStartsInDisplay: remaining,
});

export const SetClientId = (state, { clientId }) => [
  {
    ...state,
    clientId,
  },
  [
    effects.WebsocketSend({
      payload: {
        type: 'clientId:set',
        clientId,
      },
    }),
    effects.GetPlayers({
      clientId,
      onUpdatePlayerList: UpdatePlayerList,
    }),
  ],
];

export const LobbyUpdate = state => [
  state,
  effects.GetPlayers({
    clientId: state.clientId,
    onUpdatePlayerList: UpdatePlayerList,
  }),
];

export const GameWait = (state, props) => ({
  ...state,
  gameStartsIn: props.time,
});

export const GameStart = state => [
  { ...state, exit: true },
  effects.PageNavigate(
    `/play/network/${state.clientId}/${serializeState(state)}`,
  ),
];

export const UpdatePlayerList = (state, { players }) => ({
  ...state,
  players,
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
    { index: gamepad.index, identifier: player.identifier },
  ],
  addingPlayer: false,
});

export const GamepadDisconnect = (state, { identifier }) => ({
  ...state,
  gamepadPlayers: state.gamepadPlayers.filter(gpp => gpp.identifier !== identifier),
});

export const AddKeyboard = (state, { player }) => ({
  ...state,
  players: state.players.concat(player),
  keyboardPlayer: {
    identifier: player.identifier,
  },
  addingPlayer: false,
});

export const EditLocalPlayer = (state, { identifier }) => {
  const [clientId] = identifier.split('.');
  if (clientId !== state.clientId) return state;

  const player = state.players.find(p => p.identifier === identifier);

  return {
    ...state,
    editPlayer: {
      ...player,
      loading: false,
    },
  };
};

export const EditLocalPlayerChange = (state, { key, value }) => ({
  ...state,
  editPlayer: {
    ...state.editPlayer,
    [key]: value,
  },
});

export const EditLocalPlayerSave = (state, { payload }) => [
  { ...state, editPlayer: { ...state.editPlayer, loading: true } },
  effects.PlayerUpdate({
    player: state.editPlayer,
    clientId: state.clientId,
    onDone: CancelEditLocalPlayer,
  }),
];

export const CancelEditLocalPlayer = (state, props) => ({
  ...state,
  editPlayer: (!props || props.shouldClose) ? {} : state.editPlayer,
});

export const LockAddingPlayer = state => ({
  ...state,
  addingPlayer: true,
});

export const UnlockAddingPlayer = state => ({
  ...state,
  addingPlayer: false,
});
