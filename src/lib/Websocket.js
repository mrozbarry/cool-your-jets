const WebsocketFactory = (address) => {
  let websocket = null;

  const open = () => {
    return new Promise((resolve, reject) => {
      if (websocket) {
        return reject('websocket already active');
      }

      websocket = new WebSocket(address);

      websocket.addEventListener('open', () => {

        return resolve(websocket);
      }, { once: true });
    });
  };

  const on = (eventName, fn) => {
    websocket.addEventListener(eventName, fn);

    return () => {
      if (!websocket) return;

      websocket.removeEventListener(eventName, fn);
    };
  };

  const close = () => {
    return new Promise((resolve, reject) => {
      if (!websocket) {
        return reject();
      }
      websocket.close();
      resolve();
    });
  };

  const send = (payload) => {
    const string = JSON.stringify(payload);
    websocket.send(string);
  };

  return {
    open: () => websocket
      ? Promise.resolve(websocket)
      : open(),

    close: () => websocket
      ? close()
      : Promise.resolve(),

    on: (eventName, fn) => open()
      .catch(() => {})
      .then(() => on(eventName, fn)),

    send: (payload) => open()
      .catch(() => {})
      .then(() => send(payload)),
  };
};

export default WebsocketFactory;
