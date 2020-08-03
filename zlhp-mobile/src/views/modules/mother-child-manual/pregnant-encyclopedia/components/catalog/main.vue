<!-- 目录 -->
<template>
	<div :class="classRoot">
		<div :class="`${classRoot}-title`">目录</div>
		<div :class="`${classRoot}-body`">
			<div class="chapter" v-for="(item, index) in type" :key="index">
				<div
					class="title"
					@click="item.ArticleModel !== 2 ? $emit('articleInfo', item) : ''"
				>
					{{ `${changeNum(index + 1)} 、${item.Title}` }}
				</div>
				<ul>
					<li
						v-for="(childrensitem, childrensindex) in item.ChildrensArticles"
						:key="childrensindex"
						@click="
							childrensitem.ArticleModel !== 2
								? $emit('articleInfo', childrensitem)
								: ''
						"
					>
						{{ `( ${changeNum(childrensindex + 1)} ) ${childrensitem.Title}` }}
						<ul>
							<li
								v-for="(threechildrensitem,
								threechildrensindex) in childrensitem.ChildrensArticles"
								:key="threechildrensindex"
								@click="$emit('articleInfo', threechildrensitem)"
							>
								{{
									`${index + 1}.${childrensindex + 1}.${threechildrensindex +
										1} ${threechildrensitem.Title}`
								}}
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
import { changeNum } from '../../../../../../commons';

export default {
	name: 'catalog',
	data() {
		return {
			articlesList: null,
			articlesParam: {
				ParentArticleID: null,
				ArticleSectionID: this.articleSectionID,
				ArticleModel: 0
			}
		};
	},
	props: {
		type: { type: Array, default: null },
		articleSectionID: { type: Number, default: null }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {},
	methods: {
		changeNum
	}
};
</script>
<style lang="less">
@import '../../../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-catalog';
.@{inner-prefix} {
	height: calc(100% - 51px);
	overflow: scroll;
	&-title {
		font-size: 20px;
		color: #000000;
		text-align: center;
		padding: 15px 0;
	}
	&-body {
		padding: 0 20px;
		.chapter {
			margin-bottom: 13px;
			.title {
				font-size: 16px;
				color: #f082a5;
			}
			ul {
				padding: 13px 3px 0 3px;
				li {
					padding: 7px 0;
					color: #666666;
				}
			}
		}
	}
}
</style>
