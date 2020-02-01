const StartGameFX = (dispatch, { count, onStart, onTick }) => {
  let remaining = count;
  let handle = null;

  const tick = () => {
    if (remaining === 0) {
      dispatch(onStart);
    } else {
      dispatch(onTick, { remaining });
      remaining -= 1;
      handle = setTimeout(tick, 1000);
    }
  };

  setTimeout(() => {
    tick();
  }, 1);

  return () => {
    clearTimeout(handle);
  };
};
export const StartGame = props => [StartGameFX, props];


const GamepadFX = (dispatch, { onConnect }) => {
  const connected = () => dispatch(onConnect);
  window.addEventListener('gamepadconnected', connected);

  return () => {
    window.removeEventListener('gamepadconnected', connected);
  };
};
export const Gamepad = props => [GamepadFX, props];

const WaitForGamepadFX = (dispatch, { index, players, onButtonPress }) => {
  const now = performance.now();

  const otherGamepads = players
    .filter(p => p.controls.startsWith('gamepad'))
    .map(p => p.controls.split('|')[1])
    .map(Number);

  const checkButtons = () => {
    const gamepads = navigator.getGamepads();
    let gamepad;
    for(gamepad of gamepads) {
      if (!gamepad) continue;
      if (gamepad && !otherGamepads.includes(gamepad.index) && gamepad.timestamp > now) {
        console.log('gamepad detected', gamepad);
        dispatch(onButtonPress, { index, controls: `gamepad|${gamepad.index}` });
        break;
      }
    }
  };

  const handle = setInterval(checkButtons, 250);
  checkButtons();

  return () => {
    clearInterval(handle);
  };
};
export const WaitForGamepad = props => [WaitForGamepadFX, props];
