import Control, { KEYMAPS } from '#/controls';
import debounce from '#/debounce';
import render from '#/canvas';
import scene from '#/scenes/empty';
import * as particleEngine from '#/particleEngine';
import * as shipObject from '#/objects/ship';
import tickManager from '#/tick';
import screamingNeonFont from '#/assets/fonts/screaming_neon/screaming_neon.ttf';

const control = Control({ up: 0, left: 0, down: 0, right: 0 });
control.keyboard('user1', KEYMAPS.wasd);
control.keyboard('user2', KEYMAPS.arrows);

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

const add = vecA => vecB => vecA.map((v, idx) => v + vecB[idx]);

const main = () => {
  const { ctx } = initCanvas(document.querySelector('canvas'));

  let particles = particleEngine.make();

  let cancel = null;
  let lastTime = null;

  const ships = {
    user1: shipObject.shields(4, shipObject.position([200, 200], shipObject.identity('ozbarry'))),
    user2: shipObject.shields(3, shipObject.position([300, 200], shipObject.identity('ernikins'))),
    user3: shipObject.shields(2, shipObject.position([400, 200], shipObject.identity('shames'))),
    user4: shipObject.shields(1, shipObject.position([500, 200], shipObject.identity('psitiki'))),
  };

  const tick = (time) => {
    const delta = (time - lastTime) / 1000;
    lastTime = time;

    Object.keys(ships).forEach((userKey) => {
      const ship = ships[userKey];
      const thrusters = shipObject.getThrusters(ship);
      const thrustersWithRandom = thrusters.map(p => p.map(t => t + (Math.random() * 2)));

      const adder = add(ship.offset);

      if (Math.random() > 0.3) {
        particles = thrustersWithRandom
          .reduce((particleList, thrusterPosition) => (
            particleEngine.add(
              adder(thrusterPosition),
              'thrust',
              3,
              particleList,
            )
          ), particles);
      }
    });

    const gravity = [0, (delta * 20)];
    particles = particleEngine.moveEach(gravity, particles);

    render(
      scene(
        Object.values(ships),
        particles,
        ctx,
      ),
      ctx,
    );

    particles = particleEngine.tick(delta, particles);

    schedule();
  };

  const schedule = () => {
    cancel = tickManager(tick, 1 / 60);
  };

  const unschedule = () => {
    return cancel && cancel();
  };

  const onFocusChange = () => {
    return document.hasFocus()
      ? schedule()
      : unschedule();
  };

  window.addEventListener('blur', onFocusChange);
  window.addEventListener('focus', () => {
    onFocusChange();
    lastTime = performance.now();
  });

  schedule();
};

(new FontFace('screaming_neon', `url(${screamingNeonFont})`))
  .load()
  .then(main);
