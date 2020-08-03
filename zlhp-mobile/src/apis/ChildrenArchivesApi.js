import { version } from '../fetch/version';
import { fetchGet, fetchPost } from '../fetch';

/**
 * 根据 ID 获取
 * ..param editId
 * ..constructor
 */
export function Get(editId) {
	return fetchGet(`/v${version}/ChildrenArchives/${editId}`);
}

/**
 * 获取所有档案
 * ..constructor
 */
export function GetAll() {
	return fetchGet(`/v${version}/ChildrenArchives/All`);
}

/**
 * 获取当前
 * ..constructor
 */
export function Current() {
	return fetchGet(`/v${version}/ChildrenArchives/GetCurrent`);
}

/**
 * 保存儿童档案
 * ..param binding
 * ..param form
 */
export function insertOrUpdate(binding, form) {
	return fetchPost(`/v${version}/ChildrenArchives/Save/${binding}`, form);
}

/**
 * 切换儿童当前档案
 * ..param id
 */
export function ChangeArchive(id) {
	return fetchGet(`/v${version}/ChildrenArchives/ChangeArchiveById/${id}`);
}

/**
 * 获取全部编号
 * ..constructor
 */
export function GetAllNo() {
	return fetchGet(`/v${version}/ChildrenArchives/GetAllNo`);
}

/**
 * 删除
 * ..param id
 * ..constructor
 */
export function Delete(id) {
	return fetchPost(`/v${version}/ChildrenArchives/delete/${id}`);
}

/**
 * 是否建档
 * ..constructor
 */
export function IsArchiving() {
	return fetchGet(`/v${version}/ChildrenArchives/IsArchiving`);
}

/**
 * 获取并刷新编号
 */
export function GetAndRefreshNo(id, type = 0) {
	return fetchGet(
		`/v${version}/ChildrenArchives/GetAndRefreshNo/${id}/${type}`
	);
}

/**
 * 多选删除档案
 */
export function DeleteListAsync(params) {
	return fetchPost(`/v${version}/ChildrenArchives/DeleteListAsync`, params);
}

/**
 * 单个删除档案
 */
export function DeleteArchive(id) {
	return fetchPost(`/v${version}/ChildrenArchives/delete/${id}`);
}
