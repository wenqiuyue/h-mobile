import { version } from "../fetch/version";
import { fetchPost, fetchGet } from "../fetch";

//课程管理列表
export function getCourseManage(param) {
  return fetchPost(`/v${version}/CourseInfo/CourseManage`, param);
}
//课程详情
export function getCourseInfo(id) {
  return fetchGet(`/v${version}/CourseInfo/Details/${id}`);
}
//本周课程统计接口
export function getThisWeek() {
  return fetchGet(`/v${version}/CourseInfo/ThisWeek`);
}
