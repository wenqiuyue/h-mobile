import { version } from '../fetch/version';
import { fetchPost, fetchGet } from '../fetch';

/**
 *获取预约挂号记录列表
 */
export function getRegisterRecordsList(param) {
	return fetchPost(`/v${version}/RegisterRecords/List`, param);
}

/**
 *根据id获取预约挂号详情
 */
export function getRegisterRecordsById(id) {
	return fetchGet(`/v${version}/RegisterRecords/${id}`);
}
/**
 * 扫码签到，获取是否可以签到
 */
export function getAllowCheckIn(param) {
	return fetchPost(`/v${version}/RegisterRecords/GetAllowCheckIn`, param);
}
