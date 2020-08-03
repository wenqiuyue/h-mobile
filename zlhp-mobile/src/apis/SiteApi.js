import { version } from '../fetch/version';
import { fetchGet } from '../fetch';

/**
 * 是否可以签到
 */
export function canSignIn() {
	return fetchGet(`/v${version}/Site/CanSignIn`);
}

/**
 * 获取距离医院多少米
 * @returns {Promise<unknown>}
 * @constructor
 */
export function GetNowDistance() {
	return fetchGet(`/v${version}/Site/GetNowDistance`);
}

/**
 * 获取当前站点
 * ..constructor
 */
export function Current(SectionModelVal) {
	return fetchGet(`/v${version}/Site/Current/${SectionModelVal}`);
}

/**
 * 获取全部站点
 * ..constructor
 */
export function GetAll() {
	return fetchGet(`/v${version}/Site/GetAll`);
}

/**
 * 获取距离站点的距离
 * ..param uuid
 * ..constructor
 */
export function GetDistance(uuid) {
	return fetchGet(`/v${version}/Site/GetDistance/${uuid}`);
}

/**
 * 获取当前站点名
 * ..returns {Promise<unknown>}
 * ..constructor
 */
export function GetCurrentName() {
	return fetchGet(`/v${version}/Site/GetCurrentName`);
}
