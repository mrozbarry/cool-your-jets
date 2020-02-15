import { Server as WebSocketServer } from 'ws';

export default (httpServer, node) => {
  const socketServer = new WebSocketServer({ server: httpServer });

  socketServer.on('connection', (socket) => {
    node.connect(socket);

    socket.on('close', () => {
      node.disconnect(socket);
    });
  });
};
