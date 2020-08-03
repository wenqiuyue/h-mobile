<template>
	<div :class="classRoot">
		<van-dialog
			v-if="!reservationId || reservationsData"
			:class="`${classRoot}-dialog`"
			v-model="show"
			title="温馨提示"
			confirmButtonText="退出"
			@confirm="$router.push({ path: '/home' })"
		>
			<template v-if="code === 700005">
				<span v-if="reservationId"
					>你未预约{{ reservationsData.Title }}，请先预约！</span
				>
				<span v-else>你没有任何预约，请先预约！</span>
				<van-button
					type="info"
					class="register_button"
					round
					@click="handleRegister"
					>立即预约</van-button
				>
			</template>
			<template v-else-if="code === 700004">
				<span>还未到签到时间，预约时间前30分钟才能进行签到！</span>
				<van-button
					type="info"
					class="register_button"
					round
					@click="$router.push({ path: '/mother/registration-record' })"
					>查看预约</van-button
				>
			</template>
		</van-dialog>
		<div
			v-if="registerRecordsData.length > 1 || $route.query.isCode === 1"
			:class="`${classRoot}-sel`"
		>
			<!-- <van-nav-bar title="选择就诊人"></van-nav-bar> -->
			<div class="patient">
				<van-panel
					class="record_panel"
					v-for="(item, index) in registerRecordsData"
					:key="index"
					@click="handleRecord(item)"
				>
					<template #header>
						<div class="record">
							<div class="people_info">
								<span class="name">
									{{ item.MedicalCards.Name }}
									<label>{{ item.MedicalCards.IDNumber }}</label>
								</span>
							</div>
							<div class="record_info">
								<span class="info">
									<label>就诊科室：{{ item.DepartmentName }}</label>
									<label>预约时间：{{ item.BespeakDateTime }}</label>
								</span>
								<span class="number" v-if="item.ShowRegisterNumber"
									>{{ item.ShowRegisterNumber }}号</span
								>
							</div>
						</div>
					</template>
				</van-panel>
			</div>
		</div>
	</div>
</template>
<script>
import * as RegisterRecordsApi from '../../../../apis/RegisterRecordsApi';

export default {
	name: 'code-sign-in',
	data() {
		return {
			show: false,
			registerRecordsData: [], // 预约信息
			reservationsData: null,
			code: null,
			reservationId: this.$route.query.reservation_id // 科室id
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},

	created() {
		this.isRegister();
	},
	methods: {
		/**
		 * 查询当前科室下面有没有预约记录
		 */
		isRegister() {
			RegisterRecordsApi.getAllowCheckIn({
				ReservationID: this.reservationId ? this.reservationId : null
			}).then(res => {
				this.code = res.Code;
				this.reservationsData = res.Body.Reservations;
				this.show = true;
				if (res.Code === 0) {
					this.registerRecordsData.push(...res.Body.RegisterRecords);
					// 当只有一个就诊人预约，则直接进入签到
					if (this.registerRecordsData.length === 1) {
						if (this.$route.query.isCode === 1) {
							this.show = false;
						} else {
							this.$router.push({
								path: '/mother/information-confirmation',
								query: {
									register_record_id: this.registerRecordsData[0]
										.RegisterRecordID
								}
							});
						}
					} else if (this.registerRecordsData.length > 1) {
						this.show = false;
					}
				} else {
					this.show = true;
				}
			});
		},
		// isRegister() {
		// 	RegisterRecordsApi.getAllowCheckIn(this.reservationId).then(res => {
		// 		this.code = res.Code;
		// 		this.reservationsData = res.Body.Reservations;
		// 		if (res.Code === 0) {
		// 			this.registerRecordsData.push(...res.Body.RegisterRecords);
		// 			// 当只有一个就诊人预约，则直接进入签到
		// 			if (this.registerRecordsData.length === 1) {
		// 				if (this.$route.query.isCode === 1) {
		// 					this.show = false;
		// 				} else {
		// 					this.$router.push({
		// 						path: '/mother/information-confirmation',
		// 						query: {
		// 							register_record_id: this.registerRecordsData[0]
		// 								.RegisterRecordID
		// 						}
		// 					});
		// 				}
		// 			} else if (this.registerRecordsData.length > 1) {
		// 				this.show = false;
		// 			} else {
		// 				this.show = true;
		// 			}
		// 		} else {
		// 			this.$toast.fail(res.Message);
		// 		}
		// 	});
		// },
		/**
		 * 预约挂号
		 */
		handleRegister() {
			this.$router.push({
				path: '/mother/select-patient',
				query: this.reservationId
					? {
							reservation_id: this.reservationId
					  }
					: ''
			});
		},
		/**
		 * 查看预约详情
		 */
		handleRecord(data) {
			if (data.CanCheckIn && data.CanCancel && data.Status === 1) {
				this.$router.push({
					path: '/mother/information-confirmation',
					query: {
						register_record_id: data.RegisterRecordID,
						isSign: 1,
						isNoReservation: this.reservationId ? 1 : 0
					}
				});
			} else {
				this.code = 700004;
				this.show = true;
			}
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-code-sign-in';
.@{inner-prefix} {
	height: 100%;
	&-dialog {
		.van-dialog__header {
			font-size: 18px;
		}
		.van-dialog__content {
			padding: 0 20px;
			margin-top: 13px;
			color: #666666;
			display: flex;
			flex-direction: column;
			align-items: center;
			.register_button {
				display: block;
				margin-top: 20px;
				background: @next-button-color;
				border: none;
				width: 248px;
			}
		}
	}
	&-sel {
		height: 100%;
		background: #f8f8f8;
		.patient {
			height: calc(100% - 47px);
			overflow: scroll;
			.record_panel {
				border-radius: 5px;
				margin-bottom: 10px;
				.record {
					padding: 18px 16px 16px 28px;
					.people_info {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.name {
							color: #333333;
							font-size: 17px;
							label {
								color: #666666;
								font-size: 14px;
								margin-left: 10px;
							}
						}
						.status {
							// color: #fb5e5e;
							color: #666666;
							font-size: 14px;
						}
					}
					.record_info {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
						.info {
							display: flex;
							flex-direction: column;
							color: #999999;
							font-size: 14px;
							label {
								margin-top: 10px;
							}
						}
						.number {
							color: #333333;
							font-size: 18px;
						}
					}
					.action-button {
						display: flex;
						justify-content: flex-end;
						margin-top: 13px;
						.van-button {
							margin-left: 5px;
							font-size: 14px;
							height: 30px;
							line-height: 10px;
							padding: 8px 20px;
						}
					}
				}
			}
		}
	}
}
</style>
