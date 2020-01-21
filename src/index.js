import debounce from '#/lib/debounce';
import render from '#/lib/canvas';
import scene from '#/scenes/empty';
import tickManager from '#/lib/tick';
import Particles from '#/middleware/Particles';
import Projectiles from '#/middleware/Projectiles';
import KeyboardInput from '#/inputs/Keyboard';
import Game from '#/models/Game';

const initCanvas = (canvasElement) => {
  const ctx = canvasElement.getContext('2d');

  const resize = () => {
    canvasElement.width = window.innerWidth; // * window.devicePixelRatio;
    canvasElement.height = window.innerHeight; // * window.devicePixelRatio;
  };

  const resizeDebounce = debounce(resize, 250);

  window.addEventListener('resize', resizeDebounce);
  resize();

  return {
    detach: () => {
      window.removeEventListener('resize', resizeDebounce);
    },
    ctx,
  };
};

const main = () => {
  const { ctx } = initCanvas(document.querySelector('canvas'));
  let running = true;
  let cancelFrame = null;


  const game = new Game(1 / 60);
  const particles = game.addMiddleware('particles', new Particles(game.world));
  const projectiles = game.addMiddleware('projectiles', new Projectiles(game.world));

  game.addPlayer('WASD Boi', KeyboardInput.WASD());
  game.addPlayer('Arrow Boi', KeyboardInput.Arrows());

  const tick = (time) => {
    game.step(time);

    render(
      scene(
        game.getShips(),
        particles.items,
        projectiles.items,
        ctx,
      ),
      ctx,
    );

    schedule();
  };

  const schedule = () => {
    cancelFrame = tickManager(tick, 1 / 60);
  };

  const unschedule = () => {
    return cancelFrame && cancelFrame();
  };

  const onFocusChange = () => {
    running = document.hasFocus();
    return running
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
