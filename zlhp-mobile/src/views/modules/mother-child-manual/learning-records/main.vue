<template>
	<div :class="classRoot">
		<van-nav-bar
			title="孕妇学校学习记录"
			left-arrow
			@click-left="$router.back()"
		></van-nav-bar>
		<van-pull-refresh
			v-model="refreshing"
			:class="`${classRoot}-body`"
			@refresh="onRefresh"
		>
			<van-list
				v-model="loading"
				:finished="finished"
				:error="error"
				finished-text="没有更多了"
				@load="getSignUpList"
			>
				<template v-if="signUpList && signUpList.length">
					<div
						class="records_array"
						v-for="(item, index) in signUpList"
						:key="index"
					>
						<span class="line"></span>
						<van-panel class="records_panel">
							<template #header>
								<div class="header">
									<div class="circle"></div>
									{{ item.CourseInfo.ClassDataDate }}
								</div>
							</template>
							<div class="default">
								<div class="title">{{ item.CourseInfo.Title }}</div>
								<div class="bottom">
									<span class="time"
										>课程时间：
										{{
											`${item['CourseInfo']['ClassDataWeek']} ${item['CourseInfo']['ClassBeginTimeStr']}~${item['CourseInfo']['ClassEndTimeStr']}`
										}} </span
									><van-button
										round
										:class="!item.TakeNotes ? 'pink_button' : 'gray_button'"
										@click="takeNotes(item)"
										>{{ !item.TakeNotes ? '记笔记' : '看笔记' }}</van-button
									>
								</div>
							</div>
						</van-panel>
					</div>
				</template>
				<hint v-else-if="!loading" message="这里好冷清，没有任何课程记录" />
			</van-list>
		</van-pull-refresh>
	</div>
</template>
<script>
import * as CourseSignUpApi from '../../../../apis/CourseSignUpApi';

export default {
	name: 'learning-records',
	data() {
		return {
			loading: false,
			finished: false,
			error: false,
			refreshing: false,
			signUpList: [], // 预约记录列表
			paramData: {
				// 课程列表分页接口从参数
				page: 0,
				limit: 10
			}
		};
	},
	created() {},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	methods: {
		/**
		 * 记笔记
		 */
		takeNotes(data) {
			if (data.TakeNotes) {
				this.$router.push({
					path: '/mother/look-notes',
					query: {
						course_signup_id: data.CourseSignUpID
					}
				});
			} else {
				this.$router.push({
					path: '/mother/take-notes',
					query: {
						course_signup_id: data.CourseSignUpID
					}
				});
			}
		},
		/**
		 * 刷新
		 */
		onRefresh() {
			this.signUpList = [];
			this.finished = false;
			this.loading = true;
			this.getSignUpList();
		},
		/**
		 * 获取报名记录
		 */
		getSignUpList() {
			if (this.refreshing) {
				this.signUpList = [];
				this.refreshing = false;
			}
			this.paramData.page =
				Math.floor(this.signUpList.length / this.paramData.limit) + 1;
			CourseSignUpApi.GetUserList(this.paramData)
				.then(res => {
					if (res.Code === 0 && res.Body) {
						this.signUpList.push(...res.Body);
						if (res.Body.length !== this.paramData.limit) {
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
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-learning-records';
.@{inner-prefix} {
	height: 100%;
	background: #f8f8f8;
	&-body {
		height: calc(100% - 56px);
		overflow: scroll;
		padding: 0 5px 10px 5px;
		.records_array {
			.line {
				display: block;
				background: #e5e5e5;
				border: 2px solid #e5e5e5;
				margin-left: 10px;
				height: 6px;
				width: 1px;
			}
			.records_panel {
				border-radius: 5px;
				box-shadow: 1px 1px 2px rgba(221, 221, 221, 1);
				.header {
					padding: 9px;
					font-size: 15px;
					color: #666666;
					display: flex;
					flex-direction: row;
					align-items: center;
					border-bottom: 1px solid #e5e5e5;
					.circle {
						width: 7px;
						height: 7px;
						border-radius: 50%;
						background: #ff7979;
						margin-right: 10px;
					}
				}
				.default {
					padding: 13px 16px 9px 25px;
					.title {
						font-size: 16px;
						color: #000000;
					}
					.bottom {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: 17px;
						.time {
							font-size: 15px;
							color: #bbbbbb;
						}
						.van-button {
							width: 81px;
							height: 30px;
							line-height: 30px;
						}
						.pink_button {
							color: #ff8080;
							border: 1px solid #ffbcbb;
						}
						.gray_button {
							color: #676767;
							border: 1px solid #c9c9c9;
						}
					}
				}
			}
		}
	}
}
</style>
