import { h } from 'hyperapp';

export const overrideStyles = {
  fontFamily: `'screaming_neon', sans-serif`,
  fontSize: '36px',
  backgroundColor: 'transparent',
  color: 'white',
  borderRadius: 0,
};

const formElementStyles = {
  ...overrideStyles,
  display: 'block',
  border: 'none',
  outline: 'none',
  borderBottom: '3px white solid',
  width: '100%',
};

const playerContainer = (props, children) => h(
  'div',
  {
    ...(props || {}),
    style: {
      fontSize: '36px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around',
      width: '100%',
      height: '100%',
    },
  },
  children,
);

const fieldset = (props, children) => h(
  'fieldset',
  {
    ...(props || {}),
    style: {
      ...(props && props.style || {}),
      width: '100%',
      border: 'none',
      outline: 'none',
    },
  },
  children,
);

const label = ({ text, style }, children) => h(
  'label',
  {
    style: {
      display: 'block',
      ...(style || {}),
    },
  },
  [
    text,
    children,
  ],
);

const row = (props, children) => h(
  'div',
  {
    ...(props || {}),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '32px',
      width: '80%',
      ...(props && props.style || {}),
    },
  },
  children,
);

export const playerSetup = ({
  index,
  controls,
  name,
  ready,
  color: [_h, s, l],
  controlOptions,
  gameCountdown,
}) => {
  const [type, id] = controls.split('|');
  const extraGamepadOption = type === 'gamepad' && id !== '-1'
    ? [[controls, `Gamepad ${id}`]]
    : [];

  const options = controlOptions.concat(extraGamepadOption);

  return h(playerContainer, null, [
    row(null, [
      fieldset(null, [
        h(label, { text: 'Controls' }, [
          h('select', {
            style: {
              ...formElementStyles,
              width: '100%',
            },
            onchange: [actions.PlayerControls, (event) => ({ index, controls: event.target.value })],
          }, options.map(([value, label]) => (
            h('option', { value, selected: value === controls }, label)
          ))),
        ]),
      ]),
    ]),
    row(null, [
      h('div', {
        style: {
          border: '3px white solid',
          backgroundColor: `hsl(${_h}, ${s}%, ${l}%)`,
          width: '48px',
          height: '48px',
          cursor: 'pointer',
          flex: '0 0 48px',
          marginRight: '8px',

        },
        onclick: [actions.PlayerColor, { index }],
      }),
      fieldset({ style: { flex: 1 } }, [
        h(label, { text: 'Name' }, [
          h('input', {
            value: name,
            style: formElementStyles,
            oninput: [actions.PlayerName, (event) => ({ index, name: event.target.value })],
          }),
        ]),
      ]),
    ]),
    row(null, [
      h('button', {
        type: 'button',
        style: {
          ...overrideStyles,

          borderWidth: '3px',
          padding: '1rem',
        },
        disabled: (controls === '' || gameCountdown !== null),
        onclick: [actions.PlayerReady, { index, ready: !ready }],
      }, (gameCountdown === null ? (ready ? 'CANCEL' : 'READY') : `Starts in ${gameCountdown}`)),
    ]),
  ]);
};

export const grid = ({ count }, children) => h(
  'div',
  {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: count > 2 ? '1fr 1fr' : '1fr',
      gridGap: '3rem',
      width: '100vw',
      height: '100vh',
    },
  },
  children,
);


