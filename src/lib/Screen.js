import debounce from '#/lib/debounce';

const ASPECT_RATIO = 9 / 10;

export class Canvas {
  constructor(screen, canvasElement) {
    this.screen = screen;
    this.element = canvasElement;
    this.context = canvasElement.getContext('2d');

    this.resize = debounce((width, height) => {
      this.element.width = width; // * window.devicePixelRatio;
      this.element.height = height; // * window.devicePixelRatio;
    });
  }

  resize(width, height) {}
}

export default class Screen {
  constructor(width, height) {
    this.container = document.querySelector('game-container');
    this.width = width;
    this.height = height;
    this.canvases = [];

    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  add() {
    const element = document.createElement('canvas');
    this.container.appendChild(element);
    const canvas = new Canvas(this, element);
    this.canvases.push(canvas);
    this.resize();
    return canvas;
  }

  resize() {
    const count = this.canvases.length;
    const columns = Math.min(2, count);
    const rows = 2; // Math.min(1, Math.floor(count / 2))
    const availableWidth = (window.innerWidth / columns) - 5;
    const availableHeight = (window.innerHeight / rows) - 5;
    for(const canvas of this.canvases) {
      canvas.resize(
        availableWidth,
        availableHeight * ASPECT_RATIO,
      );
    }
  }
}
