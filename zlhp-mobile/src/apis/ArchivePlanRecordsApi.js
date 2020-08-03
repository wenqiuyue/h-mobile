import { version } from '../fetch/version';
import { fetchGet, fetchPut } from '../fetch';
/**
 * 分页获取产检计划列表
 */
export function archivePlanRecordsList(page, limit) {
	return fetchGet(
		`/v${version}/ArchivePlanRecords/List?page=${page}&limit=${limit}`
	);
}

/**
 * 获取产检计划详情
 */
export function archivePlanRecordsInfo(id) {
	return fetchGet(`/v${version}/ArchivePlanRecords/${id}`);
}

/**
 * 修改产检计划
 */
export function PutArchivePlanRecords(id, param) {
	return fetchPut(`/v${version}/ArchivePlanRecords/PutAsync/Put/${id}`, param);
}

/**
 * 获取所有产检计划列表
 */
export function archivePlanRecordsAll() {
	return fetchGet(`/v${version}/ArchivePlanRecords/All`);
}

/**
 * 完成产检
 * @param id
 * @returns {Promise<unknown>}
 * @constructor
 */
export function Finish(id) {
	return fetchPut(`/v${version}/ArchivePlanRecords/Finish/${id}`);
}
