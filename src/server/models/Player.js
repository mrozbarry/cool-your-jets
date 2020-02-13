class Player {
  constructor(clientId) {
    this.clientId = clientId;
    this.id = Math.random().toString(36).slice(2);

    this.name = `Player ${this.identifier}`;
    this.hue = Math.floor(Math.random() * 360);
    this.wins = 0;
    this.ready = false;
    this.inputs = {
      thrust: 0,
      turn: 0,
      fire: 0,
    };
  }

  get identifier() {
    return [this.clientId, this.id].join('.');
  }

  toPublicJson() {
    return {
      identifier: this.identifier,
      name: this.name,
      hue: this.hue,
      wins: this.wins,
      ready: this.ready,
    };
  }
}

export default Player;
