class Client {
  constructor(id) {
    this.id = id;
    this.lastSeen = null;

    this.touch();
  }

  touch() {
    this.lastSeen = Date.now();
  }
}

export default Client;
