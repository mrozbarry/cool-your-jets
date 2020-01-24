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
    this.items = this.items.reduce((list, item) => {
      item.life[0] += delta;

      if (item.life[0] > item.life[1]) {
        this.pendingRemoves.push(item);
        return list;
      }

      return list.concat(item);
    }, []);
  }

  tickEnd(game) {
    for(const item of this.pendingRemoves) {
      game.world.removeBody(item.body);
    }
  }
}
