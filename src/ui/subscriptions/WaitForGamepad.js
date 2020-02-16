// import defer from '#/lib/defer';
import * as api from '#/ui/api';

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
        dispatch(onGamepadDiscovered, {
          gamepad: {
            index: gamepad.index,
            id: gamepad.id,
          },
          player,
        });
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

