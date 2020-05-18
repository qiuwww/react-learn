import * as _ from './util';
import {
  renderComponent,
  clearPending,
  compareTwoVnodes,
  getChildContext,
  syncCache,
} from './virtual-dom';

// 更新队列
// 内部存放若干更新器
export let updateQueue = {
  // 存放更新器，一堆盆子
  updaters: [],
  // 是否正在依据state和props去更新
  isPending: false,
  add(updater) {
    this.updaters.push(updater);
  },
  batchUpdate() {
    if (this.isPending) {
      return;
    }
    this.isPending = true;
    let { updaters } = this;
    let updater;
    // 依次弹出更新器，然后去执行updateComponent
    // 从前面拿对象去更新
    while ((updater = updaters.pop())) {
      updater.updateComponent();
    }
    this.isPending = false;
  },
};

// $updater的类
class Updater {
  constructor(instance) {
    this.instance = instance;
    // 盆子
    this.pendingStates = []; // 待处理状态数组
    // 闹钟/记事本，后续的事情
    this.pendingCallbacks = [];
    // 当前更新其是否正在更新dom
    this.isPending = false;
    this.nextProps = this.nextContext = null;
    this.clearCallbacks = this.clearCallbacks.bind(this);
  }

  // 如下，订阅发布
  // 接受两个参数：接下来的属性和接下来的上下文

  // 如下函数被调用，有两种可能：
  // 1.父组件传递的props改变的时候调用，是传递参数的；
  // 2. 自身setState之后调用是无参数的。
  emitUpdate(nextProps, nextContext) {
    this.nextProps = nextProps;
    this.nextContext = nextContext;
    // receive nextProps!! should update immediately
    // 1. 属性引起的更新会直接更新，就是传递了nextProps
    // 2. 如果没有在更新就去更新。
    // 3. 否则就把当前的上下文添加到更新队列中，updateQueue.add(this)
    nextProps || !updateQueue.isPending
      ? // 如果没在更新就去更新，如果在更新就添加一条state到队列中
        this.updateComponent()
      : updateQueue.add(this);
  }
  updateComponent() {
    let { instance, pendingStates, nextProps, nextContext } = this;
    if (nextProps || pendingStates.length > 0) {
      nextProps = nextProps || instance.props;
      nextContext = nextContext || instance.context;
      this.nextProps = this.nextContext = null;
      // getState 合并所有的state的数据，一次更新
      shouldUpdate(
        instance,
        nextProps,
        this.getState(),
        nextContext,
        this.clearCallbacks
      );
    }
  }
  // 每次setState的时候，要添加一个新的状态到pendingStates数组中，
  // 并且判断当前是否正在更新，如果没有就立即更新
  addState(nextState) {
    if (nextState) {
      this.pendingStates.push(nextState);
      if (!this.isPending) {
        this.emitUpdate();
      }
    }
  }
  // 合并state的操作
  getState() {
    // 这个阶段，状态是一定要合并的，至于更新不更新通过shouldUpdate进行判断；
    // componentWillReviceProps 这个时候控制props时候接受
    // static getDerivedStateFromProps 控制接受props
    let { instance, pendingStates } = this;
    let { state, props } = instance;
    if (pendingStates.length) {
      // 当前的state
      state = { ...state };
      // 循环执行，循环合并state
      pendingStates.forEach((nextState) => {
        let isReplace = _.isArr(nextState);
        // 如果是一个数组，就进行覆盖操作
        if (isReplace) {
          nextState = nextState[0];
        }
        // 这里就是传递的函数操作state类型
        // 如果是一个函数，就直接调用，更新实例上的state
        // 也只是当前的一个setState
        if (_.isFn(nextState)) {
          // 回调函数形式可以直接拿到更新的状态
          nextState = nextState.call(instance, state, props);
        }
        // 这里就是控制状态是否更新的处理
        // replace state
        if (isReplace) {
          state = { ...nextState };
        } else {
          // 通常我们的setState会走到这一步
          state = { ...state, ...nextState };
        }
      });
      pendingStates.length = 0;
    }
    return state;
  }
  clearCallbacks() {
    let { pendingCallbacks, instance } = this;
    if (pendingCallbacks.length > 0) {
      this.pendingCallbacks = [];
      pendingCallbacks.forEach((callback) => callback.call(instance));
    }
  }
  addCallback(callback) {
    if (_.isFn(callback)) {
      this.pendingCallbacks.push(callback);
    }
  }
}

// Component组件实现
export default class Component {
  static isReactComponent = {};

  constructor(props, context) {
    this.$updater = new Updater(this);
    // $cache记录上一次的结果
    this.$cache = { isMounted: false };
    this.props = props;
    this.state = {};
    this.refs = {};
    this.context = context;
  }
  // 直接更新
  // 跳过任何生命周期
  forceUpdate(callback) {
    // 实际更新组件的函数
    let { $updater, $cache, props, state, context } = this;
    if (!$cache.isMounted) {
      return;
    }
    if ($updater.isPending) {
      $updater.addState(state);
      return;
    }
    // 上一次的状态 ｜ 上下文
    let nextProps = $cache.props || props;
    let nextState = $cache.state || state;
    let nextContext = $cache.context || context;
    let parentContext = $cache.parentContext;
    // 上一次处理完成的真实节点
    let node = $cache.node;
    // 上一次处理完成的虚拟节点
    let vnode = $cache.vnode;
    // 缓存
    $cache.props = $cache.state = $cache.context = null;
    $updater.isPending = true;
    if (this.componentWillUpdate) {
      this.componentWillUpdate(nextProps, nextState, nextContext);
    }
    this.state = nextState;
    this.props = nextProps;
    this.context = nextContext;

    // 下面才是重点  对比vnode
    // 调用当前的render方法，得到最新的虚拟dom
    let newVnode = renderComponent(this);
    // 虚拟dom的对比，compareTwoVnodes
    let newNode = compareTwoVnodes(
      vnode,
      newVnode,
      node,
      getChildContext(this, parentContext)
    );
    if (newNode !== node) {
      newNode.cache = newNode.cache || {};
      syncCache(newNode.cache, node.cache, newNode);
    }
    $cache.vnode = newVnode;
    $cache.node = newNode;
    // 清除pending 执行didmount生命周期
    clearPending();
    if (this.componentDidUpdate) {
      this.componentDidUpdate(props, state, context);
    }
    if (callback) {
      callback.call(this);
    }
    $updater.isPending = false;
    $updater.emitUpdate();
    // 更新
  }
  // 更新的对象和callback
  // 核心点
  setState(nextState, callback) {
    // 添加异步队列  不是每次都更新
    this.$updater.addCallback(callback);
    this.$updater.addState(nextState);
  }
}

// 拿到最新的state，去更新页面，也有可能不更新页面
function shouldUpdate(component, nextProps, nextState, nextContext, callback) {
  // 是否应该更新 判断shouldComponentUpdate生命周期
  let shouldComponentUpdate = true;
  // component.shouldComponentUpdate，生命周期shouldComponentUpdate的返回值
  if (component.shouldComponentUpdate) {
    shouldComponentUpdate = component.shouldComponentUpdate(
      nextProps,
      nextState,
      nextContext
    );
  }
  // 只修改数据，不更新
  if (shouldComponentUpdate === false) {
    component.props = nextProps;
    component.state = nextState;
    component.context = nextContext || {};
    return;
  }
  let cache = component.$cache;
  cache.props = nextProps;
  cache.state = nextState;
  cache.context = nextContext || {};
  // forceUpdate跳过任何生命周期直接去做更新
  component.forceUpdate(callback);
}
