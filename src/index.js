import Control, { KEYMAPS } from '#/lib/controls';
import debounce from '#/lib/debounce';
import render from '#/lib/canvas';
import scene from '#/scenes/empty';
import * as simulation from '#/lib/simulation';
import * as projectileEngine from '#/projectileEngine';
import * as shipObject from '#/models/ship';
import tickManager from '#/lib/tick';
import Particles from '#/middleware/Particles';
import Projectiles from '#/middleware/Projectiles';

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

const makeShip = (name, position, power = 'ssslllttt') => {
  return shipObject.shields(
    1,
    shipObject.distributePower(
      power,
      shipObject.make(
        name,
        position,
      ),
    ),
  );
};

const main = () => {
  const { ctx } = initCanvas(document.querySelector('canvas'));
  let sim = simulation.make();

  let running = true;

  let particles = new Particles(sim.world);
  let projectiles = new Projectiles(sim.world);

  const control = Control({ up: 0, left: 0, down: 0, right: 0 });
  control.keyboard('wasd', KEYMAPS.wasd);
  control.keyboard('tfgh', KEYMAPS.tfgh);
  control.keyboard('ijkl', KEYMAPS.ijkl);
  control.keyboard('arrows', KEYMAPS.arrows);


  let cancelFrame = null;
  let lastTime = null;

  const ships = {
    wasd: makeShip('wasd', [100, 100], 'llllllltt'),
    tfgh: makeShip('tfgh', [700, 100], 'ssllllttt'),
    ijkl: makeShip('ijkl', [100, 500], 'ssslltttt'),
    arrows: makeShip('arrows', [700, 500], 'slllltttt'),
  };

  Object.values(ships).forEach((ship) => {
    sim.world.addBody(ship.body);
  });

  const players = Object.keys(ships);

  const addThrustParticles = (controls) => {
    for(const key of players) {
      if (!controls[key]) continue;

      const ship = ships[key];
      const { up } = controls[key];

      if (up) {
        let vec = [0, 0];
        ship.body.toWorldFrame(vec, [0, 30]);
        const count = Math.round(Math.random() * 3) + 1;

        for(let num = 0; num < count; num++) {
          particles.add(
            vec.map(v => v + ((Math.random() * 8) - 4)),
            'simple',
            10,
          );
        }
      }
    }
  };

  const addLasers = (controls) => {
    for(const key of players) {
      if (!controls[key]) continue;

      const ship = ships[key];
      const { down } = controls[key];

      if (down && performance.now() > ship.fireLock) {
        projectiles.add(ship.body);
        ship.fireLock = performance.now() + 250;
      }
    }
  };

  const handleInput = (controls) => {
    for(const key of players) {
      if (!controls[key]) continue;

      const ship = ships[key];
      const { up, left, right } = controls[key];

      ship.body.applyForceLocal([0, up * -500]);
      ship.body.angularVelocity = (right - left) * 2;
    }
  };

  sim.world.on('postStep', () => {
    handleInput(control.snapshot());
    projectiles.postStep();
    particles.postStep();
  });

  const tick = (time) => {
    const delta = (time - lastTime) / 1000;
    lastTime = time;

    if (!running) {
      return;
    }

    const controls = control.snapshot();
    addLasers(controls);
    addThrustParticles(controls);

    particles.tick(delta);
    projectiles.tick(delta);

    sim = simulation.step(time, sim);

    render(
      scene(
        Object.values(ships),
        particles.particles,
        projectiles.projectiles,
        ctx,
      ),
      ctx,
    );

    particles.tickEnd(delta);
    projectiles.tickEnd(delta);
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
    lastTime = performance.now();
  };

  window.addEventListener('blur', onFocusChange);
  window.addEventListener('focus', onFocus);

  schedule();

  return () => {
    window.removeEventListener('blur');
    window.removeEventListener('focus');
    window.removeEventListener('onKeyDown');
    window.removeEventListener('onKeyUp');
    sim.world.clear();
    running = false;
  };
};

let cancel = main();

if (module.hot) {
  module.hot.dispose(() => cancel());
}
