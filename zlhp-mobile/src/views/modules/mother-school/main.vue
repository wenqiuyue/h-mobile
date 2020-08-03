<template>
	<div :class="classRoot">
		<van-nav-bar
			title="孕妈学校"
			left-arrow
			@click-left="$router.back()"
		></van-nav-bar>
		<div :class="`${classRoot}-choice`">
			<van-button
				@click="required = !required"
				:style="required ? buttonColor : ''"
			>
				<svg-icon value="icon-RequiredCourse" :size="2" />必修课
			</van-button>
			<van-button
				@click="enabled = !enabled"
				:style="enabled ? buttonColor : ''"
			>
				<svg-icon value="icon-motherSchool_signUp" :size="2" />可报名
			</van-button>
			<div class="choice-icon" @click="showPopup = true">
				<svg-icon value="icon-motherSchool_Screen" />
				<span>筛选</span>
			</div>
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
					<div
						v-for="item in courseData"
						:key="item.CourseID"
						class="class-car"
						@click="runClass(item['CourseInfoID'])"
					>
						<div class="mask" v-if="item.ClassStatus === 2">
							<svg-icon value="icon-over" :size="item['Banner'] ? 8 : 6" />
						</div>
						<!-- 题目 -->
						<div class="class-title">
							<svg-icon
								value="icon-sign_MiniNew"
								class="new-class-icon"
								:size="1.7"
								v-if="item['IsNew']"
							/>
							{{ item['Title'] }}
						</div>
						<!-- 标签 -->
						<div>
							<van-tag
								v-for="(tag, index) in item['TagNameArray']"
								:key="index"
								class="title-tag"
								>{{ tag }}</van-tag
							>
						</div>
						<van-image
							class="banner"
							fit="fill"
							:src="item['Banner']"
							v-if="item['Banner']"
						/>
						<!-- 时间 -->
						<div class="class-time">
							<span class="time">
								{{
									`${item['ClassDataDate']} ${item['ClassDataWeek']} ${item['ClassBeginTimeStr']}~${item['ClassEndTimeStr']}`
								}}
							</span>
							<van-tag
								color="#FFF3F0"
								text-color="#FF4E2C"
								class="surplus-time"
								v-if="item['IsTodayEndSignUp']"
							>
								距结束
								<van-count-down
									:time="item['SignUpEndTimeCount'] * 1000"
									format="HH小时mm分"
								/>
							</van-tag>
						</div>
						<!-- 医生 -->
						<div class="class-doctor">
							<van-image
								v-if="item['MedicalStaff']['Avatar']"
								round
								width="2.2rem"
								height="2.2rem"
								fit="cover"
								:src="item['MedicalStaff']['Avatar']"
							/>
							<svg-icon v-else value="icon-Headportrait" :size="3" />
							<span v-if="item['MedicalStaff']" class="doctor-name"
								>{{ item['MedicalStaff']['Name'] }}
								<label v-if="item.MedicalStaff.MedicalStaffOfType.length > 0"
									>(
									{{
										item.MedicalStaff.MedicalStaffOfType[0].MedicalStaffType
											.MedicalStaffTypeName
									}}
									)</label
								></span
							>
							<span v-else class="doctor-name"
								>{{ item['Lecturer'] }} ({{ item['LecturerTitle'] }})</span
							>
							<!-- <span class="sign-up" style="color:#85DA46" v-if="item.IsClass"
								>课程进行中</span
							> -->
							<template v-if="item.ClassStatus !== 2">
								<span
									class="sign-up"
									style="color:#FF0000"
									v-if="item.SignInStatus === 2"
									>报名时间已截止</span
								>
								<span
									v-else
									class="sign-up"
									:style="
										item['MaxPeople'] - item['SignUpCount'] < 5
											? 'color:#FF0000'
											: ''
									"
									>{{
										item['MaxPeople'] - item['SignUpCount'] === 0
											? '无剩余名额'
											: `剩余${item['MaxPeople'] - item['SignUpCount']}个名额`
									}}</span
								>
							</template>
						</div>
					</div>
				</div>
				<hint v-else-if="!loading" message="这里好冷清，没有任何课程" />
			</van-list>
		</van-pull-refresh>

		<div
			v-if="selScreen.length"
			@submit="onSubmit"
			:class="`${classRoot}-screening-now`"
		>
			<div class="tip">当前分类:</div>
			<div class="screening">
				<van-tag
					v-for="(tag, index) in selScreen"
					:key="index"
					closeable
					size="medium"
					type="primary"
					class="screening-tag"
					@close="closeSel(tag)"
				>
					{{ tag }}
				</van-tag>
			</div>
		</div>
		<!-- 日期和孕周筛选选择框 -->
		<van-popup
			v-model="showPopup"
			round
			position="bottom"
			:style="{ height: '65%' }"
			:class="`${classRoot}-pregnancy-screening`"
		>
			<div class="determine">
				<span @click="cancle">取消</span><span @click="determine">确定</span>
			</div>
			<div class="option">
				<van-tabs v-model="active" color="#FCD3D3">
					<van-tab title="适用孕周">
						<van-picker
							class="gestational-age"
							:columns="columns"
							:default-index="1"
							@change="onChange"
						/>
					</van-tab>
					<van-tab title="开课日期">
						<van-datetime-picker
							v-model="classDate"
							type="date"
							:min-date="minDate"
							@change="onChangeDate"
							confirm-button-text=" "
							cancel-button-text=" "
						/>
					</van-tab>
				</van-tabs>
			</div>
		</van-popup>
	</div>
</template>
<script>
import * as CourseInfoApi from '../../../apis/CourseInfoApi';
import * as UserApi from '../../../apis/UserApi';
import { changeNum } from '../../../commons';

export default {
	name: 'mother-school',
	data() {
		return {
			courseData: [], // 课程信息
			required: false, // 按必修课筛选
			enabled: false, // 按可报名筛选
			isWeek: false, // 按孕期筛选
			isDate: false, // 按照日期筛选
			hasPic: true, // 课程是否有图片
			selScreen: [], // 选择的筛选标签
			newClass: null, // 最新课程
			showPopup: false, // 日期和孕周筛选选择框是否显示
			buttonColor: {
				background: '#FFF6F4'
			},
			active: 0, // 孕期和时间筛选选项
			columns: [
				'孕早期 (0 ~ 12周)',
				'孕中期 (13 ~ 27周)',
				'孕晚期 (28 ~ 42周)'
			], // 孕期选项
			minDate: new Date(2020, 0, 1),
			// maxDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
			classDate: new Date(), // 选择的开课时间
			weekIndex: 1, // 选择的孕期
			alreadyWeekIndex: -1, // 上一次选择的孕期
			alreadyDate: null, // 上一次选择的日期
			userId: null, // 用户userid
			paramData: {
				// 课程列表分页接口从参数
				ClassData: null,
				IsMust: null,
				FitWeek: null,
				IsSignIn: null,
				page: 0,
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
	watch: {
		// 必修课筛选
		required() {
			if (this.required) {
				this.paramData.IsMust = 1;
				this.onRefresh();
				this.selScreen.push('必修课');
			} else {
				this.paramData.IsMust = null;
				this.onRefresh();
				this.selScreen = this.selScreen.filter(
					item => item.indexOf('必修课') === -1
				);
			}
		},
		// 可报名筛选
		enabled() {
			if (this.enabled) {
				this.paramData.IsSignIn = true;
				this.onRefresh();
				this.selScreen.push('可报名');
			} else {
				this.paramData.IsSignIn = null;
				this.onRefresh();
				this.selScreen = this.selScreen.filter(
					item => item.indexOf('可报名') === -1
				);
			}
		},
		// 孕期筛选
		isWeek() {
			if (this.isWeek) {
				if (this.weekIndex === 0) {
					this.paramData.FitWeek = '孕早期';
				} else if (this.weekIndex === 1) {
					this.paramData.FitWeek = '孕中期';
				} else {
					this.paramData.FitWeek = '孕晚期';
				}
				this.onRefresh();
				this.selScreen.push(this.columns[this.weekIndex]);
			} else if (!this.isWeek && !this.showPopup) {
				this.paramData.FitWeek = null;
				this.onRefresh();
				this.selScreen = this.selScreen.filter(
					item => item.indexOf(this.columns[this.weekIndex]) === -1
				);
			}
		},
		// 开课日期筛选
		isDate() {
			if (this.isDate) {
				this.paramData.ClassData = new Date(
					this.classDate
				).toLocaleDateString();
				this.onRefresh();
				this.selScreen.push(new Date(this.classDate).format('MM月dd日'));
			} else if (!this.isDate && !this.showPopup) {
				this.paramData.ClassData = null;
				this.onRefresh();
				this.selScreen = this.selScreen.filter(
					item =>
						item.indexOf(new Date(this.classDate).format('MM月dd日')) === -1
				);
			}
		}
	},
	created() {
		// 获取用户userid
		UserApi.GetUser().then(res => {
			if (res.Code === 0 && res.Body) {
				this.userId = res.Body.UserID;
			}
		});
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
		 * 进入课程
		 */
		runClass(cid) {
			this.$router.push({
				path: '/mother/course-introduction',
				query: {
					courseinfo_id: cid
				}
			});
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
			CourseInfoApi.GetCourseInfoList(this.paramData)
				.then(res => {
					if (res.Code === 0) {
						res.Body.forEach(element => {
							// 切割tagName字段
							if (element.TagName) {
								element.TagNameArray = element.TagName.split(',').map(s => {
									return s;
								});
							}
							// 判断课程是否已报名
							if (element.CourseSignUp) {
								element.CourseSignUp.forEach(ele => {
									if (ele.UserID === this.userId) {
										element.statusClass = 0;
									} else {
										element.statusClass = 1;
									}
								});
							} else {
								element.statusClass = 1;
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
		 * 取消选择
		 */
		onSubmit() {
			this.required = false;
			this.enabled = false;
			this.isWeek = false;
			this.isDate = false;
		},
		/**
		 * 关闭标签取消该筛选条件
		 */
		closeSel(tag) {
			if (tag === '必修课') {
				this.required = false;
			} else if (tag === '可报名') {
				this.enabled = false;
			} else if (tag === this.columns[this.weekIndex]) {
				this.isWeek = false;
			} else if (tag === new Date(this.classDate).format('MM月dd日')) {
				this.isDate = false;
			}
		},
		/**
		 * 孕期选项
		 */
		onChange(picker, value, index) {
			this.isWeek = false;
			this.weekIndex = index;
			if (this.alreadyWeekIndex !== -1) {
				this.selScreen = this.selScreen.filter(
					item => item.indexOf(this.columns[this.alreadyWeekIndex]) === -1
				);
				this.alreadyWeekIndex = -1;
			}
		},
		/**
		 * 选择的开课时间改变
		 */
		onChangeDate() {
			// eslint-disable-next-line no-console
			this.isDate = false;
			if (this.alreadyDate) {
				this.selScreen = this.selScreen.filter(
					item =>
						item.indexOf(new Date(this.alreadyDate).format('MM月dd日')) === -1
				);
				this.alreadyDate = null;
			}
		},
		/**
		 * 确定筛选
		 */
		determine() {
			if (this.active === 0) {
				this.isWeek = true;
				this.alreadyWeekIndex = this.weekIndex;
			} else {
				this.isDate = true;
				this.alreadyDate = this.classDate;
			}
			this.showPopup = false;
		},
		/**
		 * 取消筛选
		 */
		cancle() {
			this.showPopup = false;
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-mother-school';
.@{inner-prefix} {
	height: 100%;

	&-choice {
		padding: 15px 0;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		background: #ffffff;
		button {
			padding-left: 15px;
			border: 1px solid #facdc5;
			border-radius: 8px;
			height: 43px;
			width: 42%;
			font-size: 14px;
			color: #333333;
			svg {
				vertical-align: middle;
				position: relative;
				bottom: 1px;
				right: 5px;
			}
		}
		.choice-icon {
			float: right;
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 12px;
			color: #fbb8b8;
			span {
				margin-top: 2px;
			}
		}
	}
	&-body {
		height: calc(100% - 146px);
		overflow-y: scroll;
		overflow-x: hidden;
		padding: 11px 7px;
		background: @background-color-container;
		.van-pull-refresh__track {
			height: 100%;
		}
		.class-main {
			padding-bottom: 22px;
			.class-car {
				border-radius: 10px;
				border: 1px solid #f3f3f3;
				margin-bottom: 10px;
				background: #ffffff;
				padding: 20px 10px;
				position: relative;
				.mask {
					border-radius: 10px;
					background: rgba(19, 0, 0, 0.28);
					height: 100%;
					width: 100%;
					z-index: 200;
					position: absolute;
					top: 0;
					left: 0;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				.class-title {
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
				.banner {
					height: 147px;
					width: 100%;
					margin-top: 13px;
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
					padding-top: 15px;
					display: flex;
					flex-direction: row;
					align-items: flex-end;
					// justify-content: space-between;
					.doctor-name {
						font-size: 13px;
						color: #666666;
						margin-left: 10px;
						flex: 5;
					}
					.sign-up {
						font-size: 13px;
						color: #999999;
						float: right;
					}
				}
			}
		}
	}
	&-current-screening {
		padding: 15px 10px;
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		color: #999999;
		box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.8);
		.button {
			color: #ff6060;
			font-size: 16px;
			border: 1px solid #f06e80;
		}
	}
	&-screening-now {
		font-size: 12px;
		color: #999999;
		box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.8);
		padding: 8px 0;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 999;
		width: 100%;
		background: #ffffff;
		.tip {
			color: #333333;
			font-size: 13px;
			padding: 0 5px;
		}
		.screening {
			margin-top: 18px;
			.screening-tag {
				background: rgba(255, 170, 170, 0.25);
				color: #333333;
				font-size: 13px;
				padding: 5px 2px 5px 11px;
				border-radius: 10px;
				margin: 0 0 5px 5px;
				.van-tag__close {
					margin-left: 7px;
					background: #ffaaaa;
					border-radius: 50%;
					padding: 2px;
					color: #fff;
				}
			}
		}
	}
	&-pregnancy-screening {
		.determine {
			padding: 25px 33px;
			display: flex;
			justify-content: space-between;
			font-size: 14px;
			span:first-child {
				color: #666666;
			}
			span:last-child {
				color: #fc8892;
			}
		}
		.option {
			padding: 0 45px;
			font-size: 14px;
			color: #333333;
		}
	}
}
</style>
