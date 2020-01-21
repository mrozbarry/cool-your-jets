import debounce from '#/lib/debounce';
import render from '#/lib/canvas';
import scene from '#/scenes/withFocus';
import tickManager from '#/lib/tick';
import Particles from '#/middleware/Particles';
import Projectiles from '#/middleware/Projectiles'; import KeyboardInput from '#/inputs/Keyboard';
import Game from '#/models/Game';
import Screen from '#/lib/Screen';

const main = () => {
  let running = true;
  let cancelFrame = null;


  const screens = new Screen(1024, 768);

  const game = new Game(1 / 60);
  const particles = game.addMiddleware('particles', new Particles(game.world));
  const projectiles = game.addMiddleware('projectiles', new Projectiles(game.world));

  const players = [
    ['WASD Boi', KeyboardInput.WASD()],
    ['Arrow Boi', KeyboardInput.Arrows()],
    ['TFGH Boi', new KeyboardInput({
      KeyT: 'up',
      KeyF: 'left',
      KeyG: 'down',
      KeyH: 'right',
    })],
    ['IJKL Boi', new KeyboardInput({
      KeyI: 'up',
      KeyJ: 'left',
      KeyK: 'down',
      KeyL: 'right',
    })],
  ];

  for(const details of players) {
    const canvas = screens.add();
    const info = game.addPlayer(...details);
    canvas.ship = info.ship;
  }

  const tick = (time) => {
    game.step(time);

    for(const canvas of screens.canvases) {
      render(
        scene(
          canvas.ship,
          game.getShips(),
          particles.items,
          projectiles.items,
          canvas,
        ),
        canvas.context,
      );
    }

    requestAnimationFrame(tick);
    // schedule();
  };

  const schedule = () => {
    running = true;
    requestAnimationFrame(tick);
    // cancelFrame = tickManager(tick, 1 / 60);
  };

  const unschedule = () => {
    running = false;
    // return cancelFrame && cancelFrame();
  };

  const onFocusChange = () => {
    return document.hasFocus()
      ? schedule()
      : unschedule();
  };

  const onFocus = () => {
    onFocusChange();
    game.resetPreviousTime();
  };

  window.addEventListener('blur', onFocusChange);
  window.addEventListener('focus', onFocus);

  schedule();

  return () => {
    window.removeEventListener('blur');
    window.removeEventListener('focus');
    window.removeEventListener('onKeyDown');
    window.removeEventListener('onKeyUp');
    game.world.clear();
    running = false;
  };
};

let cancel = main();

if (module.hot) {
  module.hot.dispose(() => cancel());
}
