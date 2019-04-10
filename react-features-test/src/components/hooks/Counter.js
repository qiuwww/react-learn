import React, { useState, useEffect } from "react";

export default function Counter() {
  // 声明一个变量count,来保存中间值
  // useState返回两个参数，一个是当前state的值，还有一个其实是一个函数，用来改变state的值，就是setCount。
  // 它不会将旧的state跟新的state合并在一起，而是覆盖式的重写state的值。
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  // 在hooks里，这些生命周期函数都被统一成一个方法 useEffect。
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });
  return (
    <div
      className="counter-wrap"
      style={{
        border: "1px solid green"
      }}
    >
      <p>You clicked {count} times</p>
      {/* 可以不需要用this，直接使用count */}
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
