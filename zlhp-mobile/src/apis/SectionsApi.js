import { version } from '../fetch/version';
import { fetchGet } from '../fetch';

/**
 * 获取模式获取板块
 */
export function getSectionByModels(model) {
	return fetchGet(`/v${version}/Sections/ByModel/${model}`);
}
