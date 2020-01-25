export default class BaseInput {
  constructor() {
    this.notifier = () => {};
  }

  setNotifier(fn) {
    this.notifier = fn;
  }

  pumpEvents() {}

  cleanup() {}
}
