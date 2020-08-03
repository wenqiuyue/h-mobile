import { version } from '../fetch/version';
import { fetchGet, fetchPost } from '../fetch';

/**
 * 获取微信js sdk信息
 */
export function GetConfig() {
	return fetchGet(
		`/v${version}/WeixinJSSDK/GetConfig?url=${
			document.location.href.split('#')[0]
		}`
	);
}

/**
 * 设置位置信息
 * ..param {*} params
 * ..returns
 */
export function SetLocation(params) {
	return fetchPost(`/v${version}/WeixinJSSDK/SetLocation`, params);
}

/**
 * 拍照识别挂号单或就诊卡
 * ..param mediaId
 * ..returns {*}
 */
export function GetCardNo(mediaId) {
	return fetchGet(`/v${version}/WeixinJSSDK/GetCardNo?mediaId=${mediaId}`);
}
