// 使用默认的
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

// 使用自己实现

// 默认引入这个文件，就引入了createElement
// import React, {Component} from './kreact';
// import ReactDOM from './kreact-dom';

function Comp(props) {
  return <h2>hi {props.name}</h2>;
}

class Comp2 extends Component {
  render() {
    return (
      <div>
        <h2>hi {this.props.name}</h2>
      </div>
    );
  }
}

// vdom
const users = [
  {name: 'tom', age: 20},
  {name: 'jerry', age: 20},
];
const jsx = (
  <div id="demo" style={{color: 'red', border: '1px solid green'}}>
    <span onClick={() => alert('click')}>hi</span>
    <Comp name="函数组件" />
    <Comp2 name="类组件" />
    <ul>
      {users.map(user => (
        <li key={user.name}>{user.name}</li>
      ))}
    </ul>
  </div>
);

console.log('打印出来Comp2:', Comp2.prototype);
console.log('React.Component:', Component.prototype);
// 这里的jsx转成js对象是webpack做的，babel转译的
console.log('打印出来jsx，查看jsx的解析结果，也就是createElement的结果：', jsx);

ReactDOM.render(jsx, document.querySelector('#root'));
