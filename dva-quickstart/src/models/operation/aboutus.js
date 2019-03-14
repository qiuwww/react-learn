import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { queryAboutus, queryAboutusUpdate } from '../../services/operation';

export default {
  namespace: 'aboutus',
  state: {
  	loading: false,
  	btnLoading: false,
  	data: {},
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      yield put({ type: 'changeLoading', payload: true });
      const response = yield call(queryAboutus);
      yield put({ type: 'changeLoading', payload: false });
      if (response.code === 0) {
      	if (callback) callback(response.data);
        yield put({
          type: 'save',
          payload: {
          	data: response.data,
          }
        });
      } else {
        message.error(response.msg || '出错了！');
      }
    },
    *fetchPush({ payload, callback }, { call, put }) {
      yield put({ type: 'changeBtnLoading', payload: true });
      const response = yield call(queryAboutusUpdate, { ...payload });
      yield put({ type: 'changeBtnLoading', payload: false });
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
    changeBtnLoading(state, action) {
      return {
        ...state,
        btnLoading: action.payload,
      }
    }
  }

}
