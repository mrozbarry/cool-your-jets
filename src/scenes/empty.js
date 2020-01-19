import { rectFill, fillStyle } from '#/lib/canvas';
import shipComponent from '#/components/ship';
import particleComponent from '#/components/particle';
import laserComponent from '#/components/laser';
import infoComponent from '#/components/info';

export default (ships, particles, projectiles, ctx) => [
  fillStyle('black', rectFill([0, 0], [ctx.canvas.width, ctx.canvas.height])),
  ...particles.map(particleComponent),
  ...projectiles.map(laserComponent),

  ...ships.map((ship) => [
    infoComponent(ship),
    shipComponent(ship),
  ]),
];

