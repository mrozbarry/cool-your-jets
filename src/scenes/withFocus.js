import { scale, rectFill, fillStyle, translate, textFill } from '#/lib/canvas';
import shipComponent from '#/components/ship';
import particleComponent from '#/components/particle';
import laserComponent from '#/components/laser';
import infoComponent from '#/components/info';

export default (ship, ships, particles, projectiles, canvas) => {
  const scaleAmount = [
    canvas.element.width / canvas.screen.width,
    canvas.element.height / canvas.screen.height,
  ];

  const size = [canvas.screen.width, canvas.screen.height];

  const centerOnShip = [
    -ship.body.interpolatedPosition[0] + (size[0] / 2),
    -ship.body.interpolatedPosition[1] + (size[1] / 2),
  ];

  return [
    fillStyle('black', [
      rectFill([0, 0], [canvas.element.width, canvas.element.height]),
    ]),

    scale(scaleAmount, [
      translate(centerOnShip, [
        ...particles.map(particleComponent),
        ...projectiles.map(laserComponent),

        ...ships.map((ship) => [
          infoComponent(ship),
          shipComponent(ship),
        ]),
      ]),
    ]),

    fillStyle('white', [
      textFill([10, 10], `Scale ${scaleAmount.join('x')}`),
      textFill([10, 20], `Translate ${centerOnShip.join('x')}`),
      textFill([10, 30], `Ship ${ship.body.interpolatedPosition.join(',')}`),
    ]),
  ];
};


