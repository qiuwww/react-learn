import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { queryLiquidationRecord, querySaveLiquidation } from '../../services/affairs';
export default {

  namespace: 'payBack',

  state: {
    data: {},
    modals: {
      visible: false,
      currentKey: '',
    },
    loading: false,
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'changeLoading', payload: true });
      const response = yield call(queryLiquidationRecord, payload);
      yield put({ type: 'changeLoading', payload: false });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            data: response.data && response.data.renewalInfo ? response.data.renewalInfo : {},
          }
        });
        yield put({
          type: 'showModals',
        });
      } else {
        message.error(response.msg || '出错了！');
      }
    },
    *fetchSave({ payload, callback }, { call, put }) {  // eslint-disable-line
      const response = yield call(querySaveLiquidation, payload);
      if (callback) callback();
      if (response.code === 0) {
        yield put({
          type: 'hideModals',
        });
        message.success('展期成功');
      } else {
        message.error(response.msg || '出错了！');
      }
    },
    *showModals({ payload }, { call, put }) {
      yield put({
        type: 'changeAddModals',
        payload: {
          visible: true,
        },
      });
    },
    *hideModals({ payload }, { call, put }) {
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
        modals: {
          ...state.modals,
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
