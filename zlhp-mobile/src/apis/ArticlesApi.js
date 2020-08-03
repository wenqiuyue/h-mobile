import { version } from '../fetch/version';
import { fetchPost, fetchGet } from '../fetch';

/**
 * 获取文章
 */
export function ArticlesList(param) {
	return fetchPost(`/v${version}/Articles/List`, param);
}

/**
 * 获取文章详情
 */
export function ArticlesInfo(id) {
	return fetchGet(`/v${version}/Articles/${id}`);
}

/**
 * 获取文章分类
 */
export function getArticlesType(param) {
	return fetchPost(`/v${version}/Articles/All`, param);
}

/**
 * 获取文章推荐
 */
export function getRecommend(param) {
	return fetchPost(`/v${version}/Articles/GetRecommend`, param);
}
