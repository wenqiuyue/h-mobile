import { version } from "../fetch/version";
import { fetchPut, fetchGet } from "../fetch";

//修改工作时间
export function ChangeWorkTime(id, param) {
  return fetchPut(`/v${version}/OnlineDoctor/ChangeWorkTime/${id}`, param);
}
//获取在线医生
export function getOnlineDoctor(id) {
  return fetchGet(`/v${version}/OnlineDoctor/${id}`);
}
//修改工作状态
export function changeWorkStatus(id, param) {
  return fetchPut(`/v${version}/OnlineDoctor/ChangeWorkStatus/${id}`, param);
}
