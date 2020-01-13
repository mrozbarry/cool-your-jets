import planck from 'planck-js';

export const create = () => {
  return {
    timestep: 1 / 60,
    accumulator: 0,
    previousTick: null,
    world: new planck.World({
      gravity: planck.Vec2(0, 0),
    }),
  };
};

export const drain = (currentSimulation) => ({
  ...currentSimulation,
  accumulator: 0,
  previousTick: null,
});

export const step = (delta, simulation) => {
  const { timestep, world } = simulation;
  let accumulator = simulation.accumulator + delta;

  while (accumulator > timestep) {
    world.step(timestep);
    accumulator -= timestep;
  }

  return {
    ...simulation,
    world,
    accumulator,
  };
};

export const eachBody = (bodyCallback, simulation) => {
  let body = simulation.world.getBodyList();
  while (body) {
    bodyCallback(body);
    body = body.getNext();
  }
};

export const eachFixture = (fixtureCallback, body) => {
  let fixture = body.getFixtureList();
  while (fixture) {
    fixtureCallback(fixture);
    fixture = fixture.getNext();
  }
};
