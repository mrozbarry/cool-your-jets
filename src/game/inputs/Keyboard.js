import BaseInput from './Base';

export default class Keyboard extends BaseInput {
  static keyDownHandler (event) {
    if (event.repeat) return;
    Keyboard.keyboardState[event.code] = true;
  }

  static keyUpHandler(event) {
    Keyboard.keyboardState[event.code] = false;
  }

  static addListeners() {
    if (Keyboard.hasHandlers) return;

    Keyboard.keyboardState = {};

    window.addEventListener('keydown', Keyboard.keyDownHandler);
    window.addEventListener('keyup', Keyboard.keyUpHandler);
    Keyboard.hasHandlers = true;
  }

  static removeListeners() {
    window.removeEventListener('keydown', Keyboard.keyDownHandler);
    window.removeEventListener('keyup', Keyboard.keyUpHandler);
    Keyboard.hasHandlers = false;
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
    this.keyMap = keyMap;
    Keyboard.addListeners();
  }

  pumpEvents() {
    for(const code of Object.keys(this.keyMap)) {
      this.notifier(this.keyMap[code], Boolean(Keyboard.keyboardState[code]));
    }
  }

  cleanup() {
    Keyboard.removeListeners();
  }
}
