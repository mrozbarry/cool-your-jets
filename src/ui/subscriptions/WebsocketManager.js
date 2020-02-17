const WebsocketManagerFX = (dispatch, { websocket, messageActions }) => {
  let cancel = () => {};

  const sendMessage = ({ detail }) => {
    console.log('websocketManager.send', detail);
    websocket.send(detail);
  };

  websocket.on('message', (event) => {
    const data = JSON.parse(event.data);
    const action = messageActions[data.type];
    if (!action) {
      console.log('got a message', data);
      return;
    }
    dispatch(action, data);
  })
    .then((fn) => { cancel = fn; });

  document.addEventListener('cyj:ws:send', sendMessage);

  return () => {
    document.removeEventListener('cyj:ws:send', sendMessage);
    cancel();
  };
};
export const WebsocketManager = props => [WebsocketManagerFX, props];

