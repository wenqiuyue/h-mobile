import { version } from "../fetch/version";
import { fetchGet, fetchPost, fetchPut } from "../fetch";

//问诊统计接口
export function getInquiryRecordStatistics() {
  return fetchGet(`/v${version}/InquiryRecord/Doctor/Statistics`);
}
//问诊列表接口
export function getInquiryRecordList(param) {
  return fetchPost(`/v${version}/InquiryRecord/Doctor/List`, param);
}
//医生接诊接口
export function doctorReception(id) {
  return fetchPut(`/v${version}/InquiryRecord/Doctor/Reception/${id}`);
}
/**
 * 结束诊疗
 */
export function stopInquiryRecord(id) {
  return fetchPut(`/v${version}/InquiryRecord/Stop/${id}`);
}
//根据id获取诊疗
export function getInquiryRecordById(id) {
  return fetchGet(`/v${version}/InquiryRecord/${id}`);
}
