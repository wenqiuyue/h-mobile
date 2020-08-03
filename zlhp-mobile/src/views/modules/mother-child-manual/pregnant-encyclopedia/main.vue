<template>
	<div :class="classRoot" v-if="componentsTypeData">
		<van-nav-bar
			:title="componentsTypeData.SectionName"
			left-arrow
			@click-left="$router.back()"
		></van-nav-bar>

		<text-list
			:type="articlesType"
			:articleSectionID="componentsTypeData.ArticleSectionID"
			v-if="componentsTypeData.SectionType === 2"
			@articleInfo="articleInfo"
		></text-list>
		<navigation
			v-else-if="componentsTypeData.SectionType === 1"
			:type="articlesType"
			:articleSectionID="componentsTypeData.ArticleSectionID"
			@articleInfo="articleInfo"
		></navigation>
		<catalog
			v-else-if="componentsTypeData.SectionType === 0"
			:type="articlesType"
			:articleSectionID="componentsTypeData.ArticleSectionID"
			@articleInfo="articleInfo"
		></catalog>
	</div>
</template>
<script>
import Vue from 'vue';
import components from './components';

import * as ArticlesApi from '../../../../apis/ArticlesApi';
import * as ArticleSectionApi from '../../../../apis/ArticleSectionApi';

Vue.use(components);
export default {
	name: 'pregnant-encyclopedia',
	data() {
		return {
			articlesType: [], // 文章分类
			sectionVal: this.$route.query.SectionVal, // 栏目值
			componentsTypeData: null // 文章显示类型
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		this.getComponentsType();
	},
	methods: {
		/**
		 * 获取文章显示类型
		 */
		getComponentsType() {
			this.$toast.loading('加载中');
			ArticleSectionApi.getArticleSectionBySectionVal(this.sectionVal)
				.then(res => {
					if (res.Code === 0 && res.Body) {
						this.componentsTypeData = res.Body;
						// 获取文章分类
						const articlesTypeParam = {
							ArticleSectionID: this.componentsTypeData.ArticleSectionID,
							ArticleModel:
								this.componentsTypeData.SectionType === 2 ? 2 : null,
							ParentArticleID: ''
						};
						ArticlesApi.getArticlesType(articlesTypeParam).then(result => {
							if (result.Code === 0) {
								this.articlesType = result.Body;
								// 将文章按sort正序排列
								const compare = function(property) {
									return function(a, b) {
										const value1 = a[property];
										const value2 = b[property];
										return value1 - value2;
									};
								};
								this.articlesType.sort(compare('Sort'));
								this.articlesType.forEach(element => {
									element.ChildrensArticles.sort(compare('Sort'));
								});
							}
						});
					} else {
						this.$toast.fail('暂无查询到数据');
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 文章详情
		 */
		articleInfo(item) {
			// 链接型
			if (item.ArticleModel === 1 && item.LinkUrl) {
				window.location.href = item.LinkUrl;
			} else {
				// 文章型
				this.$router.push({
					path: '/mother/pregnant-encyclopedia-info',
					query:
						this.componentsTypeData.SectionType === 0
							? {
									article_id: item.ArticleID,
									article_section_id: this.componentsTypeData.ArticleSectionID
							  }
							: { article_id: item.ArticleID }
				});
			}
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-pregnant-encyclopedia';
.@{inner-prefix} {
	height: 100%;
}
</style>
