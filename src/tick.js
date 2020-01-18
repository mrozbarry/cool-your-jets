const scheduleTimeout = (fn, hertz) => {
  const handle = setTimeout(() => fn(performance.now()), hertz * 1000);
  return () => clearTimeout(handle);
};

const scheduleRaf = (fn) => {
  const handle = requestAnimationFrame(fn);
  return () => cancelAnimationFrame(handle);
};

export default (tickFn, hertz) => {
  return hertz >= (1 / 60)
    ? scheduleTimeout(tickFn, hertz)
    : scheduleRaf(tickFn);
};
