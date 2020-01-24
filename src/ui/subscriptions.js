import { main } from '../index';

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

const RunGameFX = (_, { players }) => {
  let cancel = () => {};

  const testDom = () => {
    if (document.querySelector('game-container')) {
      cancel = main(players);
      return;
    }
    setTimeout(testDom, 100);
  };

  testDom();

  return () => cancel();
};
export const RunGame = props => [RunGameFX, props];
