import { version } from '../fetch/version';
import { fetchGet } from '../fetch';

/**
 * 获取评论标签
 */
export function getPositiveTags() {
	return fetchGet(`/v${version}/PositiveTags/All`);
}
