import { version } from '../fetch/version';
import { fetchGet } from '../fetch';

/**
 * ..description 根据代码类型获取
 * ..author 961497201..qq.com
 * ..date 2019-06-22
 * ..export
 * ..param {*} type
 * ..returns
 */
export function item(type) {
	return fetchGet(`/v${version}/Code/${type}`);
}

/**
 * 获取民族
 * ..constructor
 */
export function GetRace() {
	return fetchGet(`/v${version}/Code/1`);
}
