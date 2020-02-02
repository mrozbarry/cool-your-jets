const middleware = (fnList, initValue) => {
  let remaining = [...fnList];
  const next = (value) => {
    const fn = remaining.shift();
    return fn
      ? fn(value, next)
      : value;
  };
  return next(initValue);
};

const pipe = (fnList, initValue) => (
  middleware(fnList.map(fn => (value, next) => {
    return next(fn(value));
  }), initValue)
);

pipe.if = (fnList, condition) => value => {
  if (!condition) return value;
  return pipe(fnList, value);
};

pipe.tap = fn => value => {
  fn(value);
  return value;
};

export default pipe;

export { middleware };
