<template>
	<div :class="classRoot" v-if="doctorInfo">
		<van-nav-bar title="医生详情" left-arrow @click-left="$router.back()">
		</van-nav-bar>
		<div :class="`${classRoot}-main`">
			<div class="info-background"></div>
			<div class="body">
				<van-image
					v-if="doctorInfo.MedicalStaff.Avatar"
					round
					width="80px"
					height="80px"
					fit="cover"
					:src="doctorInfo.MedicalStaff.Avatar"
					class="doctor-pic"
				/>
				<svg-icon
					v-else
					value="icon-Headportrait"
					:size="5.5"
					class="doctor-pic"
				/>
				<div class="info-main">
					<div class="name">
						{{ doctorInfo.MedicalStaff.Name }}
						<span
							>{{ doctorInfo.MedicalStaff.Departments.DName
							}}<label
								v-for="(type, index) in doctorInfo.MedicalStaff
									.MedicalStaffOfType"
								:key="index"
							>
								· {{ type.MedicalStaffType.MedicalStaffTypeName }}</label
							></span
						>
					</div>
					<div class="hospital">
						{{ doctorInfo.MedicalStaff.Departments.Hospitals.HName }}
					</div>
					<div class="other-info">
						<span>
							<div>{{ doctorInfo.ConsultationFee }}元/次</div>
							<div>图文咨询</div>
						</span>
						<span class="line"></span>
						<span>
							<div>
								{{ doctorInfo.CommentScore ? doctorInfo.CommentScore : 0 }}分
							</div>
							<div>评分</div>
						</span>
						<span class="line"></span>
						<span>
							<div>
								{{
									doctorInfo.ConsultationCount
										? doctorInfo.ConsultationCount
										: 0
								}}
							</div>
							<div>服务患者数</div>
						</span>
					</div>
				</div>
				<van-panel class="begoodat">
					<template #header>
						<div class="begoodat-title">医生擅长</div>
						<div
							class="begoodat-content"
							v-html="
								doctorInfo.MedicalStaff.Introduction
									? doctorInfo.MedicalStaff.Introduction
									: '暂无介绍'
							"
						></div>
					</template>
				</van-panel>
				<van-panel class="begoodat resume">
					<template #header>
						<div class="begoodat-title">医生简历</div>
						<div
							class="begoodat-content"
							v-html="
								doctorInfo.MedicalStaff.Resume
									? doctorInfo.MedicalStaff.Resume
									: '暂无介绍'
							"
						></div>
					</template>
				</van-panel>
				<van-panel class="public-praise">
					<template #header>
						<div class="public-praise-header">
							<div class="public-praise-header-title">
								<span class="title" v-if="inquiryCommitsList.Count > 0"
									>用户口碑<label>（{{ inquiryCommitsList.Count }}）</label>
								</span>
								<span class="title" v-else>暂无用户口碑 </span>
								<span v-if="inquiryCommitsList.Count > 3" @click="moreCommits"
									>更多<van-icon name="arrow" color="#999999"
								/></span>
							</div>
							<div
								class="public-praise-header-tag"
								v-if="inquiryCommitsList.Tags.length > 0"
							>
								<van-tag
									color="#FFF8F8"
									text-color="#FF8888"
									v-for="(tag, index) in inquiryCommitsList.Tags"
									:key="index"
									>{{ tag.Name }}</van-tag
								>
							</div>
						</div>
					</template>
					<template #footer>
						<div class="public-praise-footer">
							<div
								class="public-praise-car"
								v-for="(item, index) in inquiryCommitsList.Data"
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
												{{ new Date(item.CreateTime).format('yyyy-MMMM-dddd') }}
											</div></span
										>
									</div>
									<van-rate
										:value="item.Score / 2"
										allow-half
										void-icon="star"
										void-color="#eee"
										size="14px"
									/>
								</div>
								<div class="public-praise-content">
									{{ item.Content }}
								</div>
							</div>
						</div>
					</template>
				</van-panel>
			</div>
		</div>
		<van-button
			class="doctorinfo-button"
			@click="interrogationPay(doctorInfo.UserID)"
			>图文问诊(￥{{ doctorInfo.ConsultationFee }}元)</van-button
		>
	</div>
</template>
<script>
import * as OnlineDoctorApi from '../../../apis/OnlineDoctorApi';
import * as InquiryCommitsApi from '../../../apis/InquiryCommitsApi';

export default {
	name: 'interrogation-doctor-info',
	data() {
		return {
			showMoreResume: false, // 是否显示全部简历
			doctorInfo: null, // 医生详情
			inquiryCommitsList: [], // 医生口碑
			doctorId: this.$route.query.doctor_id,
			inquiryCommitsParam: {
				OnlineDoctorID: null,
				page: 1,
				limit: 3
			},
			sourceId: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	watch: {},
	created() {
		this.getDoctorInfo();
	},
	methods: {
		/**
		 * 获取医生详情数据
		 */
		getDoctorInfo() {
			this.inquiryCommitsParam.OnlineDoctorID = parseInt(this.doctorId, 0);
			const methods = [
				OnlineDoctorApi.GetDoctor(this.doctorId),
				InquiryCommitsApi.GetInquiryCommits(this.inquiryCommitsParam)
			];
			this.$toast.loading('正在加载...');
			Promise.all(methods)
				.then(result => {
					if (result[0].Code === 0 && result[1].Code === 0) {
						this.doctorInfo = result[0].Body;
						this.inquiryCommitsList = result[1].Body;
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 更多评论
		 */
		moreCommits() {
			this.$router.push({
				path: '/mother/interrogation-public-praise',
				query: {
					doctor_id: this.doctorId
				}
			});
		},
		/**
		 * 图文问诊支付
		 */
		interrogationPay(id) {
			this.$router.push({
				path: '/mother/interrogation-pay-page',
				query: {
					duser_id: id,
					type: 0
				}
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-interrogation-doctor-info';
.@{inner-prefix} {
	height: 100%;
	background: #f8f8f8;
	&-main {
		position: relative;
		height: calc(100% - 50px);
		overflow: scroll;
		.info-background {
			background: #ffdddf;
			height: 125px;
		}
		.body {
			padding: 0 5px;
			.doctor-pic {
				position: absolute;
				left: 150px;
				top: 10px;
				z-index: 999;
			}
			.info-main {
				position: absolute;
				background: #ffffff;
				left: 5px;
				right: 5px;
				width: calc(100%-10px);
				border-radius: 10pt 10pt 0pt 0pt;
				top: 60px;
				z-index: 99;
				padding: 42px 0 20px 0;
				.name {
					font-size: 16px;
					color: #000000;
					text-align: center;
					span {
						margin-left: 10px;
					}
				}
				.hospital {
					font-size: 13px;
					color: #999999;
					margin-top: 13px;
					text-align: center;
				}
				.other-info {
					margin-top: 20px;
					display: flex;
					flex-direction: row;
					justify-content: space-around;
					align-items: center;
					padding: 0 10px;
					.line {
						height: 31px;
						border: 1px solid #eeeeee;
						background: #eeeeee;
					}
					span {
						text-align: center;
						div:first-child {
							color: #ef749b;
						}
						div:last-child {
							margin-top: 5px;
							font-size: 12px;
							color: #474747;
						}
					}
				}
			}
			.begoodat {
				margin-top: 112px;
				padding: 22px 12px 17px 15px;
				.begoodat-title {
					color: #000000;
				}
				.begoodat-content {
					color: #666666;
					margin-top: 12px;
					line-height: 23px;
				}
			}
			.resume {
				margin-top: 5px;
				.resume-content {
					display: -webkit-box;
					-webkit-line-clamp: 3;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-box-orient: vertical;
				}
				.more {
					display: block;
					text-align: center;
					margin-top: 5px;
					color: #ef749b;
				}
			}
			.public-praise {
				margin-top: 5px;
				.public-praise-header {
					padding: 18px 8px 8px 15px;
					.public-praise-header-title {
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-size: 12px;
						color: #999999;
						.title {
							font-size: 14px;
							color: #000000;
							label {
								color: #999999;
							}
						}
					}
					.public-praise-header-tag {
						margin-top: 15px;
						.van-tag {
							margin-left: 5px;
							font-size: 13px;
							padding: 3px 9px;
							border-radius: 12px;
							margin-bottom: 8px;
						}
					}
				}
				.public-praise-footer {
					padding: 0 5px 0 5px;
					padding-bottom: 60px;
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
					}
				}
			}
		}
	}
	.doctorinfo-button {
		position: absolute;
		bottom: 20px;
		background: #ffb2bf;
		box-shadow: 0px 3px 6px rgba(249, 219, 229, 1);
		color: #ffffff;
		border-radius: 10px;
		left: 27px;
		font-size: 16px;
		width: 325px;
		height: 45px;
	}
}
</style>
