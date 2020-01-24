export const Initialize = () => ({
  hasGamepads: false,
  players: Array.from({ length: 4 }, (_, index) => ({
    controls: index === 0 ? 'keyboard|wasd' : '',
    name: `Player ${index + 1}`,
    readyAt: null,
  })),
  playGame: false,
  gameCountdown: null,
});

export const GameCountdown = (state, { remaining }) => ({
  ...state,
  gameCountdown: remaining,
});

export const PlayerReady = (state, { index, ready }) => ({
  ...state,
  players: state.players.map((player, playerIndex) => {
    if (playerIndex !== index) return player;
    return { ...player, ready };
  }),
});

export const PlayerControls = (state, { index, controls }) => ({
  ...state,
  players: state.players.map((player, playerIndex) => {
    if (playerIndex !== index) return player;
    return { ...player, controls };
  }),
});

export const PlayerName = (state, { index, name }) => ({
  ...state,
  players: state.players.map((player, playerIndex) => {
    if (playerIndex !== index) return player;
    return { ...player, name };
  }),
});

export const PlayGame = state => ({ ...state, playGame: true });

export const GamepadConnected = state => ({ ...state, hasGamepads: true });
