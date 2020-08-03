import { version } from '../fetch/version';
import { fetchGet, fetchPost } from '../fetch';

/**
 * 获取课程表
 */
export function All() {
	return fetchGet(`/v${version}/Courses/All`);
}

/**
 * 根据课程id获取课程表里的课程
 */
export function GetCourseById(id) {
	return fetchGet(`/v${version}/Courses/${id}`);
}
/**
 * 分页查询课程列表
 */
export function GetCourseList(param) {
	return fetchPost(`/v${version}/Courses/List`, param);
}
