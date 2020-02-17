import * as ships from '../ships/index';

class Player {
  constructor(clientId, shipModel) {
    this.clientId = clientId;
    this.id = Math.random().toString(36).slice(2);

    this.name = `Player ${this.identifier}`;
    this.hue = Math.floor(Math.random() * 360);
    this.shipModel = shipModel;
    this.inputs = {
      thrust: 0,
      turn: 0,
      fire: 0,
    };
  }

  update(payload) {
    if (!payload) return false;

    this.name = payload.name || this.name;
    this.hue = 'hue' in payload ? Number(payload.hue) : this.hue;
    if (ships[payload.shipModel]) {
      this.shipModel = payload.shipModel;
    }
    return true;
  }

  get identifier() {
    return [this.clientId, this.id].join('.');
  }

  toPublicJson() {
    return {
      identifier: this.identifier,
      name: this.name,
      hue: this.hue,
      shipModel: this.shipModel,
    };
  }
}

export default Player;
