import { version } from '../fetch/version';
import { fetchGet } from '../fetch';

/**
 * 获取栏目
 */
export function getSectionModels(id) {
	return fetchGet(`/v${version}/SectionModels/${id}`);
}
