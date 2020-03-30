import React, { useState, useEffect, useRef } from 'react';

export default function HookCustomize() {
  let [count, setCount] = useState(0);
  let [isFullScreen, setFullScreen] = useFullScreen(false);

  useInterval(() => {
    // Your custom logic here
    setCount(count + 1);
  }, 1000);

  return (
    <>
      <h1>useInterval: {count}</h1>
      <button onClick={setFullScreen}>{isFullScreen ? '退出全屏' : '全屏显示'}</button>
    </>
  );
}

// 如果你玩React Hooks有一些时间，你可能会遇到一个有趣的问题：使用setInterval并不会按照你的预期工作。
// useInterval Hook设置一个间隔并在卸载后清除它。 它是与组件生命周期相关的setInterval和clearInterval的组合。
function useInterval(callback, delay) {
  // callback是一个state修改函数
  // useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内保持不变。
  // 本质上，useRef 就像是可以在其 .current 属性中保存一个可变值的“盒子”。
  const savedCallback = useRef();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      // @ts-ignore
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

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
