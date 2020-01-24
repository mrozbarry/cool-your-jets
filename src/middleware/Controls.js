import BaseMiddleware from '#/middleware/Base';
import GamepadInput from '#/inputs/Gamepad';

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

  tickStart(game) {
    for(const input of Object.values(this.inputs)) {
      if (!(input instanceof GamepadInput)) continue;

      input.update();
    }

    const particles = game.getMiddleware('particles');
    const projectiles = game.getMiddleware('projectiles');
    const keyState = game.controls.snapshot();

    for(const playerId of game.getPlayerIds()) {
      if (!keyState[playerId]) continue;

      const ship = game.ships[playerId];
      if (!ship || !ship.alive) continue;

      const { up, down } = keyState[playerId];

      if (up) {
        for(let thruster of ship.getThrusters()) {
          particles.add(
            thruster.map(v => v + ((Math.random() * 2) - 1)),
            'simple',
            10,
          );
        }
      }
      if (down && game.currentTime > ship.fireLock) {
        projectiles.add(game, ship.body);
        ship.fireLock = game.currentTime + game.fireLockDelay;
      }

    }
  }

  postStep(game, delta) {
    const keyState = game.controls.snapshot();

    for(const playerId of game.getPlayerIds()) {
      if (!keyState[playerId]) continue;

      const ship = game.ships[playerId];
      if (!ship || !ship.alive) continue;
      const { up, right, left } = keyState[playerId];

      ship.body.applyForceLocal([0, up * -game.thrustForce]);
      ship.body.angularVelocity = (right - left) * (game.turnVelocity * delta);
    }
  }
}
