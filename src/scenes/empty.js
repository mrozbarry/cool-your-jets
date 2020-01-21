import { scale, rectFill, fillStyle } from '#/lib/canvas';
import shipComponent from '#/components/ship';
import particleComponent from '#/components/particle';
import laserComponent from '#/components/laser';
import infoComponent from '#/components/info';

export default (ships, particles, projectiles, ctx) => [
  scale([ctx.canvas.width / 800, ctx.canvas.height / 600], [
    fillStyle('black', rectFill([0, 0], [800, 600])),
    ...particles.map(particleComponent),
    ...projectiles.map(laserComponent),

    ...ships.map((ship) => [
      infoComponent(ship),
      shipComponent(ship),
    ]),
  ]),
];

