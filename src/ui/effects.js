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

const PageNavigateFX = (_, path) => {
  page.show(path);
};
export const PageNavigate = props => [PageNavigateFX, props];
