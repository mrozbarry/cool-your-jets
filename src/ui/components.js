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

export const playerRow = ({ player, gamepadPlayers, clientId, ships }) => {
  const isLocal = player.identifier.startsWith(`${clientId}.`);
  const identifier = `${player.clientId}.${player.id}`;
  const localGamepad = isLocal && gamepadPlayers.find(gpp => gpp.identifier === identifier);

  const ship = ships.find(s => s.name === player.shipModel);
  const f = ship.vertices[0];
  const lines = ship.vertices
    .slice(1)
    .map(([x, y]) => `L ${x} ${y}`);
  const pathD = [
    `M ${f[0]} ${f[1]}`,
    ...lines,
    'Z',
  ].join(' ');

  const iconClass = isLocal
    ? (localGamepad ? 'far fa-gamepad' : 'far fa-keyboard')
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
    h('svg', {
      viewBox: '0 0 44 44',
      width: 48,
      height: 48,
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'transparent',
    }, [
      h('g', {
        transform: 'translate(22, 22)'
      }, [
        h('path', {
          d: pathD,
          style: {
            strokeWidth: 3,
            stroke: `hsl(${player.hue}, 100%, 50%)`,
          },
        }),
      ]),
    ]),
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
