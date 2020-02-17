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
  h('thead', null, h('tr', null, props.columns.map((column, index) => h(
    'th',
    {
      style: {
        width: props.widths ? props.widths[index] : (void 0),
      }
    },
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

export const playerRow = ({
  player,
  gamepadPlayers,
  clientId,
  ships,
  onEdit,
}) => {
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
      style: isLocal ? {
        borderBottom: '3px white dotted',
        cursor: 'pointer',
      } : {
        borderBottom: '3px transparent solid',
      },
      onclick: isLocal ? [
        onEdit,
        { identifier: player.identifier },
      ] : (void 0),
    }, player.name),
  ]);
};

export const modal = ({ onRequestClose }, children) => {
  return h('div', {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'hsla(0, 0%, 10%, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    onclick: [
      onRequestClose,
      event => ({
        shouldClose: event.target === event.currentTarget,
      }),
    ],
  }, [
    h('div', {
      style: {
        border: '3px white solid',
        padding: '1rem',
        paddingBottom: '2rem',
      },
    }, children),
  ]);
};

export const input = (props) => h(
  'input',
  {
    ...(props || {}),
    style: {
      ...(props && props.style || {}),
      border: 'none',
      borderBottom: '3px white solid',
      backgroundColor: 'transparent',
      color: 'white',
      fontFamily: 'inherit',
      fontSize: '2.5rem',
      padding: '0.5rem',
      display: 'block',
    },
  },
);

export const button = (props, children) => h(
  'button',
  {
    type: 'button',
    ...(props || {}),
    style: {
      ...(props && props.style || {}),
      border: '3px white solid',
      backgroundColor: 'transparent',
      color: (props && props.loading) ? '#aaa' : 'white',
      fontFamily: 'inherit',
      fontSize: '2.5rem',
      padding: '0.5rem',
      transition: 'all 300ms',
    },

  },
  [
    children,
    !!props.loading && [
      h('span', { class: 'loading' }),
    ],
  ],
);

export const flexRow = (props, children) => h(
  'div',
  {
    ...(props || {}),
    style: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginBottom: '1rem',
      ...(props && props.style || {}),
    },
  },
  children,
);

const inputDecoder = event => ({
  key: event.target.name,
  value: event.target.value,
});
export const updatePlayerModal = ({
  ships,
  player,
  onEdit,
  onSubmit,
  onCancel,
}) => h(modal, {
  onRequestClose: onCancel,
}, [
  h(flexRow, null, [
    h('h1', null, 'Update Player'),
  ]),
  h('form', {
    action: `/api/lobby/players/${player.identifier}`,
    method: 'post',
    onsubmit: [
      onSubmit,
      (event) => {
        event.preventDefault();
        return {};
      },
    ],
  }, [
    h(flexRow, null, [
      h('label', {
        for: 'player-name',
      }, [
        h('h2', null, 'Rename Player'),
      ]),
    ]),
    h(flexRow, null, [
      h(input, {
        id: 'player-name',
        placeholder: 'The Red Baron',
        autoFocus: true,
        minLength: 3,
        maxLength: 32,
        autocomplete: 'nickname',
        name: 'name',
        value: player.name,
        oninput: [
          onEdit,
          inputDecoder,
        ],
        style: {
          width: '40vw',
          marginBottom: '1rem',
        },
      }),
    ]),
    h(flexRow, null, [ h('label', {
        for: 'player-hue',
      }, [
        h('h2', null, 'Ship color'),
      ]),
    ]),
    h(flexRow, {
      style: {
        justifyContent: 'flex-end',
      },
    }, [
      h('input', {
        id: 'player-hue',
        type: 'range',
        min: 0,
        max: 359,
        value: player.hue,
        name: 'hue',
        oninput: [
          onEdit,
          inputDecoder,
        ],
        style: {
          display: 'block',
          width: '100%',
        },
      }),
    ]),
    h(flexRow, null, [
      h('label', {
        for: 'player-ship-model',
      }, [
        h('h2', null, 'Ship model'),
      ]),
    ]),
    h(flexRow, { style: { flexWrap: 'wrap' } }, ships.map(ship => (
      h('div', {
        style: {
          textAlign: 'center',
          marginBottom: '1rem',
          border: '3px transparent solid',
          borderColor: player.shipModel === ship.name ? 'white' : '#aaa',
          padding: '1rem',
          margin: '0.5rem',
          cursor: 'pointer',
        },
        onclick: [
          onEdit,
          () => {
            console.log('clicked on ship', ship);
            return ({
              key: 'shipModel',
              value: ship.name,
            });
          },
        ],
      }, [
        h(shipSvg, {
          width: 64,
          height: 64,
          ship,
          pathProps: {
            style: {
              strokeWidth: 3,
              stroke: `hsl(${player.hue}, 100%, 50%)`,
            },
          },
        }),
        h('h3', null, ship.name),
      ])
    ))),
    h(flexRow, {
      style: {
        justifyContent: 'flex-end',
      },
    }, [
      h(button, {}, 'Remove'),
      h('div', { style: { flex: 1 } }),
      h(button, { onclick: [onCancel, null] }, 'Cancel'),
      h(button, { loading: player.loading, type: 'submit' }, 'Update'),
    ]),
  ]),
]);
