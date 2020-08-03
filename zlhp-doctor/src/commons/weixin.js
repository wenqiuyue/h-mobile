import { version } from "../fetch/version";
import uuid from "uuid";
/**
 * 授权
 * @param token 用户TOKEN
 * @param path 授权完成后跳转的地址
 * @constructor
 */
export function Auth(token, path) {
  window.location.href = `/v${version}/Account/WxAuth?token=${token}&returnUrl=${process.env.VUE_APP_RETURN_URL}${path}`;
}
/**
 * 微信登录
 * @param uuid
 * @param path 授权完成后跳转的地址
 * @constructor
 */
export function Login() {
  const UUID = uuid();
  window.location.href = `/v${version}/Account/WxLogin?uuid=${UUID}&returnUrl=${process.env.VUE_APP_RETURN_URL}/login`;
}
