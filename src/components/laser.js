import { lineCap, properties, beginPath, moveTo, lineTo, stroke, closePath } from '#/canvas';

const lineFrom = (position, size, direction) => {
  const a = [
    position[0] + (Math.cos(direction / 180 * Math.PI) * size / 2),
    position[1] + (Math.cos(direction / 180 * Math.PI) * size / 2),
  ];

  const b = [
    position[0] + (Math.cos((direction + 180) / 180 * Math.PI) * size / 2),
    position[1] + (Math.cos((direction + 180) / 180 * Math.PI) * size / 2),
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

export default (position, direction) => lineCap('round', [
  maybeRender() && laser(position, 24, direction, 13, 'hsla(0, 63%, 54%, 0.2)'),
  maybeRender() && laser(position, 22, direction, 9, 'hsla(0, 63%, 54%, 0.2)'),
  maybeRender() && laser(position, 20, direction, 5, 'hsla(0, 63%, 54%, 0.2)'),
  laser(position, 15, direction, 4, 'hsla(0, 63%, 54%, 0.8)'),
]);
