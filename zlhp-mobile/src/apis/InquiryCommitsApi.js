import { version } from '../fetch/version';
import { fetchPost } from '../fetch';

/**
 * 获取评论
 */
export function GetInquiryCommits(param) {
	return fetchPost(`/v${version}/InquiryCommits/List`, param);
}
/**
 * 发表评论
 */
export function AddInquiryCommits(param) {
	return fetchPost(`/v${version}/InquiryCommits/Post`, param);
}
