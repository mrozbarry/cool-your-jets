import render, { restorable } from '#/lib/canvas';
import scene, { defaultCollections } from '#/scenes/withFocus';
import Particles from '#/middleware/Particles';
import Projectiles from '#/middleware/Projectiles';
import SumoGamemode from '#/middleware/SumoGamemode';
//import FreeGamemode from '#/middleware/FreeGamemode';
import KeyboardInput from '#/inputs/Keyboard';
import GamepadInput from '#/inputs/Gamepad';
import Game from '#/models/Game';
import Screen from '#/lib/Screen';

export const main = (playerConfigs) => {
  let running = true;

  const screen = new Screen(1024, 768);

  const game = new Game(1 / 60);
  const particles = game.addMiddleware('particles', new Particles(game.world));
  const projectiles = game.addMiddleware('projectiles', new Projectiles(game.world));
  const gameMode = game.addMiddleware('gamemode', new SumoGamemode(500, 60));
  //const gameMode = game.addMiddleware('gamemode', new FreeGamemode());

  const keyboardInputMap = {
    wasd: KeyboardInput.WASD(),
    arrows: KeyboardInput.Arrows(),
  };

  const players = playerConfigs.map((config) => {
    const [inputType, subType] = config.controls.split('|');
    switch (inputType) {
    case 'keyboard': return [config.name, keyboardInputMap[subType]];
    case 'gamepad': return [config.name, new GamepadInput(Number(subType))];
    }
    return null;
  }).filter(p => p);

  for(const details of players) {
    game.addPlayer(...details);
  }

  game.init();

  const tick = (time) => {
    if (!running) return;

    const ships = game.getShips();

    const collections = gameMode.renderCollection(
      defaultCollections({
        particles: particles.items,
        projectiles: projectiles.items,
        ships,
      }),
    );

    game.step(time);

    render(
      restorable(scene(
        game.getShips(),
        collections,
        screen,
      )),
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
