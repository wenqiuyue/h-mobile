import { version } from '../fetch/version';
import { fetchGet, fetchPost } from '../fetch';

/**
 * 获取全部
 * ..constructor
 */
export function GetAll() {
	return fetchGet(`/v${version}/FetalRecords/GetAll`);
}

/**
 * 保存
 * ..param params
 * ..constructor
 */
export function Post(params) {
	return fetchPost(`/v${version}/FetalRecords/Post`, params);
}
