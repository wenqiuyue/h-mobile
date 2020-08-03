import { version } from "../fetch/version";
import { fetchGet } from "../fetch";

//我的收入
export function getWallets() {
  return fetchGet(`/v${version}/Wallets/User`);
}
