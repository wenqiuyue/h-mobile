import { version } from "../fetch/version";
import { fetchGet, fetchPost } from "../fetch";

//提现明细
export function getExtractRecordsList(page, limit) {
  return fetchGet(
    `/v${version}/ExtractRecords/List?page=${page}&limit=${limit}`
  );
}

//提现详情
export function getExtractRecordsInfo(id) {
  return fetchGet(`/v${version}/ExtractRecords/${id}`);
}

//提现
export function extract(money) {
  return fetchPost(`/v${version}/ExtractRecords/Extract/${money}`);
}
