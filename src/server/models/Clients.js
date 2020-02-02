class Clients {
  constructor() {
    this.clients = {};
    this.blacklist = {};
  }

  add() {
    this._pruneOldClients();

    return this._add();
  }

  has(id) {
    this._pruneOldClients();
    return !!this.clients[id];
  }

  touch(id) {
    this._pruneOldClients();

    if (this.clients[id]) {
      this.clients[id] = Date.now();
      return true;
    }
    return false;
  }

  _add() {
    const id = Math.random().toString(36).slice(2);
    if (this.has(id)) return this._add();

    this.clients[id] = Date.now();

    return id;
  }

  _pruneOldClients() {
    const fifteenMinutesAgo = Date.now() - (15 * 60 * 1000);
    for(const id of Object.keys(this.clients)) {
      if (this.clients[id] >= fifteenMinutesAgo) continue;

      delete this.clients[id];
    }
  }

}

export default Clients;
