// diff
// vtype元素类型：1-html元素；2-function组件；3-class组件
export function createVNode(vtype, type, props) {
  const vnode = {vtype, type, props};
  return vnode;
}

// vdom转换为dom
export function initVNode(vnode) {
  const {vtype} = vnode;
  if (!vtype) {
    // 文本节点
    return document.createTextNode(vnode);
  } else if (vtype === 1) {
    // 原生元素
    return createRealElement(vnode);
  } else if (vtype === 2) {
    // 类组件
    return createClassComp(vnode);
  } else if (vtype === 3) {
    // 函数组件
    return createFuncComp(vnode);
  }
}
// 创建原生节点
function createRealElement(vnode) {
  // 根据type创建元素
  const {type, props} = vnode;
  const node = document.createElement(type);

  // 处理属性
  const {key, children, ...rest} = props;
  Object.keys(rest).forEach(k => {
    // 处理特殊属性名：className，htmlFor
    // JSX语法转html属性
    if (k === 'className') {
      node.setAttribute('class', rest[k]);
    } else if (k === 'htmlFor') {
      node.setAttribute('for', rest[k]);
    } else if (k === 'style' && typeof rest[k] === 'object') {
      const style = Object.keys(rest[k])
        .map(s => s + ':' + rest[k][s])
        .join(';');
      node.setAttribute('style', style);
    } else if (k.startsWith('on')) {
      // (/^on.+/).test(k);
      // onClick
      const event = k.toLowerCase();
      node[event] = rest[k];
    } else {
      node.setAttribute(k, rest[k]);
    }
  });

  // 递归子元素
  children.forEach(c => {
    if (Array.isArray(c)) {
      c.forEach(n => node.appendChild(initVNode(n)));
    } else {
      node.appendChild(initVNode(c));
    }
  });

  return node;
}
// class组件转换
function createClassComp(vnode) {
  // type是class组件声明
  const {type, props} = vnode;
  // type就是子组件的构造函数，类
  const component = new type(props);
  const vdom = component.render();
  return initVNode(vdom);
}
function createFuncComp(vnode) {
  // type是函数
  const {type, props} = vnode;
  const vdom = type(props);
  return initVNode(vdom);
}
