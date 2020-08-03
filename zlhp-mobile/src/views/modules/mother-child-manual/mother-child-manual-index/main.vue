<template>
	<div :class="classRoot" v-if="sectionModelsData">
		<div
			:class="`${classRoot}-bar`"
			:style="`background: ${sectionModelsData.Background}`"
		>
			<van-icon name="arrow-left" @click="$router.back()" />
		</div>
		<div
			:class="`${classRoot}-title`"
			:style="`background: ${sectionModelsData.Background}`"
		>
			<span class="title">{{ sectionModelsData.SectionModelName }}</span>
			<van-image
				class="logo_img"
				:src="
					require(`../../../../assets/mother-child-manual/${sectionModelsData.BackIcon}`)
				"
			/>
		</div>
		<div :class="`${classRoot}-body`">
			<div v-for="(item, index) in sectionData" :key="index">
				<div class="option" v-if="item.Type === 5">
					<van-grid class="grid" :border="false">
						<template v-for="(itemSection, index) in item.SectionItems">
							<van-grid-item
								:key="index"
								@click="$router.push({ path: itemSection.Url })"
							>
								<van-image
									:style="`background: ${itemSection.Color}`"
									:src="
										require(`../../../../assets/mother-child-manual/${itemSection.Icon}`)
									"
								/>
								<div class="title">{{ itemSection.Title }}</div>
							</van-grid-item>
						</template>
					</van-grid>
				</div>
				<van-row
					class="manual"
					v-else-if="item.Type === 8"
					@click="$router.push({ path: `${item.SectionItems[0].Url}` })"
				>
					<van-col span="5"
						><svg-icon :value="item.SectionItems[0].Icon" :size="3.6"
					/></van-col>
					<van-col class="manual_text" span="17"
						><span>{{ item.SectionItems[0].Title }}</span
						><span>{{ item.SectionItems[0].SubContent }}</span></van-col
					>
					<van-col span="2">
						<svg-icon value="icon-mother-arrow-right-yellow" :size="1.8"
					/></van-col>
				</van-row>
				<div
					v-else-if="item.Type === 6"
					:class="index === 0 ? 'content_array first_content' : 'content_array'"
					v-for="(recommenditem, index) in recommendData"
					:key="index"
					@click="handleInfo(recommenditem.ArticleID)"
				>
					<van-row class="content">
						<van-col
							:span="recommenditem.ImagePath ? 16 : 24"
							class="policy_content"
						>
							<span class="policy_content_title">{{
								recommenditem.Title
							}}</span>
							<span class="subtitle">
								<label>{{ recommenditem.ParentArticle.Title }}</label>
							</span>
							<span class="policy_content_container">
								{{
									recommenditem.Content
										? recommenditem.Content.replace(/&lt;.+?&gt;/g, '')
										: ''
								}}
							</span>
						</van-col>
						<van-col span="8" class="policy_img" v-if="recommenditem.ImagePath">
							<van-image :src="recommenditem.ImagePath" />
						</van-col>
					</van-row>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import * as SectionModelsApi from '../../../../apis/SectionModelsApi';
import * as SectionsApi from '../../../../apis/SectionsApi';
import * as ArticlesApi from '../../../../apis/ArticlesApi';

export default {
	name: 'mother-child-manual-index',
	data() {
		return {
			sectionModelsData: null,
			sectionData: null,
			recommendData: null // 推荐的惠民政策文章
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		this.getSectionModelsData();
		this.getRecommendData();
	},
	methods: {
		/**
		 * 获取母子健康手册栏目
		 */
		getSectionModelsData() {
			this.$toast.loading('加载中...');
			SectionModelsApi.getSectionModels(3)
				.then(res => {
					if (res.Code === 0) {
						this.sectionModelsData = res.Body;
						// 根据模式获取板块
						SectionsApi.getSectionByModels(
							this.sectionModelsData.SectionModelVal
						).then(result => {
							if (result.Code === 0) {
								this.sectionData = result.Body;
							} else {
								this.$toast.fail(result.Message);
							}
						});
					} else {
						this.$toast.fail(res.Message);
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 获取推荐
		 */
		getRecommendData() {
			ArticlesApi.getRecommend({
				ArticleSectionID: 1,
				ArticleModel: 0,
				ParentArticleID: 0
			}).then(res => {
				if (res.Code === 0) {
					this.recommendData = res.Body;
				} else {
					this.$toast.fail(res.Message);
				}
			});
		},
		/**
		 * 查看文章详情
		 */
		handleInfo(id) {
			this.$router.push({
				path: '/mother/pregnant-encyclopedia-info',
				query: {
					article_id: id
				}
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-mother-child-manual-index';
.@{inner-prefix} {
	height: 100%;
	background: #f8f8f8;
	&-bar {
		padding: 16px 18px;
	}
	&-title {
		height: 132px;
		display: flex;
		justify-items: flex-start;
		padding-left: 30px;
		.title {
			font-size: 26px;
			color: #292654;
		}
		.logo_img {
			margin-left: 57px;
			height: 75px;
			width: 109px;
		}
	}
	&-body {
		padding: 0 5px;
		.option {
			margin-top: 8px;
			border-top: none;
			position: relative;
			top: -50px;
			.grid {
				text-align: center;
				background: #ffffff;
				border-radius: 10px 10px 0 0;
				.van-grid-item__content {
					padding-top: 24px;
					padding-bottom: 19px;
				}
				.van-grid-item:first-child .van-grid-item__content {
					border-radius: 10px 0 0 0;
				}
				.van-grid-item:last-child .van-grid-item__content {
					border-radius: 0 10px 0 0;
				}
				.van-image {
					border-radius: 50%;
					padding: 13px;
					img {
						height: 26px;
						width: 26px;
					}
				}
				.title {
					margin-top: 5px;
					color: #333333;
				}
			}
		}
		.manual {
			background: #ffffff;
			padding: 19px;
			margin-top: -45px;
			margin-bottom: 5px;
			border-radius: 5px;
			display: flex;
			align-items: center;
			.manual_text {
				display: flex;
				flex-direction: column;
				span:first-child {
					font-size: 19px;
					color: #000000;
				}
				span:last-child {
					font-size: 14px;
					color: #888888;
					margin-top: 5px;
				}
			}
		}
		.content_array {
			background: #ffffff;
			.content {
				padding: 22px 10px;
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
						color: #999999;
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
		.first_content {
			// margin-top: -45px;
			border-radius: 10px 10px 0 0;
		}
	}
}
</style>
