import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { queryMemberConfig, queryMemberConfigSave } from '../../services/operation';

export default {
  namespace: 'member',
  state: {
    loading: false,
    btnLoading: false,
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'changeLoading', payload: true });
      const response = yield call(queryMemberConfig, payload);
      yield put({ type: 'changeLoading', payload: false });
      if (response.code === 0) {
        if (callback) callback(response.data);
      } else {
        message.error(response.msg || '出错了！');
      }
    },
    *fetchSave({ payload }, { call, put }) {  // eslint-disable-line
      const response = yield call(queryMemberConfigSave, payload);
      if (response.code === 0) {
        message.success(response.msg || '成功');
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
    },
    changeAddModals(state, action) {
      return {
        ...state,
        modals: {
          ...state.modals,
          ...action.payload,
        }
      };
    },
  }

}
