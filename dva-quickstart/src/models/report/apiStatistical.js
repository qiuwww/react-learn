import { parse } from "qs";
import { message } from "antd";
import { routerRedux } from "dva/router";
import {
  queryList,
  queryLoanList,
} from "../../services/apiStatistical";
export default {
  namespace: "apiStatistical",
  state: {
    LoanList: [],
    list: [],
    detailList: [],
    pagination: {
      current: 1,
      pageSize: 20
    },
    isNewUserList: [],
    loading: false
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      // eslint-disable-line
      yield put({ type: "changeLoading", payload: true });
      const response = yield call(queryList, payload);
      yield put({ type: "changeLoading", payload: false });
      if (response.code === 0) {
        yield put({
          type: "save",
          payload: {
            list:
              response.data && response.data.list
                ? response.data.list
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
    *queryLoanList({ payload, callback }, { call, put }) {
      // eslint-disable-line
      const response = yield call(queryLoanList, payload);
      if (response.code === 0) {
        yield put({
          type: "save",
          payload: {
            LoanList:
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
