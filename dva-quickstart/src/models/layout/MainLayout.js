/**
 * Created by ziyu on 2017/7/25.
 */

import { history } from '../../utils/config'

export default {
  namespace: 'mainLayout',
  state: {
    activeModule: '',
    menus: []
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
