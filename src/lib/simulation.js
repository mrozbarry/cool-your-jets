import p2 from 'p2';

export const make = () => {
  return {
    timestep: 1 / 60,
    previousTick: null,
    world: new p2.World({
      gravity: [0, 0],
    }),
  };
};

export const drain = (currentSimulation) => ({
  ...currentSimulation,
  previousTick: null,
});

export const step = (time, simulation) => {
  const { previousTick, timestep, world } = simulation;
  let delta = time && previousTick
    ? ((time - previousTick) / 1000)
    : 0;

  world.step(timestep, delta, 10);

  return {
    ...simulation,
    world,
    previousTick: time,
  };
};
