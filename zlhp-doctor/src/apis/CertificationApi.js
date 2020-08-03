import { version } from "../fetch/version";
import { fetchGet } from "../fetch";

/**
 * 发送短信至 HIS 预留手机号
 * ..param code
 * ..constructor
 */
export function SendHisSMS(code) {
  return fetchGet(`/v${version}/Certification/SendHisSMS/${code}`);
}
