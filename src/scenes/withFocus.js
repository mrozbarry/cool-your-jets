import { rectFill, rectStroke, fillStyle, strokeStyle, translate } from '#/lib/canvas';
import shipComponent from '#/components/ship';
import particleComponent from '#/components/particle';
import laserComponent from '#/components/laser';
import infoComponent from '#/components/info';
import viewportComponent from '#/components/viewport';

export default (ships, particles, projectiles, screen) => {
  const size = [screen.width, screen.height];

  const portals = screen.divide(ships.length);

  return [
    fillStyle('black', [
      rectFill([0, 0], [screen.canvas.element.width, screen.canvas.element.height]),
    ]),

    portals.map(({ x, y, w, h }, index) => {
      const ship = ships[index];

      const centerOnShip = [
        (size[0] / 2) - ship.body.interpolatedPosition[0],
        (size[1] / 2) - ship.body.interpolatedPosition[1],
      ];

      return viewportComponent({
        offset: [x, y],
        pixelSize: [w, h],
        virtualSize: size,
      }, [
        strokeStyle('#444', [
          rectStroke([0, 0], size),
        ]),

        translate(centerOnShip, [
          ...particles.map(particleComponent),
          ...projectiles.map(laserComponent),

          ...ships.map((ship) => [
            infoComponent(ship),
            shipComponent(ship),
          ]),
        ]),

      ])
    }),
  ];
};


