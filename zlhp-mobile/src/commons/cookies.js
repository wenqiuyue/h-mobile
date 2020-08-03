import Cookies from 'js-cookie';
import types from './types';

/**
 * 设置
 * @param key
 * @param value
 * @param expires
 * @returns {*}
 */
export function setCookie(key, value, expires) {
	return Cookies.set(key, value, {
		path: '/',
		domain: '',
		expires
	});
}

/**
 * 获取
 * @param key
 * @returns {*}
 */
export function getCookie(key) {
	return Cookies.get(key);
}

/**
 * 删除
 * @param key
 * @returns {*}
 */
export function removeCookie(key) {
	return Cookies.remove(key, { path: '/', domain: '' });
}

/**
 * 获取 Token
 * @returns {*}
 */
export function getToken() {
	return Cookies.get(types.TOKEN);
}

/**
 * 设置 Token
 * @param token
 * @returns {*}
 */
export function setToken(token) {
	return Cookies.set(types.TOKEN, token, {
		path: '/',
		domain: '',
		expires: 1
	});
}

/**
 * 删除 Token
 * @returns {*}
 */
export function removeToken() {
	return Cookies.remove(types.TOKEN, {
		path: '/',
		domain: ''
	});
}

export default {
	get: getCookie,
	set: setCookie,
	remove: removeCookie,
	getToken,
	setToken,
	removeToken
};
