import { version } from '../fetch/version';
import { fetchGet, fetchPost } from '../fetch';

/**
 * 保存
 * ..param params
 * ..constructor
 */
export function Post(params) {
	return fetchPost(`/v${version}/HighRisk/Post`, params);
}

/**
 * 获取全部
 * ..constructor
 */
export function GetAllFactor() {
	return fetchGet(`/v${version}/HighRisk/GetAllFactor`);
}

/**
 * 获取全部高危自评
 * ..constructor
 */
export function GetAll() {
	return fetchGet(`/v${version}/HighRisk/GetAll`);
}
