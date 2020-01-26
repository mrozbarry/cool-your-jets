import p2 from 'p2';
import Controls from '#/game/middleware/Controls';
import Ship from '#/game/models/Ship';

function *defaultSpawnGenerator() {
  while(true) {
    yield [
      (Math.random() * 200) - 100,
      (Math.random() * 200) - 100,
    ];
  }
}

export default class Game {
  constructor({
    timestep,
    thrustForce,
    turnVelocity,
    fireLockDelay,
    projectileAugmentForce,
  }) {
    this.controls = new Controls();

    this.timestep = timestep || (1 / 30);
    this.thrustForce = Math.abs(thrustForce || 600);
    this.turnVelocity = Math.abs(turnVelocity || 100);
    this.fireLockDelay = Math.abs(fireLockDelay || 300);
    this.projectileAugmentForce = Math.abs(projectileAugmentForce || 100);

    this.middleware = [];

    this.previousTime = null;
    this.currentTime = 0;

    this.ships = {};

    this.world = new p2.World({
      gravity: [0, 0],
    });

    this.spawnGenerator = defaultSpawnGenerator();

    this.world.on('preStep', this.runMiddlewarePreStep.bind(this));
    this.world.on('postStep', this.runMiddlewarePostStep.bind(this));

    this.addMiddleware('controls', this.controls);
  }

  addPlayer(name, input) {
    const id = Math.random().toString(36).slice(2);

    const ship = new Ship(name, this.spawnGenerator.next().value);

    this.ships[id] = ship;
    this.controls.add(id, input);
    this.world.addBody(ship.body);

    return { id, ship, input };
  }

  killPlayer(body) {
    const ship = this.getShipFromBody(body);
    if (!ship) return;
    ship.alive = false;
    this.world.removeBody(ship.body);
  }

  getShips() { return Object.values(this.ships); }
  getPlayerIds() { return Object.keys(this.ships); }
  getShipFromBody(body) {
    return this.getShips()
      .find(ship => ship.body === body);
  }

  addMiddleware(name, instance) {
    this.middleware.push({ name, instance });
    return instance;
  }

  getMiddleware(name) {
    const m = this.middleware.find(m => m.name === name);
    if (!m) return null;
    return m.instance;
  }

  init() {
    let m;
    for(m of this.middleware) {
      m.instance.init(this);
    }
  }

  runMiddlewareTickStart(delta) {
    let m;
    for(m of this.middleware) {
      if (!m.instance.enabled) continue;
      m.instance.tickStart(this, delta);
    }
  }

  runMiddlewarePreStep() {
    let m;
    for(m of this.middleware) {
      if (!m.instance.enabled) continue;
      m.instance.preStep(this, this.timestep);
    }
  }

  runMiddlewarePostStep() {
    let m;
    for(m of this.middleware) {
      if (!m.instance.enabled) continue;
      m.instance.postStep(this, this.timestep);
    }
  }

  runMiddlewareTickEnd(delta) {
    let m;
    for(m of this.middleware) {
      if (!m.instance.enabled) continue;
      m.instance.tickEnd(this, delta);
    }
  }

  deinit() {
    let m;
    for(m of this.middleware) {
      m.instance.deinit(this);
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
