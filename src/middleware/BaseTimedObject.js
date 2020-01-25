import Base from '#/middleware/Base';

export default class BaseTimedObject extends Base {
  constructor() {
    super();

    this.items = [];
    this.pendingRemoves = [];
  }

  add(item) {
    this.items.push(item);
    return item;
  }

  init(game) {
    this.world = game.world;
  }

  tickStart(_, delta) {
    const nextItems = [];
    let item;
    for(item of this.items) {
      item.life[0] += delta;
      if (item.life[0] > item.life[1]) {
        this.pendingRemoves.push(item);
        continue;
      }
      nextItems.push(item);
    }
    this.items = nextItems;
  }

  tickEnd(game) {
    let item;
    for(item of this.pendingRemoves) {
      game.world.removeBody(item.body);
    }
    this.pendingRemoves = [];
  }
}
