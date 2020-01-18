export const make = () => [];

export const add = ([x, y], type, totalLife, particles) => [
  ...particles,
  { p: [x, y], type, life: [0, totalLife] },
];

export const moveEach = ([x, y], particles) => particles.map(p => ({
  ...p,
  p: [p.p[0] + x, p.p[1] + y],
}));

export const tick = (delta, particles) => particles.reduce((list, item) => {
  const particle = {
    ...item,
    life: [item.life[0] + delta, item.life[1]],
  };

  return (particle.life[0] > particle.life[1]) 
    ? list
    : list.concat(particle);
}, []);
