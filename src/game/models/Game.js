import p2 from 'p2';
import Controls from '#/game/middleware/Controls';
import Ship from '#/game/models/Ship';
import Player from '#/game/models/Player';

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

    this.done = false;

    this.middleware = [];

    this.previousTime = null;
    this.currentTime = 0;

    this.players = [];

    this.world = new p2.World({
      gravity: [0, 0],
    });

    this.spawnGenerator = defaultSpawnGenerator();

    this.world.on('preStep', this.runMiddlewarePreStep.bind(this));
    this.world.on('postStep', this.runMiddlewarePostStep.bind(this));

    this.addMiddleware('controls', this.controls);
  }

  onEndWithWinner(id) {}
  onEndWithoutWinner() {}

  endWithWinner(id) {
    this.done = true;
    this.onEndWithWinner(id);
  }

  endWithoutWinner() {
    this.done = true;
    this.onEndWithoutWinner();
  }

  addPlayer(config) {
    const id = Math.random().toString(36).slice(2);

    const ship = new Ship(config.name, this.spawnGenerator.next().value);

    const player = new Player(id, config, ship);

    this.controls.add(id, player.input);
    this.world.addBody(ship.body);

    this.players.push(player);

    return player;
  }

  killPlayer(body) {
    const player = this.getPlayerFromBody(body);
    if (!player) return;
    player.alive = false;
    this.world.removeBody(player.ship.body);
  }

  getShips() { return this.players.map(p => p.ship); }
  getPlayerIds() { return this.players.map(p => p.id); }
  getPlayerFromBody(body) {
    return this.players.find(p => p.ship.body === body);
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
    this.world.clear();
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
