import { version } from "../fetch/version";
import { fetchGet } from "../fetch";

//获取报名情况，签到情况
export function getCourseSignUpInfo(id) {
  return fetchGet(`/v${version}/CourseSignUp/GetByCourseInfo/${id}`);
}
