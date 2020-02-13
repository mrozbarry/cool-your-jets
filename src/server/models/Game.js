import Simulation from './Simulation';
import Player from './Player';
import InputsMiddleware from '../game/Inputs';
import ShipsMiddleware from '../game/Ships';
import RelayMiddleware from '../game/Relay';
import Connection from './Connection';
import { performance } from 'perf_hooks';

class Game {
  constructor(lobby) {
    this.lobby = lobby;
    this.connections = [];

    this.openLobby();

    this.readyToPlayHandle = null;

    this.playTick = this.playTick.bind(this);
  }

  get isInProgress() {
    return !!this.simulation;
  }

  openLobby() {
    console.log('Setting game to lobby');

    for(const connection of this.connections) {
      connection.close();
    }
    this.connections = [];
    if (this.simulation) {
      this.simulation.deinit();
      delete this.simulation;
    }
  }

  openGame() {
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

  connect(websocket) {
    this.connections.push(new Connection(this, websocket));
    return true;
  }

  disconnect(id) {
    for(const key of Object.keys(this.players)) {
      const clientId = key.split('.')[0];
      if (clientId === id) {
        delete this.players[key];
      }
    }
    const connectionIndex = this.connections.findIndex(c => c.clientId === id);
    if (connectionIndex >= 0) {
      const [connection] = this.connections.splice(connectionIndex, 1);
      connection.close();
    }
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

  join([id, index]) {
    const key = `${id}.${index}`;
    this.players[key] = new Player();

    return this.players[key];
  }

  hasJoined([id, index]) {
    const key = `${id}.${index}`;
    return !!this.players[key];
  }

  getReadyToPlay() {
    this.cancelCountdown();
    const players = this.getPlayers();
    const hasMinPlayers = players.length > 0; // FIXME: 3
    const allReady = players.every(p => p.ready);

    if (!hasMinPlayers || !allReady) return;

    this.broadcastCountdown();
  }

  doCountdown(seconds) {
    this.broadcase({ type: 'countdown', seconds });

    if (seconds === 0) return this.play();

    this.readyToPlayHandle = setTimeout(() => {
      this.doCountdown(seconds - 1);
    }, 1000);
  }

  cancelCountdown() {
    this.broadcase({ type: 'countdown:cancel' });
    clearTimeout(this.readyToPlayHandle);
  }

  ready([id, index]) {
    const key = `${id}.${index}`;

    if (!this.players[key]) {
      console.log('player with id does not exist', { id });
      return false;
    }

    this.players[key].ready = true;

    return true;
  }

  unready(id) {
    if (this.players[id]) {
      this.cancelCountdown();
      delete this.websockets[id];
      return true;
    }

    return false;
  }

  getPlayers() {
    return Object.keys(this.players)
      .map(key => this.players[key].toPublicJson());
  }

}

export default Game;
