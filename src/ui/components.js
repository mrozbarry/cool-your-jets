import { h } from 'hyperapp';

export const table = (props, children) => h(
  'table',
  {
    style: {
      width: '100%',
      height: 'auto',
      borderCollapse: 'collapse',
    },
  },
  h('thead', null, h('tr', null, props.columns.map(column => h(
    'th',
    null,
    column,
  )))),
  h('tbody', null, children),
);

export const row = (props, children) => h( 'tr',
  props,
  children.map(child => h(
    'td',
    {
      style: {
        borderBottom: '3px white solid',
        padding: '1rem',
      },
    },
    child,
  )),
);

export const shipSvg = ({ ship, width, height, pathProps }) => {
  const { min, max } = ship.shapes.reduce((memo, shape) => {
    const points = shape.vertices.map(([x, y]) => [x + shape.offset[0], y + shape.offset[1]]);

    return {
      min: [
        Math.min(memo.min[0], ...points.map(p => p[0])),
        Math.min(memo.min[1], ...points.map(p => p[1])),
      ],
      max: [
        Math.max(memo.max[0], ...points.map(p => p[0])),
        Math.max(memo.max[1], ...points.map(p => p[1])),
      ],
    };
  }, { min: [0, 0], max: [0, 0] });

  const size = [
    Math.abs(min[0]) + Math.abs(max[0]),
    Math.abs(min[1]) + Math.abs(max[1]),
  ];

  const padding = 6;

  return h('svg', {
    viewBox: `0 0 ${size[0] + padding} ${size[1] + padding}`,
    width,
    height,
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'transparent',
  }, [
    h('g', {
      transform: `translate(${(size[0] / 2) + (padding / 2)}, ${(size[1] / 2) + (padding / 2)})`,
    }, ship.shapes.map(shape => {
      const points = shape.vertices
        .map(([x, y]) => [x + shape.offset[0], y + shape.offset[1]]);

      const f = points[0];
      const lines = points
        .slice(1)
        .map(([x, y]) => `L ${x} ${y}`);

      const d = [
        `M ${f[0]} ${f[1]}`,
        ...lines,
        'Z',
      ].join(' ');

      return h('path', {
        ...pathProps,
        d,
      });
    })),
  ]);

};

export const playerRow = ({ player, gamepadPlayers, clientId, ships }) => {
  const isLocal = player.identifier.startsWith(`${clientId}.`);
  const { identifier } = player;
  const localGamepad = isLocal && gamepadPlayers.find(gpp => gpp.identifier === identifier);

  const ship = ships.find(s => s.name === player.shipModel);

  const iconClass = isLocal
    ? (localGamepad ? 'fas fa-gamepad' : 'far fa-keyboard')
    : 'fas fa-wifi';

  return row({
    style: {
      backgroundColor: isLocal
        ? `hsla(${player.hue}, 100%, 80%, 0.2)`
        : (void 0),
      height: '48px',
    },
  }, [
    h('i', { class: iconClass, style: { fontSize: '2rem' } }),
    h(shipSvg, {
      width: 48,
      height: 48,
      ship,
      pathProps: {
        style: {
          strokeWidth: 3,
          stroke: `hsl(${player.hue}, 100%, 50%)`,
        },
      },
    }),
    h('div', {
      contentEditable: isLocal,
      oninput: [
        (state, text) => {
          console.log('Updating name', text);
          return state;
        },
        (event) => event.target.innerText,
      ],
    }, player.name),
  ]);
};
