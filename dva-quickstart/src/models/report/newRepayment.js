import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { queryNewRepaymentList } from '../../services/api';
export default {

  namespace: 'newRepayment',

  state: {
    list: [],
    pagination: {
      current: 1,
      pageSize: 20,
    },
    loading: false,
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'changeLoading', payload: true });
      const response = yield call(queryNewRepaymentList, payload);
      yield put({ type: 'changeLoading', payload: false });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            list: response.data && response.data.statisticNewRepayAccountList ? response.data.statisticNewRepayAccountList : [],
            pagination: response.page ? {
              pageSize: response.page.pageSize || 20,
              current: response.page.currentPage || 1,
              total: response.page.totalCount,
            } : {},
          }
        });
      } else {
        message.error(response.msg || '出错了！');
      }
    },
  },

  reducers: {
    save (state, action) {
      return { ...state, ...action.payload }
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      }
    }
  }

}
