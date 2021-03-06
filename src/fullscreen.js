const elem = document.documentElement;

export const openFullscreen = () => {
  try {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
    // eslint-disable-next-line no-restricted-globals
    screen.orientation.lock("landscape-primary");
  } catch (err) {
    console.error(err);
  }
};

export const closeFullscreen = () => {
  try {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE11 */
      document.msExitFullscreen();
    }
  } catch (err) {
    console.error(err);
  }
};
