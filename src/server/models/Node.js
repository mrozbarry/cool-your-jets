import Connection from './Connection';
import Player from './Player';

class Node {
  constructor(clients) {
    this.clients = clients;
    this.connections = [];
    this.players = [];
    this.locked = false;
  }

  destroy() {
    let connection = this.connections[0];
    while(connection) {
      this.disconnectByConnection(connection);
      connection = this.connections[0];
    }

    this.connections = [];
    this.players = [];
    this.locked = false;
  }

  connect(websocket) {
    // TODO: Decide how to handle new websocket
    // connections when the game is in progress
    if (this.locked) {
      return websocket.close();
    }

    this.connections.push(
      new Connection(this, websocket),
    );

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
    }

    return (void 0);
  }

  broadcast(message) {
    const serialized = JSON.stringify(message);
    console.log('Node#broadcast', { message, serialized });
    let connection;
    for(connection of this.connections) {
      connection.websocket.send(serialized);
    }
  }

  setLocked(value) {
    this.locked = !!value;
  }

  addPlayer(clientId) {
    const player = new Player(clientId);
    this.players.push(player);
    return player;
  }

  removePlayer(clientId, playerId) {
    const id = `${clientId}.${playerId}`;
    const index = this.players
      .findIndex(p => p.identifier === id);

    if (index === -1) return false;

    this.players.splice(index, 1);

    return true;
  }

  removePlayersFromClient(clientId, indexOffset = 0) {
    if (!clientId) return (void 0);

    let index = 0;

    for(index in this.players.slice(indexOffset)) {
      const player = this.players[indexOffset + index];
      if (player.clientId !== clientId) continue;

      this.players.splice(index, 1);

      return this.removePlayersFromClient(clientId, index);
    }

    return (void 0);
  }
}

export default Node;
