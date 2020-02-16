const defer = (fn) => new Promise((resolve) => {
  setTimeout(() => { fn();
    resolve();
  }, 0);
});

export default defer;
