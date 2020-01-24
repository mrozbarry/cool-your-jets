import AudioControl from '#/lib/audio';

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
