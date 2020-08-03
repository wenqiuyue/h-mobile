import { version } from '../fetch/version';
import { fetchGet } from '../fetch';

/**
 * 获取栏目
 */
export function getArticleSectionBySectionVal(SectionVal) {
	return fetchGet(`/v${version}/ArticleSection/BySectionVal/${SectionVal}`);
}
