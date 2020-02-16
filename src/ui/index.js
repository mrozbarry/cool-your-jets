import { app, h } from 'hyperapp';
import * as subscriptions from '#/ui/subscriptions';
import * as actions from '#/ui/actions';
import * as components from '#/ui/components';

export default (node, websocket) => {
  const messageActions = {
    'lobby:update': actions.LobbyUpdate,
  };

  return app({
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
        h('div', { style: { overflow: 'auto' } }, [
          h('pre', null, JSON.stringify(state, null, 2)),
        ]),

        h('div', null, [
          h(
            components.table,
            { columns: ['', 'ship', 'name'] },
            state.players.map(player => (
              components.playerRow({
                player,
                gamepadPlayers: state.gamepadPlayers,
                clientId: state.clientId,
                ships: state.ships,
              })
            )),
          ),
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
        !!state.clientId && subscriptions.GamepadDisconnect({
          clientId: state.clientId,
          gamepadPlayers: state.gamepadPlayers,
          onDisconnect: actions.GamepadDisconnect
        }),
        subscriptions.WebsocketManager({
          websocket,
          messageActions,
        }),
      ];
    },

    node,
  });
};
