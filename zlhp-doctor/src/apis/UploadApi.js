import { version } from "../fetch/version";
import { fetchPost } from "../fetch";

/**
 * 上传单图
 */
export function UploadImage(param) {
  return fetchPost(`/v${version}/Upload/image`, param);
}
/**
 * 上传多图
 */
export function UploadImages(param) {
  return fetchPost(`/v${version}/Upload/images`, param);
}
