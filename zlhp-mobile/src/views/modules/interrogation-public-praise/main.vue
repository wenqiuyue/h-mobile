<template>
	<div :class="classRoot">
		<van-nav-bar title="全部口碑" left-arrow @click-left="$router.back()">
		</van-nav-bar>
		<div :class="`${classRoot}-body`">
			<van-panel class="title-panel" v-if="commitsOtherData">
				<template #header>
					<div class="favorable-rate">
						<span
							>综合评分
							{{ parseFloat(commitsOtherData.Percent).toFixed(1) }}分</span
						><span
							>评论数({{
								commitsOtherData.Count > 99 ? '99+' : commitsOtherData.Count
							}})</span
						>
					</div>
					<div class="public-praise-tag" v-if="commitsOtherData.Tags.length">
						<van-tag
							color="#FFF8F8"
							text-color="#FF8888"
							v-for="(tag, index) in commitsOtherData.Tags"
							:key="index"
							>{{ tag.Name }}({{ tag.Count > 99 ? '99+' : tag.Count }})</van-tag
						>
					</div>
				</template>
			</van-panel>
			<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
				<van-list
					v-model="loading"
					:finished="finished"
					:error="error"
					finished-text="没有更多啦"
					@load="getCommits"
				>
					<van-panel class="comment" v-if="commitsData && commitsData.length">
						<template #header>
							<div class="public-praise-comment">
								<div
									class="public-praise-car"
									v-for="(item, index) in commitsData"
									:key="index"
								>
									<div class="userinfo">
										<div class="userinfo-pic">
											<van-image
												round
												width="50px"
												height="50px"
												fit="cover"
												:src="item.User.UserImage"
											/>
											<span class="userinfo-name"
												><div>{{ item.User.UserName }}</div>
												<div>
													{{
														new Date(item.CreateTime).format('yyyy-MMMM-dddd')
													}}
												</div></span
											>
										</div>
										<van-rate
											:value="item.Score / 2"
											allow-half
											void-icon="star"
											void-color="#eee"
											size="14px"
											readonly
										/>
									</div>
									<div class="public-praise-content">
										{{ item.Content }}
									</div>
									<!-- <div class="public-praise-pic" v-if="index % 2 !== 0">
								<van-image
									v-for="(img, index) in publicPraisePic"
									:key="index"
									width="80px"
									height="80px"
									fit="cover"
									:src="img"
									@click="browsePic(index)"
								/>
							</div> -->
								</div>
							</div>
						</template>
					</van-panel>
					<hint v-else-if="!loading" message="这里好冷清，没有任何评价" />
				</van-list>
			</van-pull-refresh>
			<!-- <van-panel class="public-praise-footer">
				<template #header>
					<div>已过滤帮助不大的信息</div>
					<div class="no-more">没有更多啦</div>
				</template>
			</van-panel> -->
		</div>
	</div>
</template>
<script>
import * as InquiryCommitsApi from '../../../apis/InquiryCommitsApi';

export default {
	name: 'interrogation-public-praise',
	data() {
		return {
			doctorId: this.$route.query.doctor_id, // 在线医生id
			commitsData: [], // 评论数据
			commitsOtherData: null, // 评论显示在头部数据
			inquiryCommitsParam: {
				OnlineDoctorID: null,
				page: 1,
				limit: 10
			},
			loading: false,
			finished: false,
			error: false,
			refreshing: false
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	mounted() {},
	methods: {
		/**
		 * 刷新
		 */
		onRefresh() {
			this.commitsData = [];
			this.loading = true;
			this.finished = false;
			this.getCommits();
		},
		/**
		 * 获取评论列表
		 */
		getCommits() {
			if (this.refreshing) {
				this.commitsData = [];
				this.refreshing = false;
			}
			this.inquiryCommitsParam.page =
				Math.floor(this.commitsData.length / this.inquiryCommitsParam.limit) +
				1;
			this.inquiryCommitsParam.OnlineDoctorID = this.doctorId;
			InquiryCommitsApi.GetInquiryCommits(this.inquiryCommitsParam)
				.then(res => {
					if (res.Code === 0) {
						this.commitsOtherData = res.Body;

						this.commitsData.push(...res.Body.Data);
						if (res.Body.Data.length !== this.inquiryCommitsParam.limit) {
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
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-interrogation-public-praise';
.@{inner-prefix} {
	background: #f8f8f8;
	height: 100%;
	&-body {
		padding: 5px 0;
		height: calc(100% - 57px);
		overflow: scroll;
		.title-panel {
			padding: 16px 19px;
			.favorable-rate {
				display: flex;
				justify-content: space-between;
				align-items: center;
				span:first-child {
					color: #f082a5;
				}
				span:last-child {
					color: #9f9f9f;
					font-size: 12px;
				}
			}
			.public-praise-tag {
				margin-top: 19px;
				.van-tag {
					margin-right: 5px;
					font-size: 13px;
					padding: 3px 9px;
					border-radius: 12px;
					margin-bottom: 8px;
				}
			}
		}
		.van-pull-refresh {
			.comment {
				margin-top: 4px;
				.public-praise-comment {
					padding: 0 20px 0 20px;
					padding-bottom: 15px;
					.public-praise-car {
						padding: 15px 0 29px 0;
						border-bottom: 1px solid #dddddd;
						.userinfo {
							display: flex;
							justify-content: space-between;
							.userinfo-pic {
								display: flex;
								flex-direction: row;
								align-items: center;
								.userinfo-name {
									margin-left: 8px;
									div:first-child {
										color: #333333;
									}
									div:last-child {
										margin-top: 9px;
										font-size: 12px;
										color: #999999;
									}
								}
							}
							.van-rate {
								margin-top: 5px;
							}
						}
						.public-praise-content {
							margin-top: 18px;
							line-height: 22px;
							color: #333333;
						}
						.public-praise-pic {
							margin-top: 15px;
							.van-image {
								margin-right: 10px;
								img {
									border-radius: 5px;
								}
							}
						}
					}
				}
			}
		}

		.public-praise-footer {
			margin-top: 5px;
			padding: 20px 0;
			text-align: center;
			.no-more {
				margin-top: 23px;
				font-size: 12px;
				color: #999999;
			}
			.no-more::before {
				content: '—— ';
			}
			.no-more::after {
				content: ' ——';
			}
		}
	}
}
</style>
