import { version } from '../fetch/version';
import { fetchPost, fetchGet } from '../fetch';

/**
 * 问诊医生列表
 */
export function DoctorList(param) {
	return fetchPost(`/v${version}/OnlineDoctor/List`, param);
}

/**
 * 问诊医生详情
 */
export function GetDoctor(id) {
	return fetchGet(`/v${version}/OnlineDoctor/${id}`);
}
