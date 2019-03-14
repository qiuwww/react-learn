import { parse } from "qs";
import { message } from "antd";
import { routerRedux } from "dva/router";
import {
  queryOverdueList,
  queryNewUserList,
  queryOverdueDetails
} from "../../services/apiOverdueStatistical";
export default {
  namespace: "apiOverdueStatistical",

  state: {
    list: [],
    detailList: [],
    pagination: {
      current: 1,
      pageSize: 20
    },
    channleType: [],
    loading: false
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      // eslint-disable-line
      yield put({ type: "changeLoading", payload: true });
      const response = yield call(queryOverdueList, payload);
      yield put({ type: "changeLoading", payload: false });
      if (response.code === 0) {
        yield put({
          type: "save",
          payload: {
            list:
              response.data && response.data.statisticLoanOverdueList
                ? response.data.statisticLoanOverdueList
                : [],
            pagination: response.page
              ? {
                  pageSize: response.page.pageSize || 20,
                  current: response.page.currentPage || 1,
                  total: response.page.totalCount
                }
              : {}
          }
        });
      } else {
        message.error(response.msg || "出错了！");
      }
    },
    *fetchDetails({ payload }, { call, put }) {
      // eslint-disable-line
      yield put({ type: "changeLoading", payload: true });
      const response = yield call(queryOverdueDetails, payload);
      yield put({ type: "changeLoading", payload: false });
      if (response.code === 0) {
        yield put({
          type: "save",
          payload: {
            detailList:
              response.data && response.data.statisticLoanOverdueList
                ? response.data.statisticLoanOverdueList
                : []
          }
        });
      } else {
        message.error(response.msg || "出错了！");
      }
    },
    *fetchNewUserList({ payload, callback }, { call, put }) {
      // eslint-disable-line
      const response = yield call(queryNewUserList, payload);
      if (response.code === 0) {
        yield put({
          type: "save",
          payload: {
            channleType:
              response.data && response.data.channleType
                ? response.data.channleType
                : []
          }
        });
      } else {
        message.error(response.msg || "出错了！");
      }
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload
      };
    }
  }
};
