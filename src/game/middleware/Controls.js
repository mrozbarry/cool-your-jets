import BaseMiddleware from './Base';
import AudioControl from '#/lib/audio';

const defaultState = {
  up: 0,
  down: 0,
  left: 0,
  right: 0,
};

export default class Controls extends BaseMiddleware {
  constructor() {
    super();

    this.state = {};
    this.inputs = {};
  }

  add(id, input) {
    this.state[id] = { ...defaultState };
    this.inputs[id] = input;
    this.inputs[id].setNotifier((button, value) => {
      this.notify(id, button, value);
    });
  }

  remove(id) {
    this.inputs[id].detach();
    delete this.inputs[id];
    delete this.state[id];
  }

  notify(id, button, value) {
    this.state[id][button] = value;
  }

  snapshot() {
    return JSON.parse(JSON.stringify(this.state));
  }

  init() {}

  tickStart(game) {
    for(const input of Object.values(this.inputs)) {
      input.pumpEvents();
    }

    const particles = game.getMiddleware('particles');
    const projectiles = game.getMiddleware('projectiles');
    const keyState = game.controls.snapshot();

    let player;
    for(player of game.players) {
      if (!keyState[player.id]) continue;

      if (!player.alive) continue;

      const { up, down } = keyState[player.id];

      if (up) {
        for(let thruster of player.ship.getThrusters()) {
          particles.add(
            thruster.map(v => v + ((Math.random() * 2) - 1)),
            'simple',
            10,
          );
        }
      }
      if (down && game.currentTime > player.ship.fireLock) {
        projectiles.add(game, player.ship.body);
        player.ship.fireLock = game.currentTime + game.fireLockDelay;
        AudioControl.playSfx('laser');
      }
    }
  }

  postStep(game, delta) {
    const keyState = game.controls.snapshot();

    let player;
    for(player of game.players) {
      if (!keyState[player.id]) continue;

      if (!player.alive) continue;
      const { up, right, left } = keyState[player.id];

      player.ship.body.applyForceLocal([0, up * -game.thrustForce]);
      player.ship.body.angularVelocity = (right - left) * (game.turnVelocity * delta);
    }
  }

  deinit() {
    for(const input of Object.values(this.inputs)) {
      input.cleanup();
    }
    this.inputs = {};
    this.state = {};
  }
}
