class Game {
  constructor() {
    this.players = {};
    this.websockets = {};

    this.lobby();
  }

  lobby() {
    console.log('Setting game to lobby');
    for(const websocket of Object.values(this.websockets)) {
      websocket.close();
    }
    this.websockets = {};
    this.isInProgress = false;
  }

  play() {
    // Need at least 3 players
    // All players must be ready
    // All players must have a websocket connection
    this.isInProgress = true;
  }

  joinable() {
    return !this.isInProgress;
  }

  kick(id) {
    delete this.players[id];
    return true;
  }

  join(id) {
    const hue = Math.floor(Math.random() * 360);
    const player = {};

    this.players[id] = player;

    return player;
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
        ...this.players[id],
        id,
        ready: !!this.websockets[id],
      }));
  }

}

export default Game;
