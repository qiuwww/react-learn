// 直接使用setInterval的问题：State not updating when using React state hook within setInterval
// 但你发现我的 useInterval 与 setInterval 之间的不同后，你会看出 它的参数是「动态地」。

// setInterval()是一个副作用。
// useEffect 使用的 count 是在第一次渲染的时候获取的。 获取的时候，它就是 0。由于一直没有重新执行 effect，所以 setInterval 在闭包中使用的 count 始终是从第一次渲染时来的，所以就有了 count + 1 始终是 1 的现象。是不是恍然大悟！如果在 hooks 中想要获取一个有记忆的 count，这时候就会想起使用 useRef 了，也该它登场了~

// 参考：https://juejin.cn/post/6973456385665138725
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
