import { circleFill, radialGradient } from '#/canvas';

const c = ([x, y], radius, percent) => {
  const r = radius * percent;
  if (r <= 0) return [];

  const h = 30 + ((Math.random() * 20) - 10);
  const l = Math.random(Math.random() * 60) + 40;

  return radialGradient(
    'fillStyle',
    [x, y],
    1,
    [x, y],
    r,
    [
      [0, `hsla(${h}, 100%, ${l}%, 0.8)`],
      [0.4, `hsla(${h}, 100%, ${l}%, 0.1)`],
      [1, `hsla(${h}, 100%, ${l}%, 0)`],
    ],
    [
      circleFill([x, y], r),
    ],
  );
};


const simple = ({ p, life: [current, total] }) => {
  const percent = current / total;
  return [
    c(p, 10, 1 - percent),
  ];
};

export default (props) => {
  return simple(props);
};
