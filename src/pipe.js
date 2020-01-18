const pipe = (fnList, initValue) => (
  fnList.reduce((value, fn) => fn(value), initValue)
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
