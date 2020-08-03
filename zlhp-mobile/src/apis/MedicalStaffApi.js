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
export function All(page, limit, IsLecturer = 1) {
	return fetchGet(`/v${version}/MedicalStaff/List?page=${page}&limit=${limit}&IsLecturer=${IsLecturer}
	`);
}
