import * as api from '#/ui/api';

const GamepadDisconnectFx = (dispatch, { clientId, gamepadPlayers, onDisconnect }) => {
  const handleDisconnect = async (event) => {
    const { gamepad } = event;
    const gamepadPlayer = gamepadPlayers
      .find(gpp => gpp.index === gamepad.index);

    if (!gamepadPlayer) return;

    try {
      await api.removePlayer(clientId, gamepadPlayer);
      dispatch(onDisconnect, gamepadPlayer);
    } catch (err) {
      console.warn('Unable to remove gamepad player from server', err);
    }
  };

  window.addEventListener('gamepaddisconnected', handleDisconnect);

  return () => {
    window.removeEventListener('gamepaddisconnected', handleDisconnect);
  };
};

export const GamepadDisconnect = props => [GamepadDisconnectFx, props];
