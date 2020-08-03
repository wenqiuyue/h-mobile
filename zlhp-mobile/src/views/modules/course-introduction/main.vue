<template>
	<div :class="classRoot" v-if="courseInfo">
		<van-nav-bar
			title="课程介绍"
			left-arrow
			@click-left="$router.back()"
		></van-nav-bar>
		<div :class="`${classRoot}-body`">
			<!-- 头部 -->
			<div class="class-main">
				<van-image
					class="banner"
					fit="fill"
					:src="courseInfo['Banner']"
					v-if="courseInfo['Banner']"
				/>
				<!-- 题目 -->
				<div class="course_top_text">
					<div class="class-title">
						<svg-icon
							value="icon-sign_MiniNew"
							v-if="courseInfo['IsNew']"
							class="new-class-icon"
							:size="1.7"
						/>
						{{ courseInfo['Title'] }}
					</div>
					<van-tag
						v-for="(tag, index) in courseInfo.TagNameArray"
						:key="index"
						class="title-tag"
						>{{ tag }}</van-tag
					>
					<!-- 时间 -->
					<div class="class-time">
						<span class="time">
							{{
								`${courseInfo['ClassDataDate']} ${courseInfo['ClassDataWeek']} ${courseInfo['ClassBeginTimeStr']}~${courseInfo['ClassEndTimeStr']}`
							}}
						</span>
						<van-tag
							v-if="courseInfo['IsTodayEndSignUp']"
							color="#FFF3F0"
							text-color="#FF4E2C"
							class="surplus-time"
						>
							距结束
							<van-count-down
								:time="courseInfo['SignUpEndTimeCount'] * 1000"
								format="HH小时mm分"
							/>
						</van-tag>
					</div>
					<!-- 上课地点 -->
					<div class="class-place">上课地点：{{ courseInfo['Address'] }}</div>
				</div>
			</div>
			<!-- 医生 -->
			<div class="class-doctor" @click="teacherInfo">
				<van-image
					v-if="courseInfo['MedicalStaff']['Avatar']"
					round
					width="3rem"
					height="3rem"
					fit="cover"
					:src="courseInfo.MedicalStaff.Avatar"
				/>
				<svg-icon v-else value="icon-Headportrait" :size="3" />
				<span v-if="courseInfo['MedicalStaff']" class="doctor-name">
					{{ courseInfo['Lecturer'] }} (
					<label
						v-for="(type, index) in courseInfo['MedicalStaff'][
							'MedicalStaffOfType'
						]"
						:key="index"
					>
						{{
							`${type.MedicalStaffType.MedicalStaffTypeName}${
								index ===
								courseInfo['MedicalStaff']['MedicalStaffOfType'].length - 1
									? ''
									: '、'
							}`
						}} </label
					>)
				</span>
				<span v-else class="doctor-name">
					{{ courseInfo['Lecturer'] }} ({{ courseInfo['LecturerTitle'] }})
				</span>
				<svg-icon
					value="icon-home_RightArrow"
					v-if="courseInfo['MedicalStaff']"
				></svg-icon>
			</div>
			<!-- 课程介绍 -->
			<div class="class-introduce" v-html="courseInfo['Description']">
				<!-- <title-circle :title="'课程介绍'" :number="'01'"></title-circle>
				<div class="introduce">
					<van-button round class="class-bg">课程背景</van-button>
					<span class="introduce_main" v-if="courseInfo['Description']">
						{{
						courseInfo['Description']
						}}
					</span>
					<span v-else>暂无课程介绍</span>
				</div>
				<title-circle :title="'报名须知'" :number="'02'"></title-circle>
				<div class="notice">
					<span class="horn3"></span>
					<div class="question">
						<span>Q:</span> 请问这个课程如何报名？
					</div>
					<div class="answer">
						<span>A:</span>
						<div>
							1、本课程仅限在我院有孕产档案的妈妈报名参加，您在我院微信公众号参与课程报名即可；
							<br />
							2、课程名额有限（{{ courseInfo['MaxPeople'] }}名），请尽快报名；
							<br />
							3、报名的妈妈请按时参加课程培训哦，具体情况可以咨询{{
							courseInfo['Lecturer']
							}}老师（{{ courseInfo['Phone'] }}）。
						</div>
					</div>
				</div> -->
				<!-- <title-circle :title="'上课须知'" :number="'03'"></title-circle> -->
				<!-- <div class="instructions-class">
					<span class="line-left"></span>
					<span class="line-right"></span>
					<div class="instructions-class-info">
						上课时间：{{
						`${new Date(courseInfo['ClassData']).format(
						'MM月dd日'
						)} 周${changeNum(
						new Date(this.courseInfo.ClassData).getDay()
						)} ${new Date(courseInfo['ClassBeginTime']).format(
						'hh:mm'
						)}~${new Date(courseInfo['ClassEndTime']).format('hh:mm')}`
						}}
						<br />
						授课地点：{{ courseInfo['Address'] }}
						<br />
						咨询电话：{{ courseInfo['Lecturer'] }}老师 {{ courseInfo['Phone'] }}
						<br />
					</div>
				</div> -->
			</div>
		</div>
		<div
			:class="`${classRoot}-sign-up-end ${classRoot}-light-pink-end`"
			v-if="courseInfo['SignInStatus'] === 0"
		>
			还未到报名时间
		</div>
		<div
			:class="`${classRoot}-sign-up-end ${classRoot}-gray-end`"
			v-else-if="statusClass === 4 && courseInfo['ClassStatus'] === 2"
		>
			课程已结束
		</div>
		<div
			:class="`${classRoot}-sign-up-end ${classRoot}-light-pink-end`"
			v-else-if="statusClass === 0 && !courseInfo['IsTodayBeginClass']"
		>
			已报名，请开课当天前来签到
		</div>
		<div
			:class="`${classRoot}-sign-up-end ${classRoot}-pink-end`"
			v-else-if="
				statusClass === 0 &&
					courseInfo['IsTodayBeginClass'] &&
					isHospitalData &&
					courseInfo['ClassStatus'] !== 2
			"
			@click="signIn"
		>
			立即签到
		</div>
		<div
			:class="`${classRoot}-sign-up-end ${classRoot}-light-pink-end`"
			v-else-if="
				statusClass === 0 && courseInfo['IsTodayBeginClass'] && !isHospitalData
			"
		>
			当前位置不可签到
		</div>
		<div
			:class="`${classRoot}-sign-up-end ${classRoot}-pink-end`"
			v-else-if="statusClass === 3"
			@click="takeNotes"
		>
			记笔记 >>
		</div>
		<div
			:class="`${classRoot}-sign-up-end`"
			v-else-if="statusClass === 2 && courseInfo['ClassStatus'] === 2"
		>
			课程已结束，未签到
		</div>
		<div
			:class="`${classRoot}-sign-up-end`"
			v-else-if="statusClass === 4 && courseInfo['SignInStatus'] === 2"
		>
			报名时间已截止
		</div>
		<div
			:class="`${classRoot}-sign-up-end`"
			v-else-if="
				statusClass === 4 &&
					courseInfo['MaxPeople'] - courseInfo['SignUpCount'] === 0
			"
		>
			无剩余名额
		</div>
		<div :class="`${classRoot}-sign-up`" v-else-if="statusClass === 4">
			<span
				:style="
					courseInfo['MaxPeople'] - courseInfo['SignUpCount'] < 5
						? 'color:#FF0000'
						: ''
				"
			>
				还剩{{ courseInfo['MaxPeople'] - courseInfo['SignUpCount'] }}个名额
			</span>
			<van-button
				class="button"
				plain
				round
				size="small"
				@click="signUp(courseInfo.CourseInfoID)"
				>立即报名</van-button
			>
		</div>
	</div>
</template>
<script>
import wx from 'weixin-js-sdk';
import * as CourseInfoApi from '../../../apis/CourseInfoApi';
import * as UserApi from '../../../apis/UserApi';
import * as CourseSignUpApi from '../../../apis/CourseSignUpApi';
import * as TipConfigsApi from '../../../apis/TipConfigsApi';
import * as SiteApi from '../../../apis/SiteApi';
import { changeNum } from '../../../commons';
import { getDistance, setLocation } from '../../../commons/weixin';
export default {
	name: 'course-introduction',
	data() {
		return {
			hasPic: true, // 课程是否有图片
			courseId: null, // 课程id
			courseInfo: null, // 课程详情
			userData: null, // 用户信息
			statusClass: 4, // 用户课程报名状态 0，已报名 1，已取消 2，未参加 3，已参加 4，未报名
			signUpID: null, // 用户课程报名的id
			isHospitalData: false, // 是否到院
			tipData: null // 提示语
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	watch: {
		courseInfo() {
			if (this.courseInfo && this.userData) {
				// 判断课程是否已报名
				if (this.courseInfo.CourseSignUp.length) {
					this.courseInfo.CourseSignUp.forEach(element => {
						if (element.UserID === this.userData.UserID) {
							this.statusClass = element.Status;
							this.signUpID = element.CourseSignUpID;
						} else {
							this.statusClass = 4;
							this.signUpID = null;
						}
					});
				} else {
					this.statusClass = 4;
					this.signUpID = null;
				}
			}
		}
	},
	created() {
		this.courseId = this.$route.query.courseinfo_id;
		// 获取用户userid
		UserApi.GetUser().then(res => {
			if (res.Code === 0 && res.Body) {
				this.userData = res.Body;
			}
		});
		this.getCourseInfo();
		this.getTips();

		// eslint-disable-next-line no-undef
		wx.ready(() => {
			getDistance()
				.then(setLocation)
				.then(() => {
					SiteApi.canSignIn()
						.then(res => {
							this.isHospitalData = res;
						})
						.catch(() => {
							this.isHospitalData = false;
						});
				})
				.catch('获取距离失败');
		});
	},
	methods: {
		changeNum,
		getCourseInfo() {
			this.$toast.loading('加载中');
			CourseInfoApi.GetCourseInfoById(this.courseId)
				.then(res => {
					if (res.Code === 0) {
						this.courseInfo = res.Body;
						// 切割tagName字段
						if (this.courseInfo.TagName) {
							this.courseInfo.TagNameArray = this.courseInfo.TagName.split(
								','
							).map(s => {
								return s;
							});
						}
						// 讲师名字
						if (this.courseInfo.MedicalStaff) {
							this.courseInfo.Lecturer = this.courseInfo.MedicalStaff.Name;
						}
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 获取提示语
		 */
		getTips() {
			TipConfigsApi.GetByTipVals([1901, 1902]).then(res => {
				if (res.Code === 0 && res.Body) {
					this.tipData = res.Body;
				} else {
					this.$toast.fail(res.Message);
				}
			});
		},
		/**
		 * 讲师介绍
		 */
		teacherInfo() {
			if (this.courseInfo.MedicalStaff) {
				this.$router.push({
					path: '/mother/teacher-introduction',
					query: {
						teacher_id: this.courseInfo.MedicalStaffID
					}
				});
			}
		},
		/**
		 * 报名
		 */
		signUp(id) {
			if (this.userData.IsBindHis === 1) {
				this.$dialog
					.confirm({
						title: '温馨提示',
						message: this.tipData[1].TipConent
					})
					.then(() => {
						CourseSignUpApi.SignUp(id).then(res => {
							if (res.Code === 0) {
								this.getCourseInfo();
								this.$toast.success('课程报名成功！');
							} else {
								this.$toast.fail(res.Message);
							}
						});
					})
					.catch(() => {
						// on cancel
					});
			} else {
				this.$dialog
					.alert({
						title: '温馨提示',
						message: this.tipData[0].TipConent
					})
					.then(() => {
						this.$router.push({
							path: '/mother/binding'
						});
					});
			}
		},
		/**
		 * 签到
		 */
		signIn() {
			this.$toast.loading('签到中');
			CourseSignUpApi.CourseInfoSignUp({
				CourseSignUpID: this.signUpID,
				CourseInfoID: this.courseId
			})
				.then(res => {
					if (res.Code === 0) {
						this.$toast.success({
							forbidClick: true,
							message: '签到成功',
							onClose: () => {
								this.getCourseInfo();
							}
						});
					} else {
						this.$toast.fail(res.Message);
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 记笔记
		 */
		takeNotes() {
			this.$router.push({
				path: '/mother/take-notes',
				query: {
					course_signup_id: this.signUpID
				}
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-course-introduction';
.@{inner-prefix} {
	height: 100%;
	&-body {
		height: calc(100% - 100px);
		overflow: scroll;
		background: #f6f7fe;
		padding-bottom: 54px;
		.class-main {
			background: #ffffff;
			.banner {
				height: 182px;
				width: 100%;
			}
			.course_top_text {
				padding: 15px 10px;
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
				.class-time {
					margin-top: 10px;
					.time {
						font-size: 14px;
						color: #666666;
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
				.class-place {
					font-size: 14px;
					color: #666666;
					margin-top: 10px;
				}
			}
		}
		.class-doctor {
			background: #fff;
			padding: 10px 17px;
			margin-top: 6px;
			display: flex;
			flex-direction: row;
			align-items: center;
			// justify-content: space-between;
			.doctor-name {
				font-size: 14px;
				color: #666666;
				margin-left: 16px;
				flex: 5;
			}
		}
		.class-introduce {
			margin-top: 6px;
			background: #fff;
			padding: 1rem 15px;
			.introduce {
				border: 1px solid #ffd4e0;
				padding: 35px 12px 20px 27px;
				border-radius: 10px;
				position: relative;
				margin-top: 5px;
				.class-bg {
					position: absolute;
					background-image: linear-gradient(to left, #efdff3, #c9d2f7, #ffcfdd);
					color: white;
					font-size: 16px;
					height: 25px;
					line-height: 20px;
					top: -10px;
					left: 12px;
				}
				.introduce_main {
					font-size: 14px;
					line-height: 25px;
					color: #666666;
				}
			}
			.notice {
				border: 1px solid #ffcfdd;
				padding: 5px 9px 12px 20px;
				margin-top: 5px;
				position: relative;
				.horn3 {
					position: absolute;
					right: -5px;
					bottom: -3px;
					padding: 35% 50%;
					border-style: solid;
					border-color: #cbd7fa;
					border-width: 0 5px 3px 0;
				}
				.question {
					font-size: 14px;
					color: #333333;
					border-bottom: 1px dashed #ffcfdd;
					padding: 11px 5px;
					span {
						font-size: 16px;
						color: #ffcfdd;
					}
				}
				.answer {
					padding: 12px 0 0 5px;
					display: flex;
					flex-direction: row;
					span {
						font-size: 16px;
						color: #ffcfdd;
						padding-top: 3px;
					}
					div {
						font-size: 14px;
						color: #666666;
						line-height: 30px;
						margin-left: 5px;
					}
				}
			}
			.instructions-class {
				border-color: #ffcfdd;
				border-style: solid;
				border-width: 1px 0 1px 0;
				position: relative;
				.line-left {
					position: absolute;
					border: 4px solid #ffcfdd;
					height: 20px;
					background: #ffcfdd;
					top: 0px;
				}
				.line-right {
					position: absolute;
					border: 4px solid #ffcfdd;
					height: 20px;
					background: #ffcfdd;
					right: 0;
					bottom: 0;
				}
				.instructions-class-info {
					font-size: 14px;
					color: #666666;
					padding: 40px 2px 25px 25px;
					line-height: 30px;
					.w-teacher {
						margin-left: 70px;
					}
				}
			}
		}
	}
	&-sign-up {
		padding: 15px 10px;
		font-size: 12px;
		color: #999999;
		box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.8);
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 100;
		width: 100%;
		background: #ffffff;
		.button {
			color: #ff6060;
			font-size: 16px;
			border: 1px solid #f06e80;
			margin-left: 180px;
		}
	}
	&-sign-up-end {
		padding: 15px 10px;
		font-size: 18px;
		color: #ffffff;
		box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.8);
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 100;
		width: 100%;
		background: #dfdfdf;
		text-align: center;
	}
	&-light-pink-end {
		background: #facfd7;
		color: #ffffff;
	}
	&-pink-end {
		background: #f59fb0;
		color: #ffffff;
	}
	&-gray-end {
		background: #dfdfdf;
		color: #5b4d4d;
	}
}
</style>
