import p2 from 'p2';

export const create = () => {
  return {
    timestep: 1 / 60,
    accumulator: 0,
    previousTick: null,
    world: new p2.World({
      gravity: [0, 0.01],
    }),
  };
};

export const drain = (currentSimulation) => ({
  ...currentSimulation,
  accumulator: 0,
  previousTick: null,
});

export const step = (timestamp, simulation) => {
  const { previousTick, timestep, world } = simulation;
  let delta = timestamp && previousTick
    ? ((timestamp - previousTick) / 1000)
    : 0;

  let accumulator = simulation.accumulator + delta;

  while (accumulator > timestep) {
    world.step(timestep);
    accumulator -= timestep;
  }

  return {
    ...simulation,
    world,
    accumulator,
    previousTick: timestamp,
  };
};
