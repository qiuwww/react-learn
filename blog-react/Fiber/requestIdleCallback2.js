const sleep = (delay) => {
  const start = Date.now();
  while (Date.now() - start <= delay) {}
};
const taskQueue = [
  () => {
    console.log('task1 start');
    sleep(10);
    console.log('task1 end');
  },
  () => {
    console.log('task2 start');
    sleep(10);
    console.log('task2 end');
  },
  () => {
    console.log('task3 start');
    sleep(10);
    console.log('task3 end');
  },
];
const performUnitWork = () => {
  taskQueue.shift()();
};
const workloop = (deadline) => {
  console.log(`此帧的剩余时间为: ${deadline.timeRemaining()}`);
  while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && taskQueue.length > 0) {
    performUnitWork();
  }
  if (taskQueue.length > 0) {
    window.requestIdleCallback(workloop, { timeout: 1000 });
  }
};
requestIdleCallback(workloop, { timeout: 1000 });
