export default class BaseInput {
  constructor() {
    this.notifier = () => {};
  }

  setNotifier(fn) {
    console.log('Setting notifier', fn);
    this.notifier = fn;
  }

  pumpEvents() {}

  cleanup() {}
}
