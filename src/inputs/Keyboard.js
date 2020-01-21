export default class Keyboard {
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
    this.keyMap = keyMap;
    this.notifier = () => {};

    const makeHandler = result => ({ code, repeat }) => {
      const mapping = this.keyMap[code];
      if (repeat || !mapping) return;

      this.notifier(mapping, result);
    };

    const keydown = makeHandler(1);
    const keyup = makeHandler(0);

    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);

    this.detach = () => {
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
    };
  }

  setNotifier(fn) {
    this.notifier = fn;
  }
}
