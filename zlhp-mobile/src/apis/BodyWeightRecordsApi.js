import { version } from '../fetch/version';
import { fetchGet, fetchPost } from '../fetch';

/**
 * 保存
 * ..param form
 * ..constructor
 */
export function Post(form) {
	return fetchPost(`/v${version}/BodyWeightRecords/Post`, form);
}

/**
 * 获取胎动记录
 * ..constructor
 */
export function GetAll() {
	return fetchGet(`/v${version}/BodyWeightRecords/GetAll`);
}
