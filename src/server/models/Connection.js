import { middleware as pipe } from '../../lib/pipe';

class Connection {
  constructor(game, websocket) {
    this.websocket = websocket;
    this.game = game;
    this.clientId = null;

    this.handleMessage = this.handleMessage.bind(this);
    this.waitForClientIdAssociation = this.waitForClientIdAssociation.bind(this);

    this.websocket.addEventListener('message', this.handleMessage);
  }

  close() {
    this.websocket.close();
  }

  handleMessage(event) {
    pipe([
      this.waitForClientIdAssociation,
    ], event.data);
  }

  waitForClientIdAssociation(message, next) {
    if (this.clientId) return next(message);

    const clientId = message.clientId;

    const wrongMessage = message.type !== 'clientId:set';
    const clientIdAlreadyInUse = clientId && !!this.game.connections.find(c => c.clientId === clientId);

    if (wrongMessage || clientIdAlreadyInUse) {
      return this.websocket.send({
        type: 'error',
        message: 'You must send {type:"clientId:set",clientId:"..."} before with your unique clientId from /api/client/create',
      });
    }

    return this.websocket.send({
      type: 'clientId:ok',
    });
  }

  handleGameMessage(message, next) {
    console.log
  }
}

export default Connection;
