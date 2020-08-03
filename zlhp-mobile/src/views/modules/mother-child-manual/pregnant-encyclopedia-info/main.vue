<template>
	<div :class="classRoot">
		<article-type
			:data="articlesInfoData"
			v-if="articleSectionID"
			@articlesInfo="getArticlesInfo"
		></article-type>
		<image-text
			:data="articlesInfoData"
			@articlesInfo="getArticlesInfo"
			v-else
		></image-text>
	</div>
</template>
<script>
import Vue from 'vue';
import components from './components';
import * as ArticlesApi from '../../../../apis/ArticlesApi';

Vue.use(components);
export default {
	name: 'pregnant-encyclopedia-info',
	data() {
		return {
			articleId: this.$route.query.article_id,
			articleSectionID: this.$route.query.article_section_id,
			articlesInfoData: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		this.getArticlesInfo();
	},
	methods: {
		/**
		 * 获取文章详情
		 */
		getArticlesInfo(artic, isCatalog) {
			if (artic && artic.ArticleModel === 1 && artic.LinkUrl) {
				window.location.href = artic.LinkUrl;
			} else if (artic && isCatalog) {
				this.articlesInfoData = artic;
			} else {
				this.$toast.loading('加载中...');
				ArticlesApi.ArticlesInfo(artic ? artic.ArticleID : this.articleId)
					.then(res => {
						if (res.Code === 0) {
							this.articlesInfoData = res.Body;
						}
					})
					.finally(this.$toast.clear);
			}
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-pregnant-encyclopedia-info';
.@{inner-prefix} {
	height: 100%;
}
</style>
