import { fetchPost } from '../utils/request';

export async function queryLiquidationRecord(params) {// 导出未申请/未复借用户表
  return fetchPost(`/liquidation/${params}/renewal/info`, {});
}
export async function querySaveLiquidation(params) {// 导出未申请/未复借用户表
  return fetchPost('/repayment/artificial/renewal/callback', { ...params });
}
export async function queryWithHoldType(params) {// 代扣任务执行对象条件
  return fetchPost('/withhold/task/type', {}, 'GET');
}
export async function queryWithHoldDetailsStatus(params) {// 代扣详情状态
  return fetchPost('/withhold/task/details/status', {}, 'GET');
}
export async function queryWithHoldList(params) {// 批量代扣列表
  return fetchPost(`/withhold/task/page?overdue=${params.overdue || ''}&pageSize=${params.pageSize || 20}&currentPage=${params.currentPage || 1}`, {}, 'GET');
}

export async function queryWithHoldDetails(params) {// 代扣详情
  return fetchPost(`/withhold/${params.taskNo}/task/details/page?status=${params.status}&pageSize=${params.pageSize}&currentPage=${params.currentPage}`, {}, 'GET');
}
export async function queryExecuteWithHold(overdueType) {//  代扣
  return fetchPost(`/withhold/execute/task/withhold/${overdueType}`, {},);
}
