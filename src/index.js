import page from 'page';
import ui from './ui';
import game from './game';
import networkGame from './network-game';
import postGame from './post-game';
import AudioControl from './lib/audio';
import SocketFactory from './lib/Websocket';

const run = () => {
  const ws = SocketFactory(`ws://${location.host}`);
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
    Promise.all([
      AudioControl.waitForLoad(),
      ws.open(),
    ])
      .then(() => next());
  });

  page('/', () => {
    console.log('entering menu');

    AudioControl.playLoop('menu');
    uiCancelFn = createUINode((node) => ui(node, ws));
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
    AudioControl.stopLoops();
    gameCancelFn();

    next();
  });

  page('/play/network/:clientId/:config', (context) => {
    console.log('entering game', context);
    const config = JSON.parse(atob(context.params.config));
    console.log(config);
    AudioControl.playLoop('game');
    gameCancelFn = networkGame(config, gameContainer);
    // gameCancelFn = game(config, gameContainer);
  });

  page.exit('/play/network/:clientId/:config', (_context, next) => {
    console.log('exiting game');
    // Stop game music
    // Stop game tick
    AudioControl.stopLoops();
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

run();
