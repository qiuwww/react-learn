import { fetchPost } from '../utils/request';

export async function queryExportRecord(params) {// 导出前记录
  return fetchPost('/user/export/record', { ...params });
}
