import React from 'react';

export default class ErrorBoundaries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasErrors: false,
    };
  }

  // ErrorBoundary： 这里确实可以捕获到错误，进行局部的错误处理，不影响整体的显示。
  // 在未来的版本中被废弃。 
  // 使用static getDerivedStateFromError()处理退路渲染来代替。
  // 函数用来将错误信息记录到应用中。
  // 未来会被放弃
  componentDidCatch(error, info) {
    console.dir('Component Did Catch Error');
  }
  // 函数用于指定回退机制，并从收到的错误中获取组件的新状态。
  static getDerivedStateFromError(error) {
    console.dir('Get Derived State From Error');
    return {
      hasErrors: true,
    };
  }

  render() {
    // 错误处理
    // 页面不会崩溃，但是脚手架还是会提示一个错误，这里渲染出来一个文本
    if (this.state.hasErrors === true) {
      return <div>This is a Error</div>;
    }

    return (
      <div>
        <ShowData name="Mayank" />
      </div>
    );
  }
}

// 如下组件在点击按钮的时候会抛出一个错误，外层组件通过生命周期来获取错误，避免整个界面崩溃
export class ShowData extends React.Component {
  constructor() {
    super();
    this.state = {
      name: 'Mayank',
    };
  }

  changeData = () => {
    this.setState({
      name: 'Anshul',
    });
  };
  render() {
    if (this.state.name === 'Anshul') {
      throw new Error('Sample Error');
    }

    return (
      <div>
        <b>This is the Child Component {this.state.name}</b>
        <input type="button" onClick={this.changeData} value="Click To Throw Error" />
      </div>
    );
  }
}
