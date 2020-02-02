import Base from './Base';

class Relay extends Base {
  init(simulation, data) {
    this.shipsMiddleware = simulation.getMiddleware('ships');
    this.game = data.game;
  }

  postStep() {
    const ships = this.shipsMiddleware.ships.map(ship => ({
      p: Array.from(ship.body.interpolatedPosition),
      a: ship.body.interpolatedAngle,
    }));

    this.game.broadcast({
      type: 'ships',
      ships,
    });
  }
}

export default Relay;
