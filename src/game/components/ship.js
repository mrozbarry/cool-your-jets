import { moveTo, lineTo, path, fill, stroke, properties, rotate, translate, restorable } from '#/lib/canvas';

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
      fillStyle: `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, ${alive ? 0.5 : 0.1})`,
    },
    [
      path({ close: true, after: fill }, lineOps),
    ],
  );
};

const maybeRender = (v) => Math.random() > v;

const ship = (player) => {
  const shipObject = player.ship;

  const color = (alpha) => `hsla(0, 0%, ${player.alive ? '100%' : '20%'}, ${alpha})`;

  const vertices = shipObject.shapes.hull.vertices
    .map(v => Array.from(v))
    .map(v => (
      v.map((value, index) => value + shipObject.shapes.hull.position[index])
    ));

  const first = vertices[0];
  const trailing = vertices.slice(1);

  const lineOps = [
    moveTo(first),
    trailing.map(p => lineTo(p)),
  ];

  return [
    shipFilled(lineOps, player.color, player.alive),
    maybeRender(0.3) && player.alive && shipOutline(lineOps, 8, color(0.1)),
    maybeRender(0.3) && player.alive && shipOutline(lineOps, 5, color(0.1)),
    shipOutline(lineOps, 3, color(1)),
  ];
};

export default (player) => {
  const shipObject = player.ship;
  const position = Array.from(shipObject.body.interpolatedPosition);
  const angle = shipObject.body.interpolatedAngle;

  return restorable(translate(position, [
    rotate(angle, ship(player)),
  ]));
};
