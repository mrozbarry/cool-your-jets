import Base from './Base';
import p2 from 'p2';
import * as collisions from '#/collisions';
import { properties, circleStroke } from '#/lib/canvas';
import AudioControl from '#/lib/audio';

export default class SumoGamemode extends Base {
  constructor(radius, seconds) {
    super();

    this.time = [0, seconds * 1000];
    this.radius = radius;
    this.lastOneAt = null;
    this.winner = null;
    this.done = false;

    this.ring = this.makeRing();
  }

  init(game) {
    super.init(game);

    game.world.addBody(this.ring.body);

    game.world.on('endContact', (event) => {
      if (this.done) {
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

  renderCollection(collection) {
    return [
      {
        collection: [this.ring],
        fn: (ring) => [
          properties({
            lineWidth: 5,
            strokeStyle: 'red',
          }, [
            circleStroke(
              ring.body.interpolatedPosition,
              ring.shape.radius,
            ),
          ]),
        ],
      },
      ...collection,
    ];
  }

  renderOverlay() {
  }

  tickStart(_game, delta) {
    if (this.done) return;
    this.time[0] += (delta * 1000);
    const percent = 1.0 - Math.min(1, this.time[0] / this.time[1]);
    this.ring.shape.radius = this.radius * percent;
  }

  tickEnd(game) {
    const shipsAlive = game.getShips().filter(s => s.alive);
    if (this.lastOneAt === null && shipsAlive.length === 1) {
      this.lastOneAt = game.currentTime + 1000;
    } else if (shipsAlive.length === 1 && game.currentTime >= this.lastOneAt) {
      if (!this.done) {
        this.winner = shipsAlive[0];
        this.done = true;
        game.getMiddleware('controls').enabled = false;
        AudioControl.stop();
        AudioControl.playLoop('game-winner');
      }
    } else if (shipsAlive.length === 0) {
      this.done = true;
    }
  }
}
