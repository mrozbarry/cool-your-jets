import { properties, textStroke, textFill, translate, path, moveTo, lineTo, stroke, restorable } from '#/lib/canvas';

const maybeRender = (v = 0.1) => Math.random() > v;

const text = ([x, y], text, lineWidth, style) => {
  const styleProperty = lineWidth === 1
    ? { fillStyle: style }
    : { strokeStyle: style };

  const textFn = lineWidth === 1 ? textFill : textStroke;

  return properties({
    lineWidth,
    ...styleProperty,
    font: '24px screaming_neon',
    textAlign: 'left',
    textBaseline: 'top',
  }, [
    textFn([x, y], text),
  ]);
};

const fuzzyText = (ship) => [
  //maybeRender(0.6) && text([-30, -70], ship.name, 3, 'hsla(0, 100%, 100%, 0.3)'),
  //maybeRender(0.6) && text([-30, -70], ship.name, 2, 'hsla(0, 100%, 100%, 0.3)'),
  text([-30, -70], ship.name, 1, 'hsla(0, 100%, 100%, 1.0)'),
];

const bar = ([x, y], [w], lineWidth, strokeStyle) => properties({
  lineWidth,
  strokeStyle,
}, [
  path({ close: false, after: stroke }, [
    moveTo([x, y]),
    lineTo([x + w, y]),
  ]),
]);

const fuzzyBar = ([x, y], [w], hue) => [
  maybeRender(0.2) && bar([x - 4, y], [w + 8], 11, `hsla(${hue}, 100%, 60%, 0.1)`),
  maybeRender(0.2) && bar([x - 2, y], [w + 4], 5, `hsla(${hue}, 100%, 60%, 0.1)`),
  bar([x, y], [w], 1, `hsl(${hue}, 100%, 60%)`),
];

const fuzzyPercentBar = ([x, y], [w], percent, hue) => [
  bar([x, y], [w], 1, `hsl(${hue}, 0%, 50%)`),
  fuzzyBar([x, y], [w * percent], hue),
];

const infoLine = (points, lineWidth, strokeStyle) => {
  const first = points[0];
  const tail = points.slice(1);

  return properties({
    lineWidth,
    strokeStyle,
  }, [
    path({
      closed: false,
      after: stroke,
    }, [
      moveTo(first),
      ...tail.map(p => lineTo(p)),
    ]),
  ]);
};

const fuzzyInfoLine = (points) => [
  // maybeRender(0.5) && infoLine(points, 4, 'hsla(0, 100%, 100%, 0.1)'),
  infoLine(points, 1, 'hsla(0, 100%, 100%, 1)'),
];

export default (ship) => {
  //const items = ship.power.split('');
  //const total = items.length - 2;

  //const shield = items.filter(p => p === 's').length / total;
  //const thruster = items.filter(p => p === 't').length / total;
  //const laser = items.filter(p => p === 'l').length / total;

  return restorable(translate(ship.body.interpolatedPosition, [
    fuzzyInfoLine([
      [-60, 0],
      [-70, 0],
      [-70, -60],
      [-40, -60],
    ]),
    fuzzyText(ship),
    //fuzzyPercentBar([-30, -52], [60], shield, 180),
    //fuzzyPercentBar([-30, -49], [60], thruster, 30),
    //fuzzyPercentBar([-30, -46], [60], laser, 0),
  ]));
};
