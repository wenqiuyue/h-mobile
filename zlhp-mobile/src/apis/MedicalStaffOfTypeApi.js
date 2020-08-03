import { version } from '../fetch/version';
import { fetchGet } from '../fetch';

/**
 * 获取讲师详情
 */
export function GetMedicalStaffById(id) {
	return fetchGet(`/v${version}/MedicalStaff/${id}`);
}

/**
 * 获取讲师列表
 */
export function All() {
	return fetchGet(`/v${version}/MedicalStaffOfType/All`);
}
