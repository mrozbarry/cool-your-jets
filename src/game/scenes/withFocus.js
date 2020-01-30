import viewportComponent from '#/game/components/viewport';
import singlePlayerScene from '#/game/scenes/singlePlayer';

export default (game, screen) => {
  const size = [screen.width, screen.height];
  const portals = screen.divide(1);
  const { w, h } = portals[0];
  const path = new Path2D();
  path.rect(0, 0, w, h);


  return portals.map(({ x, y }) => {
    return viewportComponent({
      offset: [x, y],
      pixelSize: [w, h],
      virtualSize: size,
      path,
    }, singlePlayerScene([0, 0], game, screen));
  });
};

