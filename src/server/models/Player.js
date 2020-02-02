class Player {
  constructor() {
    this.hue = Math.floor(Math.random() * 360);
    this.wins = 0;
    this.inputs = {
      thrust: 0,
      turn: 0,
      fire: 0,
    };
  }

  toJson() {
    return {
      hue: this.hue,
      wins: this.wins,
    };
  }
}

export default Player;
