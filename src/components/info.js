import { properties, textStroke, polygonStroke, translate, beginPath, moveTo, lineTo, stroke } from '#/canvas';

const maybeRender = (v = 0.1) => Math.random() > v;

const text = ([x, y], text, lineWidth, strokeStyle) => properties({
  lineWidth,
  strokeStyle,
  font: '16px screaming_neon',
  textAlign: 'left',
  textBaseline: 'top',
}, [
  textStroke([x, y], text),
]);

const fuzzyText = (ship) => [
  //maybeRender(0.6) && text([ship.offset[0] - 30, ship.offset[1] - 70], ship.name, 5, 'hsla(0, 50%, 70%, 0.3)'),
  //maybeRender(0.6) && text([ship.offset[0] - 30, ship.offset[1] - 70], ship.name, 3, 'hsla(0, 50%, 70%, 0.3)'),
  maybeRender(0) && text([ship.offset[0] - 30, ship.offset[1] - 70], ship.name, 1, 'hsla(0, 50%, 100%, 1.0)'),
];

const box = ([x, y], [w, h], lineWidth, strokeStyle) => properties({
  lineWidth,
  strokeStyle,
}, [
  translate([x, y], [
    polygonStroke([
      [0, 0],
      [w, 0],
      [w, h],
      [0, h],
    ]),
  ]),
]);

const fuzzyBoxStroke = ([x, y], size, hue) => [
  maybeRender(0.2) && box([x, y], [size, size], 10, `hsla(${hue}, 50%, 50%, 0.1)`),
  maybeRender(0.2) && box([x, y], [size, size], 6, `hsla(${hue}, 50%, 50%, 0.1)`),
  maybeRender(0.1) && box([x, y], [size, size], 2, `hsla(${hue}, 50%, 50%, 1.0)`),
];

const infoLine = (points, lineWidth, strokeStyle) => {
  const first = points[0];
  const tail = points.slice(1);

  return properties({
    lineWidth,
    strokeStyle,
  }, [
    beginPath(),
    moveTo(first),
    ...tail.map(p => lineTo(p)),
    stroke(),
  ]);
};

const fuzzyInfoLine = (points) => [
  maybeRender(0.5) && infoLine(points, 4, 'hsla(0, 100%, 100%, 0.1)'),
  infoLine(points, 1, 'hsla(0, 100%, 100%, 1)'),
];

const infoBoxColor = {
  s: 180,
  t: 30,
  l: 0,
};

export default (ship) => {
  return [
    fuzzyInfoLine([
      [ship.offset[0] - 60, ship.offset[1]],
      [ship.offset[0] - 70, ship.offset[1]],
      [ship.offset[0] - 70, ship.offset[1] - 60],
      [ship.offset[0] - 40, ship.offset[1] - 60],
    ]),
    fuzzyText(ship),
    ship.power.map((powerItem, index) => {
      const x = ship.offset[0] - 30 + (index * 10);
      return fuzzyBoxStroke(
        [x, ship.offset[1] - 55],
        6,
        infoBoxColor[powerItem],
      );
    }),
  ];
};
