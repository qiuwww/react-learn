import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { queryStatisticalRepaymentList } from '../../services/api';
export default {

  namespace: 'reportRepayment',

  state: {
    list: [],
    pagination: {
      current: 1,
      pageSize: 20,
    },
    loading: false,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'changeLoading', payload: true });
      const response = yield call(queryStatisticalRepaymentList, payload);
      yield put({ type: 'changeLoading', payload: false });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            list: response.data && response.data.statisticRepayAccountList ? response.data.statisticRepayAccountList : [],
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
