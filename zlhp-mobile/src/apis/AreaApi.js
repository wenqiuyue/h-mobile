import { version } from '../fetch/version';
import { fetchGet, fetchPost } from '../fetch';

/**
 * ..description 根据code集合获取对应集合数据
 * ..author 961497201..qq.com
 * ..date 2019-06-22
 * ..export
 * ..param {*} codes
 * ..returns
 */
export function CodeList(codes) {
	return fetchPost(`/v${version}/Area/codes`, codes);
}

/**
 * ..description 根据code集合获取对应集合数据
 * ..author 961497201..qq.com
 * ..date 2019-06-22
 * ..export
 * ..param {*} codes
 * ..returns
 */
export function CodeList2(codes) {
	return fetchPost(`/v${version}/Area/codes2`, codes);
}

/**
 * ..description 根据行政区划等级获取
 * ..author 961497201..qq.com
 * ..date 2019-06-22
 * ..export
 * ..param {*} level
 * ..returns
 */
export function list(level) {
	return fetchGet(`/v${version}/Area/list/${level}`);
}

/**
 * ..description 根据上级ID获取
 * ..author 961497201..qq.com
 * ..date 2019-06-22
 * ..export
 * ..param {*} pid
 * ..returns
 */
export function listByPid(pid) {
	return fetchGet(`/v${version}/Area/listByPid/${pid}`);
}

/**
 * 获取所有父节点
 * ..param code
 * ..constructor
 */
export function GetByCode(code) {
	return fetchGet(`/v${version}/Area/GetByCode/${code}`);
}

/**
 * 获取站点默认行政区划
 * ..constructor
 */
export function GetBySiteArea() {
	return fetchGet(`/v${version}/Area/GetBySiteArea`);
}
