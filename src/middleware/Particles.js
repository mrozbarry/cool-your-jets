import BaseMiddleware from '#/middleware/Base';
import p2 from 'p2';
import * as collisions from '#/collisions';

export default class Particles extends BaseMiddleware {
  constructor(world) {
    super(world);

    this.particles = [];
    this.pendingRemoves = [];
  }

  add([x, y], type, totalLife) {
    const body = new p2.Body({
      mass: 5,
      position: [x, y],
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

    this.particles.push(particle);

    return particle;
  }

  tick(delta) {
    this.particles = this.particles.reduce((list, item) => {
      const particle = {
        ...item,
        life: [item.life[0] + delta, item.life[1]],
      };

      if (particle.life[0] > particle.life[1]) {
        this.pendingRemoves.push(particle);
        return list;
      }

      return list.concat(particle);
    }, []);
  }

  tickEnd() {
    for(const particle of this.pendingRemoves) {
      this.world.removeBody(particle.body);
    }
  }


}
