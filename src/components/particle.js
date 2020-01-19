import { translate, fillStyle, path, fill, moveTo, lineTo } from '#/lib/canvas';

const maybeRender = (v = 0.5) => Math.random() > v;

const atom = (size) => {
  const half = size / 2;
  return path({ close: true, after: fill }, [
    moveTo([-half, -half]),
    lineTo([half, -half]),
    lineTo([half, half]),
    lineTo([-half, half]),
    lineTo([-half, -half]),
  ]);
};

const simple = ({ life: [current, total] }) => {
  const percent = 1 - (current / total);
  const r = 8 * percent;
  if (r <= 0) return [];

  const h = 30 + ((Math.random() * 10) - 5);
  const l = `${percent * 80}%`;

  return [
    maybeRender() && fillStyle(`hsla(${h}, 100%, ${l}, 0.1)`, atom(r * 2.5)),
    maybeRender() && fillStyle(`hsla(${h}, 100%, ${l}, 0.1)`, atom(r * 2)),
    fillStyle(`hsla(${h}, 100%, ${l}, 1.0)`, atom(r)),
  ];
};

export default (particle) => translate(
  Array.from(particle.body.interpolatedPosition),
  simple(particle),
);
