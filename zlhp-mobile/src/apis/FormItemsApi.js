import { version } from '../fetch/version';
import { fetchGet } from '../fetch';

/**
 * 获取表单内容
 *
 */
export function GetFormItems() {
	return fetchGet(`/v${version}/FormItems/All`);
}
