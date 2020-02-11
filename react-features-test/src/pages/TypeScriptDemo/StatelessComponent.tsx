import * as React from 'react';

// 定义接受的参数格式，接口
interface Props {
  name: string;
  count?: number;
}
// 定义了一个类型Props，它指定了我们组件要用到的属性。 name是必需的且为string类型，同时count是可选的且为number类型
const Counter = ({ name, count = 1 }: Props) => (
  <div>
    Counter {name}: {count}
  </div>
);

console.log('StatelessComponent打印当前的组件的属性值Counter：', Counter.prototype);

const StatelessComponent = () => (
  <div>
    <Counter name="StatelessComponent test" count={2}></Counter>
  </div>
);

export default StatelessComponent;
