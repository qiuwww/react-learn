import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { queryUpdateBlack, queryGetBlackSelect } from '../../services/user';
export default {

  namespace: 'manage',

  state: {
    blackSelect: [],
  },

  effects: {
    *fetchUpdateBlack({ payload, callback }, { call, put }) {
      /*{
        "userCode":"",
        "type": number,  1: 黑名单（风控直接拒绝）2: 删除用户
        "operationType":""
      }*/
      const response = yield call(queryUpdateBlack, payload);
      if (response.code === 0) {
        message.success('操作成功');
        if (callback) callback();
      } else {
        message.error(response.msg || '出错了！');
      }
    },
    *fetchBlackSelect({ payload, callback }, { call, put }) {
      const response = yield call(queryGetBlackSelect, payload);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: {
            blackSelect: response.data.userClassEnum || [],
          }
        });
      } else {
        message.error(response.msg || '出错了！');
      }
    },
  },

  reducers: {
    save (state, action) {
      return { ...state, ...action.payload }
    },
  }
}
