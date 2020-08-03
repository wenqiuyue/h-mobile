<template>
	<div :class="classRoot">
		<van-nav-bar
			title="我的课程"
			left-arrow
			@click-left="$router.back()"
		></van-nav-bar>
		<div :class="`${classRoot}-screen`">
			<van-radio-group v-model="screenRadio" class="screen-group">
				<van-radio
					v-for="(screen, index) in screenGroup"
					:key="index"
					:name="index"
					checked-color="#f59fb0"
					icon-size="18"
					>{{ screen }}</van-radio
				>
			</van-radio-group>
		</div>

		<van-pull-refresh
			v-model="refreshing"
			@refresh="onRefresh"
			:class="`${classRoot}-body`"
		>
			<van-list
				v-model="loading"
				:finished="finished"
				:error="error"
				finished-text="没有更多了"
				@load="getCourse"
			>
				<div class="class-main" v-if="courseData && courseData.length">
					<van-panel
						v-for="item in courseData"
						:key="item.CourseID"
						class="class-car"
					>
						<div slot="header" class="head">
							<!-- 医生 -->
							<div class="class-doctor">
								<div class="docter-left" @click="teacherInfo(item)">
									<van-image
										v-if="item['CourseInfo']['MedicalStaff']['Avatar']"
										round
										width="1.8rem"
										height="1.8rem"
										fit="cover"
										:src="item['CourseInfo']['MedicalStaff']['Avatar']"
									/>
									<svg-icon v-else value="icon-Headportrait" :size="3" />
									<span
										v-if="item['CourseInfo']['MedicalStaff']"
										class="doctor-name"
										>{{
											item['CourseInfo']['MedicalStaff']
												? item['CourseInfo']['MedicalStaff']['Name']
												: item['CourseInfo']['Lecturer']
										}}</span
									>
									<van-icon
										class="arrow-icon"
										name="arrow"
										color="#BBBBBB"
										:size="13"
									/>
								</div>
								<div class="docter-right">
									<span v-if="item['Status'] === 2">未签到</span>
									<span v-else-if="item['Status'] === 1">已取消</span>
									<span v-else-if="item['Status'] === 3">已签到</span>
								</div>
							</div>
							<!-- 题目 -->
							<div @click="viewDetails(item['CourseInfoID'])">
								<div class="class-title">
									<svg-icon
										value="icon-sign_MiniNew"
										v-if="item['CourseInfo']['IsNew']"
										class="new-class-icon"
										:size="1.7"
									/>
									{{ item['CourseInfo']['Title'] }}
								</div>
								<van-tag
									v-for="(tag, index) in item['TagNameArray']"
									:key="index"
									class="title-tag"
									>{{ tag }}</van-tag
								>
								<!-- 时间 -->
								<div class="class-time">
									<span class="time">
										{{
											`${item['CourseInfo']['ClassDataDate']} ${item['CourseInfo']['ClassDataWeek']} ${item['CourseInfo']['ClassBeginTimeStr']}~${item['CourseInfo']['ClassEndTimeStr']}`
										}}
									</span>
									<van-tag
										color="#FFF3F0"
										text-color="#FF4E2C"
										class="surplus-time"
										v-if="item['CourseInfo']['IsTodayEndSignUp']"
									>
										距结束
										<van-count-down
											:time="item['CourseInfo']['SignUpEndTimeCount'] * 1000"
											format="HH小时mm分"
										/>
									</van-tag>
								</div>
								<div class="footer_button">
									<van-button
										round
										type="info"
										plain
										color="#666666"
										class="grey-button"
										@click.stop="viewDetails(item['CourseInfoID'])"
										>查看详情</van-button
									>
									<van-button
										v-if="
											item['Status'] === 0 && item.CourseInfo.ClassStatus !== 2
										"
										round
										type="info"
										plain
										color="#F27198"
										@click.stop="cancelSignUp(item['CourseSignUpID'])"
										>取消报名</van-button
									>
								</div>
							</div>
						</div>
						<!-- <div slot="footer" class="footer">
							<span @click="viewDetails(item['CourseInfoID'])">查看详情</span>
							<span
								v-if="item['Status'] === 0 && item['ClassStatus'] === 3"
								@click="cancelSignUp(item['CourseSignUpID'])"
								>取消报名</span
							>
							<span
								v-else-if="item['Status'] === 0 && item['ClassStatus'] === 2"
								>未签到</span
							>
							<span v-else-if="item['ClassStatus'] === 4">课程进行中</span>
							<span v-else-if="item['Status'] === 1">已取消</span>
							<span v-else-if="item['Status'] === 3">已签到</span>
							<span v-else>已开课</span>
						</div> -->
					</van-panel>
				</div>
				<hint v-else-if="!loading" message="这里好冷清，没有任何课程" />
			</van-list>
		</van-pull-refresh>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import * as CourseSignUpApi from '../../../apis/CourseSignUpApi';
import { changeNum } from '../../../commons';
import types from '../../../commons/types';
import * as TipConfigsApi from '../../../apis/TipConfigsApi';

export default {
	name: 'my-sign-up',
	data() {
		return {
			courseData: [], // 课程信息
			screenGroup: ['全部', '未开课', '已开课', '已取消'], // 筛选单选框选择项
			screenRadio: 0, // 筛选单选框当前选择的选择项
			paramData: {
				// 课程列表分页接口从参数
				Status: null,
				page: 0,
				limit: 10
			},
			refreshing: false,
			loading: false,
			finished: false,
			error: false,
			tipData: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		},
		...mapState({
			radio: state => state[types.SIGNUP_RADIO]
		})
	},
	watch: {
		screenRadio() {
			if (this.screenRadio === 0) {
				this.paramData.Status = null;
			} else if (this.screenRadio === 1) {
				this.paramData.Status = 0;
			} else if (this.screenRadio === 2) {
				this.paramData.Status = 1;
			} else {
				this.paramData.Status = 2;
			}
			this.onRefresh();
		}
	},
	created() {
		this.screenRadio = this.radio;
		this.getTips();
	},
	methods: {
		changeNum,
		/**
		 * 刷新
		 */
		onRefresh() {
			this.courseData = [];
			this.loading = true;
			this.finished = false;
			this.getCourse();
		},
		/**
		 * 获取所有课程
		 */
		getCourse() {
			if (this.refreshing) {
				this.courseData = [];
				this.refreshing = false;
			}
			this.paramData.page =
				Math.floor(this.courseData.length / this.paramData.limit) + 1;
			// this.$toast.loading('加载中');
			CourseSignUpApi.GetUserList(this.paramData)
				.then(res => {
					if (res.Code === 0 && res.Body) {
						res.Body.forEach(element => {
							// 切割tagName字段
							if (element.CourseInfo.TagName) {
								element.TagNameArray = element.CourseInfo.TagName.split(
									','
								).map(s => {
									return s;
								});
							}
							this.courseData.push(element);
						});
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
		},
		/**
		 * 讲师介绍
		 */
		teacherInfo(data) {
			if (data.CourseInfo.MedicalStaff) {
				this.$router.push({
					path: '/mother/teacher-introduction',
					query: {
						teacher_id: data.CourseInfo.MedicalStaff.MedicalStaffID
					}
				});
			}
		},
		/**
		 * 查看详情
		 */
		viewDetails(cid) {
			this.$router.push({
				path: '/mother/course-introduction',
				query: {
					courseinfo_id: cid
				}
			});
			this.$store.dispatch(types.SIGNUP_RADIO, this.screenRadio);
		},
		/**
		 * 取消报名
		 */
		cancelSignUp(cid) {
			this.$dialog
				.confirm({
					title: '标题',
					message: this.tipData[0].TipConent
				})
				.then(() => {
					CourseSignUpApi.UnSignUp(cid).then(res => {
						if (res.Code === 0 && res.Body) {
							this.courseData = [];
							this.getCourse();
						}
					});
				})
				.catch(() => {
					// on cancel
				});
		},
		/**
		 * 获取提示语
		 */
		getTips() {
			TipConfigsApi.GetByTipVals([1903]).then(res => {
				if (res.Code === 0 && res.Body) {
					this.tipData = res.Body;
				} else {
					this.$toast.fail(res.Message);
				}
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-my-sign-up';
.@{inner-prefix} {
	background: #f9f9f9;
	height: 100%;
	&-screen {
		padding: 15px 3px;
		.screen-group {
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			font-size: 14px;
		}
	}
	.van-pull-refresh {
		padding: 0 8px;
		height: calc(100% - 100px);
		overflow: scroll;
		.van-pull-refresh__track {
			height: 100%;
		}
		.class-main {
			.class-car {
				border-radius: 10px;
				border: 0.5px solid #ebedf0;
				margin-bottom: 8px;
				box-shadow: 1px 1px 3px rgba(6, 6, 6, 0.1);
				.head {
					padding: 24px 14px 15px 14px;
					.class-title {
						margin-top: 20px;
						font-size: 18px;
						.new-class-icon {
							vertical-align: middle;
							position: relative;
							bottom: 1px;
							right: 5px;
							margin-left: 10px;
						}
					}
					.title-tag {
						font-size: 13px;
						padding: 3px 8px;
						border-radius: 4.5px;
						margin: 13px 8px 0 0;
						background: #f8f8f8;
						color: #cb9946;
					}
					.class-time {
						margin-top: 10px;
						.time {
							font-size: 13px;
							color: #888888;
						}
						.surplus-time {
							font-size: 9px;
							border: 0.5px solid #ffd2cb;
							margin-left: 10px;
							border-radius: 4px;
							.van-count-down {
								font-size: 9px;
								color: #ff4e2c;
								line-height: 0;
							}
						}
					}
					.class-doctor {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						.docter-left {
							display: flex;
							flex-direction: row;
							align-items: center;
							.doctor-name {
								font-size: 16px;
								color: #666666;
								margin-left: 10px;
								flex: 5;
							}
							.arrow-icon {
								margin-left: 5px;
								margin-top: 2px;
							}
						}
						.docter-right {
							font-size: 14px;
							color: #fb5e5e;
						}
					}
					.footer_button {
						display: flex;
						justify-content: flex-end;
						margin-top: 26px;
						.van-button {
							margin-left: 5px;
							font-size: 14px;
							height: 30px;
							line-height: 10px;
							padding: 8px 20px;
						}
						.grey-button {
							border-color: #dddddd !important;
						}
					}
				}
				.footer {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					span {
						padding: 11px 35px;
						color: #666666;
					}
				}
			}
		}
	}
}
</style>
