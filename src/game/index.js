import render, { restorable } from '#/lib/canvas';
import scene from '#/game/scenes/withFocus';
import Particles from '#/game/middleware/Particles';
import Projectiles from '#/game/middleware/Projectiles';
import SumoGamemode from '#/game/middleware/SumoGamemode';
import Game from '#/game/models/Game';
import Screen from '#/lib/Screen';
import pipe from '#/lib/pipe';
import page from 'page';

export default (playerConfigs, container) => {
  console.warn('game/index', { playerConfigs, container });
  const screen = new Screen(1920, 1080, container);

  const game = new Game(1 / 30);

  const playersToConfig = () => pipe([
    players => players.map(p => ({
      id: p.id,
      name: p.name,
      wins: p.wins,
      color: p.color,
      controls: p.controls,
    })),
    JSON.stringify,
    btoa,
  ], game.players);

  game.onEndWithWinner = (id) => {
    const config = playersToConfig();
    page.show(`/play/${config}/winner/${id}`);
  };

  game.onEndWithoutWinner = () => {
    const config = playersToConfig();
    page.show(`/play/${config}/no-winner`);
  };

  game.addMiddleware('particles', new Particles(game.world));
  game.addMiddleware('projectiles', new Projectiles(game.world));
  game.addMiddleware('gamemode', new SumoGamemode(500, 60));

  for(const details of playerConfigs) {
    game.addPlayer(details);
  }

  game.init();

  let rafHandle = null;

  const tick = (time) => {
    game.step(time);

    render(
      restorable(scene(
        game,
        screen,
      )),
      screen.canvas.context,
    );

    rafHandle = requestAnimationFrame(tick);
  };

  const schedule = () => {
    rafHandle = requestAnimationFrame(tick);
  };

  const unschedule = () => {
    cancelAnimationFrame(rafHandle);
    rafHandle = null;
  };

  schedule();

  return () => {
    unschedule();
    game.deinit();
    screen.detach();
  };
};
