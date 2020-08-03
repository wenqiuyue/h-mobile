<!-- 图文列表类型 -->
<template>
	<van-pull-refresh
		id="chat"
		v-model="refreshing"
		:class="`${classRoot}-refresh`"
		@refresh="onRefresh"
		:style="`overflow-y: ${moreButton ? 'hidden' : 'scroll'}`"
	>
		<van-list
			v-model="loading"
			:finished="finished"
			:error="error"
			@load="getArticlesList"
		>
			<div class="title" ref="title">
				<div class="title_button">
					<van-row>
						<van-col span="22" :class="moreButton ? '' : 'type_col'"
							><div class="btn">
								<van-button
									round
									:class="
										articlesListParam.ParentArticleID
											? 'gray-button'
											: 'sel_button'
									"
									@click="selButton(0)"
									>全部</van-button
								>
							</div>
							<div v-for="(item, index) in type" :key="index" class="btn">
								<van-button
									round
									:class="
										articlesListParam.ParentArticleID !== item.ArticleID
											? 'gray-button'
											: 'sel_button'
									"
									@click="selButton(item)"
									>{{ item.Title }}</van-button
								>
							</div>
						</van-col>
						<van-col span="2" class="icon_col"
							><van-icon
								name="arrow-down"
								@click="moreButton = true"
								v-if="!moreButton"/>
							<van-icon name="arrow-up" @click="moreButton = false" v-else
						/></van-col>
					</van-row>
				</div>
			</div>
			<div
				class="content_bg"
				v-if="articlesList && articlesList.length"
				:style="moreButton ? 'height:100%' : 'height:auto'"
			>
				<div class="bg" v-if="moreButton"></div>
				<div
					class="content_array"
					v-for="(item, index) in articlesList"
					:key="index"
					@click="$emit('articleInfo', item)"
				>
					<van-row class="content">
						<van-col :span="item.ImagePath ? 16 : 24" class="policy_content">
							<span class="policy_content_title">{{ item.Title }}</span>
							<span class="subtitle">
								<label>{{ item.ParentArticle.Title }}</label>
							</span>
							<span class="policy_content_container">
								{{ item.Content.replace(/&lt;.+?&gt;/g, '') }}
							</span>
						</van-col>
						<van-col span="8" class="policy_img" v-if="item.ImagePath">
							<van-image :src="item.ImagePath" />
						</van-col>
					</van-row>
				</div>
			</div>
			<hint v-else-if="!loading" message="这里好冷清，没有任何内容" />
		</van-list>
	</van-pull-refresh>
</template>
<script>
import * as ArticlesApi from '../../../../../../apis/ArticlesApi';

export default {
	name: 'text-list',
	data() {
		return {
			loading: false,
			finished: false,
			error: false,
			refreshing: false,
			moreButton: false,
			articlesList: [],
			articlesListParam: {
				ParentArticleID: 0,
				ArticleSectionID: this.articleSectionID,
				ArticleModel: 0,
				page: 0,
				limit: 10
			},

			selButtonArray: [], // 选择的标题按钮
			selArticle: null // 当前选择的按钮
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
	methods: {
		/**
		 * 刷新
		 */
		onRefresh() {
			this.articlesList = [];
			this.finished = false;
			this.loading = true;
			this.getArticlesList();
		},
		/**
		 * 获取文章列表
		 */
		getArticlesList() {
			if (this.refreshing) {
				this.articlesList = [];
				this.refreshing = false;
			}
			this.articlesListParam.page =
				Math.floor(this.articlesList.length / this.articlesListParam.limit) + 1;
			ArticlesApi.ArticlesList(this.articlesListParam)
				.then(res => {
					if (res.Code === 0) {
						this.articlesList.push(...res.Body);
						if (res.Body.length !== this.articlesListParam.limit) {
							this.finished = true;
						}
					} else {
						this.error = true;
					}
				})
				.catch(() => {
					this.finished = true;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		/**
		 * 标题类型选择
		 */
		selButton(item) {
			if (item === 0) {
				this.articlesListParam.ParentArticleID = 0;
				this.onRefresh();
			} else {
				this.articlesListParam.ParentArticleID = item.ArticleID;
				this.onRefresh();
			}
			this.moreButton = false;
		}
	}
};
</script>
<style lang="less">
@import '../../../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-text-list';
.@{inner-prefix} {
	&-refresh {
		height: calc(100% - 51px);
		margin-top: 5px;
		background: #ffffff;
		border-radius: 5px;
		.van-pull-refresh__track {
			height: 100%;
		}
		.van-list {
			height: 100%;
		}
		.title {
			padding: 10px 15px;

			.title_button {
				.type_col {
					overflow-x: scroll;
					white-space: nowrap;
				}
				.icon_col {
					text-align: center;
				}
				.van-button {
					height: 30px;
					line-height: 30px;
					margin-right: 18px;
					margin-bottom: 8px;
				}
				.sel_button {
					background: #ffefef;
					border: 1px solid #fc8a8a;
					color: #f97777;
				}
				.gray-button {
					background: #f1f1f1;
					border: 1px solid #f1f1f1;
					color: #888888;
				}
				.btn {
					display: inline;
				}
			}
		}
		.content_bg {
			position: relative;
			.bg {
				background: rgba(0, 0, 0, 0.3);
				width: 100%;
				height: 100%;
				position: absolute;
				top: 1px;
				z-index: 999;
			}
			.content_array {
				.content {
					padding: 22px 20px;
					border-bottom: 1px solid #eeeeee;
					.policy_content {
						padding-right: 16px;
						display: flex;
						flex-direction: column;
						.policy_content_title {
							font-size: 17px;
							color: #333333;
							letter-spacing: 1px;
							display: -webkit-box;
							-webkit-line-clamp: 1;
							overflow: hidden;
							text-overflow: ellipsis;
							-webkit-box-orient: vertical;
						}
						.subtitle {
							font-size: 13px;
							color: #bbbbbb;
							margin-top: 5px;
							label {
								margin-right: 20px;
							}
						}
						.policy_content_container {
							font-size: 14px;
							color: #888888;
							margin-top: 12px;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							overflow: hidden;
							text-overflow: ellipsis;
							-webkit-box-orient: vertical;
						}
					}
					.policy_img {
						text-align: center;
						.van-image {
							width: 100px;
							height: 70px;
							img {
								border-radius: 10px;
							}
						}
					}
				}
			}
		}
	}
}
</style>
