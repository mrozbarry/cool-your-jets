import debounce from '#/lib/debounce';

export class Canvas {
  constructor(screen, canvasElement) {
    this.screen = screen;
    this.element = canvasElement;
    this.context = canvasElement.getContext('2d');

    this.resize = debounce((width, height) => {
      this.element.width = width; // * window.devicePixelRatio;
      this.element.height = height; // * window.devicePixelRatio;
      console.log('divided screen', {
        screens: this.screen.divide(4),
        size: [this.element.width, this.element.height],
      });
    });
  }

  resize(width, height) {}
}

export default class Screen {
  constructor(width, height) {
    this.container = document.querySelector('game-container');
    console.log('Screen', this.container);
    this.width = width;
    this.height = height;
    this.aspectRatio = this.height / this.width;

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
    const availableHeight = Math.min(
      (this.canvas.element.height / rows),
      availableWidth * this.aspectRatio,
    );

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
