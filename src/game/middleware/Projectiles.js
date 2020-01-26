import BaseTimedObjectMiddleware from './BaseTimedObject';
import p2 from 'p2';
import * as collisions from '#/game/collisions';
import AudioControl from '#/lib/audio';

export default class Projectiles extends BaseTimedObjectMiddleware {
  init(game) {
    super.init(game);

    game.world.on('beginContact', (event) => {
      const bodies = [event.bodyA, event.bodyB];
      if (bodies.some(b => b._isLaser) && bodies.some(b => b._isShip)) {
        AudioControl.playSfx('laser-bounce');
      }
    });
  }

  add(game, parentBody) {
    const position = [0, 0];
    parentBody.toWorldFrame(position, [0, -30]);
    const body = new p2.Body({
      mass: 2,
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

    projectile.body._isLaser = true;

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
