import { lineCap, properties, beginPath, moveTo, lineTo, stroke, closePath } from '#/lib/canvas';

const lineFrom = (position, size, direction) => {
  const x = Math.cos(direction) * size;
  const y = Math.sin(direction) * size;

  const a = [
    position[0] - x,
    position[1] - y,
  ];

  const b = [
    position[0] + x,
    position[1] + y,
  ];

  return [a, b];
};

const laser = (position, size, direction, lineWidth, strokeStyle) => {
  const [a, b] = lineFrom(position, size, direction);

  return properties({
    lineWidth,
    strokeStyle,
  }, [
    beginPath(),
    moveTo(a),
    lineTo(b),
    closePath(),
    stroke(),
  ]);
};

const maybeRender = () => Math.random() > 0.4;

export default (projectile) => {
  const position = projectile.body.interpolatedPosition;
  const direction = ((projectile.body.angle * 180 / Math.PI) + 90) / 180 * Math.PI;
  const shape = projectile.body.shapes[0];

  return lineCap('round', [
    maybeRender() && laser(position, shape.height * 1.6, direction, shape.width * 3, 'hsla(0, 63%, 54%, 0.2)'),
    maybeRender() && laser(position, shape.height * 1.4, direction, shape.width * 2.5, 'hsla(0, 63%, 54%, 0.2)'),
    maybeRender() && laser(position, shape.height * 1.2, direction, shape.width * 2, 'hsla(0, 63%, 54%, 0.2)'),
    laser(position, shape.height, direction, shape.width, 'hsla(0, 63%, 70%, 0.8)'),
  ]);
};
