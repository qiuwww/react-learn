import { fetchPost } from '../utils/request';

export async function queryLoanList(params) {// 查询注册放款统计
	const data = { ...params };
  if (data.currentPage) delete data.currentPage;
  if (data.pageSize) delete data.pageSize;
  return fetchPost(`/statistic/register/loan/page?currentPage=${params.currentPage || 1}&pageSize=${params.pageSize || 20}`, data);
}

export async function queryloanDetails(params) {// 渠道select
  return fetchPost('/statistic/register/loan/details', { ...params });
}
