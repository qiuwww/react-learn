import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { queryWithHoldType, queryWithHoldDetailsStatus, queryWithHoldList, queryWithHoldDetails, queryExecuteWithHold } from '../../services/affairs';
export default {

  namespace: 'withholding',

  state: {
    list: [],
    typeList: [],
    statusList: [],
    pagination: {
      pageSize: 20,
      current: 1,
    },
    detailsList: [],
    detailsPage: {
      pageSize: 30,
      current: 1,
    },
    loading: false,
    buttonLoading: false,
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'changeLoading', payload: true });
      const response = yield call(queryWithHoldList, payload);
      yield put({ type: 'changeLoading', payload: false });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            list: response.data && response.data.withHoldTaskList ? response.data.withHoldTaskList : [],
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
    *fetchDetails({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'changeLoading', payload: true });
      const response = yield call(queryWithHoldDetails, payload);
      yield put({ type: 'changeLoading', payload: false });
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            detailsList: response.data && response.data.withHoldTaskDetailList ? response.data.withHoldTaskDetailList : [],
            detailsPage: response.page ? {
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
    *fetchWithHoldType({ payload }, { call, put }) {  // eslint-disable-line
      const response = yield call(queryWithHoldType, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            typeList: response.data && response.data.type ? response.data.type : [],
          }
        });
      } else {
        message.error(response.msg || '出错了！');
      }
    },
    *fetchWithHoldStatus({ payload }, { call, put }) {  // eslint-disable-line
      const response = yield call(queryWithHoldDetailsStatus, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            statusList: response.data && response.data.status ? response.data.status : [],
          }
        });
      } else {
        message.error(response.msg || '出错了！');
      }
    },
    *fetchExecute({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'changeBtnLoading', payload: true });
      const response = yield call(queryExecuteWithHold, payload);
      yield put({ type: 'changeBtnLoading', payload: false });
      if (response.code === 0) {
        message.success(response.msg || '成功！');
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
        buttonLoading: action.payload,
      }
    }
  }

}
