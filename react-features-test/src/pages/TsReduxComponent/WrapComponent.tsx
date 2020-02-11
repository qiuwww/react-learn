import Hello from './components/Hello';
import * as actions from '../../redux/actions';
import { StoreState } from '../../redux/types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

export function mapStateToProps({ enthusiasmLevel, languageName }: StoreState) {
  return {
    enthusiasmLevel,
    name: languageName,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.EnthusiasmAction>) {
  return {
    onIncrement: () => dispatch(actions.incrementEnthusiasm()),
    onDecrement: () => dispatch(actions.decrementEnthusiasm()),
  };
}

//  connect可以将我们的Hello组件转换成一个容器，通过以下两个函数：
// mapStateToProps将当前store里的数据以我们的组件需要的形式传递到组件。
// mapDispatchToProps利用dispatch函数，创建回调props将actions送到store。
export default connect(mapStateToProps, mapDispatchToProps)(Hello);
