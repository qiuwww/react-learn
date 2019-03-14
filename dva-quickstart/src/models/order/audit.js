import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { queryOrderAuditPass, queryTradeSelectType } from '../../services/api';
export default {

  namespace: 'audit',

  state: {
    list: [],
    pagination: {
      current: 1,
      pageSize: 20,
    },
    loading: false,
    selectType: [],
    auditType: [],
    historyList: [],
    visible: false,
    currentKey: '',
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'changeLoading', payload: true });
      const response = yield call(queryOrderAuditPass, payload);
      yield put({ type: 'changeLoading', payload: false });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            list: response.data && response.data.auditPassTradeList ? response.data.auditPassTradeList : [],
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
            auditType: response.data.auditType || [],
            selectType: response.data.selectType || [],
          }
        });
      } else {
        message.error(response.msg || '出错了！');
      }
    },
    *saveDetails({ payload }, { call, put }) {
      console.log(payload)
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
    }
  }

}
