import BaseTimedObjectMiddleware from '#/middleware/BaseTimedObject';
import p2 from 'p2';
import * as collisions from '#/collisions';

export default class Projectiles extends BaseTimedObjectMiddleware {
  add(parentBody) {
    const position = [0, 0];
    parentBody.toWorldFrame(position, [0, -25]);
    const body = new p2.Body({
      mass: 1,
      position,
      velocity: parentBody.velocity,
      angle: parentBody.angle,
      fixedRotation: true,
    });

    const shape = new p2.Box({
      width: 8,
      height: 10,
      ...collisions.laser(),
    });

    body.addShape(shape);

    const projectile = {
      body,
      life: [0, 3],
    };

    body._isShip = true;
    this.world.addBody(projectile.body);

    return super.add(projectile);
  }

  postStep(game) {
    for(const projectile of this.items) {
      projectile.body.applyForceLocal([
        0,
        -game.thrustForce - game.projectileAugmentForce,
      ]);
    }
  }
}
