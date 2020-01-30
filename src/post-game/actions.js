import pipe from '#/lib/pipe';

export const Initialize = (_, { config, winner }) => {
  const players = config
    .map(p => ({
      ...p,
      wins: (winner === p.id ? p.wins + 1 : p.wins),
    }))
    .sort((a, b) => b.wins - a.wins);

  return ({
    players,
    winner,
    config: pipe([
      playersState => playersState.map(p => ({
        name: p.name,
        wins: p.wins,
        color: p.color,
        controls: p.controls,
      })),
      JSON.stringify,
      btoa,
    ], players),
  });
};
