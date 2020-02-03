import WebsocketFactory from './lib/Websocket';
import Screen from '#/lib/Screen';
import render, { restorable } from '#/lib/canvas';

import simpleShip from '#/game/components/simpleShip';
import viewport from '#/game/components/viewport';
import centerOnPoint from '#/game/components/centerOnPoint';


const screen = new Screen(1920, 1080, document.querySelector('game-container'));
const viewportClipPath = new Path2D();
viewportClipPath.rect(0, 0, 1920, 1080);

const websocket = WebsocketFactory('ws://localhost:1234', {
  message: [
    (message) => {
      if (message.type !== 'ships') return;

      render(
        restorable(viewport({
          offset: [0, 0],
          pixelSize: [1920, 1080],
          virtualSize: [screen.width, screen.height],
          path: viewportClipPath,
        }, centerOnPoint({ focus: [0, 0], screen }, (
          message.ships.map(ship => simpleShip({ hue: 180 }, ship))
        )))),
        screen.canvas.context,
      );
    },
  ],
  disconnect: [
    () => {
      console.log('socket connection closed');
    },
  ],
});

const withAuth = (url, clientId) => fetch(url, {
  headers: {
    'X-CLIENT-ID': clientId,
  },
});


const getClientId = async () => {
  const response = await fetch('/api/client/new');
  const json = await response.json();
  return json.id;
};

const joinLobby = async (id) => {
  const response = await withAuth('/api/lobby/join', id);
  return response.json();
};

const viewLobby = async (id) => {
  const response = await withAuth('/api/lobby', id);
  return response.json();
};

const setupClient = async () => {
  const clientId = await getClientId();
  console.log('Got client id', clientId);
  console.log('My info', await joinLobby(clientId));
  console.log('Lobby (before ready):', await viewLobby(clientId));

  await websocket.open();
  await websocket.send({ type: 'ready', id: clientId });

  console.log('Lobby (after ready):', await viewLobby(clientId));

  let inputs = {
    thrust: 0,
    turn: 0,
    fire: 0,
  };

  const sendInputs = () => {
    const copy = { ...inputs };
    console.log('sendInputs', { ...copy });
    websocket.send({ type: 'input', inputs: copy });
  };

  window.addEventListener('keydown', ({ code, repeat }) => {
    if (repeat) return;
    switch (code) {
    case 'ArrowUp':
      inputs.thrust = 1;
      break;
    case 'ArrowLeft':
      inputs.turn = -1;
      break;
    case 'ArrowRight':
      inputs.turn = 1;
      break;
    case 'ArrowDown':
      inputs.fire = 1;
      break;
    default: return;
    }
    sendInputs();
  });

  window.addEventListener('keyup', ({ code }) => {
    switch (code) {
    case 'ArrowUp':
      inputs.thrust = 0;
      break;
    case 'ArrowLeft':
    case 'ArrowRight':
      inputs.turn = 0;
      break;
    case 'ArrowDown':
      inputs.fire = 0;
      break;

    case 'Escape':
      websocket.close();
      viewLobby(clientId)
        .then(lobby => console.log('Lobby (after disconnect):', lobby));
      break;

    default: return;
    }

    sendInputs();
  });
};

setupClient();

