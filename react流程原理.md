# react流程原

1. 玩具react，参考<https://www.bilibili.com/video/BV1FZ4y1U7uS/?spm_id_from=333.337.search-card.all.click&vd_source=74131f1904317d4588ca09944b35c595>；；

2. React 哲学<https://zh-hans.react.dev/learn/thinking-in-react>

## createElement

1. 模板 + 变量 = 渲染方法；
2. createElement，用于将js描述的对象转为dom标签；
   1. children，递归去渲染树状结构；

```jsx
// React.createElement(tag, props, data, children);
// 这里的title，是属性集合
React.createElement('div', {title: "111"}, "11111");
```

## renderFunction

1. 递归生成dom节点的时候，可能会阻塞页面的渲染；
2. requestIdsCallback();
   1. deadline.timeRemaining();
3. 每个fiber都是一个任务单元；

```js
function perforUnitOfWork() {
  // 执行任务单元，reactElement

  // return下一个任务单元
}
// 循环去执行
function workLoop(deadLine) {
  let shouldYield = true;

  while(nextUnitOdWork && shouldYield) {
    nextUnitOdWork = perforUnitOfWork(nextUnitOdWork);
    
    shouldYield = deadLine.timeRemaining(); // 当前帧的剩余时间；
  }

  requestIdsCallback(workLoop);
}

requestIdsCallback(workLoop);
```

## ConcurrentModeAndFiber

并发模式替代

## Fibers

1. 浏览器：
   1. 60hz，刷新一次大约16.6ms；
2. 代码执行：
   1. 时间处理
   2. js执行
   3. 绘制/布局
   4. 空闲时间
3. Fiber：
   1. 调度请求，页面需要更新的时候，fiber会调用浏览器；
   2. 空闲时间去执行；
   3. 执行单元：
      1. 任务集合；
      2. 判断剩余时间及是否有更多执行单元；
         1. 需要执行，继续执行；
         2. 不需要执行，交还给浏览器控制权；

## render and commit

协调阶段

## function components

## hooks

1. 代数效应；
   1. **使用了 await语法糖的函数，也必须使用async 把函数变成异步的**。这样就变成另外一种嵌套了，async/await的异步嵌套。有时候这种代码也很烦的。
   2. 我可以异步调用一个函数，同时又不会改变我同步函数的逻辑呢？
      1. React Hooks其实可以理解为就是代数效应的最佳实践了，虽然hooks并没有创造新的语法糖，但是这种实现方式，其实就是在践行代数效应。
2. 就是状态和回调的对应关系；
3.

## schedule调度，优先级队列，数据结构，小顶堆

1. 对优先级进行排序；
