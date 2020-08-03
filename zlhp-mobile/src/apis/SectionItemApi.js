import { version } from '../fetch/version';
import { fetchGet } from '../fetch';

/**
 * 获取单个栏目
 */
export function Get(id) {
	return fetchGet(`/v${version}/SectionItem/${id}`);
}
