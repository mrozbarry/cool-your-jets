import { middleware as pipe } from '../../lib/pipe';

class Connection {
  constructor(node, websocket) {
    this.node = node;
    this.websocket = websocket;
    this.clientId = null;

    this.handleMessage = this.handleMessage.bind(this);
    this.waitForClientIdAssociation = this.waitForClientIdAssociation.bind(this);
    this.handleGameMessage = this.handleGameMessage.bind(this);

    this.handleFallthrough = this.handleFallthrough.bind(this);

    this.websocket.addEventListener('message', this.handleMessage);
  }

  close() {
    this.websocket.close();
    this.clientId = null;
    this.websocket = null;
    this.node = null;
  }

  handleMessage(event) {
    console.log('Connection#handleMessage', typeof event.data, event.data);
    pipe([
      this.waitForClientIdAssociation,
      this.handleGameMessage,

      this.handleFallthrough,
    ], JSON.parse(event.data));
  }

  waitForClientIdAssociation(message, next) {
    if (this.clientId) return next(message);

    const client = this.node.clients.get(message.clientId);

    const wrongMessage = message.type !== 'clientId:set';
    const clientIdAlreadyInUse = client && client.hasWebsocket();

    if (wrongMessage || clientIdAlreadyInUse) {
      return this.websocket.send(JSON.stringify({
        type: 'error',
        message: 'You must send {type:"clientId:set",clientId:"..."} before with your unique clientId from /api/client/create',
      }));
    }

    console.log('>> Associated clientid to websocket');
    client.setHasWebsocket(true);
    this.clientId = message.clientId;

    return this.websocket.send(JSON.stringify({
      type: 'clientId:ok',
    }));
  }

  handleGameMessage(message, next) {
    console.log('Connection#handleGameMessage', message);
    next(message);
  }

  handleFallthrough(message) {
    return this.websocket.send(JSON.stringify({
      type: 'error',
      message: 'The message you sent is unexpected', yourMessage: message,
    }));
  }
}

export default Connection;
