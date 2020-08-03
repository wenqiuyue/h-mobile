import { version } from "../fetch/version";
import { fetchGet, fetchPost } from "../fetch";

//医生信息
export function getDoctorInfo() {
  return fetchGet(`/v${version}/User/DoctorInfo`);
}
//修改密码
export function changePassword(param) {
  return fetchPost(`/v${version}/User/ChangePassword`, param);
}
