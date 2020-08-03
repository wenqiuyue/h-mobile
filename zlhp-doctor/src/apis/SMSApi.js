import { version } from "../fetch/version";
import { fetchGet } from "../fetch";

/**
 * 修改密码发送短信
 */
export function smsSend() {
  return fetchGet(`/v${version}/SMS/Send`);
}
