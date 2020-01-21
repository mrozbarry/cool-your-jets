import p2 from 'p2';
import Controls from '#/middleware/Controls';
import Ship from '#/models/Ship';

export default class Game {
  constructor({
    timestep,
    thrustForce,
    turnVelocity,
    fireLockDelay,
    projectileAugmentForce,
  }) {
    this.controls = new Controls();

    this.middleware = [{ name: 'controls', instance: this.controls }];
    this.timestep = timestep || (1 / 60);
    this.thrustForce = Math.abs(thrustForce || 600);
    this.turnVelocity = Math.abs(turnVelocity || 100);
    this.fireLockDelay = Math.abs(fireLockDelay || 250);
    this.projectileAugmentForce = Math.abs(projectileAugmentForce || 100);

    this.previousTime = null;
    this.currentTime = 0;

    this.ships = {};

    this.world = new p2.World({
      gravity: [0, 0],
    });

    this.world.on('preStep', this.runMiddlewarePreStep.bind(this));
    this.world.on('postStep', this.runMiddlewarePostStep.bind(this));
  }

  addPlayer(name, input) {
    const id = Math.random().toString(36).slice(2);

    const ship = new Ship(name, [
      100 + (Math.random() * 800),
      100 + (Math.random() * 600),
    ]);

    this.ships[id] = ship;
    this.controls.add(id, input);
    this.world.addBody(ship.body);

    return { id, ship };
  }

  getShips() { return Object.values(this.ships); }
  getPlayerIds() { return Object.keys(this.ships); }

  addMiddleware(name, instance) {
    this.middleware.push({ name, instance });
    return instance;
  }

  getMiddleware(name) {
    const m = this.middleware.find(m => m.name === name);
    if (!m) return null;
    return m.instance;
  }

  runMiddlewareTickStart(delta) {
    for(const m of this.middleware) {
      m.instance.tickStart(this, delta);
    }
  }

  runMiddlewarePreStep() {
    for(const m of this.middleware) {
      m.instance.preStep(this, this.timestep);
    }
  }

  runMiddlewarePostStep() {
    for(const m of this.middleware) {
      m.instance.postStep(this, this.timestep);
    }
  }

  runMiddlewareTickEnd(delta) {
    for(const m of this.middleware) {
      m.instance.tickEnd(this, delta);
    }
  }

  step(time) {
    const diff = time && this.previousTime
      ? time - this.previousTime
      : 0;
    const delta = diff / 1000;

    this.currentTime += diff;

    this.runMiddlewareTickStart(delta);

    this.world.step(this.timestep, delta, 10);

    this.runMiddlewareTickEnd(delta);

    this.previousTime = time;
  }

  resetPreviousTime() {
    this.previousTime = performance.now();
  }
}
