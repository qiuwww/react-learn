import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { queryOrderRepayment, queryTradeSelectType } from '../../services/api';
export default {

  namespace: 'repayment',

  state: {
    list: [],
    pagination: {
      current: 1,
      pageSize: 20,
    },
    loading: false,
    overdueType: [],
    selectType: [],
    historyList: [],
    visible: false,
    currentKey: '',
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'changeLoading', payload: true });
      const response = yield call(queryOrderRepayment, payload);
      yield put({ type: 'changeLoading', payload: false });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            list: response.data && response.data.repaymentTradeModuleList ? response.data.repaymentTradeModuleList : [],
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
    *fetchSelect({ payload }, { call, put }) {
      const response = yield call(queryTradeSelectType, payload);
      if (response.code === 0 && response.data) {
        yield put({
          type: 'save',
          payload: {
            overdueType: response.data.overdueType || [],
            selectType: response.data.selectType || [],
          }
        });
      } else {
        message.error(response.msg || '出错了！');
      }
    },
    *saveHistoryList({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          ...payload,
          visible: true,
        }
      });
    },
    *hideModal({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          visible: false,
          currentKey: '',
        },
      });
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
    },
    changeModal(state, action) {
      return {
        ...state,
        visible: action.payload,
      }
    },
  }

}
