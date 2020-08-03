import { version } from '../fetch/version';
import { fetchGet, fetchPost } from '../fetch';
/**
 * 根据课程id获取课程详情
 */
export function GetCourseInfoById(id) {
	return fetchGet(`/v${version}/CourseInfo/${id}`);
}
/**
 * 分页查询课程列表
 */
export function GetCourseInfoList(param) {
	return fetchPost(`/v${version}/CourseInfo/List`, param);
}
