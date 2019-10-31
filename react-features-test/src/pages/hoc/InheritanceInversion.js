// 基于反向继承：拦截生命周期、state、渲染过程
// 渲染劫持，操作state
const InheritanceInversion = Wrapcomponent => {
  console.log("原组件", Wrapcomponent);
  return class HOC extends Wrapcomponent {
    componentDidMount() {
      let messagess = document.createElement("div");
      messagess.innerHTML =
        '<p style="position:fixed;top:100px;z-index:10;background-color:black">消息类高阶组件！</p>';
      document.getElementsByTagName("body")[0].appendChild(messagess);
    }
    render() {
      // 直接调用原render函数，这里也可以更改渲染视图
      return super.render();
    }
  };
};
export default InheritanceInversion;