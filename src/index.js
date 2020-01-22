import render from '#/lib/canvas';
import scene from '#/scenes/withFocus';
import Particles from '#/middleware/Particles';
import Projectiles from '#/middleware/Projectiles';
import KeyboardInput from '#/inputs/Keyboard';
import GamepadInput from '#/inputs/Gamepad';
import Game from '#/models/Game';
import Screen from '#/lib/Screen';

const main = () => {
  let running = true;

  const screen = new Screen(1024, 768);

  const game = new Game(1 / 60);
  const particles = game.addMiddleware('particles', new Particles(game.world));
  const projectiles = game.addMiddleware('projectiles', new Projectiles(game.world));

  const players = [
    ['WASD Boi', KeyboardInput.WASD()],
    ['Arrow Boi', KeyboardInput.Arrows()],
    ['TFGH Boi', new GamepadInput('first')],
    ['IJKL Boi', new GamepadInput('second')],
  ];

  for(const details of players) {
    game.addPlayer(...details);
  }

  const tick = (time) => {
    if (!running) return;

    game.step(time);

    render(
      scene(
        game.getShips(),
        particles.items,
        projectiles.items,
        screen,
      ),
      screen.canvas.context,
    );

    requestAnimationFrame(tick);
  };

  const schedule = () => {
    running = true;
    requestAnimationFrame(tick);
  };

  const unschedule = () => {
    running = false;
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
