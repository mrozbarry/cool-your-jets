import page from 'page';
import ui from './ui';
import game from './game';
import postGame from './post-game';
import AudioControl from './lib/audio';
import WebsocketFactory from './lib/Websocket';

const websocket = WebsocketFactory('ws://localhost:1234', {
  message: [
    (message) => {
      console.log('server sent', message);
    },
  ],
  disconnect: [
    () => {
      console.log('socket connection closed');
    },
  ],
});

const getClientId = async () => {
  const response = await fetch('/api/client/new');
  console.log(response);
  const json = await response.json();
  return json.id;
};

const joinLobby = async (id) => {
  const response = await fetch(`/api/client/${id}/join`);
  return response.json();
};

const viewLobby = async (id) => {
  const response = await fetch(`/api/client/${id}/lobby`);
  return response.json();
};

const setupClient = async () => {
  const clientId = await getClientId();
  console.log('Got client id', clientId);
  const playerInformation = await joinLobby(clientId);
  console.log('Lobby (before ready):', await viewLobby(clientId));

  await websocket.open();
  await websocket.send({ type: 'ready', id: clientId });

  console.log('Lobby (after ready):', await viewLobby(clientId));

  await websocket.close();

  console.log('Lobby (after disconnect):', await viewLobby(clientId));
};

setupClient();

const run = () => {
  const uiContainer = document.querySelector('ui-container');
  const gameContainer = document.querySelector('game-container');

  let uiCancelFn = () => {};
  let gameCancelFn = () => {};

  const createUINode = (fn) => {
    const node = document.createElement('div');
    uiContainer.appendChild(node);
    fn(node);

    return () => {
      for(const child of uiContainer.children) {
        uiContainer.removeChild(child);
      }
    };
  };

  page('*', (_, next) => {
    AudioControl.waitForLoad().then(() => next());
  });

  page('/', () => {
    console.log('entering menu');

    AudioControl.playLoop('menu');
    uiCancelFn = createUINode(ui);
  });

  page.exit('/', (_context, next) => {
    console.log('leaving menu');
    uiCancelFn();
    AudioControl.stopLoops();
    next();
  });

  page('/play/:config', (context) => {
    console.log('entering game', context);
    const config = JSON.parse(atob(context.params.config));
    console.log(config);
    AudioControl.playLoop('game');
    gameCancelFn = game(config, gameContainer);
  });

  page.exit('/play/:config', (_context, next) => {
    console.log('exiting game');
    // Stop game music
    // Stop game tick
    AudioControl.stopAudio('game');
    gameCancelFn();

    next();
  });

  page('/play/:config/winner/:id', (context) => {
    console.log('entering post game (winner)', context);
    const config = JSON.parse(atob(context.params.config));
    AudioControl.playSfx('game-winner-start');
    AudioControl.playLoop('game-winner');
    uiCancelFn = createUINode((node) => postGame(config, context.params.id, node));
    // Start game music
    // Start game tick
  });

  page.exit('/play/:config/winner/:id', (_context, next) => {
    console.log('exiting post game (winner)');
    uiCancelFn();
    AudioControl.stopLoops();

    next();
  });

  page('/play/:config/no-winner', (context) => {
    console.log('entering post game (no winner)', context);
    const config = JSON.parse(atob(context.params.config));
    uiCancelFn = createUINode((node) => postGame(config, null, node));
    // Start game music
    // Start game tick
  });

  page.exit('/play/:config/winner/:id', (_context, next) => {
    console.log('exiting post game (no winner)');
    uiCancelFn();
    AudioControl.stopLoops();

    next();
  });

  page('*', (context) => {
    console.log('page not found', context);
  });

  page();
};

// run();
