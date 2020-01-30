import Base from './Base';
import p2 from 'p2';
import * as collisions from '#/game/collisions';
import { properties, circleStroke } from '#/lib/canvas';

export default class SumoGamemode extends Base {
  constructor(radius, seconds) {
    super();

    this.time = [0, seconds * 1000];
    this.radius = radius;
    this.lastOneAt = null;
    this.winner = null;

    this.ring = this.makeRing();
  }

  init(game) {
    super.init(game);

    game.world.addBody(this.ring.body);

    game.world.on('endContact', (event) => {
      if (game.done) {
        return;
      }
      const shapes = [event.shapeA, event.shapeB];
      const sensor = shapes.filter(s => s.sensor)[0];
      const shipBody = shapes.filter(s => !s.sensor)[0];

      if (sensor && shipBody) {
        game.killPlayer(shipBody.body);
      }
    });
  }

  makeRing() {
    const body = new p2.Body({
      mass: 0,
      position: [0, 0],
    });

    const shape = new p2.Circle({
      ...collisions.levelSensor(),
      radius: this.radius,
      sensor: true,
    });

    body.addShape(shape);

    return { body, shape };
  }

  render() {
    return [
      properties({
        lineWidth: 5,
        strokeStyle: 'red',
      }, [
        circleStroke(
          this.ring.body.interpolatedPosition,
          this.ring.shape.radius,
        ),
      ]),
    ];
  }

  tickStart(game, delta) {
    if (game.done) return;
    this.time[0] += (delta * 1000);
    this.ring.shape.radius = this.radius * (1.0 - Math.min(1, this.time[0] / this.time[1]));
  }

  tickEnd(game) {
    const playersAlive = game.players.filter(p => p.alive);
    if (this.lastOneAt === null && playersAlive.length === 1) {
      this.lastOneAt = game.currentTime + 1000;
    } else if (playersAlive.length === 1 && game.currentTime >= this.lastOneAt) {
      if (!game.done) {
        game.endWithWinner(playersAlive[0].id);
      }
    } else if (playersAlive.length === 0) {
      game.endWithoutWinner();
    }
  }
}
