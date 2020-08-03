import { version } from '../fetch/version';
import { fetchGet, fetchPost } from '../fetch';

/**
 * H5支付
 * @param params
 * @returns {Promise<unknown>}
 * @constructor
 */
export function H5Pay(params) {
	return fetchPost(`/v${version}/Payment/H5Pay`, params);
}

/**
 * JS-SDK支付
 * @returns {Promise<unknown>}
 * @constructor
 * @param orderNo
 * @param returnUrl
 */
export function JsPay(orderNo, returnUrl = null) {
	return fetchGet(
		`/v${version}/Payment/JsApi?orderNo=${orderNo}&returnUrl=${returnUrl}`
	);
}
