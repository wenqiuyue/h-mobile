import { version } from '../fetch/version';
import { fetchGet, fetchPost, fetchPut, fetchDelete } from '../fetch';

/**
 * 获取就诊人列表
 */
export function getMedicalCardsList(page, limit) {
	return fetchGet(`/v${version}/MedicalCards/List?page=${page}&limit=${limit}`);
}

/**
 *绑定就诊人
 */
export function bindingMedicalCards(param) {
	return fetchPost(`/v${version}/MedicalCards/Post`, param);
}

/**
 *设置默认就诊人
 */
export function setDefault(params) {
	return fetchPut(`/v${version}/MedicalCards/SetDefault`, params);
}

/**
 * 根据就诊人id获取就诊人
 */
export function getMedicalCardsById(id) {
	return fetchGet(`/v${version}/MedicalCards/${id}`);
}

/**
 *编辑就诊人信息
 */
export function editMedicalCards(id, param) {
	return fetchPut(`/v${version}/MedicalCards/PutAsync/Put/${id}`, param);
}

/**
 *绑定就诊卡
 */
export function resetBindCard(id) {
	return fetchPut(`/v${version}/MedicalCards/ResetBindCard/${id}`);
}

/**
 *删除就诊卡
 */
export function delMedicalCards(id) {
	return fetchDelete(`/v${version}/MedicalCards/${id}`);
}
