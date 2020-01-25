import { polygonStroke, properties, rotate, translate, restorable } from '#/lib/canvas';

const ship = (shipObject, lineWidth, color) => {
  const vertices = shipObject.shapes.hull.vertices
    .map(v => Array.from(v))
    .map(v => (
      v.map((value, index) => value + shipObject.shapes.hull.position[index])
    ));

  return properties(
    {
      lineCap: 'round',
      lineJoin: 'round',
      lineWidth,
      strokeStyle: color,
    },
    [
      polygonStroke(vertices),
    ],
  );
};

const maybeRender = (v) => Math.random() > v;

export default (shipObject) => {
  const position = Array.from(shipObject.body.interpolatedPosition);
  const angle = shipObject.body.interpolatedAngle;
  const color = (alpha, alive) => `hsla(0, 0%, ${alive ? '100%' : '20%'}, ${alpha})`;

  return restorable(translate(position, [
    rotate(angle, [
      //maybeRender(0.3) && ship(shipObject, 11, color(0.1, shipObject.alive)),
      //maybeRender(0.3) && ship(shipObject, 8, color(0.1, true)),
      //maybeRender(0.3) && ship(shipObject, 5, color(0.1, shipObject.alive)),
      ship(shipObject, 2, color(1, shipObject.alive)),
    ]),
  ]));
};
