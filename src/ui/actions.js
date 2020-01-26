import * as effects from '#/ui/effects';
import page from 'page';

const makePlayer = (controls, name, ready = false) => ({ controls, name, ready });
const initialPlayers = [
  makePlayer('keyboard|wasd', 'Player 1'),
  makePlayer('keyboard|arrows', 'Player 2'),
  makePlayer('', 'Player 3'),
  makePlayer('', 'Player 4'),
];

export const Initialize = () => [
  {
    hasGamepads: false,
    players: initialPlayers,
    playGame: false,
    gameCountdown: null,
  },
  effects.PlayLoop('menu'),
];

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

export const PlayGame = state => [
  { ...state, playGame: true },
  effects.PlayGame(state.players),
];

export const GamepadConnected = state => ({ ...state, hasGamepads: true });
