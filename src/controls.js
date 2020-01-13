const makeId = () => Math.random().toString(36).slice(2);

const controls = () => {
  const keyMap = {};
  const state = {};

  const onKeyDown = (event) => {
    const map = keyMap[event.code];
    if (!map) return;

    state[map.id][map.key] = true;
  };

  const onKeyUp = (event) => {
    const map = keyMap[event.code];
    if (!map) return;

    state[map.id][map.key] = false;
  };

  const onBlur = () => {
    Object.keys(state).forEach((id) => {
      state[id] = {};
    });
  };


  const ref = {
    add: (events) => {
      const id = makeId();

      state[id] = {};

      Object.keys(events).forEach((key) => {
        keyMap[key] = { id, key: events[key] };
      });

      return id;
    },

    remove: (id) => {
      Object.keys(keyMap).forEach((key) => {
        if (keyMap[key].id !== id) return;

        delete keyMap[key];
        delete state[id];
      });
    },

    snapshot: () => JSON.parse(JSON.stringify(state)),

    attach: () => {
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);
      window.addEventListener('blur', onBlur);

      return ref;
    },

    detach: () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);

      return ref;
    },
  };

  return ref;
};

export default controls;
