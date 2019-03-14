import { fetchPost } from '../utils/request';

export async function queryOverdueList(params) {// 查询放款逾期统计
	const data = { ...params };
  if (data.currentPage) delete data.currentPage;
  if (data.pageSize) delete data.pageSize;
  return fetchPost(`/statistic/loan/overdue/page?currentPage=${params.currentPage || 1}&pageSize=${params.pageSize || 20}`, data);
}

export async function queryNewUserList() {// 渠道select
  return fetchPost('/statistic/select/type', {}, 'GET');
}

export async function queryOverdueDetails(params) {
  return fetchPost('/statistic/loan/overdue/details', { ...params });
}
