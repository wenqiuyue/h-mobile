import { version } from '../fetch/version';
import { fetchGet } from '../fetch';

/**
 * 获取二维码
 * ..param sceneId
 * ..param systemType
 * ..returns {Promise<any>}
 * ..constructor
 */
export function QrCode(sceneId, systemType) {
	return fetchGet(`/v${version}/QrCode/${sceneId}/${systemType}`);
}
