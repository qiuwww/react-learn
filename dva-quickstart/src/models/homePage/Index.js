/**
 * Created by ziyu on 2017/7/25.
 */

export default {
  namespace: 'homePageIndex',
  state: {

  },
  reducers: {
    save (state, { payload }) {
      return {...state, ...payload}
    }
  },
  effects: {

  },
  subscriptions: {
    setup ({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {

      })
    }
  }
}
