import * as api from '#/ui/api';

const WaitForKeyboardFx = (dispatch, {
  clientId,
  onPlayerLock,
  onPlayerUnlock,
  onKeyboardDiscovered,
}) => {
  const onKeyDown = async (event) => {
    if (event.code !== 'ArrowDown') return;
    if (event.target.matches('td')) return;

    try {
      dispatch(onPlayerLock);
      const player = await api.addPlayer(clientId);
      dispatch(onKeyboardDiscovered, {
        identifier: player.identifier,
        player,
      });
    } catch (err) {
      console.log('Error adding player', err);
      dispatch(onPlayerUnlock);
    }
  };

  document.addEventListener('keydown', onKeyDown);

  return () => {
    document.removeEventListener('keydown', onKeyDown);
  };
};

export const WaitForKeyboard = props => [WaitForKeyboardFx, props];
