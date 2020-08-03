import { version } from '../fetch/version';
import { fetchPost } from '../fetch';

/**
 * 获取民族
 */
export function CheckIn(param) {
	return fetchPost(`/v${version}/CheckIn/CheckIn`, param);
}
