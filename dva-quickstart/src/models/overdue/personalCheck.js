import { parse } from 'qs';
import { message } from 'antd';
import { queryExportRecord } from '../../services/overdue';
export default {

  namespace: 'personalCheck',

  state: {
  },

  effects: {
    *fetchExportRecord({ payload, callback }, { call, put }) {  // eslint-disable-line
      const response = yield call(queryExportRecord, payload);
      if (response.code === 0) {
        if (callback) callback();
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
