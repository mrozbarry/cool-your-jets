import { app, h } from 'hyperapp';
import * as subscriptions from '#/ui/subscriptions';
import * as actions from '#/ui/actions';
import { grid, playerSetup, overrideStyles } from '#/ui/components';

export default (node) => app({
  init: actions.Initialize,

  view: state => {
    if (state.exit) {
      return h('div');
    }

    const controlOptions = [
      ['', 'Not Playing'],
      ['keyboard|wasd', 'Keyboard - WASD'],
      ['keyboard|arrows', 'Keyboard - Arrows'],
      ['gamepad|-1', 'Gamepad'],
    ];

    return h('div', {
      style: { position: 'relative' },
    }, [
      h(
        grid,
        { count: state.players.length },
        state.players.map((p, index) => playerSetup({
          ...p,
          index,
          controlOptions,
          gameCountdown: state.gameCountdown,
        })),
      ),
      state.addingPlayer && h('div', {
        style: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginTop: '-20vh',
          marginLeft: '-20vw',
          width: '40vw',
          height: '40vh',
          border: '3px white solid',
          backgroundColor: 'black',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '10vh 0',
        },
      }, [
        h('h1', null, 'Press Any Button To Pick Gamepad'),
        h('div', { style: { flex: 1 } }),
        h('button', {
          type: 'button',
          onclick: [actions.PlayerControls, { index: state.waitingOnGamepadForPlayer, controls: '' }],
          style: {
            ...overrideStyles,
            borderWidth: '3px',
            padding: '1rem',
          },
        }, 'Cancel'),
      ]),
    ]);
  },

  subscriptions: state => {
    if (state.exit) return [];

    const gamepadIndexes = state
      .gamepadPlayers
      .map(gpp => gpp.index)
      .join(',');

    return [
      subscriptions.WaitForGamepad({
        clientId: state.clientId,
        gamepadIndexes,
        onGamepadDiscovered: actions.AddGamepad,
        onAddingPlayer: actions.LockAddingPlayer,
      }),
    ];
  },

  node,
});
