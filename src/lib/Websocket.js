import pipe from '#/lib/pipe';

const WebsocketFactory = (address, handlers = {}) => {
  let websocket = null;

  const callbacks = {
    connect: [].concat(handlers.connect || []),
    message: [].concat(handlers.message || []),
    disconnect: [].concat(handlers.disconnect || []),
  };

  const listenForNextMessage = () => {
    websocket.addEventListener('message', (event) => {
      pipe(
        callbacks.message.map(pipe.tap),
        JSON.parse(event.data),
      );

      listenForNextMessage();
    }, { once: true });
  };

  const open = () => {
    return new Promise((resolve, reject) => {
      if (websocket) {
        return reject('websocket already active');
      }

      websocket = new WebSocket(address);

      websocket.addEventListener('open', () => {
        pipe(
          callbacks.connect.map(pipe.tap),
          websocket,
        );

        listenForNextMessage();

        return resolve(websocket);
      }, { once: true });
    });
  };

  const close = () => {
    return new Promise((resolve, reject) => {
      websocket.addEventListener('close', () => {
        websocket = null;
      }, { once: true });
      websocket.close();
    });
  };

  const send = (payload) => {
    websocket.send(JSON.stringify(payload));
  };

  return {
    open: () => websocket
      ? Promise.resolve(websocket)
      : open(),

    close: () => websocket
      ? close()
      : Promise.resolve(),

    send: (payload) => open()
      .catch(() => {})
      .then(() => send(payload)),
  };
};

export default WebsocketFactory;
