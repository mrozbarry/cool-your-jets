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

  renderCollection(collection) {
    return collection;
  }

  renderOverlay() {
    return [];
  }
}

