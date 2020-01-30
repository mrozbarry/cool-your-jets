export default class BaseMiddleware {
  constructor() {
    this.enabled = true;
  }

  isEnabled() { return this.enabled; }

  init() {}
  tickStart() {}
  preStep() {}
  postStep() {}
  tickEnd() {}
  deinit() {}

  render() {
    return [];
  }

  renderOverlay() {
    return [];
  }
}

