const pipe = data => ({
  to: fn => pipe(fn(data)),
  extract: () => data,
});

export default pipe;
