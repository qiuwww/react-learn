function useFullScreen(initFullScreen) {
  const [fullScreenState, setFullScreen] = useState(initFullScreen);
  const handleFullScreen = () => {
    if (!fullScreenState) {
      fullScreen();
    } else {
      exitFullscreen();
    }
    setFullScreen(!fullScreenState);
  };

  //全屏
  function fullScreen() {
    var element = document.documentElement;

    // 这里处理多种浏览器兼容的问题
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
  }

  //退出全屏
  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
  return [fullScreenState, handleFullScreen];
}
