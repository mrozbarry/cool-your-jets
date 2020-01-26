import render, { restorable } from '#/lib/canvas';
import scene, { defaultCollections } from '#/game/scenes/withFocus';
import Particles from '#/game/middleware/Particles';
import Projectiles from '#/game/middleware/Projectiles';
import SumoGamemode from '#/game/middleware/SumoGamemode';
//import FreeGamemode from '#/game/middleware/FreeGamemode';
import KeyboardInput from '#/game/inputs/Keyboard';
import GamepadInput from '#/game/inputs/Gamepad';
import Game from '#/game/models/Game';
import Screen from '#/lib/Screen';

export default (playerConfigs) => {
  let running = true;

  const screen = new Screen(1920, 1080);

  const game = new Game(1 / 30);
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

  let rafHandle = null;

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

    rafHandle = requestAnimationFrame(tick);
  };

  const schedule = () => {
    running = true;
    rafHandle = requestAnimationFrame(tick);
  };

  const unschedule = () => {
    cancelAnimationFrame(rafHandle);
    running = false;
    rafHandle = null;
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
    unschedule();
    window.removeEventListener('blur');
    window.removeEventListener('focus');
    game.world.clear();
    game.deinit();
  };
};
