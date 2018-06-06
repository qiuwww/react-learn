import React, { Component } from 'react'
// 运行时类型检查React道具和类似的对象。

// 使用 PropTypes 进行类型检查
import PropTypes from 'prop-types'

// react组件
class Counter extends Component {
  constructor(props) {
    // props添加到当前实例
    super(props);
    // 添加事件操作
    this.incrementAsync = this.incrementAsync.bind(this);
    this.incrementIfOdd = this.incrementIfOdd.bind(this);
  }
  // 事件的回调
  incrementIfOdd() {
    if (this.props.value % 2 !== 0) {
      // 调用到dispatch上，处理数据
      this.props.onIncrement()
    }
  }

  incrementAsync() {
    setTimeout(this.props.onIncrement, 1000)
  }

  render() {
    const { value, onIncrement, onDecrement } = this.props
    return (
      <p>
        Clicked: {value} times
        {' '}
        <button onClick={onIncrement}>
          +
        </button>
        {' '}
        <button onClick={onDecrement}>
          -
        </button>
        {' '}
        <button onClick={this.incrementIfOdd}>
          Increment if odd
        </button>
        {' '}
        <button onClick={this.incrementAsync}>
          Increment async
        </button>
      </p>
    )
  }
}
// PropTypes 包含一整套验证器，可用于确保你接收的数据是有效的。
// https://doc.react-china.org/docs/typechecking-with-proptypes.html
// 类型检查，类型指定
// 当你给属性传递了无效值时，JavsScript 控制台将会打印警告。出于性能原因，propTypes 只在开发模式下进行检查。
Counter.propTypes = {
  value: PropTypes.number.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired
}

export default Counter
