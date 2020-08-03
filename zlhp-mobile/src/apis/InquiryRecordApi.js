import { version } from '../fetch/version';
import { fetchPost, fetchGet, fetchPut } from '../fetch';

/**
 * 新增
 * @param params
 * @constructor
 */
export function Post(type, params) {
	return fetchPost(`/v${version}/InquiryRecord/Post/${type}`, params);
}

/**
 * 我的问诊
 */
export function getInquiryRecordList(params) {
	return fetchPost(`/v${version}/InquiryRecord/List`, params);
}

/**
 * 问诊详情
 */
export function inquiryRecordInfo(id) {
	return fetchGet(`/v${version}/InquiryRecord/${id}`);
}
/**
 * 发表图文问诊
 */
export function addInquiryRecord(id, params) {
	return fetchPut(`/v${version}/InquiryRecord/Put/${id}`, params);
}
/**
 * 结束诊疗
 */
export function stopInquiryRecord(id) {
	return fetchPut(`/v${version}/InquiryRecord/Stop/${id}`);
}

/**
 * 取消
 * @constructor
 */
export function Cancel(id) {
	return fetchPut(`/v${version}/InquiryRecord/Cancel/${id}`);
}
