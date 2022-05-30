import { useRef, useEffect } from 'react';

export default function useUpdate(fn) {
  // useRef 创建一个引用，也就是创建一个闭包保存的变量
  const mounting = useRef(true);
  useEffect(() => {
    // 这里取消了componentDidMount的时候触发，只会在componentDidUpdate的时候触发了
    if (mounting.current) {
      mounting.current = false;
    } else {
      fn();
    }
  });
}
