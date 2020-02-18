import BaseInput from './base';

const emptyGamepad = () => ({
  axes: [],
  buttons: [],
  connected: false,
  displayId: '',
  id: '',
  index: -1,
  mapping: '',
  timestamp: (void 0),
});

let gamepadStates = [
  emptyGamepad(),
  emptyGamepad(),
  emptyGamepad(),
  emptyGamepad(),
];
let installed = false;

const onBlur = () => {
  gamepadStates = [
    emptyGamepad(),
    emptyGamepad(),
    emptyGamepad(),
    emptyGamepad(),
  ];
};

const install = () => {
  if (installed) return;

  window.addEventListener('blur', onBlur);

  installed = true;
};

const uninstall = () => {
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
    return JSON.parse(JSON.stringify(gamepadStates));
  }

  collect() {
    const gamepads = Array.from(navigator.getGamepads())
    // TODO: snapshot gamepads
  }
}

export default KeyboardInput;

