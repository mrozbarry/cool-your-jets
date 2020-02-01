import * as effects from '#/ui/effects';
import pipe from '#/lib/pipe';

const makePlayer = (controls, name) => ({
  controls,
  name,
  ready: false,
  color: [Math.round(Math.random() * 359), 100, 50],
  wins: 0,
});
const initialPlayers = [
  makePlayer('', 'Player 1'),
  makePlayer('', 'Player 2'),
  makePlayer('', 'Player 3'),
  makePlayer('', 'Player 4'),
];

export const Initialize = () => ({
  waitingOnGamepadForPlayer: null,
  players: initialPlayers,
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

export const PlayerControls = (state, { index, controls }) => {
  const waitingOnGamepadForPlayer = state.waitingOnGamepadForPlayer === index
    ? null
    : (controls === 'gamepad|-1' ? index : state.waitingOnGamepadForPlayer);

  return {
    ...state,
    players: state.players.map((player, playerIndex) => {
      if (playerIndex !== index) return player;
      return { ...player, controls };
    }),
    waitingOnGamepadForPlayer,
  };
};

export const PlayerColor = (state, { index }) => ({
  ...state,
  players: state.players.map((player, playerIndex) => {
    if (playerIndex !== index) return player;
    return { ...player, color: [Math.round(Math.random() * 359), 100, 50] };
  }),
});

export const PlayerName = (state, { index, name }) => ({
  ...state,
  players: state.players.map((player, playerIndex) => {
    if (playerIndex !== index) return player;
    return { ...player, name };
  }),
});

export const PlayGame = state => {
  const config = pipe([
    players => players.filter(p => p.controls),
    players => players.map(p => ({
      name: p.name,
      controls: p.controls,
      color: p.color,
      wins: p.wins,
    })),
    JSON.stringify,
    btoa,
  ], state.players);

  return [
    { ...state, playGame: true },
    effects.PageNavigate(`/play/${config}`),
  ];
};

export const GamepadConnected = state => ({ ...state, hasGamepads: true });
