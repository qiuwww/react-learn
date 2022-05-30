// 直接使用setInterval的问题：State not updating when using React state hook within setInterval
// 但你发现我的 useInterval 与 setInterval 之间的不同后，你会看出 它的参数是「动态地」。
function useInterval(callback, delay) {
  // callback是一个state修改函数
  // useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内保持不变。
  // 本质上，useRef 就像是可以在其 .current 属性中保存一个可变值的“盒子”。
  const savedCallback = useRef();
  // Remember the latest callback.
  useEffect(() => {
    // 修改参数
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      // @ts-ignore
      // 修改参数
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      // willUnMount
      return () => clearInterval(id);
    }
  }, [delay]);
}
