/**
 * 获取本地缓存
 * @param key
 */
export function getLocal(key) {
	return localStorage.getItem(key);
}

/**
 * 设置本地缓存
 * @param key
 * @param value
 */
export function setLocal(key, value) {
	if (value) {
		localStorage.setItem(key, value);
	} else {
		localStorage.removeItem(key);
	}
}

/**
 * 删除本地缓存
 * @param key
 */
export function removeLocal(key) {
	localStorage.removeItem(key);
}

export default {
	get: getLocal,
	set: setLocal,
	remove: removeLocal
};
