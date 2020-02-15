class Client {
  constructor(id) {
    this.id = id;
    this.lastSeen = null;
    this._hasWebsocket = false;

    this.touch();
  }

  touch() {
    this.lastSeen = Date.now();
  }

  setHasWebsocket(value) {
    this._hasWebsocket = !!value;
  }

  hasWebsocket() {
    return this._hasWebsocket;
  }


}

export default Client;
