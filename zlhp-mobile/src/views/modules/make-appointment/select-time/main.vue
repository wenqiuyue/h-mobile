<template>
	<div :class="classRoot" v-if="numberData && medicalData">
		<van-nav-bar
			:title="numberData.Title"
			left-arrow
			@click-left="$router.back()"
		></van-nav-bar>
		<div :class="`${classRoot}-body`">
			<div class="patient_info">
				<van-panel class="patient_panel" @click="handleSelectPatient">
					<template #header>
						<div class="patient">
							<label>
								就诊人：{{ medicalData.Name }}
								<van-tag class="select_tag" v-if="medicalData.IsDefault"
									>默认</van-tag
								>
							</label>
							<svg-icon value="icon-home_RightArrow" :size="1.1" />
						</div>
					</template>
				</van-panel>
			</div>
			<div class="select_week">
				<span class="week_title">就诊日期</span>
				<div class="week_array">
					<div
						v-for="(item, index) in numberData.RegistrationDateList"
						:key="index"
						@click="changeStep(index)"
					>
						<span
							class="week"
							:style="step === index ? 'color:#ff7979' : 'color:#B8B8B8'"
						>
							<p class="day">{{ item.Title }}</p>
							<p class="date">
								{{ new Date(item.Date).format('MM-dd') }}
							</p>
							<div class="sel" v-if="step === index">
								<label></label>
								<label>√</label>
							</div>
						</span>
					</div>
				</div>
			</div>
			<template v-if="numberData.HisSchedulingData.Scheduling.Row.length > 0">
				<van-tabs v-model="morningActive" color="#FF7979" line-height="2px">
					<van-tab
						v-for="(schedulingtype, index) in numberData.HisSchedulingData
							.Scheduling.Row"
						:key="index"
						:title="schedulingtype.Scheduling"
					></van-tab>
				</van-tabs>
				<van-panel>
					<template #header>
						<type0
							v-if="
								!dayChange &&
									numberData.HisSchedulingData.Scheduling.Row[morningActive]
										.TimeIntervalList &&
									numberData.HisSchedulingData.Scheduling.Row[morningActive]
										.TimeIntervalList.length
							"
							:data="
								numberData.HisSchedulingData.Scheduling.Row[morningActive]
									.TimeIntervalList
							"
							@handleSelectNum="selectNum"
						></type0>
						<type2
							v-else-if="!dayChange"
							:data="numberData.HisSchedulingData.Scheduling.Row[morningActive]"
							:isRegister="numberData.isRegister"
							@handleAppointment="handleAppointment"
						></type2>
						<!-- <type1
						v-if="false"
						:data="numberData.HisSchedulingData.Scheduling.Row"
						@handleSelectNum="selectNum"
					></type1> -->
					</template>
				</van-panel>
			</template>
			<hint v-else-if="!loading" message="当天没有排号信息" />
		</div>
		<van-popup
			v-model="showConfirmation"
			:class="`${classRoot}-confirmation_popup`"
		>
			<div class="confirmation">
				<div class="title">
					<span>预约信息</span>
					<svg-icon
						value="icon-Close_Black"
						:size="0.8"
						@click="showConfirmation = false"
					/>
				</div>
				<div class="information-panel">
					<div class="information">
						<van-row class="row">
							<van-col class="row_title" span="7">就诊人</van-col>
							<van-col class="row_info" span="17">{{
								medicalData.Name
							}}</van-col>
						</van-row>
						<van-row class="row">
							<van-col class="row_title" span="7">就诊科室</van-col>
							<van-col class="row_info" span="17">{{
								numberData.Title
							}}</van-col>
						</van-row>
						<van-row class="row">
							<van-col class="row_title" span="7">预约时间</van-col>
							<van-col class="row_info" span="17">{{
								`${
									step === 0 ? numberData.RegistrationDateList[0].Date : date
								} ${selNumData ? selNumData.BeginTeim.slice(0, 5) : ''}`
							}}</van-col>
						</van-row>
						<van-row class="row">
							<van-col class="row_title" span="7">预约号数</van-col>
							<van-col class="row_info" span="17"
								>{{
									selNumData ? selNumData.ShowSequenceNumber : ''
								}}号</van-col
							>
						</van-row>
					</div>
				</div>
				<div class="tips">
					<p class="tips_title">温馨提示：</p>
					<p v-html="numberData.Guide"></p>
				</div>
				<div class="appointment_button">
					<van-button @click="handleAppointment">
						我要预约
					</van-button>
				</div>
			</div>
		</van-popup>
	</div>
</template>
<script>
import Vue from 'vue';
import * as MedicalCardsApi from '../../../../apis/MedicalCardsApi';
import * as HisBespeakApi from '../../../../apis/HisBespeakApi';
import { setSession } from '../../../../commons/session';
import types from '../../../../commons/types';
import components from './components';

Vue.use(components);
export default {
	name: 'select-time',
	data() {
		return {
			step: 0,
			medicalCardId: this.$route.query.medical_card_id, // 就诊卡id
			reservationId: this.$route.query.reservation_id,
			medicalData: null, // 就诊人信息
			numberData: null, // 排班信息
			date: null,
			morningActive: 0, // 上午、下午选择
			showConfirmation: false, // 消息确认
			selNumData: null, // 选择的号
			departsData: null, // 科室信息
			dayChange: false, // 是否在切换日期
			loading: false // 是否在加载
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	watch: {
		morningActive() {
			if (this.numberData.HisSchedulingData.Scheduling.Row.length > 0) {
				this.numberData.HisSchedulingData.Scheduling.Row[
					this.morningActive
				].TimeIntervalList = [];
			}
			this.dayChange = true;
			this.getSchedulingInfoData();
		}
	},
	created() {
		this.getSchedulingInfoData(0);
		this.getMedicalCardsByIdData();
	},
	methods: {
		/**
		 * 确认预约
		 */
		handleAppointment(isTotal) {
			const selRow = this.numberData.HisSchedulingData.Scheduling.Row[
				this.morningActive
			];
			const param = {
				Number: selRow.Number,
				MedicalCardID: this.medicalData.MedicalCardID,
				BespeakDate:
					isTotal === 1
						? `${selRow.Date}`
						: `${selRow.Date} ${this.selNumData.BeginTeim}`,
				// 当isTotal等于1时，为剩余号源或无线号类型，不传SequenceNumber参数
				SequenceNumber: isTotal === 1 ? null : this.selNumData.SequenceNumber,
				ShowRegisterNumber:
					isTotal === 1 ? null : this.selNumData.ShowSequenceNumber,
				Scheduling: selRow.Scheduling,
				ReservationID: this.numberData.ReservationID,
				Price: selRow.Price
			};
			this.$toast.loading('正在预约...');
			HisBespeakApi.appointmentRegisterNoPay(param)
				.then(res => {
					if (res.Code === 0) {
						this.$router.push({
							path: '/mother/appointment-success',
							query: {
								register_record_id: res.Body.RegisterRecordID
							}
						});
					} else {
						// 将预约失败的提示存到缓存
						setSession(
							types.REGISTER_FAIL_TIPS,
							JSON.stringify({
								fail_tips: res.Message,
								guide: this.numberData.Guide
							})
						);
						this.$router.push({
							path: '/mother/appointment-success',
							query:
								res.Code === 700003
									? {
											isCancel: 1
									  }
									: ''
						});
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 选择号
		 */
		selectNum(data) {
			this.selNumData = data;
			this.showConfirmation = true;
		},
		/**
		 * 切换日期
		 */
		changeStep(index) {
			if (this.numberData.HisSchedulingData.Scheduling.Row.length > 0) {
				this.numberData.HisSchedulingData.Scheduling.Row[
					this.morningActive
				].TimeIntervalList = [];
			}
			this.dayChange = true;
			this.step = index;
			this.date = this.numberData.RegistrationDateList[index].Date;
			this.getSchedulingInfoData();
		},
		/**
		 * 获取号源
		 */
		getSchedulingInfoData(index) {
			this.$toast.loading('加载中...');
			this.loading = true;
			HisBespeakApi.getSchedulingInfo(this.reservationId, {
				Date: this.date
			})
				.then(res => {
					if (res.Code === 0) {
						this.numberData = res.Body;
						if (this.numberData.HisSchedulingData.Scheduling.Row.length > 0) {
							const selRow = this.numberData.HisSchedulingData.Scheduling.Row[
								this.morningActive
							];
							// 筛选挂号记录，如果该科室当天病人已挂号，则添加标记
							const thisDate = new Date(
								index === 0
									? this.numberData.RegistrationDateList[index].Date
									: this.date
							).getTime();
							this.numberData.isRegister = false;
							if (
								this.numberData.RegisterRecords &&
								this.numberData.RegisterRecords.length > 0
							) {
								this.numberData.RegisterRecords.forEach(element => {
									const startTime = new Date(
										new Date(element.StartTime).format('yyyy-MM-dd')
									).getTime();

									if (
										parseInt(selRow.Number, 0) === element.Number &&
										startTime === thisDate &&
										parseInt(this.medicalCardId, 0) === element.MedicalCardID
									) {
										this.numberData.isRegister = true;
									}
								});
							}
						}
						this.dayChange = false;
					} else {
						this.$toast.fail(res.Message);
					}
				})
				.finally(() => {
					this.$toast.clear();
					this.loading = false;
				});
		},
		/**
		 * 获取就诊人信息
		 */
		getMedicalCardsByIdData() {
			MedicalCardsApi.getMedicalCardsById(this.medicalCardId).then(res => {
				if (res.Code === 0) {
					this.medicalData = res.Body;
				} else {
					this.$toast.fail(res.Message);
				}
			});
		},
		/**
		 * 进入选择就诊人
		 */
		handleSelectPatient() {
			this.$router.push({
				path: '/mother/select-patient',
				query: {
					select_patient: true,
					reservation_id: this.reservationId
				}
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-select-time';
.@{inner-prefix} {
	height: 100%;
	background: #f8f8f8;
	&-body {
		height: calc(100% - 67px);
		overflow: scroll;
		padding: 10px 0;
		.patient_info {
			padding: 0 10px;
			.patient_panel {
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
						.select_tag {
							color: #ff7979;
							background: rgba(255, 98, 99, 0.16);
							font-size: 12px;
							margin-left: 8px;
						}
					}
				}
			}
		}
		.select_week {
			display: flex;
			flex-direction: row;
			span {
				background: #ffffff;
				width: 67px;
				height: 60px;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				.sel {
					label:first-child {
						position: absolute;
						width: 0;
						height: 0;
						border-top: 20px solid #ff7979;
						border-left: 20px solid transparent;
						top: 0;
						right: 0;
					}
					label:last-child {
						position: absolute;
						top: 0;
						right: 2px;
						color: #ffffff;
						font-size: 10px;
					}
				}
			}
			.week_title {
				width: 60px;
				font-size: 14px;
				padding: 0 12px;
				color: #666666;
				text-align: center;
				line-height: 23px;
			}
			.today {
				font-size: 18px;
			}
			.week_array {
				overflow-x: scroll;
				white-space: nowrap;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				.week {
					display: flex;
					flex-direction: column;
					align-items: center;
					border-left: 1px solid #eeeeee;
					p {
						margin: 2px 0;
					}
					.day {
						font-size: 16px;
					}
					.date {
						font-size: 12px;
					}
				}
			}
		}
		.van-tabs {
			margin-top: 5px;
		}
	}
	&-confirmation_popup {
		border-radius: 5px;
		.confirmation {
			width: 345px;
			padding-bottom: 20px;
			background: #f8f8f8;

			.title {
				background: #ffffff;
				margin-bottom: 15px;
				padding: 13px 15px 13px 0;
				text-align: right;
				color: #f082a5;
				font-size: 18px;
				svg {
					margin-left: 106px;
				}
			}

			.information-panel {
				padding: 0 7px;
				.information {
					background: #ffffff;
					border-radius: 5px;
					padding: 26px 15px 1px 15px;
					.row {
						margin-bottom: 21px;
						.row_title {
							font-size: 16px;
							color: #666666;
						}
						.row_info {
							font-size: 15px;
							color: #999999;
						}
					}
				}
			}
			.tips {
				padding: 25px 15px;
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
				margin-top: 5px;
				text-align: center;
				.van-button {
					width: 325px;
					height: 45px;
					font-size: 16px;
					color: #ffffff;
					background: @next-button-color;
					box-shadow: @box-shadow;
					border-color: @next-button-color;
					border-radius: 5px;
				}
			}
		}
	}
}
</style>
