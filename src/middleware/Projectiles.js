import BaseMiddleware from '#/middleware/Base';
import p2 from 'p2';
import * as collisions from '#/collisions';

export default class Projectiles extends BaseMiddleware {
  constructor(world) {
    super(world);

    this.projectiles = [];
    this.pendingRemoves = [];
  }

  add(parentBody) {
    const position = [0, 0];
    parentBody.toWorldFrame(position, [0, -25]);
    const body = new p2.Body({
      mass: 1,
      position,
      velocity: parentBody.velocity,
      angle: parentBody.angle,
    });

    const shape = new p2.Box({
      width: 4,
      height: 10,
      ...collisions.laser(),
    });

    body.addShape(shape);

    const projectile = {
      body,
      life: [0, 3],
    };

    this.world.addBody(projectile.body);

    this.projectiles.push(projectile);

    return projectile;

  }

  tick(delta) {
    this.projectiles = this.projectiles.reduce((list, item) => {
      const projectile = {
        ...item,
        life: [item.life[0] + delta, item.life[1]],
      };

      if (projectile.life[0] > projectile.life[1]) {
        this.pendingRemoves.push(projectile);
        return list;
      }

      return list.concat(projectile);
    }, []);
  }

  postStep() {
    for(const projectile of this.projectiles) {
      projectile.body.applyForceLocal([0, -800]);
    }
  }

  tickEnd() {
    for(const projectile of this.pendingRemoves) {
      this.world.removeBody(projectile.body);
    }
  }
}
