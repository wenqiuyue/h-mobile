<template>
	<div :class="classRoot" v-if="InquiryRecordInfoData">
		<van-nav-bar title="问诊详情" left-arrow @click-left="handelBack">
		</van-nav-bar>
		<van-panel class="details-inquiring-steps">
			<template #header>
				<van-steps :active="stepsActive" active-color="#EF749B">
					<van-step v-for="(item, index) in statusStsp" :key="index">{{
						item
					}}</van-step>
					<van-step v-if="InquiryRecordInfoData.ConsultStatus === 5"
						>已取消</van-step
					>
				</van-steps>
			</template>
		</van-panel>
		<div :class="`${classRoot}-body`">
			<van-panel class="doctor-panel">
				<template #header>
					<div class="doctor">
						<span @click="handleDoctor">
							<van-image
								v-if="
									InquiryRecordInfoData.DUser.OnlineDoctor.MedicalStaff.Avatar
								"
								round
								width="40px"
								height="40px"
								fit="cover"
								:src="
									InquiryRecordInfoData.DUser.OnlineDoctor.MedicalStaff.Avatar
								"
							/>
							<svg-icon v-else value="icon-Headportrait" :size="3" />
							{{ InquiryRecordInfoData.DUser.OnlineDoctor.MedicalStaff.Name }}
							<van-icon name="arrow" color="#BBBBBB" />
						</span>
						<span
							style="color:#FF0049"
							v-if="InquiryRecordInfoData.ConsultStatus === 0"
							>待付款</span
						>
						<span
							style="color:#FF0049"
							v-else-if="InquiryRecordInfoData.ConsultStatus === 1"
							>待接诊</span
						>
						<span
							style="color:#FF0049"
							v-else-if="InquiryRecordInfoData.ConsultStatus === 2"
							>问诊中</span
						>
						<span
							style="color:#FF0049"
							v-else-if="InquiryRecordInfoData.ConsultStatus === 3"
							>待评价</span
						>
						<span
							style="color:#999999"
							v-else-if="InquiryRecordInfoData.ConsultStatus === 4"
							>已完成</span
						>
						<span
							style="color:#999999"
							v-else-if="InquiryRecordInfoData.ConsultStatus === 5"
							>已取消</span
						>
						<span style="color:#FF0049" v-else>已评论</span>
					</div>
					<div class="action-button">
						<!-- <van-button
							round
							class="grey-button"
							plain
							color="#666666"
							v-if="InquiryRecordInfoData.ConsultStatus === 0"
							>查看详情</van-button
						> -->
						<van-button
							round
							type="info"
							plain
							color="#FF0049"
							@click="handelPayment(InquiryRecordInfoData)"
							v-if="InquiryRecordInfoData.ConsultStatus === 0"
							>立即付款</van-button
						>
						<van-button
							round
							type="info"
							plain
							color="#FF0049"
							@click="handelConsultation(InquiryRecordInfoData)"
							v-if="
								InquiryRecordInfoData.ConsultStatus === 1 ||
									InquiryRecordInfoData.ConsultStatus === 2 ||
									InquiryRecordInfoData.ConsultStatus === 3 ||
									InquiryRecordInfoData.ConsultStatus === 4
							"
							>查看咨询</van-button
						>
						<van-button
							round
							class="grey-button"
							plain
							color="#666666"
							@click="onCancelOrder"
							v-if="
								InquiryRecordInfoData.ConsultStatus === 0 ||
									InquiryRecordInfoData.ConsultStatus === 1
							"
							>取消订单</van-button
						>
						<van-button
							round
							type="info"
							plain
							color="#FF0049"
							@click="handelEvaluate(InquiryRecordInfoData)"
							v-if="InquiryRecordInfoData.ConsultStatus === 3"
							>立即评价</van-button
						>
						<van-button
							round
							class="grey-button"
							plain
							color="#666666"
							v-if="InquiryRecordInfoData.ConsultStatus === 4"
							@click="handelPayment(InquiryRecordInfoData)"
							>再次咨询</van-button
						>
					</div>
				</template>
			</van-panel>
			<van-panel class="order-information">
				<template #header>
					<span class="order-information-title">订单信息</span>
					<span class="order-information-content">
						咨询类型：{{
							InquiryRecordInfoData.ConsultType === 0 ? '图文问诊' : '快速问诊'
						}}
						￥{{ InquiryRecordInfoData.ConsultFee }}元<br />
						<!-- 订单号：2020033009231261<br /> -->
						创建时间：{{
							new Date(InquiryRecordInfoData.CreateTime).format(
								'yyyy-MM-dd hh:mm:ss'
							)
						}}<br />
						支付时间：{{
							InquiryRecordInfoData.ConsultStatus === 0
								? '-- --'
								: '2020-03-30 16:00:30'
						}}<br />
					</span>
				</template>
			</van-panel>
			<van-panel
				class="description-illness"
				v-if="
					InquiryRecordInfoData.ConsultStatus !== 0 &&
						InquiryRecordInfoData.ConsultType === 0
				"
			>
				<template #header>
					<div @click="handelIllness">
						<div class="description-illness-title">
							<span>病情描述</span>
							<van-icon name="arrow" color="#999999" />
						</div>
						<div class="description-illness-content">
							{{ InquiryRecordInfoData.Content }}
						</div>
						<div class="description-illness-pic">
							<van-image
								v-for="(img, index) in InquiryRecordInfoData.ImageArray"
								:key="index"
								width="80px"
								height="80px"
								fit="cover"
								:src="img"
								@click="browsePic(index)"
							/>
						</div>
					</div>
				</template>
			</van-panel>
			<van-panel
				class="my-evaluation"
				v-if="InquiryRecordInfoData.ConsultStatus === 4 && inquiryCommitsData"
			>
				<template #header>
					<div class="evaluate-score">
						我的评价
						<van-rate
							:value="inquiryCommitsData.Data[0].Score / 2"
							readonly
							allow-half
							void-icon="star"
							void-color="#eee"
						/>
					</div>
					<div class="evaluate-tag">
						<van-tag
							round
							v-for="(tag, index) in inquiryCommitsData.MyTagArray"
							:key="index"
							>{{ tag }}</van-tag
						>
					</div>
					<div class="evaluate-content">
						{{ inquiryCommitsData.Data[0].Content }}
					</div>
				</template>
			</van-panel>
			<van-button
				class="doctorinfo-button"
				v-if="InquiryRecordInfoData.ConsultStatus === 2"
				@click="handelConsultation(InquiryRecordInfoData)"
				>医生已接诊，立即前往</van-button
			>
		</div>
	</div>
</template>
<script>
// import _ from 'lodash';
import { ImagePreview } from 'vant';
import * as InquiryRecordApi from '../../../apis/InquiryRecordApi';
import * as InquiryCommitsApi from '../../../apis/InquiryCommitsApi';

export default {
	name: 'interrogation-details-inquiring',
	data() {
		return {
			stepsActive: 1, // 当前步骤
			scoreValue: 5, // 我的评分分数
			InquiryRecordInfoData: null, // 问诊详情数据
			inquiryRecordID: this.$route.query.inquiry_record_id, // 问诊id
			inquiryCommitsParam: {
				InquiryRecordID: null,
				page: 1,
				limit: 1
			},
			inquiryCommitsData: null, // 评论数据
			statusStsp: ['申请问诊', '支付', '问诊', '评价']
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	watch: {
		/**
		 * 监听当前是否是已完成步骤,获取评论
		 */
		stepsActive() {
			if (this.stepsActive === 4) {
				this.inquiryCommitsParam.InquiryRecordID = this.inquiryRecordID;
				InquiryCommitsApi.GetInquiryCommits(this.inquiryCommitsParam).then(
					res => {
						if (res.Code === 0) {
							this.inquiryCommitsData = res.Body;
							if (this.inquiryCommitsData.Data[0].PositiveTags) {
								this.inquiryCommitsData.MyTagArray = this.inquiryCommitsData.Data[0].PositiveTags.split(
									','
								).map(s => {
									return s;
								});
							}
						}
					}
				);
			}
		}
	},
	created() {
		this.getInquiryRecordInfo();
	},
	methods: {
		/**
		 * 取消
		 */
		onCancelOrder() {
			this.$dialog
				.confirm({
					title: '提示',
					message: '确认取消订单？'
				})
				.then(() => {
					this.$toast.loading('加载中');
					InquiryRecordApi.Cancel(this.inquiryRecordID)
						.then(res => {
							if (res.Code === 0) {
								this.$toast.success('取消成功！');
								this.getInquiryRecordInfo();
							}
						})
						.finally(this.$toast.clear);
				})
				.catch(() => {
					this.$toast.fail('用户取消');
				});
		},
		/**
		 * 病情描述详情
		 */
		handelIllness() {
			this.$router.push({
				path: '/mother/interrogation-teletext',
				query: {
					teletext_status: 'check',
					inquiry_record_id: this.inquiryRecordID
				}
			});
		},
		/**
		 * 查看医生详情
		 */
		handleDoctor() {
			this.$router.push({
				path: '/mother/interrogation-doctor-info',
				query: {
					doctor_id: this.InquiryRecordInfoData.DUser.OnlineDoctor
						.OnlineDoctorID
				}
			});
		},
		/**
		 * 返回
		 */
		handelBack() {
			this.$router.push({
				path: '/mother/interrogation-my-inquisition'
			});
		},
		/**
		 * 获取问诊详情数据
		 */
		getInquiryRecordInfo() {
			this.$toast.loading('加载中');
			InquiryRecordApi.inquiryRecordInfo(this.inquiryRecordID)
				.then(res => {
					if (res.Code === 0) {
						this.InquiryRecordInfoData = res.Body;
						if (this.InquiryRecordInfoData.Images) {
							this.InquiryRecordInfoData.ImageArray = this.InquiryRecordInfoData.Images.split(
								'|'
							).map(s => {
								return s;
							});
						}
						// 待支付
						if (res.Body.ConsultStatus === 0) {
							this.stepsActive = 1;
						} else if (
							// 待接诊或问诊中
							res.Body.ConsultStatus === 1 ||
							res.Body.ConsultStatus === 2
						) {
							this.stepsActive = 2;
						} else if (res.Body.ConsultStatus === 3) {
							// 未评价
							this.stepsActive = 3;
						} else if (res.Body.ConsultStatus === 4) {
							// 已评论
							this.stepsActive = 4;
						} else if (res.Body.ConsultStatus === 5) {
							// 已取消
							this.statusStsp = this.statusStsp.filter((m, index) => index < 2);
							this.stepsActive = 2;
						}
					} else {
						this.$toast.fail(res.Message);
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 浏览图片
		 */
		browsePic(index) {
			ImagePreview({
				images: this.InquiryRecordInfoData.ImageArray,
				startPosition: index,
				closeable: true
			});
		},
		/**
		 * 立即评价
		 */
		handelEvaluate(data) {
			this.$router.push({
				path: '/mother/interrogation-publication-evaluation',
				query: {
					inquiry_record_iD: data.InquiryRecordID,
					online_doctor_id: data.DUser.OnlineDoctor.OnlineDoctorID
				}
			});
		},
		/**
		 * 立即付款
		 */
		handelPayment(data) {
			this.$router.push({
				path: '/mother/interrogation-pay-page',
				query: {
					duser_id: data.DUserID,
					type: data.ConsultType
				}
			});
		},
		/**
		 * 查看咨询
		 */
		handelConsultation(data) {
			this.$router.push({
				path: '/mother/interrogation-rapid-interrogation',
				query: {
					source_id: data.InquiryRecordID,
					steps: this.stepsActive,
					consult_type: this.InquiryRecordInfoData.ConsultType // 问诊类型
				}
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-interrogation-details-inquiring';
.@{inner-prefix} {
	background: #f8f8f8;
	height: 100%;
	.details-inquiring-steps {
		padding: 0 20px 0 20px;
		.van-steps {
			.van-step__title {
				font-size: 13px;
			}
			.van-step__line {
				background: #969799;
			}
			.van-step--finish {
				color: #ef749b;
			}
			.van-step--finish .van-step__circle {
				background: #ef749b;
			}
		}
	}
	&-body {
		padding: 5px;
		height: calc(100% - 120px);
		overflow: scroll;
		.doctor-panel {
			padding: 10px 15px 16px 20px;
			border-radius: 5px;
			.doctor {
				display: flex;
				justify-content: space-between;
				align-items: center;
				span:first-child {
					display: flex;
					align-items: center;
					.van-image,
					svg {
						margin-right: 5px;
					}
				}
			}
			.action-button {
				display: flex;
				justify-content: flex-end;
				margin-top: 18px;
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
		.order-information {
			margin-top: 5px;
			border-radius: 5px;
			padding: 15px 12px 15px 20px;
			span {
				display: block;
			}
			.order-information-title {
				color: #000000;
			}
			.order-information-content {
				color: #999999;
				font-size: 14px;
				margin-top: 10px;
				line-height: 25px;
			}
		}
		.description-illness {
			margin-top: 5px;
			border-radius: 5px;
			padding: 15px 12px 15px 20px;
			.description-illness-title {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.description-illness-content {
				font-size: 14px;
				color: #999999;
				margin-top: 13px;
				line-height: 25px;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				overflow: hidden;
				text-overflow: ellipsis;
				-webkit-box-orient: vertical;
			}
			.description-illness-pic {
				margin-top: 15px;
				.van-image {
					margin-right: 10px;
					img {
						border-radius: 5px;
					}
				}
			}
		}
		.my-evaluation {
			margin-top: 5px;
			border-radius: 5px;
			padding: 15px 12px 20px 20px;
			.evaluate-score {
				display: flex;
				align-items: center;
				font-size: 17px;
				color: #000000;
				.van-rate {
					margin-left: 10px;
				}
			}
			.evaluate-tag {
				margin-top: 22px;
				.van-tag {
					font-size: 13px;
					padding: 3px 9px;
					margin: 0 6px 15px 0;
					background: #fff8f8;
					border: 1px solid #ffd4d4;
					color: #ff8888;
				}
			}
			.evaluate-content {
				margin-top: 10px;
				color: #999999;
				line-height: 25px;
			}
		}
		.doctorinfo-button {
			background: #ffb2bf;
			box-shadow: 0px 3px 6px rgba(249, 219, 229, 1);
			color: #ffffff;
			border-radius: 10px;
			font-size: 16px;
			width: 325px;
			height: 45px;
			margin: 40px 20px 20px 20px;
		}
	}
}
</style>
