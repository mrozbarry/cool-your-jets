import BaseInput from './base';

let keyState = {};
let installed = false;

const onKeyHandler = isDown => (event) => {
  if (event.repeat) return;

  keyState[event.code] = isDown;
};

const onKeyDown = onKeyHandler(true);
const onKeyUp = onKeyHandler(true);
const onBlur = () => {
  keyState = {};
};

const install = () => {
  if (installed) return;

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onBlur);

  installed = true;
};

const uninstall = () => {
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
  window.removeEventListener('blur', onBlur);

  installed = false;
};

class KeyboardInput extends BaseInput {
  constructor() {
    super();

    install();
  }

  destroy() {
    uninstall();
  }

  snapshot() {
    return { ...keyState };
  }
}

export default KeyboardInput;
