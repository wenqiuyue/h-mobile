import { version } from '../fetch/version';
import { fetchGet } from '../fetch';

/**
 * 获取列表
 * ..constructor
 */
export function GetHisCheckRecordList() {
	return fetchGet(`/v${version}/ChildrenCheckRecords/GetHisCheckRecordList`);
}

/**
 * 获取详情
 * ..constructor
 */
export function GetHisCheckRecordDetail(id) {
	return fetchGet(
		`/v${version}/ChildrenCheckRecords/GetHisCheckRecordDetail/${id}`
	);
}

/**
 * 获取儿童编号
 * ..constructor
 */
export function GetAllNo() {
	return fetchGet(`/v${version}/ChildrenCheckRecords/GetAllNo`);
}
