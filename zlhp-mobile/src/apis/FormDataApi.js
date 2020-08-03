import { version } from '../fetch/version';
import { fetchPost, fetchGet, fetchPut } from '../fetch';

/**
 * 保存表单
 * SystemType 0：孕产妇 ，1：儿童
 */
export function postFormData(SystemType, param) {
	return fetchPost(`/v${version}/FormData/Post/${SystemType}`, param);
}

/**
 * 获取表单
 */
export function getFormData(FormId) {
	return fetchGet(`/v${version}/FormData/GetByForm/${FormId}`);
}

/**
 *修改表单
 */
export function putFormData(id, param) {
	return fetchPut(`/v${version}/FormData/PutAsync/Put/${id}`, param);
}
