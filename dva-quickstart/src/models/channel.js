import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { queryChannelList, queryChannelSave, queryChannelSelect } from '../services/api';
export default {

  namespace: 'channel',

  state: {
    list: [],
    selectList: [],
    pagination: {
      current: 1,
      pageSize: 20,
    },
    addModals: {
      visible: false,
      currentKey: '',
    },
    loading: false,
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'changeLoading', payload: true });
      const response = yield call(queryChannelList, payload);
      yield put({ type: 'changeLoading', payload: false });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            list: response.data && response.data.channelList ? response.data.channelList : [],
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
    *fetchSave({ payload, callback }, { call, put }) {  // eslint-disable-line
      const response = yield call(queryChannelSave, parse(payload));
      if (response.code === 0) {
        yield put({
          type: 'hideAddModals',
        });
      } else {
        message.error(response.msg || '出错了！');
      }
      if (callback) callback(response);
    },
    *fetchSelect({ payload }, { call, put }) {  // eslint-disable-line
      const response = yield call(queryChannelSelect);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            selectList: response.data && response.data.channelList ? response.data.channelList : [],
          }
        });
      } else {
        message.error(response.msg || '出错了！');
      }
    },
    
    *showAddModals({ payload }, { call, put }) {
      yield put({
        type: 'changeAddModals',
        payload: {
          ...payload,
          visible: true,
        },
      });
    },
    *hideAddModals({ payload }, { call, put }) {
      yield put({
        type: 'changeAddModals',
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
    changeAddModals(state, action) {
      return {
        ...state,
        addModals: {
          ...state.addModals,
          ...action.payload,
        }
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      }
    }
  }

}
