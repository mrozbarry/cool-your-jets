// Axis 1: thrust
// Axis 2: turn
// B9: Shoot

let locked = false;

const lock = (fn) => {
  if (locked) {
    return false;
  }

  locked = true;
  fn();
  locked = false;

  return true;
};

const claimedIndexes = [];

export default class Gamepad {
  constructor(debugName) {
    this.notifier = () => {};

    this.debugName = debugName;

    this.gamepadIndex = null;

    this.connectGamepad = this.connectGamepad.bind(this);
    this.disconnectGamepad = this.disconnectGamepad.bind(this);

    window.addEventListener('gamepadconnected', this.connectGamepad);
    window.addEventListener('gamepaddisconnected', this.disconnectGamepad);

    this.detach = () => {
      window.removeEventListener('gamepadconnected', this.connectGamepad);
      window.removeEventListener('gamepaddisconnected', this.disconnectGamepad);
    };
  }

  setNotifier(fn) {
    this.notifier = fn;
  }

  update() {
    if (this.gamepadIndex === null) return;

    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[this.gamepadIndex];

    const axis = v => parseInt(v * 10, 10) / 10;

    this.notifier('up', Math.abs(Math.min(0, axis(gamepad.axes[1]))));
    this.notifier('right', Math.abs(Math.max(0, gamepad.axes[2])));
    this.notifier('left', Math.abs(Math.min(0, gamepad.axes[2])));
    this.notifier('down', gamepad.buttons[9].value);
  }

  connectGamepad(event) {
    if (this.gamepadIndex !== null) return;
    if (claimedIndexes.indexOf(event.gamepad.index) >= 0) return;
    claimedIndexes.push(event.gamepad.index);
    this.gamepadIndex = event.gamepad.index;
  }

  disconnectGamepad(event) {
    if (this.gamepadIndex === event.gamepad.index) {
      const index = claimedIndexes.indexOf(this.gamepadIndex);
      claimedIndexes.splice(index, 1);
      this.gamepadIndex = null;
    }
  }

  listenForConnection() {
    window.removeEventListener('gamepaddisconnected', this.setGamepad);
    window.addEventListener('gamepadconnected', this.setGamepad);
  }

  listenForDisconnection() {
    window.removeEventListener('gamepadconnected', this.setGamepad);
    window.addEventListener('gamepaddisconnected', this.setGamepad);
  }
}
