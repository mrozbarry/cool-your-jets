import * as api from './api';

const WaitForGamepadFX = (dispatch, {
  clientId,
  gamepadIndexes,
  onAddingPlayer,
  onGamepadDiscovered,
}) => {
  let dead = false;
  const id = Math.random().toString(36).slice(2);
  console.log('Waiting for gamepads...', id);
  const now = performance.now();
  let handle = null;

  const takenGamepadIndexes = gamepadIndexes
    ? gamepadIndexes.split(',').map(Number)
    : [];

  console.log('Observing taken indexes', gamepadIndexes, takenGamepadIndexes);

  const checkButtons = async () => {
    if (dead) return;
    const gamepads = navigator.getGamepads();
    let gamepad;
    for(gamepad of gamepads) {
      if (!gamepad) continue;
      if (takenGamepadIndexes.includes(gamepad.index)) {
        console.log('checkButtons', id, 'skipping', gamepad.index, 'since it is already taken');
        continue;
      }
      if (gamepad.timestamp < now) {
        console.log('checkButtons', id, 'skipping', gamepad.index, 'since it has not been updated in a while');
        continue; 
      }

      dispatch(onAddingPlayer);
      const player = await api.addPlayer(clientId);
      console.log('gamepad discovered', gamepad);
      dispatch(onGamepadDiscovered, {
        index: gamepad.index,
        identifier: player.identifier,
      });
    }
    handle = requestAnimationFrame(checkButtons);
  };

  handle = requestAnimationFrame(checkButtons);
  checkButtons();

  return () => {
    dead = true;
    console.log('Stopped waiting for gamepads', id);
    cancelAnimationFrame(handle);
  };
};
export const WaitForGamepad = props => [WaitForGamepadFX, props];

const WaitForKeyboardFx = (dispatch, {
  clientId,
  onAddingPlayer,
  onKeyboardDiscovered,
}) => {
  const onKeyDown = async () => {
    dispatch(onAddingPlayer);
    dispatch(onKeyboardDiscovered);
    const player = await api.addPlayer(clientId);
    dispatch(onKeyboardDiscovered, {
      identifier: player.identifier,
    });
  };

  document.addEventListener('keydown', onKeyDown, { once: true });

  return () => {
    document.removeEventListener('keydown', onKeyDown);
  };
};
export const WaitForKeyboard = props => [WaitForKeyboardFx, props];
