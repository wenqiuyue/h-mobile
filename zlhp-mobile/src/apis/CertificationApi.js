import { version } from '../fetch/version';
import { fetchGet, fetchPost } from '../fetch';

/**
 * HIS身份认证
 * ..param params
 * ..constructor
 */
export function AuthenticationHis(params) {
	return fetchPost(`/v${version}/Certification/AuthenticationHis`, params);
}

/**
 * 绑定 HIS 档案
 * ..param params
 * ..constructor
 */
export function BindHis(params) {
	return fetchPost(`/v${version}/Certification/BindHis`, params);
}

/**
 * 获取缓存在 Redis 中的数据
 * ..constructor
 */
export function GetBindHisRedisData() {
	return fetchGet(`/v${version}/Certification/GetBindHisRedisData`);
}

/**
 * 发送短信至 HIS 预留手机号
 * ..param code
 * ..constructor
 */
export function SendHisSMS(code) {
	return fetchGet(`/v${version}/Certification/SendHisSMS/${code}`);
}

/**
 * 修改 HIS 手机号并绑定档案
 * ..param code
 * ..constructor
 */
export function UpdateHisPhoneAndBind(code) {
	return fetchGet(`/v${version}/Certification/UpdateHisPhoneAndBind/${code}`);
}

// / /////////////////////////////////////////////////// 以下为儿童
/**
 * HIS身份认证
 * ..param params
 * ..constructor
 */
export function ChildrenAuthenticationHis(params) {
	return fetchPost(
		`/v${version}/Certification/ChildrenAuthenticationHis`,
		params
	);
}

/**
 * 绑定 HIS 档案
 * ..param params
 * ..constructor
 */
export function ChildrenBindHis(params) {
	return fetchPost(`/v${version}/Certification/ChildrenBindHis`, params);
}

/**
 * 获取缓存在 Redis 中的数据
 * ..constructor
 */
export function ChildrenGetBindHisRedisData() {
	return fetchGet(`/v${version}/Certification/ChildrenGetBindHisRedisData`);
}

/**
 * 发送短信至 HIS 预留手机号
 * ..param code
 * ..constructor
 */
export function ChildrenSendHisSMS(code) {
	return fetchGet(`/v${version}/Certification/ChildrenSendHisSMS/${code}`);
}

/**
 * 修改 HIS 手机号并绑定档案
 * ..param code
 * ..constructor
 */
export function ChildrenUpdateHisPhoneAndBind(code) {
	return fetchGet(
		`/v${version}/Certification/ChildrenUpdateHisPhoneAndBind/${code}`
	);
}
