import { version } from '../fetch/version';
import { fetchGet } from '../fetch';

/**
 * 更新
 */
export function Update() {
	return fetchGet(`/v${version}/ArchiveRecords/UpdateArchiveRecords`);
}

/**
 * 获取全部
 */
export function Get() {
	return fetchGet(`/v${version}/ArchiveRecords/getArchiveRecords`);
}

/**
 * 获取最新
 */
export function GetNewest() {
	return fetchGet(`/v${version}/ArchiveRecords/GetNewest`);
}

/**
 * 获取健康档案目录
 */
export function DirAndArc(id) {
	return fetchGet(`/v${version}/ArchiveRecords/DirAndArc?id=${id}`);
}

/**
 * 获取用户信息
 */
export function GetUserInfoAsync(id) {
	return fetchGet(`/v${version}/ArchiveRecords/GetUserInfoAsync?id=${id}`);
}

/**
 * 获取检查项目详情
 */
export function GetJCItemDetailAsync(id) {
	return fetchGet(
		`/v${version}/ArchiveRecords/GetJCItemDetailAsync?bbid=${id}`
	);
}

/**
 * 获取高危记录
 */
export function GetRisks() {
	return fetchGet(`/v${version}/ArchiveRecords/GetRisks`);
}

/**
 * 获取保健记录
 */
export function GetHealthGuidances() {
	return fetchGet(`/v${version}/ArchiveRecords/GetHealthGuidances`);
}

/**
 * 获取检查记录列表
 * ..param registrationNo
 * ..constructor
 */
export function GetViewReportMenu(registrationNo) {
	return fetchGet(
		`/v${version}/ArchiveRecords/GetViewReportMenu/${registrationNo}`
	);
}

/**
 * 获取检查记录列表
 * ..constructor
 * ..param sampleId
 */
export function GetViewReportDetail(sampleId) {
	return fetchGet(
		`/v${version}/ArchiveRecords/GetViewReportDetail/${sampleId}`
	);
}

/**
 * 获取检查记录列表
 * ..constructor
 * ..param caseHistoryId
 * ..param mainMedicalAdviceId
 */
export function GetViewReportDetailPDF(caseHistoryId, mainMedicalAdviceId) {
	return fetchGet(
		`/v${version}/ArchiveRecords/GetViewReportDetailPDF/${caseHistoryId}/${mainMedicalAdviceId}`
	);
}
