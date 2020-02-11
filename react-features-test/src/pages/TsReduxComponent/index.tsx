import { createStore } from 'redux';
import { enthusiasm } from '../../redux/reducers/index';
import { StoreState } from '../../redux/types/index';
import { Provider } from 'react-redux';
import WrapComponent from './WrapComponent';
// 创建store
// 这里还有问题
// https://typescript.bootcss.com/tutorials/react.html
// https://juejin.im/post/5c81d10b5188257ee7275222
const store = createStore<StoreState>(enthusiasm, {
  enthusiasmLevel: 1,
  languageName: 'TypeScript',
});

// 注入store
export default () => (
  <Provider store={store}>
    <WrapComponent />
  </Provider>
);
