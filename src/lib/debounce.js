export default (fn, timeout) => {
  let handle = null;

  const wrapped = (...params) => {
    clearTimeout(handle);
    handle = setTimeout(() => {
      fn(...params);
      handle = null;
    }, timeout);
  };

  wrapped.cancel = () => {
    clearTimeout(handle);
    handle = null;
  };

  return wrapped;
};
