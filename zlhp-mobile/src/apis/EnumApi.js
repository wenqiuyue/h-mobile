import { version } from '../fetch/version';
import { fetchGet, fetchPost } from '../fetch';

/**
 * 获取枚举列表
 * ..param names
 * ..constructor
 */
export function GetList(names) {
	return fetchPost(`/v${version}/Enum/list`, names);
}

/**
 * ..description 获取单个枚举
 * ..author 961497201..qq.com
 * ..date 2019-06-22
 * ..export
 * ..returns
 */
export function GetSingle(name) {
	return fetchGet(`/v${version}/Enum/${name}`);
}

/**
 * ..description 获取全部枚举
 * ..author 961497201..qq.com
 * ..date 2019-06-22
 * ..export
 * ..returns
 */
export function GetAll() {
	return fetchGet(`/v${version}/Enum/GetAll`);
}
