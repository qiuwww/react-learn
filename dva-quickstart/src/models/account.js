import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { queryAccountInto, queryAccountOut } from '../services/api';
export default {

  namespace: 'account',

  state: {
    intoList: [],
    outList: [],
    intoPagination: {
      current: 1,
      pageSize: 20,
    },
    outPagination: {
      current: 1,
      pageSize: 20,
    },
  },

  effects: {
    *fetchIntoList({ payload }, { call, put }) {  // eslint-disable-line
      const response = yield call(queryAccountInto, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            intoList: response.data && response.data.statisticAccountList ? response.data.statisticAccountList : [],
            intoPagination: response.page ? {
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
    *fetchOutList({ payload }, { call, put }) {  // eslint-disable-line
      const response = yield call(queryAccountOut, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            outList: response.data && response.data.statisticAccountList ? response.data.statisticAccountList : [],
            outPagination: response.page ? {
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
  }

}
