import React, { Component } from 'react';

// Airbnb React规范示例
class AirbnbReact extends Component {
  render() {
    return (
      <div className="regular">
        <h2>Airbnb React规范示例</h2>
        <div className="item">
          <h3>不要使用 mixins.</h3>
          Mixins会增加隐式的依赖，导致命名冲突，并且会以雪球式增加复杂度。在大多数情况下Mixins可以被更好的方法替代，如：组件化，高阶组件，工具模块等。
        </div>
        <div className="item">
          <h3>Naming 命名</h3>
          <pre>{`React模块名使用帕斯卡命名，实例使用骆驼式命名 
          // good 
          import ReservationCard from'./ReservationCard'; 
          // good
          const reservationItem = <ReservationCard />;`}
          </pre>
        </div>
        <div className="item">
          <h3>Props 属性</h3>
          标签总是添加 alt 属性. 
        </div>
      </div>
    );
  }
}

export default AirbnbReact;
