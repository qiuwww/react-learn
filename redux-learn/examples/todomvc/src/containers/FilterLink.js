import { connect } from 'react-redux'
import { setVisibilityFilter } from '../actions'
import Link from '../components/Link'


// mapStateToProps定义了，就是要组件去监听store的改变。必须返回一个纯对象，这个对象会与组件的 props 合并
// ownProps则该参数的值为   传递到组件的props， 方便于操作props

// vuex中的mapState
const mapStateToProps = (state, ownProps) => ({ // 监听state与props
  active: ownProps.filter === state.visibilityFilter
})

// 参数是(Object or Function)， 触发时间 mapMutation
const mapDispatchToProps = (dispatch, ownProps) => ({
	// 对象所定义的方法名将作为属性名；每个方法将返回一个新的函数，函数中dispatch方法会将action creator的返回值作为参数执行。这些属性会被合并到组件的 props 中。
  setFilter: () => { // 每个定义在该对象的函数都将被当作 Redux action creator
    dispatch(setVisibilityFilter(ownProps.filter))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Link)
