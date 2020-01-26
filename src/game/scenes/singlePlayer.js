import { rectFill, rectStroke, properties, translate, restorable } from '#/lib/canvas';

export default (ship, collections, screen) => {
  const size = [screen.width, screen.height];

  const centerOnShip = [
    (size[0] / 2) - ship.body.interpolatedPosition[0],
    (size[1] / 2) - ship.body.interpolatedPosition[1],
  ];

  return [
    properties({
      strokeStyle: '#444',
      fillStyle: '#010101',
    }, [
      rectFill([0, 0], size),
      rectStroke([0, 0], size),
    ]),

    restorable(translate(centerOnShip, (
      collections.map(({ collection, fn }) => collection.map(fn))
    ))),
  ];
};


