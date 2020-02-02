import Base from './Base';

class Inputs extends Base {
  init(_simulation, data) {
    this.game = data.game;

    const ids = Object.keys(this.game.websockets);

    this.listenerCancelFns = ids.map(id => (
      this.listenToWebsocket(id, this.game.websockets[id])
    ));
  }

  deinit() {
    for(const fn of this.listenerCancelFns) {
      fn();
    }

    this.game = null;
    this.listenerCancelFns = null;
  }

  listenToWebsocket(id, websocket) {
    const listener = (event) => {
      const message = JSON.parse(event.data);
      if (message.type !== 'input') return;

      this.game.players[id].inputs = {
        ...this.game.players[id].inputs,
        ...message.inputs,
      };

      console.log('player', id, 'input', this.game.players[id].inputs);
    };

    websocket.addEventListener('message', listener);

    return () => {
      websocket.removeEventListener('message', listener);
    };
  }
}

export default Inputs;
