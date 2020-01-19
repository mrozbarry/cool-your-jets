import * as laserObject from '#/objects/laser';

export const make = () => [];

export const add = (parentBody, world, projectiles) => {
  const body = laserObject.make(parentBody);

  world.addBody(body);

  return [
    ...projectiles,
    {
      body,
      life: [0, 1],
    },
  ];
};

export const removeByBody = (body, world, projectiles) => {
  return projectiles.filter((p) => {
    if (p.body === body) {
      world.removeBody(body);
      return false;
    }
    return true;
  });
};

export const tick = (delta, world, projectiles) => projectiles.reduce((list, item) => {
  const projectile = {
    ...item,
    life: [item.life[0] + delta, item.life[1]],
  };

  if (projectile.life[0] > projectile.life[1]) {
    world.removeBody(projectile.body);
    return list;
  }

  return list.concat(projectile);
}, []);

export const step = (projectiles) => projectiles.forEach((p) => {
  p.body.applyForceLocal([0, -800]);
});
