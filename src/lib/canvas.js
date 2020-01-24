const styleOp = (key) => (value, children) => (ctx) => {
  ctx.save();
  ctx[key] = value;

  render(children, ctx);

  ctx.restore();
};

const callOp = (key) => () => (ctx) => {
  ctx[key]();
};

const coordOp = (key) => ([x, y]) => (ctx) => {
  ctx[key](x, y);
};

const int = v => (v + 0.5) | 0;

const OP = {
  strokeStyle: styleOp('strokeStyle'),
  fillStyle: styleOp('fillStyle'),
  lineCap: styleOp('lineCap'),
  lineJoin: styleOp('lineJoin'),
  lineWidth: styleOp('lineWidth'),
  font: styleOp('font'),
  textAlign: styleOp('textAlign'),
  textBaseline: styleOp('textBaseline'),

  clear: () => (ctx) => ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height),

  rectFill: ({ p, s }) => (ctx) => ctx.fillRect(int(p[0]), int(p[1]), int(s[0]), int(s[1])),
  rectStroke: ({ p, s }) => (ctx) => ctx.strokeRect(int(p[0]), int(p[1]), int(s[0]), int(s[1])),

  save: () => (ctx) => ctx.save(),
  restore: () => (ctx) => ctx.restore(),

  scale: ([w, h], children = []) => (ctx, render) => {
    ctx.save();
    ctx.scale(w, h);

    render(children, ctx);

    ctx.restore();
  },

  translate: ([x, y], children = []) => (ctx, render) => {
    ctx.save();
    ctx.translate(int(x), int(y));

    render(children, ctx);

    ctx.restore();
  },

  rotate: (radians, children = []) => (ctx, render) => {
    ctx.save();
    ctx.rotate(radians);

    render(children, ctx);

    ctx.restore();
  },

  beginPath: callOp('beginPath'),
  closePath: callOp('closePath'),
  clip: (path, children = []) => (ctx) => {
    ctx.save();
    ctx.clip(path);

    render(children, ctx);

    ctx.restore();
  },

  moveTo: coordOp('moveTo'),
  lineTo: coordOp('lineTo'),

  arc: ({ position: [x, y], radius, startAngle, endAngle, antiClockwise }) => (ctx) => {
    ctx.arc(int(x), int(y), radius, startAngle, endAngle, antiClockwise);
  },

  stroke: callOp('stroke'),
  fill: callOp('fill'),

  textFill: ({ position: [x, y], text }) => ctx => {
    ctx.fillText(text, int(x), int(y));
  },

  textStroke: ({ position: [x, y], text }) => ctx => {
    ctx.strokeText(text, int(x), int(y));
  },
};

const makeOp = (cmd, props = {}, children = []) => ({
  cmd,
  props,
  children,
});

export const strokeStyle = (style, children) => makeOp('strokeStyle', style, children);
export const fillStyle = (style, children) => makeOp('fillStyle', style, children);
export const lineCap = (style, children) => makeOp('lineCap', style, children);
export const lineJoin = (style, children) => makeOp('lineJoin', style, children);
export const lineWidth = (width, children) => makeOp('lineWidth', width, children);
export const radialGradient = (targetProp, innerPosition, innerRadius, outerPosition, outerRadius, colorStops, children) => (
  makeOp('radialGradient', { targetProp, innerPosition, innerRadius, outerPosition, outerRadius, colorStops }, children)
);

export const save = () => makeOp('save');
export const restore = () => makeOp('restore');

export const restorable = (children) => [
  save(),
  children,
  restore(),
];

export const clear = () => makeOp('clear');

export const rectFill = ([x, y], [w, h]) => makeOp('rectFill', { p: [x, y], s: [w, h] }, []);
export const rectStroke = ([x, y], [w, h]) => makeOp('rectStroke', { p: [x, y], s: [w, h] }, []);
export const scale = ([w, h], children) => makeOp('scale', [w, h], children);
export const translate = ([x, y], children) => makeOp('translate', [x, y], children);
export const rotate = (radians, children) => makeOp('rotate', radians, children);

export const beginPath = () => makeOp('beginPath');
export const closePath = () => makeOp('closePath');
export const clip = (path, children) => makeOp('clip', path, children);

export const path = ({ close, after = stroke }, children) => [
  beginPath(),
  children,
  (close ? [closePath()] : []),
  after(),
];

export const moveTo = ([x, y]) => makeOp('moveTo', [x, y]);
export const lineTo = ([x, y]) => makeOp('lineTo', [x, y]);
export const arc = ([x, y], radius, startAngle, endAngle, antiClockwise = false) => (
  makeOp('arc', { position: [x, y], radius, startAngle, endAngle, antiClockwise })
);

export const stroke = () => makeOp('stroke');
export const fill = () => makeOp('fill');

export const textFill = ([x, y], text) => makeOp('textFill', { position: [x, y], text });
export const textStroke = ([x, y], text) => makeOp('textStroke', { position: [x, y], text });

export const polygonStroke = (points) => {
  const first = points[0];
  const tail = points.slice(1);

  return path({ close: true, after: stroke }, [
    moveTo(first),
    ...tail.map(point => lineTo(point)),
  ]);
};

export const circleStroke = ([x, y], radius) => [
  beginPath(),
  arc([x, y], radius, 0, Math.PI * 2),
  stroke(),
];

export const circleFill = ([x, y], radius) => [
  beginPath(),
  arc([x, y], radius, 0, Math.PI * 2),
  fill(),
];

export const properties = (config, children = []) => Object.keys(config)
  .reduce((nestedChildren, key) => makeOp(
    key,
    config[key],
    nestedChildren,
  ), children);

const render = (operations, ctx) => {
  if (!operations) return;

  const operationList = []
    .concat(operations)
    .filter(Boolean);

  for(const opDef of operationList) {
    if (Array.isArray(opDef)) {
      render(opDef, ctx);
    } else {
      const { cmd, props, children } = opDef;
      const op = OP[cmd];
      try {
        op(props, children)(ctx, render);
      } catch (err) {
        console.log('opDef', opDef);
        console.log('OP[]', op);
        throw err;
      }
    }
  }
};

export default render;
