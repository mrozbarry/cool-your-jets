import p2 from 'p2';

import Base from './Base';

import * as collisions from '../collisions';

const points = [
  [0, -20], // Head
  [12, 20], // Thruster
  [-12, 20], // Thruster
];
const THRUSTERS = [1, 2];

class Ships extends Base {
  createShip(simulation, player) {
    const body = new p2.Body({
      mass: 10,
      position: [0, 0],
    });

    const shape = new p2.Convex({
      vertices: points,
      ...collisions.ship(),
    });

    body.addShape(shape);

    simulation.world.addBody(body);

    return {
      body,
      shape,
      fireLock: 0,
      player,
    };
  }

  getThrustersOf(ship) {
    return THRUSTERS.map(index => {
      const vec = [0, 0];
      ship.body.toWorldFrame(vec, points[index]);
      return vec;
    });
  }

  init(simulation, data) {
    this.players = Object.values(data.game.players);
    this.ships = this.players.map(player => this.createShip(simulation, player));
  }

  postStep(simulation, delta) {
    for(let index = 0; index < this.ships.length; index++) {
      const player = this.players[index];
      const ship = this.ships[index];

      ship.body.applyForceLocal([0, player.inputs.thrust * -simulation.thrustForce]);
      ship.body.angularVelocity = player.inputs.turn * (simulation.turnVelocity * delta);
    }
  }
}

export default Ships;
