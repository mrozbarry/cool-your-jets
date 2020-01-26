import AudioControl from '#/lib/audio';
import page from 'page';

const PlayLoopFX = (_, name) => {
  const attemptPlay = () => {
    requestIdleCallback(() => {
      try {
        AudioControl.playLoop(name);
      } catch (err) {
        console.log('unable to play', err);
      }
    });
  };

  attemptPlay();
};
export const PlayLoop = props => [PlayLoopFX, props];

const PlayGameFX = (_, players) => {
  const config = btoa(JSON.stringify(players.filter(p => p.controls)));
  page(`/play/${config}`);
};
export const PlayGame = players => [PlayGameFX, players];
