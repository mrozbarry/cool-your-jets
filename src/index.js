import page from 'page';
import ui from './ui';
import game from './game';

let gameCancelFn = () => {};

page('/', () => {
  console.log('entering menu');
  ui(document.querySelector('#app'));
  // Show UI
  // Start menu music
});

page.exit('/', () => {
  console.log('leaving menu');
  // Hide UI
  // Stop menu music
});

page('/play/:config', (context) => {
  console.log('entering game');
  const config = JSON.parse(atob(context.params.config));
  console.log(config);
  gameCancelFn = game(config);
  // Start game music
  // Start game tick
});

page.exit('/play/:config', () => {
  console.log('exiting game');
  // Stop game music
  // Stop game tick
  gameCancelFn();
});

page('/play/:config/results', (context) => {
  // Start winner music
  // Show scoreboard
});

page.exit('/play/:config/results', () => {
  // Stop winner music
  // Hide scoreboard
});


page();
