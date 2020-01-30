import { rectFill, rectStroke, properties, translate, restorable } from '#/lib/canvas';

import infoComponent from '#/game/components/info';
import shipComponent from '#/game/components/ship';

export default (focus, game, screen) => {
  const size = [screen.width, screen.height];

  const centerOnShip = [
    (size[0] / 2) - focus[0],
    (size[1] / 2) - focus[1],
  ];

  const particles = game.getMiddleware('particles');
  const projectiles = game.getMiddleware('projectiles');
  const gamemode = game.getMiddleware('gamemode');

  return [
    properties({
      strokeStyle: '#444',
      fillStyle: '#010101',
    }, [
      rectFill([0, 0], size),
      rectStroke([0, 0], size),
    ]),

    restorable(translate(centerOnShip, [
      particles.render(game),
      projectiles.render(game),
      gamemode.render(game),
      game.players.map(player => [
        player.alive && infoComponent(player.ship),
        shipComponent(player),
      ]),
    ])),
  ];
};

