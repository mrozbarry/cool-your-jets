import Simulation from './Simulation';
import Player from './Player';
import InputsMiddleware from '../game/Inputs';
import ShipsMiddleware from '../game/Ships';
import RelayMiddleware from '../game/Relay';
import { performance } from 'perf_hooks';

class Game {
  constructor() {
    this.players = {};
    this.websockets = {};

    this.lobby();

    this.playTick = this.playTick.bind(this);
  }

  get isInProgress() {
    return !!this.simulation;
  }

  lobby() {
    console.log('Setting game to lobby');
    for(const websocket of Object.values(this.websockets)) {
      websocket.close();
    }
    this.websockets = {};
    if (this.simulation) {
      this.simulation.deinit();
      delete this.simulation;
    }
  }

  play() {
    const players = this.getPlayers();
    const hasMinPlayers = players.length > 0; // FIXME: 3
    const allReady = players.every(p => p.ready);

    if (!hasMinPlayers || !allReady) return;

    this.simulation = new Simulation({});

    this.simulation.addMiddleware('inputs', new InputsMiddleware());
    this.simulation.addMiddleware('ships', new ShipsMiddleware());
    this.simulation.addMiddleware('relay', new RelayMiddleware());

    this.simulation.init({
      players: this.players,
      game: this,
    });

    this.playTick();

    this.broadcast({ type: 'start' });
  }

  playTick() {
    this.simulation.step(performance.now());
    this.playTickHandle = setImmediate(this.playTick);
  }

  broadcast(message) {
    const serialized = JSON.stringify(message);
    let ws;
    for(ws of Object.values(this.websockets)) {
      ws.send(serialized);
    }
  }

  joinable() {
    return !this.isInProgress;
  }

  kick(id) {
    delete this.players[id];
    return true;
  }

  join(id) {
    this.players[id] = new Player();

    return this.players[id];
  }

  hasJoined(id) {
    return !!this.players[id];
  }

  ready(id, websocket) {
    if (this.websockets[id]) {
      console.log('ERR websocket already associated to player');
      // TODO: Maybe close websocket
      return false;
    }

    if (this.players[id]) {
      console.log('OK associating websocket with player', this.players[id]);
      this.websockets[id] = websocket;
      setTimeout(() => {
        this.play();
      }, 1);
      return true;
    }

    console.log('player with id does not exist', { id });


    return false;
  }

  idByWebsocket(websocket) {
    for(const id of Object.keys(this.websockets)) {
      if (this.websockets[id] === websocket) {
        return id;
      }
    }
    return null;
  }

  unready(id) {
    if (this.players[id]) {
      delete this.websockets[id];
      return true;
    }

    return false;
  }

  getPlayers() {
    return Object.keys(this.players)
      .map(id => ({
        ...this.players[id].toJson(),
        id,
        ready: !!this.websockets[id],
      }));
  }

}

export default Game;
