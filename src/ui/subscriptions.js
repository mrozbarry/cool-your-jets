import * as api from './api';

const WaitForGamepadFX = (dispatch, {
  clientId,
  gamepadPlayers,
  onAddingPlayer,
  onGamepadDiscovered,
}) => {
  const now = performance.now();
  let handle = null;

  const takenGamepadIndexes = gamepadPlayers.map(gp => gp.index);

  const checkButtons = async () => {
    const gamepads = navigator.getGamepads();
    let gamepad;
    for(gamepad of gamepads) {
      if (!gamepad) continue;
      if (takenGamepadIndexes.includes(gamepad.index)) continue;
      if (gamepad.timestamp < now) continue; 

      dispatch(onAddingPlayer);
      const player = await api.addPlayer(clientId);
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
