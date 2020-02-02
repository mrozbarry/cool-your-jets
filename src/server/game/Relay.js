import Base from './Base';

class Relay extends Base {
  init(simulation, data) {
    this.shipsMiddleware = simulation.getMiddleware('ships');
    this.game = data.game;
  }

  postStep() {
    const ships = this.shipsMiddleware.ships.map(ship => ({
      p: ship.body.interpolatedPosition,
      a: ship.body.interpolatedAngle,
    }));

    console.log('broadcasting game state', ships);

    this.game.broadcast({
      type: 'ships',
      ships,
    });
  }
}

export default Relay;
