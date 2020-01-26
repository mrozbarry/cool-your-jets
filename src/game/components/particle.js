import { strokeStyle, rectStroke } from '#/lib/canvas';

export default (particle) => {
  const percent = 1 - (particle.life[0] / particle.life[1]);
  const size = 8 * percent;
  if (size <= 0) return [];
  const half = size / 2;

  const h = 30 + ((Math.random() * 10) - 5);
  const l = `${percent * 70}%`;

  const position = particle.body.interpolatedPosition;

  // Array.from(particle.body.interpolatedPosition),
  return strokeStyle(
    `hsla(${h}, 80%, ${l}, 1.0)`,
    rectStroke([position[0] - half, position[1] - half], [size, size]),
  );
};
