<template>
	<div :class="classRoot" v-if="data">
		<div
			:class="`${classRoot}-buoy ${showCatalog ? 'popup_buoy' : ''}`"
			@click="showCatalog = !showCatalog"
		>
			<div></div>
			<div>目录</div>
			<div></div>
		</div>
		<transition :name="pageClick === 0 ? 'next' : 'previous'">
			<div :class="`${classRoot}-body`" :key="data.ArticleID">
				<!-- <div class="title">{{ data.Title }}</div> -->
				<div v-html="data.Content"></div>
			</div>
		</transition>
		<van-popup
			:class="`${classRoot}-catalog-popup`"
			v-model="showCatalog"
			position="left"
		>
			<div class="catalog_title">目录</div>
			<div class="catalog_body">
				<div class="chapter" v-for="(item, index) in articlesType" :key="index">
					<div
						class="title"
						@click="item.ArticleModel !== 2 ? handleInfo(item) : ''"
					>
						{{ `${changeNum(index + 1)} 、${item.Title}` }}
					</div>
					<ul>
						<li
							v-for="(childrensitem, childrensindex) in item.ChildrensArticles"
							:key="childrensindex"
							@click="handleInfo(childrensitem)"
						>
							{{
								`( ${changeNum(childrensindex + 1)} ) ${childrensitem.Title}`
							}}
							<ul>
								<li
									v-for="(threechildrensitem,
									threechildrensindex) in childrensitem.ChildrensArticles"
									:key="threechildrensindex"
									@click="handleInfo(threechildrensitem)"
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
		</van-popup>
		<div :class="`${classRoot}-page`">
			<svg-icon
				value="icon-mother-switch-Leftmost"
				:size="1.2"
				@click="firstPage"
			/>
			<svg-icon
				value="icon-mother-switch-left"
				:size="1.2"
				@click="previousPage"
			/>
			<van-row class="page" gutter="1" @click="$refs.inp.focus()">
				<van-col span="8"
					><van-field
						class="input"
						v-model="pageNow"
						type="digit"
						ref="inp"
						@blur="inputBlur"
				/></van-col>
				/
				<van-col span="8">{{ catalogArray.length }}</van-col>
			</van-row>
			<svg-icon
				value="icon-mother-switch-right"
				:size="1.2"
				@click="nextPage"
			/>
			<svg-icon
				value="icon-mother-switch-rightmost"
				:size="1.2"
				@click="lastPage"
			/>
		</div>
	</div>
</template>
<script>
import _ from 'lodash';
import * as ArticlesApi from '../../../../../../apis/ArticlesApi';
import { changeNum } from '../../../../../../commons';

export default {
	name: 'article-type',
	data() {
		return {
			showCatalog: false,
			isSetPage: false, // 是否设置当前页号
			articlesType: [], // 文章分类
			catalogArray: [], // 文章序列
			articleSectionID: this.$route.query.article_section_id,
			article: null,
			isfirst: true,
			pageNow: 1, // 当前阅读文章页数
			pageClick: 0 // 0 下页 1 上页
		};
	},
	props: {
		data: { type: Object, default: null }
	},

	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	watch: {
		catalogArray() {
			// 当如果是从目录进入文章内容，更新当前页
			if (this.catalogArray && this.data && this.isfirst) {
				this.catalogArray.forEach((element, index) => {
					if (element.ArticleID === this.data.ArticleID) {
						this.pageNow = index + 1;
						this.isfirst = false;
					}
					this.isfirst = false;
					return 0;
				});
			}
		}
	},
	created() {
		this.getComponentsType();
	},
	methods: {
		changeNum,
		/**
		 * 获取文章显示类型
		 */
		getComponentsType() {
			this.catalogArray = [];

			// 获取子节点
			const getChild = arr => {
				arr.forEach(_item => {
					const item = { ..._item };
					const child = item.ChildrensArticles;
					item.ChildrensArticles = null;
					if (
						item.ArticleModel !== 2 &&
						!this.catalogArray.find(m => m.ArticleID === item.ArticleID)
					) {
						this.catalogArray.push(item);
					}
					if (child && child.length) getChild(child);
				});
			};

			// 获取文章分类
			const articlesTypeParam = {
				ArticleSectionID: this.articleSectionID,
				ParentArticleID: ''
			};
			ArticlesApi.getArticlesType(articlesTypeParam).then(result => {
				if (result.Code === 0) {
					this.articlesType = result.Body;
					getChild(result.Body);
				}
			});
		},
		/**
		 * 文章页数设置
		 */
		inputBlur() {
			if (this.pageNow > this.catalogArray.length) {
				this.pageNow = this.catalogArray.length;
			} else if (this.pageNow < 1) {
				this.pageNow = 1;
			}
			this.article = this.catalogArray[this.pageNow - 1];
			this.$emit('articlesInfo', this.article, 1);
			this.pageClick = 0;
		},
		/**
		 * 第一篇文章
		 */
		firstPage() {
			if (this.pageNow > 1) {
				this.article = _.head(this.catalogArray);
				this.pageNow = 1;
				this.$emit('articlesInfo', this.article, 1);
			}
			this.pageClick = 1;
		},
		/**
		 * 下一篇文章
		 */
		nextPage() {
			if (this.pageNow < this.catalogArray.length) {
				this.article = this.catalogArray[this.pageNow];
				this.pageNow += 1;
				this.$emit('articlesInfo', this.article, 1);
			}
			this.pageClick = 0;
		},
		/**
		 * 上一篇文章
		 */
		previousPage() {
			if (this.pageNow > 1) {
				this.article = this.catalogArray[this.pageNow - 2];
				this.pageNow -= 1;
				this.$emit('articlesInfo', this.article, 1);
			}
			this.pageClick = 1;
		},
		/**
		 * 最后一篇文章
		 */
		lastPage() {
			if (this.pageNow < this.catalogArray.length) {
				this.article = _.last(this.catalogArray);
				this.pageNow = this.catalogArray.length;
				this.$emit('articlesInfo', this.article, 1);
			}
			this.pageClick = 0;
		},
		handleInfo(artic) {
			this.pageClick = 0;
			this.article = artic;
			this.showCatalog = false;
			this.$emit('articlesInfo', artic, 1);
			this.catalogArray.forEach((element, index) => {
				if (element.ArticleID === artic.ArticleID) {
					this.pageNow = index + 1;
				}
				return 0;
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-article-type';
.@{inner-prefix} {
	height: 100%;
	// 下一页过度
	.next-enter {
		opacity: 0;
		transform: translateX(100%);
	}
	.next-leave-to {
		opacity: 0;
		transform: translateX(-100%);
		position: absolute;
	}
	.next-enter-active,
	.next-leave-active {
		transition: all 0.5s ease;
	}
	// 上一页过度
	.previous-enter {
		opacity: 0;
		transform: translateX(-100%);
	}
	.previous-leave-to {
		opacity: 0;
		transform: translateX(100%);
		position: absolute;
	}
	.previous-enter-active,
	.previous-leave-active {
		transition: all 0.5s ease;
	}
	.van-overlay {
		background-color: rgba(0, 0, 0, 0.3);
	}
	&-buoy {
		position: absolute;
		top: calc((100% - 76px) / 2);
		z-index: 9999;
		div:nth-child(1) {
			width: 0;
			height: 0;
			border: 6px solid transparent;
			border-top-color: #f7bacd;
			transform: rotate(45deg);
			position: absolute;
			top: -5px;
			left: -7px;
		}
		div:nth-child(2) {
			background: #f7bacd;
			height: 46px;
			width: 33px;
			color: #ffffff;
			text-align: center;
			line-height: 46px;
			border-radius: 0 5px 5px 0;
		}
		div:nth-child(3) {
			width: 0;
			height: 0;
			border: 6px solid transparent;
			border-top-color: #f7bacd;
			transform: rotate(135deg);
			position: absolute;
			top: 40px;
			left: -7px;
		}
	}
	.popup_buoy {
		right: 50px;
		z-index: 999999;
		div:nth-child(1) {
			transform: rotate(-45deg);
			left: 27px;
		}
		div:nth-child(2) {
			border-radius: 5px 0 0 5px;
		}
		div:nth-child(3) {
			transform: rotate(-135deg);
			left: 27px;
		}
	}
	&-body {
		height: calc(100% - 76px);
		overflow: scroll;
		padding: 0 18px 20px 18px;
		font-size: 15px;
		color: #707070;
		line-height: 24px;
		.title {
			font-size: 20px;
			color: #000000;
			text-align: center;
			padding: 15px 0;
		}
	}
	&-page {
		padding: 13px 15px;
		background: rgba(240, 130, 165, 0.55);
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		.page {
			width: 220px;
			height: 30px;
			background: #ffffff;
			border-radius: 15px;
			text-align: center;
			line-height: 30px;
			font-size: 16px;
			color: #333333;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			.input {
				background: none;
				border: none;
				text-align: right;
				.van-field__control {
					text-align: center;
					font-size: 16px;
				}
			}
		}
	}
	&-catalog-popup {
		width: 325px;
		height: 100%;
		overflow: visible;
		.catalog_title {
			font-size: 20px;
			color: #000000;
			text-align: center;
			padding: 15px 0;
		}
		.catalog_body {
			padding: 0 20px;
			overflow-y: auto;
			height: calc(100% - 56px);
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
}
</style>
