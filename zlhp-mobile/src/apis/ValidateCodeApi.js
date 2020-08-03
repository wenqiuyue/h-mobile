import { version } from '../fetch/version';
import { fetchGet, fetchPost } from '../fetch';

/**
 * 获取图片验证码
 * ..constructor
 */
export function GetCaptcha() {
	return fetchGet(`/v${version}/ValidateCode/GetCaptcha`);
}

/**
 * 验证图片验证码
 * ..param params
 * ..constructor
 */
export function CaptchaVerify(params) {
	return fetchPost(`/v${version}/ValidateCode/CaptchaVerify`, params);
}

/**
 * 验证图片验证码
 * ..param params
 * ..constructor
 */
export function SendSMS(params) {
	return fetchPost(`/v${version}/ValidateCode/SendSMS`, params);
}

/**
 * 验证图片验证码
 * ..param params
 * ..constructor
 */
export function SMSVerify(params) {
	return fetchPost(`/v${version}/ValidateCode/SMSVerify`, params);
}
