import { version } from '../fetch/version';
import { fetchGet } from '../fetch';

/**
 * 读取分页
 */
export function GetPage(page, limit) {
	return fetchGet(`/v${version}/Message/GetPage/${page}/${limit}`);
}

/**
 * 读取消息
 */
export function GetAndRead(id, read = false) {
	return fetchGet(`/v${version}/Message/${id}/${read}`);
}

/**
 * 获取最新两条
 * ..constructor
 */
export function GetSecondNew(type) {
	return fetchGet(`/v${version}/Message/GetSecondNew/${type}`);
}

/**
 * 读取分页
 */
export function GetChildrenPage(page, limit) {
	return fetchGet(`/v${version}/Message/GetChildrenPage/${page}/${limit}`);
}
