export function throttle(fn, delay) {
    let lastCall = 0;
    return (...args) => {
      const now = new Date().getTime();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn(...args);
      }
    };
  }
  