import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { queryProductList, queryProductSave, queryProductUpdateFlag, queryProductOption } from '../../services/operation';

export default {
  namespace: 'product',
  state: {
    loading: false,
    btnLoading: false,
    list: [],
    periodsOptions: [],
    modals: {
      visible: false,
      currentKey: '',
      data: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'changeLoading', payload: true });
      const response = yield call(queryProductList, payload);
      yield put({ type: 'changeLoading', payload: false });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            list: response.data && response.data.productList ? response.data.productList : [],
          }
        });
      } else {
        message.error(response.msg || '出错了！');
      }
    },
    *fetchOptions({ payload }, { call, put }) {  // eslint-disable-line
      const response = yield call(queryProductOption, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            periodsOptions: response.data && response.data.paybackPeriods ? response.data.paybackPeriods : [],
          }
        });
        
      } else {
        message.error(response.msg || '出错了！');
      }
    },
    *fetchSave({ payload }, { call, put }) {  // eslint-disable-line
      const response = yield call(queryProductSave, payload);
      if (response.code === 0) {
        message.success(response.msg || '成功');
        yield put({
          type: 'hideModals',
        });
        yield put({
          type: 'fetch',
        });
      } else {
        message.error(response.msg || '出错了！');
      }
    },
    *fetchFlag({ payload }, { call, put }) {  // eslint-disable-line
      const response = yield call(queryProductUpdateFlag, payload);
      if (response.code === 0) {
        message.success(response.msg || '成功');
        yield put({
          type: 'fetch',
        });
      } else {
        message.error(response.msg || '出错了！');
      }
    },
    *showModals({ payload }, { call, put }) {
      yield put({
        type: 'changeAddModals',
        payload: {
          visible: true,
          ...payload,
        },
      });
    },
    *hideModals({ payload }, { call, put }) {
      yield put({
        type: 'changeAddModals',
        payload: {
          visible: false,
          currentKey: '',
          data: {},
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
