import * as audio from '../assets/sounds';

class AudioClip {
  static fromUrl(url, options) {
    const audioClip = new AudioClip(options);
    return audioClip.setUrl(url);
  }

  static cloneFrom(fromAudioClip) {
    const audioClip = new AudioClip(fromAudioClip.options);
    audioClip.source = fromAudioClip.source.cloneNode();
    fromAudioClip.children.push(audioClip);
    return audioClip;
  }

  constructor(options = {}) {
    this.source = new Audio();
    this.options = options;
    this.children = [];
  }

  setUrl(url) {
    return new Promise((resolve, reject) => {
      const onError = (err) => reject(err);
      const onLoad = () => resolve(this);

      this.source.addEventListener('error', onError, { once: true });
      this.source.addEventListener('loadeddata', onLoad, { once: true });

      this.source.src = url;
    });
  }

  stop() {
    this.source.pause();
    this.source.currentTime = 0;
    let child;
    for(child of this.children) {
      child.stop();
    }
  }

  removeChild(child) {
    const index = this.children.findIndex(c => c === child);
    if (index === -1) return;

    this.children.splice(index, 1);
  }

  sfx() {
    const child = AudioClip.cloneFrom(this);

    child.source.addEventListener('ended', () => {
      child.stop();
      this.removeChild(child);
    }, { once: true });

    child.play();
  }

  loop() {
    // TODO
  }
}

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
      console.log('audio.playSfx', name, sfx.src, 'ended');
      this.stopAudio(name);
    });
    this.playing.push(sfx);
    // sfx.play();
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
