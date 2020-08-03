import { version } from '../fetch/version';
import { fetchGet, fetchPost } from '../fetch';

/**
 * 获取一个项目
 */
export function Get(id) {
	return fetchGet(`/v${version}/Archive/${id}`);
}

/**
 * 获取当前
 */
export function Current() {
	return fetchGet(`/v${version}/Archive/Current`);
}

/**
 * 根据用户
 */
export function GetAll() {
	return fetchGet(`/v${version}/Archive/GetAllByUser`);
}

/**
 * 获取并刷新编号
 */
export function GetAndRefreshNo(id, type = 0) {
	return fetchGet(`/v${version}/Archive/GetAndRefreshNo/${id}/${type}`);
}

/**
 * 更新孕前体重身高
 */
export function UpdateWeightAndStature(params) {
	return fetchPost(`/v${version}/Archive/UpdateWeightAndStature`, params);
}

/**
 * 删除
 */
export function Delete(id) {
	return fetchPost(`/v${version}/Archive/delete/${id}`);
}

/**
 * 是否建档
 * ..constructor
 */
export function IsArchiving() {
	return fetchGet(`/v${version}/Archive/IsArchiving`);
}
/**
 * 多选删除档案
 */
export function DeleteListAsync(params) {
	return fetchPost(`/v${version}/Archive/DeleteListAsync`, params);
}

/**
 * 删除单个档案
 */
export function DeleteArchive(id) {
	return fetchPost(`/v${version}/Archive/delete/${id}`);
}
