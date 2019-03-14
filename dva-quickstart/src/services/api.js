import { fetchPost } from '../utils/request';

export async function queryChannelList(params) {// 渠道列表
  return fetchPost(`/channel/page?currentPage=${params.currentPage || 1}&pageSize=${params.pageSize || 20}`, {}, 'GET');
}

export async function queryChannelSelect(params) {// 渠道select
  return fetchPost('/channel/list', {}, 'GET');
}

export async function queryChannelSave(params) {// 保存渠道
  return fetchPost('/channel/save', { ...params });
}

export async function queryAccountInto(params) {// 入账
  const data = { ...params };
  if (data.currentPage) delete data.currentPage;
  if (data.pageSize) delete data.pageSize;
  return fetchPost(`/statistic/account/into?currentPage=${params.currentPage || 1}&pageSize=${params.pageSize || 20}`, { ...data });
}

export async function queryAccountOut(params) {// 出账
  const data = { ...params };
  if (data.currentPage) delete data.currentPage;
  if (data.pageSize) delete data.pageSize;
  return fetchPost(`/statistic/account/out?currentPage=${params.currentPage || 1}&pageSize=${params.pageSize || 20}`, { ...data });
}

export async function queryStatisticalLoanList(params) {// 查询注册放款统计
  const data = { ...params };
  if (data.currentPage) delete data.currentPage;
  if (data.pageSize) delete data.pageSize;
  return fetchPost(`/statistic/loan/account/page?currentPage=${params.currentPage || 1}&pageSize=${params.pageSize || 10}`, data);
}
export async function queryStatisticalRepaymentList(params) {// 查询注册放款统计
  const data = { ...params };
  if (data.currentPage) delete data.currentPage;
  if (data.pageSize) delete data.pageSize;
  return fetchPost(`/statistic/repayment/account/page?currentPage=${params.currentPage || 1}&pageSize=${params.pageSize || 20}`, data);
}

export async function queryNewRepaymentList(params) {// 新还款统计
  const data = { ...params };
  if (data.currentPage) delete data.currentPage;
  if (data.pageSize) delete data.pageSize;
  return fetchPost(`/statistic/new_repayment/account/page?currentPage=${params.currentPage || 1}&pageSize=${params.pageSize || 20}`, data);
}
export async function queryConsumeFeeList(params) {// 新还款统计
  const data = { ...params };
  if (data.currentPage) delete data.currentPage;
  if (data.pageSize) delete data.pageSize;
  return fetchPost(`/statistic/consume_fee/page?currentPage=${params.currentPage || 1}&pageSize=${params.pageSize || 20}`, data);
}

export async function queryTradeSelectType(params) {// 逾期状态/订单状态
  return fetchPost('/trade/get/select_type', {}, 'GET');
}

export async function queryOrderAuditPass(params) {// 机审通过订单列表
  const data = { ...params };
  if (data.currentPage) delete data.currentPage;
  if (data.pageSize) delete data.pageSize;
  return fetchPost(`/trade/audit_pass/page?currentPage=${params.currentPage || 1}&pageSize=${params.pageSize || 20}`, data);
}

export async function queryOrderRepayment(params) {// 还款订单列表 (待还 已还)
  const data = { ...params };
  if (data.currentPage) delete data.currentPage;
  if (data.pageSize) delete data.pageSize;
  return fetchPost(`/trade/repayment/page?currentPage=${params.currentPage || 1}&pageSize=${params.pageSize || 20}`, data);
}

export async function queryNoApplyList(params) {// 注册未申请
  const data = { ...params };
  if (data.currentPage) delete data.currentPage;
  if (data.pageSize) delete data.pageSize;
  return fetchPost(`/user/register/noapply/page?currentPage=${params.currentPage || 1}&pageSize=${params.pageSize || 20}`, data);
}
export async function queryNormalRepayment(params) {// 正常还款未复借
  const data = { ...params };
  if (data.currentPage) delete data.currentPage;
  if (data.pageSize) delete data.pageSize;
  return fetchPost(`/user/normal/repayment/norepeat/borrow/page?currentPage=${params.currentPage || 1}&pageSize=${params.pageSize || 20}`, data);
}
export async function queryStatisticBoard(params) {// 报表 数据看板
  return fetchPost('/statistic/data/board', { ...params });
}

export async function queryExportUserRecord(params) {// 导出未申请/未复借用户表
  return fetchPost('/user/export/record', { ...params });
}


export async function queryNewLoanList(params) {// 新放款
  const data = { ...params };
  if (data.currentPage) delete data.currentPage;
  if (data.pageSize) delete data.pageSize;
  return fetchPost(`/statistic/loan/account/page?currentPage=${params.currentPage || 1}&pageSize=${params.pageSize || 10}`, data);
}
