import Player from './Player';

class Lobby {
  constructor() {
    this.websocketsByClientId = {};
    this.players = [];
  }

  connect(clientId, websocket) {
    if (this.websocketsByClientId[clientId]) {
      throw new Error('Client ID already has websocket connection');
    }

    this.websocketsByClientId[clientId] = websocket;

    return () => this.disconnect(clientId);
  }

  disconnect(clientId) {
    this.players = this.players.filter(p => p.clientId !== clientId);
    delete this.websocketsByClientId[clientId];
  }

  playerAdd(clientId) {
    const player = new Player(clientId);
    this.players.push(player);
    return player;
  }

  playerReady(identifier) {
    const index = this.players.findIndex(p => p.identifier === identifier);
    if (index === -1) return;
    this.players[index].ready = true;
  }

  playerUnready(identifier) {
    const index = this.players.findIndex(p => p.identifier === identifier);
    if (index === -1) return;
    this.players[index].ready = false;
  }

  playerRemove(identifier) {
    this.players = this.players.filter(p => p.identifier !== identifier);
  }
}

export default Lobby;
