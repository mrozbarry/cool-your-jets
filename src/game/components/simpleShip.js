import { moveTo, lineTo, path, fill, stroke, properties, rotate, translate, restorable } from '#/lib/canvas';

const points = [
  [0, -20], // Head
  [12, 20], // Thruster
  [-12, 20], // Thruster
];

const shipOutline = (lineOps, lineWidth, strokeColor) => {
  return properties(
    {
      lineCap: 'round',
      lineJoin: 'round',
      lineWidth,
      strokeStyle: strokeColor,
    },
    [
      path({ close: true, after: stroke }, lineOps),
    ],
  );
};

const shipFilled = (lineOps, hsl, alive) => {
  return properties(
    {
      fillStyle: `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, ${alive ? 0.2 : 0.1})`,
    },
    [
      path({ close: true, after: fill }, lineOps),
    ],
  );
};

const ship = (player) => {
  const color = (alpha) => `hsla(0, 0%, 100%, ${alpha})`;

  const vertices = points
    .map(v => Array.from(v));

  const first = vertices[0];
  const trailing = vertices.slice(1);

  const lineOps = [
    moveTo(first),
    trailing.map(p => lineTo(p)),
  ];

  return [
    shipFilled(lineOps, [player.hue, '100%', '50%'], player.alive),
    shipOutline(lineOps, 3, color(1)),
  ];
};

export default (player, { p, a }) => {
  return restorable(translate(Array.from(p), [
    rotate(a, ship(player)),
  ]));
};

