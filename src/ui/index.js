import { app, h } from 'hyperapp';
import * as subscriptions from '#/ui/subscriptions';
import * as actions from '#/ui/actions';

const styles = {
  td: {
    padding: '8px',
    fontSize: '1.6rem',
  },

  tdPlayer: {
    borderTop: '3px white solid',
  },
};

export default (node, websocket) => app({
  init: actions.Initialize,

  view: state => {
    if (state.exit) {
      return h('div');
    }

    return h('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: 'auto 500px',
      },
    }, [
      h('div', null, [
        h('pre', null, JSON.stringify(state, null, 2)),
      ]),

      h('table', { style: { border: '3px white solid', borderCollapse: 'collapse' } }, [
        h('thead', null, [
          h('tr', null, [
            h('td', { style: styles.td }, 'Ship'),
            h('td', { style: styles.td }, 'Ship'),
            h('td', { style: styles.td }, 'Name'),
            h('td', { style: styles.td }, 'Ready'),
          ]),
        ]),
        h('tbody', null, state.players.map(p => {
          const isLocal = p.clientId === state.clientId;
          const identifier = `${p.clientId}.${p.id}`;
          const localGamepad = isLocal && state.gamepadPlayers.find(gpp => gpp.identifier === identifier);
          const marker = isLocal
            ? (localGamepad ? `GP${localGamepad.index}` : 'KB')
            : 'NW';

          return h(
            'tr',
            null,
            [
              h('td', { style: { ...styles.td, ...styles.tdPlayer, borderRight: '3px white solid' } },
                marker,
              ),
              h('td', { style: { ...styles.td, ...styles.tdPlayer, borderRight: '3px white solid', backgroundColor: `hsl(${p.hue}, 100%, 50%)` } },
              ),
              h('td', {
                style: { ...styles.td, ...styles.tdPlayer, borderRight: '3px white solid' },
                contentEditable: isLocal,
                oninput: [
                  (state, text) => {
                    console.log('Updating name', text);
                    return state;
                  },
                  (event) => event.target.innerText,
                ],
              },
              p.name,
              ),
              h('td', { style: { ...styles.td, ...styles.tdPlayer } },
                p.ready ? 'Yes' : 'No',
              ),
            ],
          );
        })),
      ]),
    ]);
  },

  subscriptions: state => {
    if (state.exit) return [];

    const gamepadIndexes = state
      .gamepadPlayers
      .map(gpp => gpp.index)
      .join(',');

    const canJoin = state.clientId && !state.addingPlayer;

    return [
      canJoin && [
        subscriptions.WaitForGamepad({
          clientId: state.clientId,
          gamepadIndexes,
          onGamepadDiscovered: actions.AddGamepad,
          onPlayerLock: actions.LockAddingPlayer,
          onPlayerUnlock: actions.UnlockAddingPlayer,
        }),
        !state.keyboardPlayer && subscriptions.WaitForKeyboard({
          clientId: state.clientId,
          onKeyboardDiscovered: actions.AddKeyboard,
          onPlayerLock: actions.LockAddingPlayer,
          onPlayerUnlock: actions.UnlockAddingPlayer,
        }),
      ],
      subscriptions.WebsocketManager({ websocket }),
    ];
  },

  node,
});
