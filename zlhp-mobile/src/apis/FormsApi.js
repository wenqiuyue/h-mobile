import { version } from '../fetch/version';
import { fetchGet } from '../fetch';

/**
 * 获取所有表单
 *
 */
export function GetForm(FormTypeId) {
	return fetchGet(`/v${version}/Forms/All/${FormTypeId}`);
}
/**
 * 获取类型值获取表单
 *
 */
export function GetFormTypesByFromVal(FromVal) {
	return fetchGet(`/v${version}/Forms/GetByFromVal/${FromVal}`);
}
