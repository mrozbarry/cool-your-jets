import * as api from './api';

const defer = (fn) => new Promise((resolve) => {
  setTimeout(() => { fn();
    resolve();
  }, 1);
});

const WaitForGamepadFX = (dispatch, {
  clientId,
  gamepadIndexes,
  onPlayerLock,
  onPlayerUnlock,
  onGamepadDiscovered,
}) => {
  const id = Math.random().toString(36).slice(2);
  let dead = false;
  let handle = null;
  let minTime = null;

  const onGamepadConnected = (event) => {
    minTime = event.gamepad.timestamp + 1;
    handle = requestAnimationFrame(checkButtons);
  };

  const takenGamepadIndexes = gamepadIndexes
    ? gamepadIndexes.split(',').map(Number)
    : [];

  let gamepad;
  const checkButtons = async () => {
    if (dead) return;

    const gamepads = Array.from(navigator.getGamepads())
      .filter(gp => gp)
      .filter(gp => gp.connected)
      .filter(gp => !takenGamepadIndexes.includes(gp.index));

    for(gamepad of gamepads) {
      if (gamepad.timestamp < minTime) {
        continue; 
      }

      try {
        dispatch(onPlayerLock);
        const player = await api.addPlayer(clientId);
        await defer(() => dispatch(onGamepadDiscovered, {
          gamepad: {
            index: gamepad.index,
            id: gamepad.id,
          },
          player,
        }));
        dead = true;
      } catch (err) {
        console.log('Error adding player', err);
        dead = true;
        dispatch(onPlayerUnlock);
      }
    }
    handle = requestAnimationFrame(checkButtons);
  };

  const gamepads = Array.from(navigator.getGamepads()).filter(gp => gp);
  if (gamepads.length > 0) {
    handle = requestAnimationFrame(checkButtons);
  } else {
    window.addEventListener('gamepadconnected', onGamepadConnected, { once: true });
  }

  return () => {
    window.removeEventListener('gamepadconnected', onGamepadConnected);
    dead = true;
    console.log('Stopped waiting for gamepads', id);
    cancelAnimationFrame(handle);
  };
};
export const WaitForGamepad = props => [WaitForGamepadFX, props];

const WaitForKeyboardFx = (dispatch, {
  clientId,
  onPlayerLock,
  onPlayerUnlock,
  onKeyboardDiscovered,
}) => {
  const onKeyDown = async (event) => {
    if (event.code !== 'ArrowDown') return;
    if (event.target.matches('td')) return;

    try {
      dispatch(onPlayerLock);
      const player = await api.addPlayer(clientId);
      dispatch(onKeyboardDiscovered, {
        identifier: player.identifier,
        player,
      });
    } catch (err) {
      console.log('Error adding player', err);
      dispatch(onPlayerUnlock);
    }
  };

  document.addEventListener('keydown', onKeyDown);

  return () => {
    document.removeEventListener('keydown', onKeyDown);
  };
};
export const WaitForKeyboard = props => [WaitForKeyboardFx, props];

const WebsocketManagerFX = (dispatch, { websocket, messageActions }) => {
  let cancel = () => {};

  const sendMessage = ({ detail }) => {
    console.log('websocketManager.send', detail);
    websocket.send(detail);
  };

  websocket.on('message', (event) => {
    const data = JSON.parse(event.data);
    const action = messageActions[data.type];
    if (!action) {
      console.log('got a message', data);
      return;
    }
    dispatch(action);
  })
    .then((fn) => { cancel = fn });

  document.addEventListener('cyj:ws:send', sendMessage);

  return () => {
    document.removeEventListener('cyj:ws:send', sendMessage);
    cancel();
  };
};
export const WebsocketManager = props => [WebsocketManagerFX, props];
