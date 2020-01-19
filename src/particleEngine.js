import p2 from 'p2';
import * as physicsGroups from '#/groups';

export const make = () => [];

export const add = ([x, y], type, totalLife, world, particles) => {
  const body = new p2.Body({
    mass: 5,
    position: [x, y],
  });

  const shape = new p2.Particle({
    collisionGroup: physicsGroups.THRUST,
    collisionMask: physicsGroups.LASER,
  });

  body.addShape(shape);

  world.addBody(body);

  return [
    ...particles,
    {
      body,
      type,
      life: [0, totalLife],
    },
  ];
};

export const tick = (delta, world, particles) => particles.reduce((list, item) => {
  const particle = {
    ...item,
    life: [item.life[0] + delta, item.life[1]],
  };

  if (particle.life[0] > particle.life[1]) {
    world.removeBody(particle.body);
    return list;
  }

  return list.concat(particle);
}, []);
