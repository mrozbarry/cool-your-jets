import { polygonStroke, properties } from '#/canvas';
import shield from '#/components/sheild';

const ship = (shipObject, lineWidth, color) => {
  return properties(
    {
      lineCap: 'round',
      lineJoin: 'round',
      lineWidth,
      strokeStyle: color,
    },
    [
      polygonStroke(shipObject.points),
    ],
  );
};

const maybeRender = () => Math.random() > 0.1;

export default (shipObject) => [
  maybeRender() && ship(shipObject, 14, 'rgba(255, 255, 255, 0.1)'),
  maybeRender() && ship(shipObject, 11, 'rgba(255, 255, 255, 0.1)'),
  maybeRender() && ship(shipObject, 8, 'rgba(255, 255, 255, 0.1)'),
  maybeRender() && ship(shipObject, 5, 'rgba(255, 255, 255, 0.1)'),
  ship(shipObject, 2, 'rgba(255, 255, 255, 1)'),
  shield(shipObject.shields, 36),
];
