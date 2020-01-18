import { rectFill, translate, fillStyle } from '#/canvas';
import shipComponent from '#/components/ship';
import particleComponent from '#/components/particle';
import laserComponent from '#/components/laser';
import infoComponent from '#/components/info';

export default (ships, particles, ctx) => [
  fillStyle('black', rectFill([0, 0], [ctx.canvas.width, ctx.canvas.height])),
  ...particles.map(particleComponent),

  laserComponent([100, 100], 0),

  ...ships.map((ship) => [
    translate(ship.offset, [
      shipComponent(ship),
    ]),
  ]),

  infoComponent(ships[0]),
];

