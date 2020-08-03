import { version } from '../fetch/version';
import { fetchGet, fetchPost } from '../fetch';

/**
 * ..description 插入并更新
 * ..author 961497201..qq.com
 * ..date 2019-06-22
 * ..export
 * ..param {*} id
 * ..param binding
 * ..param {*} params
 * ..returns
 */
export function insertOrUpdate(id, binding, params) {
	return fetchPost(`/v${version}/PersonArchive/${id}/${binding}`, params);
}

/**
 * 获取选择列表
 * ..constructor
 */
export function GetChooseList() {
	return fetchGet(`/v${version}/PersonArchive/GetChooseList`);
}

/**
 * 获取个人档案
 *  供建档使用的模板数据
 * ..constructor
 */
export function GetPutOnRecordTemplate(id) {
	return fetchGet(`/v${version}/PersonArchive/GetPutOnRecordTemplate/${id}`);
}

/**
 * 获取个人档案编号
 * ..returns {*}
 * ..constructor
 */
export function GetAllNo() {
	return fetchGet(`/v${version}/PersonArchive/GetAllNo`);
}
