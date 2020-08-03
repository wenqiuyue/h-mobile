import { version } from '../fetch/version';
import { fetchGet } from '../fetch';

/**
 * 获取所有表单类型
 *
 */
export function GetFormTypes() {
	return fetchGet(`/v${version}/FormTypes/All`);
}

/**
 * 获取类型值获取表单
 *
 */
export function GetFormTypesByVal(FormTypeVal) {
	return fetchGet(`/v${version}/FormTypes/GetByVal/${FormTypeVal}`);
}
