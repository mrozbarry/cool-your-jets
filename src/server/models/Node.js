import Connection from './Connection';
import Player from './Player';
import ships from '../ships/index';

class Node {
  constructor(clients) {
    this.clients = clients;
    this.connections = [];
    this.players = [];
    this.locked = false;
    this.callbacks = {};
  }

  destroy() {
    let connection = this.connections[0];
    while(connection) {
      this.disconnectByConnection(connection);
      connection = this.connections[0];
    }

    this.connections = [];
    this.players = [];
    this.callbacks = {};
    this.locked = false;
  }

  on(type, fn) {
    this.callbacks[type] = this.callbacks[type] || [];
    this.callbacks[type].push(fn);

    return () => {
      const index = this.callbacks[type].findIndex(f => f === fn);
      this.callbacks[type].splice(index, 1);
    };
  }

  emit(type, ...params) {
    if (!this.callbacks[type] || this.callbacks[type].length === 0) return;
    let fn;
    for(fn of this.callbacks[type]) {
      fn(...params, this);
    }
  }

  connect(websocket) {
    // TODO: Decide how to handle new websocket
    // connections when the game is in progress
    if (this.locked) {
      return websocket.close();
    }

    const connection = new Connection(this, websocket);
    this.connections.push(connection);

    this.emit('connection:add', connection);

    return (void 0);
  }

  disconnect(websocket) {
    const connection = this.connections
      .find(c => c.websocket === websocket);

    return this.disconnectByConnection(connection);
  }

  disconnectByConnection(connection) {
    if (!connection) return (void 0);

    const index = this.connections.indexOf(connection);

    if (index >= 0) {
      this.connections.splice(index, 1);
      this.removePlayersFromClient(connection.clientId);
      connection.close();
      this.emit('connection:remove', connection);
      this.broadcast({ type: 'lobby:update' });
    }

    return (void 0);
  }

  broadcast(message) {
    const serialized = JSON.stringify(message);
    let connection;
    for(connection of this.connections) {
      connection.websocket.send(serialized);
    }
  }

  setLocked(value) {
    this.locked = !!value;
  }

  addPlayer(clientId) {
    const player = new Player(clientId, ships[0].name);
    this.players.push(player);
    this.emit('player:add', player);
    return player;
  }

  removePlayer(clientId, playerId) {
    const id = `${clientId}.${playerId}`;
    const index = this.players
      .findIndex(p => p.identifier === id);

    if (index === -1) return false;

    const player = this.players.splice(index, 1);
    this.emit('player:remove', player);

    return true;
  }

  getPlayer(clientId, playerId) {
    const identifier = `${clientId}.${playerId}`;
    return this.players.find(p => p.identifier === identifier);
  }

  removePlayersFromClient(clientId, indexOffset = 0) {
    if (!clientId) return (void 0);

    for(let index = indexOffset; index < this.players.length; index += 1) {
      const player = this.players[indexOffset + index];
      if (player.clientId !== clientId) continue;

      this.removePlayer(player.clientId, player.id);

      return this.removePlayersFromClient(clientId, index);
    }

    return (void 0);
  }
}

export default Node;
