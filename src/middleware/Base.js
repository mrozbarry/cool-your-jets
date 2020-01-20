export default class BaseMiddleware {
  constructor(world) {
    this.world = world;
  }

  tickStart() {}
  preStep() {}
  postStep() {}
  tickEnd() {}
}
