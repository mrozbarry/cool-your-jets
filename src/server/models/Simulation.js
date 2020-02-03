import p2 from 'p2';

export default class Game {
  constructor({
    timestep,
    thrustForce,
    turnVelocity,
    fireLockDelay,
    projectileAugmentForce,
  }) {
    this.timestep = timestep || (1 / 30);
    this.thrustForce = Math.abs(thrustForce || 600);
    this.turnVelocity = Math.abs(turnVelocity || 100);
    this.fireLockDelay = Math.abs(fireLockDelay || 300);
    this.projectileAugmentForce = Math.abs(projectileAugmentForce || 100);

    this.done = false;

    this.middleware = [];

    this.previousTime = null;
    this.currentTime = 0;

    this.world = new p2.World({
      gravity: [0, 0],
    });

    this.world.on('preStep', this.runMiddlewarePreStep.bind(this));
    this.world.on('postStep', this.runMiddlewarePostStep.bind(this));
  }

  onEndWithWinner(_id) {}
  onEndWithoutWinner() {}

  endWithWinner(id) {
    this.done = true;
    this.onEndWithWinner(id);
  }

  endWithoutWinner() {
    this.done = true;
    this.onEndWithoutWinner();
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

  init(gameData) {
    let m;
    for(m of this.middleware) {
      m.instance.init(this, gameData);
    }
  }

  runMiddlewareTickStart(delta) {
    let m;
    for(m of this.middleware) {
      m.instance.tickStart(this, delta);
    }
  }

  runMiddlewarePreStep() {
    let m;
    for(m of this.middleware) {
      m.instance.preStep(this, this.timestep);
    }
  }

  runMiddlewarePostStep() {
    let m;
    for(m of this.middleware) {
      m.instance.postStep(this, this.timestep);
    }
  }

  runMiddlewareTickEnd(delta) {
    let m;
    for(m of this.middleware) {
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
    if (this.done) {
      return;
    }

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

