<template>
	<div :class="classRoot">
		<div :class="`${classRoot}-top`">
			<div class="bar">
				<svg-icon value="icon-TitleBarReturn" @click="$router.back()" />
			</div>
			<van-image
				class="logo_img"
				:src="
					require(`../../../assets/mother-school/Illustration-presentation.svg`)
				"
			/>
		</div>
		<div :class="`${classRoot}-body`">
			<div class="title">
				<div class="title-border">
					<div
						:class="
							`title-bg ${
								statusClass === 3 ? 'already_sign_in_bg' : 'sign_in_bg'
							}`
						"
					>
						<div class="title-text" @click="handleSignIn">
							{{ statusClass === 3 ? '已签到' : '立即签到' }}
						</div>
					</div>
				</div>
			</div>
			<div class="course_notes" v-if="statusClass === 3">
				<div class="triangle"></div>
				<div class="notes" @click="handleLearningRecords">
					去记录课程笔记 <svg-icon value="icon-white-doubleRight" :size="0.9" />
				</div>
			</div>
			<div class="car" v-if="courseInfo">
				<div class="circle">
					<div></div>
					<div></div>
				</div>
				<div class="class">
					<p>课程</p>
					<div class="class_container">{{ courseInfo.Title }}</div>
				</div>
				<div class="class">
					<p>时间</p>
					<div class="class_container">
						{{
							`${new Date(courseInfo['ClassData']).format('MM月dd日')} 周${
								day[new Date(courseInfo['ClassData']).getDay() - 1]
							} ${new Date(courseInfo['ClassBeginTime']).format(
								'hh:mm'
							)}~${new Date(courseInfo['ClassEndTime']).format('hh:mm')}`
						}}
					</div>
				</div>
				<div class="teacher">
					<p>讲师</p>
					<div class="teacher_container">
						<van-image
							v-if="courseInfo.MedicalStaff.Avatar"
							round
							fit="cover"
							:src="courseInfo.MedicalStaff.Avatar"
						/>
						<svg-icon v-else value="icon-Headportrait" :size="4.4" />
						<div class="teacher_right">
							<div class="teacher-name">
								{{ courseInfo['Lecturer'] }}
								<label v-if="courseInfo.MedicalStaff">
									<van-tag
										v-for="(type, index) in courseInfo.MedicalStaff
											.MedicalStaffOfType"
										:key="index"
										plain
										type="danger"
										color="#FCD3D3"
										text-color="#FCA4A4"
										>{{ type.MedicalStaffType.MedicalStaffTypeName }}</van-tag
									>
								</label>
								<van-tag
									v-else
									plain
									type="danger"
									color="#FCD3D3"
									text-color="#FCA4A4"
									>{{ courseInfo.LecturerTitle }}</van-tag
								>
							</div>
							<div class="department">
								<span
									>{{ courseInfo.MedicalStaff.Hospitals }}
									{{ courseInfo.MedicalStaff.Departments.DName }}</span
								>
							</div>
						</div>
					</div>
				</div>
				<div class="circle_bottom">
					<div class="left_circle">
						<div class="gray_circle"></div>
						<van-image
							:src="
								require(`../../../assets/mother-school/Illustration-Flowerpot.svg`)
							"
						/>
					</div>
					<div class="gray_circle"></div>
				</div>
			</div>
		</div>
		<div :class="`${classRoot}-bottom`"></div>
		<van-overlay
			:show="show"
			@click="show = false"
			:class="`${classRoot}-overlay`"
		>
			<div class="wrapper" @click.stop>
				<svg-icon
					@click="show = false"
					class="cancle_icon"
					value="icon-CircleOff"
					:size="1.5"
				/>
				<svg-icon class="left_icon" value="icon-minStar" :size="6.2" />
				<div class="block">
					签到成功
				</div>
				<svg-icon class="right_icon" value="icon-bigStar" :size="7" />
			</div>
		</van-overlay>
	</div>
</template>
<script>
import * as CourseInfoApi from '../../../apis/CourseInfoApi';
import * as UserApi from '../../../apis/UserApi';
import * as CourseSignUpApi from '../../../apis/CourseSignUpApi';

export default {
	name: 'mother-school-sign-in',
	data() {
		return {
			show: false,
			courseInfo: null, // 课程信息
			courseId: 36, // 课程id
			userData: null, // 用户信息
			statusClass: 4, // 用户课程报名状态 0，已报名 1，已取消 2，未参加 3，已参加 4，未报名
			day: ['一', '二', '三', '四', '五', '六', '七'], // 星期
			signUpID: null, // 用户课程报名的id
			isFirstSign: true // 是否是第一次自动签到
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		this.getCourseInfo();
	},
	methods: {
		/**
		 * 获取课程信息
		 */
		getCourseInfo() {
			this.$toast.loading('加载中');
			const methods = [
				CourseInfoApi.GetCourseInfoById(this.courseId),
				UserApi.GetUser()
			];
			this.$toast.loading('加载中');
			Promise.all(methods)
				.then(result => {
					if (result[0].Code === 0 && result[1].Code === 0) {
						this.userData = result[1].Body;
						this.courseInfo = result[0].Body;
						// 切割tagName字段
						this.courseInfo.TagNameArray = this.courseInfo.TagName.split(
							','
						).map(s => {
							return s;
						});
						// 讲师名字
						if (this.courseInfo.MedicalStaff) {
							this.courseInfo.Lecturer = this.courseInfo.MedicalStaff.Name;
						}
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
						// 首次加载数据自动签到
						if (this.isFirstSign) {
							this.handleSignIn();
							this.isFirstSign = false;
						}
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 签到
		 */
		handleSignIn() {
			if (this.statusClass !== 3) {
				this.$toast.loading('签到中');
				CourseSignUpApi.CourseInfoSignUp(this.signUpID)
					.then(res => {
						if (res.Code === 0) {
							this.show = true;
							this.getCourseInfo();
						} else {
							this.$toast.fail(res.Message);
						}
					})
					.finally(this.$toast.clear);
			}
		},
		/**
		 * 课程笔记
		 */
		handleLearningRecords() {
			this.$router.push({
				path: '/mother/learning-records'
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-mother-school-sign-in';
.@{inner-prefix} {
	height: 100%;
	&-overlay {
		z-index: 100;
		background: rgba(0, 0, 0, 0.5);
		.wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			height: 100%;
		}
		.cancle_icon {
			margin-left: 190px;
			margin-bottom: 30px;
		}
		.block {
			width: 217px;
			height: 118px;
			background: rgba(255, 255, 255, 0.85);
			font-size: 26px;
			color: #ffb431;
			line-height: 118px;
			text-align: center;
			border-radius: 10px;
			z-index: 100;
		}
		.left_icon {
			position: absolute;
			top: 49%;
			left: 25px;
		}
		.right_icon {
			position: absolute;
			top: 42%;
			right: 5px;
			z-index: 101;
		}
	}
	&-top {
		height: 175px;
		background: linear-gradient(
			180deg,
			rgba(255, 221, 223, 1) 0%,
			rgba(255, 255, 255, 1) 100%
		);
		.bar {
			padding: 16px 18px;
		}
		.logo_img {
			width: 130px;
			height: 90px;
			float: right;
			top: -35px;
		}
	}
	&-body {
		padding: 0 12px;
		position: relative;
		top: -70px;
		.title {
			display: flex;
			justify-content: center;
			z-index: 90;
			position: relative;
			.title-border {
				background: rgba(255, 255, 255, 0.3);
				border: 5px solid #ffffff;
				width: 151px;
				height: 45px;
				border-radius: 30px;
				display: flex;
				justify-content: center;
				align-items: center;
				padding-top: 5px;
				.title-bg {
					width: 137px;
					height: 40px;
					border-radius: 30px;
					.title-text {
						width: 137px;
						height: 40px;
						border-radius: 30px;
						position: absolute;
						top: 10px;
						text-align: center;
						line-height: 40px;
						font-size: 19px;
						color: #ffffff;
					}
				}
				.sign_in_bg {
					background: #fe326d;
					.title-text {
						background: #fe78a6;
					}
				}
				.already_sign_in_bg {
					background: #c1b9bb;
					.title-text {
						background: #e1d9d9;
					}
				}
			}
		}
		.course_notes {
			background: #fe78a6;
			position: absolute;
			z-index: 55;
			left: 120px;
			padding: 9px 24px 9px 30px;
			border-radius: 9px;
			color: #ffffff;
			font-size: 16px;
			top: 70px;
			.triangle {
				position: absolute;
				top: -10px;
				width: 0;
				height: 0;
				border-left: 8px solid transparent;
				border-right: 8px solid transparent;
				border-bottom: 20px solid #fe78a6;
			}
			svg {
				margin-left: 5px;
			}
		}
		.car {
			background: #ffffff;
			position: relative;
			z-index: 50;
			top: -26px;
			padding: 18px 15px;
			box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.16);
			border-radius: 10px;
			.circle {
				display: flex;
				justify-content: space-between;
				margin-bottom: 44px;
				div {
					width: 9px;
					height: 9px;
					background: #e4e4e4;
					border-radius: 50%;
				}
			}
			.circle_bottom {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				.left_circle {
					display: flex;
					flex-direction: row;
					align-items: flex-end;
					.van-image {
						height: 53px;
						width: 34px;
					}
				}
				.gray_circle {
					width: 9px;
					height: 9px;
					background: #e4e4e4;
					border-radius: 50%;
				}
			}
			.class {
				margin-top: 1px;
				p {
					font-size: 14px;
					color: #f4a2a5;
				}
				.class_container {
					background: rgba(243, 243, 243, 0.4);
					font-size: 16px;
					color: #333333;
					padding: 14px 20px;
				}
			}
			.teacher {
				margin-bottom: 75px;
				p {
					font-size: 14px;
					color: #f4a2a5;
				}
				.teacher_container {
					display: flex;
					flex-direction: row;
					align-items: center;
					background: rgba(243, 243, 243, 0.4);
					padding: 16px 13px;
					.van-image {
						height: 62px;
						width: 62px;
					}
					.teacher_right {
						margin-left: 15px;
						.teacher-name {
							font-size: 16px;
							display: flex;
							align-items: center;
							color: #333333;
							.van-tag {
								margin-left: 10px;
							}
						}
						.department {
							margin-top: 10px;
							span {
								font-size: 14px;
								color: #666666;
							}
						}
					}
				}
			}
		}
	}
	&-bottom {
		position: relative;
		top: -200px;
		height: 175px;
		background: linear-gradient(
			360deg,
			rgba(255, 221, 223, 1) 0%,
			rgba(255, 255, 255, 1) 100%
		);
	}
}
</style>
