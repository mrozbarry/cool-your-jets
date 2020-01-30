import BaseInput from './Base';

let hasHandlers = false;
let keyboardState = {};

export default class Keyboard extends BaseInput {
  static keyDownHandler (event) {
    if (event.repeat) return;
    keyboardState[event.code] = true;
  }

  static keyUpHandler(event) {
    keyboardState[event.code] = false;
  }

  static addListeners() {
    console.log('KeyboardInput.addListeners', hasHandlers);
    if (hasHandlers) return;

    keyboardState = {};

    window.addEventListener('keydown', Keyboard.keyDownHandler);
    window.addEventListener('keyup', Keyboard.keyUpHandler);
    hasHandlers = true;
    console.log('addListeners');
  }

  static removeListeners() {
    window.removeEventListener('keydown', Keyboard.keyDownHandler);
    window.removeEventListener('keyup', Keyboard.keyUpHandler);
    hasHandlers = false;
    keyboardState = {};
    console.log('removeListeners');
  }

  static WASD() {
    return new Keyboard({
      KeyW: 'up',
      KeyA: 'left',
      KeyS: 'down',
      KeyD: 'right',
    });
  }

  static Arrows() {
    return new Keyboard({
      ArrowUp: 'up',
      ArrowLeft: 'left',
      ArrowDown: 'down',
      ArrowRight: 'right',
    });
  }

  constructor(keyMap) {
    super();
    console.warn('Initializing new KeyboardInput');
    this.keyMap = keyMap;
    Keyboard.addListeners();
  }

  pumpEvents() {
    for(const code of Object.keys(this.keyMap)) {
      this.notifier(this.keyMap[code], Boolean(keyboardState[code]));
    }
  }

  cleanup() {
    Keyboard.removeListeners();
  }
}
