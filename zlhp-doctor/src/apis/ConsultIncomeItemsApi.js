import { version } from "../fetch/version";
import { fetchPost, fetchGet } from "../fetch";

//收入明细
export function getConsultIncomeItems(param) {
  return fetchPost(`/v${version}/ConsultIncomeItems/List`, param);
}
//收入详情
export function getConsultIncomeItemsInfo(id) {
  return fetchGet(`/v${version}/ConsultIncomeItems/${id}`);
}
