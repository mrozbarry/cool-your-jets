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

    const element = document.createElement('canvas');
    this.container.appendChild(element);
    this.canvas = new Canvas(this, element);
    this.resize();


    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  divide(count) {
    const columns = Math.max(1, Math.min(2, count));
    const rows = Math.ceil(count / columns);

    const availableWidth = (this.canvas.element.width / columns);
    const availableHeight = (this.canvas.element.height / rows);

    return Array.from({ length: count }, (_, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const x = column * availableWidth;
      const y = row * availableHeight;

      return { x, y, w: availableWidth, h: availableHeight };
    });
  }

  resize() {
    this.canvas.resize(window.innerWidth, window.innerHeight);
  }
}
