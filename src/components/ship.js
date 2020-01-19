import { polygonStroke, properties, rotate, translate } from '#/lib/canvas';

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

const maybeRender = () => Math.random() > 0.1;

export default (shipObject) => {
  const position = Array.from(shipObject.body.interpolatedPosition);
  const angle = shipObject.body.interpolatedAngle;

  return translate(position, [
    rotate(angle, [
      maybeRender() && ship(shipObject, 14, 'rgba(255, 255, 255, 0.1)'),
      maybeRender() && ship(shipObject, 11, 'rgba(255, 255, 255, 0.1)'),
      maybeRender() && ship(shipObject, 8, 'rgba(255, 255, 255, 0.1)'),
      maybeRender() && ship(shipObject, 5, 'rgba(255, 255, 255, 0.1)'),
      ship(shipObject, 2, 'rgba(255, 255, 255, 1)'),
    ]),
  ]);
};
