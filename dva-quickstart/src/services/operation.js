import { fetchPost } from '../utils/request';

export async function queryAboutus(params) {// 获取关于我们信息
  return fetchPost(`/merchant/get/aboutus`, {}, 'GET');
}
export async function queryAboutusUpdate(params) {// 保存关于我们信息
  return fetchPost(`/merchant/save/aboutus`, { ...params }, 'POST');
}

export async function queryProductList(params) {// 借款产品列表
  return fetchPost('/product/get', {}, 'GET');
}

export async function queryProductSave(params) {// 产品保存
  return fetchPost('/product/save', { ...params }, 'POST');
}

export async function queryProductUpdateFlag(params) {// 产品上下架
  return fetchPost('/product/update/show/flag', { ...params }, 'POST');
}

export async function queryProductOption(params) {// 产品上下架
  return fetchPost('/product/get/option', {}, 'GET');
}

export async function queryMemberConfig(params) {// 借款产品列表
  return fetchPost('/merchant/get/member/ship/config', { ...params });
}
export async function queryMemberConfigSave(params) {// 借款产品列表
  return fetchPost('/merchant/member/ship/config/save', { ...params });
}
