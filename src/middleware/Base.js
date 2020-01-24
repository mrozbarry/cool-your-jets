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

  renderCollection(collection) {
    return collection;
  }

  renderOverlay() {
    return [];
  }
}

