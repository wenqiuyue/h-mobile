import { version } from "../fetch/version";
import { fetchPost, fetchPut } from "../fetch";

//登录
export function doctorLogin(param) {
  return fetchPost(`/v${version}/Account/DoctorLogin`, param);
}
//退出登录
export function logout() {
  return fetchPut(`/v${version}/Account/Logout`);
}
