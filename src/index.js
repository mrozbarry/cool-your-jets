import * as Simulation from './simulation';
import * as p from 'planck-js';
import controls from './controls';

const createShip = ({ world }) => {
  const body = world.createBody({
    type: 'dynamic',
    position: p.Vec2(400, 300),
    angularDamping: 2.0,
    linearDamping: 0.5,
  });

  body.createFixture(
    p.Polygon([
      p.Vec2(-0.15, -0.15),
      p.Vec2( 0,    -0.1),
      p.Vec2( 0.15, -0.15),
      p.Vec2( 0,     0.2),
    ]),
    {
      density: 1000,
    },
  );

  return body;
};

const setup = () => {
  const sim = Simulation.create();
  const keyboardControls = controls().attach();

  const shipA = createShip(sim);
  const idA = keyboardControls.add({
    KeyW: 'up',
    KeyA: 'left',
    KeyS: 'down',
    KeyD: 'right',
  });

  //const shipB = createShip(sim);
  //const idB = keyboardControls.add({
    //ArrowUp: 'up',
    //ArrowLeft: 'left',
    //ArrowDown: 'down',
    //ArrowRight: 'right',
  //});


  return {
    sim,
    keyboardControls,
    ships: {
      [idA]: shipA,
      // [idB]: shipB,
    },
  };
};

const physics = (timestamp, sim) => {
  const delta = sim.previousTick === null
    ? 0
    : timestamp - sim.previousTick;

  return {
    ...Simulation.step(delta, sim),
    previousTick: timestamp,
  };
};

const input = (keyboardControls, ships) => {
  const ids = Object.keys(ships);

  const snapshot = keyboardControls.snapshot();

  ids.forEach((id) => {
    const ship = ships[id];
    const state = snapshot[id];
    if (state.up) {
      console.log('thrust', id);
      ship.applyLinearImpulse(
        ship.getWorldVector(p.Vec2(0, 1)),
        ship.getWorldVector(p.Vec2(0, 2)),
        true,
      );
    }

    if (state.left) {
      console.log('left', id);
      ship.applyAngularImpulse(0.1, true);
    } else if (state.right) {
      console.log('right', id);
      ship.applyAngularImpulse(-0.1, true);
    }
  });
};

const draw = (ctx, sim) => {
  ctx.clearRect(0, 0, 800, 600);
  Simulation.eachBody((body) => {
    Simulation.eachFixture((fixture) => {
      const shape = fixture.getShape();
      const vertices = shape.m_vertices;

      ctx.scale(16, 16);
      ctx.beginPath();
      for(let i = 0; i < vertices.length; i++) {
        const { x, y } = vertices[i];
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = '#000';
      ctx.stroke();
    }, body);
  }, sim);
};

const run = (canvas) => {
  let {
    sim,
    keyboardControls,
    ships,
  } = setup();
  let rafHandle = null;
  const ctx = canvas.getContext('2d');

  const tick = (timestamp) => {
    if (!sim) return;

    input(keyboardControls, ships);
    sim = physics(timestamp, sim);
    draw(ctx, sim);

    rafHandle = requestAnimationFrame(tick);
  };

  tick();

  return () => {
    cancelAnimationFrame(rafHandle);
    sim = null;
  };
};

run(document.querySelector('canvas'));
