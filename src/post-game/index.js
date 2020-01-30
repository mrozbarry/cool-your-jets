import { app, h } from 'hyperapp';
import * as actions from '#/post-game/actions';

const BigLink = ({ href }, text) => h(
  'a',
  {
    style: {
      display: 'inline-block',
      padding: '1rem',
      border: '3px white solid',
      color: 'white',
      flex: 1,
      fontSize: '32px',
      margin: '0 1rem',
      textAlign: 'center',
    },
    href,
  },
  text,
);

export default (config, winner, node) => app({
  init: [actions.Initialize, { config, winner }],

  view: state => h('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
    },
  }, [
    h('table', {
      style: {
        width: '60%',
        fontSize: '2rem',
        margin: '5rem 0',
      },
    }, [
      h('thead', null, [
        h('tr', null, [
          h('th', { style: { textAlign: 'left' } }, 'Name'),
          h('th', { style: { textAlign: 'right' } }, 'Wins'),
        ]),
      ]),
      h('tbody', null, [
        state.players.map(({ id, name, wins, color: [_h, s, l]}) => h('tr', null, [
          h('td', {
            style: {
              textAlign: 'left',
            },
          }, [
            h('div', {
              style: {
                display: 'inline-block',
                border: '3px white solid',
                backgroundColor: `hsl(${_h}, ${s}%, ${l}%)`,
                width: '16px',
                height: '16px',
                marginRight: '8px',
              },
            }),
            h(id === state.winner ? 'strong' : 'span', null, name),
          ]),
          h('td', {
            style: {
              textAlign: 'right',
            },
          }, wins),
        ])),
      ]),
    ]),
    h('div', {
      style: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
      },
    }, [
      h(BigLink, {
        href: `/play/${state.config}`,
      }, 'Rematch'),
      h(BigLink, {
        href: '/',
      }, 'Main Menu'),
    ]),
  ]),

  node,
});
