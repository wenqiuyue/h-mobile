import { version } from '../fetch/version';
import { fetchGet } from '../fetch';

/**
 * 获取用户
 * ..constructor
 */
export function GetUser() {
	return fetchGet(`/v${version}/User/GetUser`);
}

/**
 * 改变当前站点
 */
export function ChangeSite(id) {
	return fetchGet(`/v${version}/User/ChangeSite/${id}`);
}

/**
 * 改变当前档案
 */
export function ChangeArchive(id) {
	return fetchGet(`/v${version}/User/ChangeArchive/${id}`);
}

/**
 * 查询是否关注公众号
 */
export function isSubscribe() {
	return fetchGet(`/v${version}/User/isSubscribe`);
}
