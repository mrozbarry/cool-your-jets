import { app, h } from 'hyperapp';
import * as subscriptions from './ui/subscriptions';
import * as actions from './ui/actions';

const overrideStyles = {
  fontFamily: `'screaming_neon', sans-serif`,
  fontSize: '36px',
  backgroundColor: 'black',
  color: 'white',
  borderRadius: 0,
};

const formElementStyles = {
  ...overrideStyles,
  border: 'none',
  outline: 'none',
  borderBottom: '3px white solid',
};

const playerContainer = (props, children) => h(
  'div',
  {
    ...(props || {}),
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: `'screaming_neon', sans-serif`,
      fontSize: '32px',
    },
  },
  children,
);

const fieldset = (props, children) => h(
  'fieldset',
  {
    ...(props || {}),
    style: {
      border: 'none',
      outline: 'none',
      marginBottom: '32px',
    },
  },
  children,
);

const label = ({ text }, children) => h(
  'label',
  {
    display: 'block',
  },
  h('div', null, text),
  children,
);

const playerSetup = ({
  index,
  controls,
  name,
  ready,
  controlOptions,
  gameCountdown,
}) => h(playerContainer, null, [
  fieldset(null, [
    h(label, { text: 'Controls' }, [
      h('select', {
        style: {
          ...formElementStyles,
          width: '40vw',
        },
        onchange: [actions.PlayerControls, (event) => ({ index, controls: event.target.value })],
      }, controlOptions.map(([value, label]) => (
        h('option', { value, selected: value === controls }, label)
      ))),
    ]),
  ]),
  fieldset(null, [
    h(label, { text: 'Name' }, [
      h('input', {
        value: name,
        style: formElementStyles,
        oninput: [actions.PlayerName, (event) => ({ index, name: event.target.value })],
      }),
    ]),
  ]),
  fieldset(null, [
    h('button', {
      type: 'button',
      style: {
        ...overrideStyles,
        borderWidth: '3px',
        padding: '1rem',
      },
      disabled: (controls === '' || gameCountdown !== null),
      onclick: [actions.PlayerReady, { index, ready: !ready }],
    }, (gameCountdown === null ? (ready ? 'CANCEL' : 'READY') : `Starts in ${gameCountdown}`)),
  ]),
]);

const grid = ({ count }, children) => h(
  'div',
  {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: count > 2 ? '1fr 1fr' : '1fr',
      width: '100vw',
      height: '100vh',
    },
  },
  children,
);

app({
  init: actions.Initialize,

  view: state => {
    if (state.playGame) {
      return h('game-container');
    }

    const gamepads = state.hasGamepads
      ? Array.from(navigator.getGamepads()).filter(gp => gp && gp.connected)
      : [];

    const controlOptions = [
      ['', 'Not Playing'],
      ['keyboard|wasd', 'Keyboard - WASD'],
      ['keyboard|arrows', 'Keyboard - Arrows'],
      ...gamepads.map((gp) => (
        [`gamepad|${gp.index}`, `Gamepad ${gp.index + 1} - ${gp.id}`]
      )),
    ];
    return h(
      grid,
      { count: state.players.length },
      state.players.map((p, index) => playerSetup({
        ...p,
        index,
        controlOptions,
        gameCountdown: state.gameCountdown,
      })),
    );
  },

  subscriptions: state => {
    const availablePlayers = state.players.filter(p => p.controls).length;
    const canStartGame = availablePlayers > 1 && state.players.filter(p => p.ready).length === availablePlayers;

    return [
      !state.hasGamepads && subscriptions.Gamepad({
        onConnect: actions.GamepadConnected,
      }),

      canStartGame && subscriptions.StartGame({
        count: 5,
        onTick: actions.GameCountdown,
        onStart: actions.PlayGame,
      }),

      state.playGame && subscriptions.RunGame({
        players: state.players,
      }),
    ];
  },

  node: document.querySelector('#app'),
});
