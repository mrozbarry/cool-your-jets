import { circleStroke, properties } from '#/canvas';

const sheild = (radius, lineWidth, strokeStyle) => (
  properties({
    strokeStyle,
    lineWidth,
  }, [
    circleStroke([0, 0], radius),
  ])
);

const maybeRender = () => Math.random() > 0.3;

export default (strength, radius) => [
  maybeRender() && sheild(radius, strength + (strength * 6), 'hsla(180, 50%, 50%, 0.1)'),
  maybeRender() && sheild(radius, strength + (strength * 4), 'hsla(180, 50%, 50%, 0.1)'),
  maybeRender() && sheild(radius, strength + (strength * 2), 'hsla(180, 50%, 50%, 0.1)'),
  sheild(radius, strength, 'hsla(180, 50%, 50%, 1)'),
];
