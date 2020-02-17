const GameCountdownFX = (dispatch, { gameStartsIn, onTick }) => {
  const handle = setInterval(() => {
    const diff = (gameStartsIn - Date.now()) / 1000;
    const remaining = Math.round(diff * 10) / 10
    dispatch(onTick, { remaining: Math.max(0, remaining) });
  }, 100);

  return () => {
    clearInterval(handle);
  };
};

export const GameCountdown = props => [GameCountdownFX, props];
