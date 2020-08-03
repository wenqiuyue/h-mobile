import { version } from '../fetch/version';
import { fetchPost } from '../fetch';

/**
 * 获取聊天记录
 */
export function getInquiryConsultsList(param) {
	return fetchPost(`/v${version}/InquiryConsults/List`, param);
}
