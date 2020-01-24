import BaseTimedObjectMiddleware from '#/middleware/BaseTimedObject';
import p2 from 'p2';
import * as collisions from '#/collisions';

export default class Particles extends BaseTimedObjectMiddleware {
  add([x, y], type, totalLife) {
    const body = new p2.Body({
      mass: 0.5,
      position: [x, y],
      sleepTimeLimit: 0.2
    });

    const shape = new p2.Particle({
      ...collisions.particle(),
    });

    body.addShape(shape);

    const particle = {
      body,
      type,
      life: [0, totalLife],
    };

    this.world.addBody(particle.body);

    return super.add(particle);
  }
}
