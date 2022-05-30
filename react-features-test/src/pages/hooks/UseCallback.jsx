import React, { useCallback, useState } from 'react';

const Button = React.memo(({ onClickButton, children }) => {
  console.log('Button');
  return (
    <>
      <button onClick={onClickButton}>{children}</button>
      <span>{Math.random()}</span>
    </>
  );
});

export default function Index() {
  // 内部点击按钮也会引起整个组件的更新
  console.log('UseCallback');

  // 1. 而有了 useCallback 就不一样了，你可以通过 useCallback 获得一个记忆后的函数。
  // 2. 第二个参数传入一个数组，数组中的每一项一旦值或者引用发生改变，useCallback 就会重新返回一个新的记忆函数提供给后面进行渲染。
  // 3. 这样只要子组件继承了 PureComponent 或者使用 React.memo 就可以有效避免不必要的 VDOM 渲染。
  // 4. useCallback(fn, deps) 相当于 useMemo(() => fn, deps)。

  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);

  // 这里应该是会重新生成这个函数
  const handleClickButton1 = () => {
    console.log('handleClickButton1');
    setCount1(count1 + 1);
  };
  // 由于我们的这个方法只依赖了 count2 这个变量，而且 count2 只在点击 Button2 后才会更新 handleClickButton2，所以就导致了我们点击 Button1 不重新渲染 Button2 的内容。
  const handleClickButton2 = useCallback(() => {
    console.log('handleClickButton2');

    setCount2(count2 + 1);
  }, [count2]); // count2 改变函数才会改变

  // 当前父组件修改的时候，会导致子组件Button的变更
  return (
    <>
      <div>
        <Button onClickButton={handleClickButton1}>Button1</Button>
      </div>
      <div>
        {/* 只有经过 useCallback 优化后的 Button2 是点击自身时才会变更，其他的两个只要父组件更新后都会变更 */}
        <Button onClickButton={handleClickButton2}>Button2</Button>
      </div>
      <div>
        <Button
          onClickButton={() => {
            setCount3(count3 + 1);
          }}
        >
          Button3
        </Button>
      </div>
    </>
  );
}
