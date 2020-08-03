import { version } from '../fetch/version';
import { fetchGet, fetchPost, fetchPut } from '../fetch';

/**
 * 课程报名
 */
export function SignUp(id) {
	return fetchGet(`/v${version}/CourseSignUp/SignUp/${id}`);
}
/**
 * 取消报名
 */
export function UnSignUp(id) {
	return fetchGet(`/v${version}/CourseSignUp/UnSignUp/${id}`);
}
/**
 * 查看我的报名
 */
export function UserAll() {
	return fetchGet(`/v${version}/CourseSignUp/UserAll`);
}
/**
 * 分页查看我的报名
 */
export function GetUserList(param) {
	return fetchPost(`/v${version}/CourseSignUp/UserList`, param);
}
/**
 * 报名课程签到
 */
export function CourseInfoSignUp(param) {
	return fetchPost(`/v${version}/CourseSignUp/CourseInfoSignUp`, param);
}
/**
 * 记笔记
 */
export function TakeNotes(id, param) {
	return fetchPut(`/v${version}/CourseSignUp/TakeNotes/${id}`, param);
}
/**
 * 根据报名id查看报名信息
 */
export function getCourseSignUpById(id) {
	return fetchGet(`/v${version}/CourseSignUp/${id}`);
}
