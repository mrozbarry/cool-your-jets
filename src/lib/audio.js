import * as audio from '../assets/sounds';

class AudioController {
  constructor() { this.audio = {};
    this.playing = [];

    this.loaders = [
      this.prepareAudio('laser', audio.SFX_LASER),
      this.prepareAudio('laser-bounce', audio.SFX_LASER_BOUNCE),
      this.prepareAudio('menu', audio.BG_LOOP_MENU),
      this.prepareAudio('game', audio.BG_LOOP_NORMAL),
      this.prepareAudio('game-winner', audio.BG_LOOP_WINNER),
    ];
  }

  prepareAudio(name, url) {
    let resolve = () => {};
    let reject = () => {};
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    const sfx = new Audio(url);
    sfx.addEventListener('loadeddata', () => {
      resolve();
    });
    sfx.addEventListener('error', (err) => {
      reject(err);
    });

    this.audio[name] = sfx;

    return promise;
  }

  waitForLoad() {
    return Promise.all(this.loaders);
  }

  stop() {
    for(const a of this.playing) {
      a.pause();
    }
    this.playing = [];
  }

  playSfx(name) {
    const sfx = this.audio[name].cloneNode();
    sfx.addEventListener('ended', () => {
      const idx = this.playing.find(s => s === sfx);
      this.playing.splice(idx, 1);
      sfx.pause();
    });
    this.playing.push(sfx);
    sfx.play();
    return sfx;
  }

  stopAudio(name) {
    const url = this.audio[name];
    this.playing = this.playing.filter(p => {
      if (p.src === url) {
        p.pause();
        return false;
      }
      return true;
    });
  }

  stopLoops() {
    this.playing = this.playing.filter(p => {
      if (p.loop) {
        console.log('stopping loop', p.src);
        p.pause();
        return false;
      }
      return true;
    });
  }

  playLoop(name) {
    this.stopLoops();
    const sfx = this.playSfx(name);
    sfx.loop = true;
    return sfx;
  }
}

const singleton = new AudioController();

export default singleton;
