<template>
	<div :class="classRoot">
		<van-nav-bar
			title="预约详情"
			left-arrow
			@click-left="$router.push({ path: '/mother/registration-record' })"
		></van-nav-bar>
		<div :class="`${classRoot}-body`" v-if="registerRecordsData">
			<div class="situation">
				<div class="situation_text" v-if="registerRecordsData.Status === 1">
					{{ registerRecordsData.BespeakDateTitle }}
				</div>
				<div
					class="situation_text"
					v-else-if="registerRecordsData.Status === 2"
				>
					已签到
				</div>
				<div
					class="situation_text"
					v-else-if="registerRecordsData.Status === 3"
				>
					已取消
				</div>
				<div
					class="situation_text"
					v-else-if="registerRecordsData.Status === 4"
				>
					已过号
				</div>
				<div class="num" v-if="registerRecordsData.ShowRegisterNumber">
					预约号数：{{ registerRecordsData.ShowRegisterNumber }}号
				</div>
				<div class="num" v-else>
					预约时间：{{ registerRecordsData.BespeakDateTime }}
				</div>
			</div>
			<van-panel class="information-panel">
				<template #header>
					<div class="information">
						<van-row class="row">
							<van-col span="6">就诊人</van-col>
							<van-col span="18"
								>{{ registerRecordsData.MedicalCards.Name }}
								<van-tag
									class="select_tag"
									v-if="registerRecordsData.MedicalCards.IsDefault === 1"
									>默认</van-tag
								></van-col
							>
						</van-row>
						<van-row class="row">
							<van-col span="6">就诊科室</van-col>
							<van-col span="18"
								>{{ registerRecordsData.DepartmentName }}
							</van-col>
						</van-row>
						<van-row class="row">
							<van-col span="6">预约时间</van-col>
							<van-col span="18"
								>{{ registerRecordsData.BespeakDateTime }}
							</van-col>
						</van-row>
						<van-row class="row" v-if="registerRecordsData.ShowRegisterNumber">
							<van-col span="6">预约号数</van-col>
							<van-col span="18"
								>{{ registerRecordsData.ShowRegisterNumber }}号
							</van-col>
						</van-row>
						<van-row class="row" v-if="registerRecordsData.Status === 1">
							<van-col span="6">状态</van-col>
							<van-col span="18">待报到 </van-col>
						</van-row>
						<van-row class="row" v-if="registerRecordsData.Status === 2">
							<van-col span="6">状态</van-col>
							<van-col span="18">已签到 </van-col>
						</van-row>
						<van-row class="row" v-else-if="registerRecordsData.Status === 3">
							<van-col span="6">状态</van-col>
							<van-col span="18">已取消 </van-col>
						</van-row>
						<van-row class="row" v-else-if="registerRecordsData.Status === 4">
							<van-col span="6">状态</van-col>
							<van-col span="18">已过号 </van-col>
						</van-row>
					</div>
				</template>
			</van-panel>
			<div
				class="appointment_button"
				v-if="
					registerRecordsData.CanCancel &&
						registerRecordsData.Status === 1 &&
						!registerRecordsData.CanCheckIn
				"
			>
				<van-button @click="cancleRegistration">
					取消预约
				</van-button>
			</div>
			<div
				class="appointment_button"
				v-else-if="
					registerRecordsData.CanCancel &&
						registerRecordsData.Status === 1 &&
						registerRecordsData.CanCheckIn
				"
			>
				<van-button @click="handleCheckIn">
					点我签到
				</van-button>
			</div>
			<div
				class="appointment_button"
				v-else-if="registerRecordsData.Status === 4"
			>
				<van-button @click="handleReschedule">
					重新预约
				</van-button>
			</div>
			<div
				class="gray_button"
				v-if="
					!registerRecordsData.ShowRegisterNumber &&
						registerRecordsData.CanCancel &&
						registerRecordsData.Status === 1 &&
						registerRecordsData.CanCheckIn
				"
			>
				<van-button @click="cancleRegistration">
					取消预约
				</van-button>
			</div>
			<div class="tips">
				<p class="tips_title">温馨提示：</p>
				<p v-html="registerRecordsData.Reservations.Guide"></p>
			</div>
		</div>
	</div>
</template>
<script>
import * as RegisterRecordsApi from '../../../../apis/RegisterRecordsApi';
import * as HisBespeakApi from '../../../../apis/HisBespeakApi';
import * as CheckInApi from '../../../../apis/CheckInApi';
import { getDistance, setLocation } from '../../../../commons/weixin';

export default {
	name: 'information-confirmation',
	data() {
		return {
			uuidInterval: null, // 定位定时器
			registerRecordsData: null, // 预约详情数据
			medicalCardId: this.$route.query.medical_card_id, // 就诊卡id
			registerRecordId: this.$route.query.register_record_id,
			backHome: this.$route.query.back_home, // 标记是否是从挂号流程过来
			isCodeSignInData: false // 扫码签到 有其他就诊人是否继续签到
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		this.getMedicalCardsByIdData();
		const disposeDistance = () => {
			getDistance().then(distance => {
				this.distance = distance;
			});
		};
		disposeDistance();
		this.uuidInterval = setInterval(disposeDistance, 6000);
	},
	beforeDestroy() {
		clearInterval(this.uuidInterval);
	},
	methods: {
		/**
		 * 签到
		 */
		handleCheckIn() {
			setLocation(this.distance)
				.then(this.checkIn())
				.catch('获取距离失败');
		},
		checkIn() {
			this.$toast.loading('签到中...');
			CheckInApi.CheckIn({
				RegisterRecordID: this.registerRecordsData.RegisterRecordID
			})
				.then(res => {
					if (res.Code === 0) {
						this.$toast.success({
							forbidClick: true,
							message: '签到成功',
							onClose: () => {
								this.getMedicalCardsByIdData();
								if (this.$route.query.isSign === 1) {
									this.isCodeSignIn();
								}
							}
						});
					} else {
						this.$toast.fail({
							forbidClick: true,
							message: res.Message,
							onClose: () => {
								this.getMedicalCardsByIdData();
							}
						});
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 扫码签到继续签到
		 */
		isCodeSignIn() {
			RegisterRecordsApi.getAllowCheckIn({
				ReservationID:
					this.$route.query.isNoReservation === 1
						? this.registerRecordsData.ReservationID
						: null
			}).then(res => {
				if (res.Code === 0 && res.Body.RegisterRecords.length > 0) {
					this.$dialog
						.confirm({
							title: '微信提示',
							confirmButtonText: '继续签到',
							message: '您还有一个预约暂未签到，是否继续签到'
						})
						.then(() => {
							this.$router.push({
								path: '/mother/code-sign-in',
								query:
									this.$route.query.isNoReservation === 1
										? {
												reservation_id: this.registerRecordsData.ReservationID,
												isCode: 1
										  }
										: {
												isCode: 1
										  }
							});
						})
						.catch(() => {
							// on cancel
						});
				}
			});
		},
		/**
		 * 取消预约
		 */
		cancleRegistration() {
			this.$dialog
				.confirm({
					title: '温馨提示',
					message: '确定要取消预约吗？'
				})
				.then(() => {
					HisBespeakApi.appointmentRegisterCancelNoPay(
						this.registerRecordsData.RegisterRecordID
					).then(res => {
						if (res.Code === 0) {
							this.$toast.success({
								forbidClick: true,
								message: '取消成功',
								onClose: () => {
									this.getMedicalCardsByIdData();
								}
							});
						} else {
							this.$toast.fail({
								forbidClick: true,
								message: res.Message,
								onClose: () => {
									this.getMedicalCardsByIdData();
								}
							});
						}
					});
				})
				.catch(() => {});
		},
		/**
		 * 重新预约
		 */
		handleReschedule() {
			this.$router.push({
				path: '/mother/notice',
				query: {
					reservation_id: this.registerRecordsData.ReservationID,
					medical_card_id: this.registerRecordsData.MedicalCardID
				}
			});
		},
		/**
		 * 获取就诊人信息
		 */
		getMedicalCardsByIdData() {
			RegisterRecordsApi.getRegisterRecordsById(this.registerRecordId).then(
				res => {
					if (res.Code === 0) {
						this.registerRecordsData = res.Body;
					} else {
						this.$toast.fail(res.Message);
					}
				}
			);
		},
		/**
		 * 返回
		 */
		handleBack() {
			if (this.backHome) {
				this.$router.push({
					path: '/'
				});
			} else {
				this.$router.back();
			}
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-information-confirmation';
.@{inner-prefix} {
	height: 100%;
	background: #f8f8f8;
	&-body {
		height: calc(100% - 67px);
		overflow: scroll;
		padding: 10px;
		.situation {
			padding: 25px 0;
			text-align: center;
			background: #ffffff;
			border-radius: 10px;
			margin-bottom: 10px;
			display: flex;
			align-items: center;
			flex-direction: column;
			.situation_text {
				font-size: 22px;
				color: #fe78a6;
			}
			.num {
				margin-top: 22px;
				font-size: 18px;
				color: #333333;
			}
		}
		.patient_panel {
			margin-top: 10px;
			border-radius: 10px;
			.patient {
				margin-bottom: 5px;
				padding: 19px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-radius: 10px;
				label {
					font-size: 16px;
					color: #333333;
				}
			}
		}
		.information-panel {
			border-radius: 10px;
			.information {
				border-radius: 10px;
				padding: 26px 15px 1px 15px;
				.row {
					margin-bottom: 21px;
					.van-col:first-child {
						font-size: 16px;
						color: #666666;
					}
					.van-col:last-child {
						font-size: 15px;
						color: #999999;
					}
					.select_tag {
						color: #ff7979;
						background: rgba(255, 98, 99, 0.16);
						font-size: 12px;
						margin-left: 8px;
					}
				}
			}
		}
		.tips {
			padding: 30px 15px;
			p {
				margin: 0;
				font-size: 13px;
				color: #999999;
				line-height: 23px;
				margin-top: 7px;
			}
			.tips_title {
				font-size: 14px;
				color: #999999;
			}
		}
		.appointment_button {
			margin-top: 15px;
			text-align: center;
			.van-button {
				width: 355px;
				height: 45px;
				font-size: 16px;
				color: #ffffff;
				background: @next-button-color;
				box-shadow: @box-shadow;
				border-radius: 5px;
				border-color: @next-button-color;
			}
		}
		.gray_button {
			margin-top: 10px;
			text-align: center;
			.van-button {
				width: 355px;
				height: 45px;
				color: #666666;
				background: #ffffff;
				border-radius: 5px;
				box-shadow: 0px 2px 3px rgba(249, 219, 229, 1);
			}
		}
	}
}
</style>
