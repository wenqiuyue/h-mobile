/**
 * 获取 Session
 * @param key
 * @returns {string}
 */
export function getSession(key) {
	return sessionStorage.getItem(key);
}

/**
 * 设置 Session
 * @param key
 * @param value
 */
export function setSession(key, value) {
	if (value) {
		sessionStorage.setItem(key, value);
	} else {
		sessionStorage.removeItem(key);
	}
}

/**
 * 删除 Session
 * @param key
 */
export function removeSession(key) {
	sessionStorage.removeItem(key);
}

export default {
	get: getSession,
	set: setSession,
	remove: removeSession
};
