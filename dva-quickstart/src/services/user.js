import { fetchPost } from '../utils/request';

export async function queryUpdateBlack(params) {// 导出未申请/未复借用户表
  return fetchPost('/user/update/special', { ...params });
}

export async function queryGetBlackSelect() {// 获取黑名单下拉菜单
  return fetchPost('/user/select/special/type', {}, 'GET');
}
