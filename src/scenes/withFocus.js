import shipComponent from '#/components/ship';
import particleComponent from '#/components/particle';
import laserComponent from '#/components/laser';
import infoComponent from '#/components/info';
import viewportComponent from '#/components/viewport';
import singlePlayerScene from '#/scenes/singlePlayer';

export const defaultCollections = ({ ships, particles, projectiles }) => {
  const collections = [];
  if (particles) {
    collections.push({ collection: particles, fn: particleComponent });
  }

  if (projectiles) {
    collections.push({ collection: projectiles, fn: laserComponent });
  }

  if (ships) {
    collections.push({
      collection: ships,
      fn: (s) => [
        s.alive && infoComponent(s),
        shipComponent(s)
      ],
    });
  }

  return collections;
};

export default (ships, collections, screen) => {
  const size = [screen.width, screen.height];

  const portals = screen.divide(ships.length);

  return portals.map(({ x, y, w, h }, index) => {
    const ship = ships[index];

    return viewportComponent({
      offset: [x, y],
      pixelSize: [w, h],
      virtualSize: size,
    }, singlePlayerScene(ship, collections, screen));
  });
};

