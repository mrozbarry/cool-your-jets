import makeId from './id';

const keyboardControl = (connect, notify) => (id, keymap) => {
  const disconnect = connect(id);
  if (!disconnect) {
    return () => {};
  }

  const makeEventHandler = value => event => {
    const action = keymap[event.code];
    if (!action) return;

    notify(id, action, value);
  };

  const onKeyDown = makeEventHandler(1);
  const onKeyUp = makeEventHandler(0);

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', () => {
    Object.values(keymap).forEach((key) => {
      notify(id, key, 0);
    });
  });

  return () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    disconnect();
  };
};

const control = (initialControlState) => {
  const ids = [];
  const state = {};
  const disconnects = {};
  const listeners = {};

  const connect = (id) => {
    if (ids.includes(id)) {
      return false;
    }

    ids.push(id);
    state[id] = JSON.parse(JSON.stringify(initialControlState));

    disconnects[id] = () => {
      const index = ids.indexOf(id);
      if (index >= 0) {
        ids.splice(index, 1);
      }

      delete state[id];
      delete disconnects[id];
    };

    return disconnects[id];
  };

  const notify = (id, key, value) => {
    if (state[id][key] !== value) {
      state[id] = { ...state[id], [key]: Number.isNaN(value) ? Number(Boolean(value)) : value };
      Object.values(listeners).forEach(c => c(state));
    }
  };

  return {
    keyboard: keyboardControl(connect, notify),

    snapshot: () => JSON.parse(JSON.stringify(state)),
    ids: () => [...ids],

    listen: (callback) => {
      const id = makeId();
      listeners[id] = callback;
      return () => {
        delete listeners[id];
      };
    },

    disconnect: () => {
      for(const id of ids) {
        disconnects[id]();
      }
    },
  };
};

export default control;

export const KEYMAPS = {
  wasd: {
    KeyW: 'up',
    KeyA: 'left',
    KeyS: 'down',
    KeyD: 'right',
  },
  tfgh: {
    KeyT: 'up',
    KeyF: 'left',
    KeyG: 'down',
    KeyH: 'right',
  },
  ijkl: {
    KeyI: 'up',
    KeyJ: 'left',
    KeyK: 'down',
    KeyL: 'right',
  },
  arrows: {
    ArrowUp: 'up',
    ArrowLeft: 'left',
    ArrowDown: 'down',
    ArrowRight: 'right',
  },
};
