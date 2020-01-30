import page from 'page';
import ui from './ui';
import game from './game';
import postGame from './post-game';

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

page('/', () => {
  console.log('entering menu');

  uiCancelFn = createUINode(ui);
  // Show UI
  // Start menu music
});

page.exit('/', (_context, next) => {
  console.log('leaving menu');
  uiCancelFn();
  // Hide UI
  // Stop menu music
  next();
});

page('/play/:config', (context) => {
  console.log('entering game', context);
  const config = JSON.parse(atob(context.params.config));
  console.log(config);
  gameCancelFn = game(config, gameContainer);
  // Start game music
  // Start game tick
});

page.exit('/play/:config', (_context, next) => {
  console.log('exiting game');
  // Stop game music
  // Stop game tick
  gameCancelFn();

  next();
});

page('/play/:config/winner/:id', (context) => {
  console.log('entering post game (winner)', context);
  const config = JSON.parse(atob(context.params.config));
  uiCancelFn = createUINode((node) => postGame(config, context.params.id, node));
  // Start game music
  // Start game tick
});

page.exit('/play/:config/winner/:id', (_context, next) => {
  console.log('exiting post game (winner)');
  uiCancelFn();
  // Stop game music
  // Stop game tick

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
  // Stop game music
  // Stop game tick

  next();
});

page('*', (context) => {
  console.log('page not found', context);
});

page();
