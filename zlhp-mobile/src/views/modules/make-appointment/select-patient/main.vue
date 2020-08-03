<template>
	<div :class="classRoot" v-if="patientData">
		<van-nav-bar
			title="选择就诊人"
			left-arrow
			@click-left="$router.back()"
		></van-nav-bar>
		<van-panel v-if="patientData.length > 0">
			<template #header>
				<div :class="`${classRoot}-tips`">
					您已添加{{ patientData.length }}人，还能添加{{
						5 - patientData.length
					}}个就诊人
				</div>
			</template>
		</van-panel>
		<div :class="`${classRoot}-body`">
			<div v-if="patientData.length > 0">
				<van-panel
					v-for="(item, index) in patientData"
					:key="index"
					@click="handleSelectDepartment(item)"
				>
					<template #header>
						<div class="select-array">
							<div class="name">
								姓名：{{ item.Name }}
								<van-tag class="select_tag" v-if="item.IsDefault">默认</van-tag>
							</div>
							<div class="info">证件号：{{ item.IDNumber }}</div>
							<div class="info">
								就诊卡号：{{ item.CardNo ? item.CardNo : '暂无就诊卡号' }}
							</div>
						</div>
					</template>
				</van-panel>
			</div>
			<hint v-else-if="!loding" message="暂无就诊人" />
			<div class="add_button" v-if="!loding && patientData.length < 5">
				<van-button @click="addPatient">
					<svg-icon value="icon-Add_Pink" :size="2" />添加就诊人
				</van-button>
			</div>
		</div>
	</div>
</template>
<script>
import * as MedicalCardsApi from '../../../../apis/MedicalCardsApi';
import * as TipConfigsApi from '../../../../apis/TipConfigsApi';

export default {
	name: 'select-patient',
	data() {
		return {
			loding: null,
			patientData: [], // 就诊人列表数据
			limit: 5,
			page: 1,
			tipData: null, // 提示语
			reservationId: this.$route.query.reservation_id // 科室id
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		this.getPatientData();
		this.getTips();
	},
	methods: {
		/**
		 * 获取就诊人
		 */
		getPatientData() {
			this.$toast.loading('加载中...');
			this.loding = true;
			MedicalCardsApi.getMedicalCardsList(this.page, this.limit)
				.then(res => {
					if (res.Code === 0 && res.Body) {
						this.patientData = res.Body;
						// 如果有默认就诊人，且就诊人绑定了his，直接进入选择科室
						res.Body.forEach(element => {
							if (
								!this.$route.query.select_patient &&
								element.IsDefault === 1 &&
								element.PatientID &&
								element.CardNo
							) {
								// 如果有科室id，则直接跳转到该科室的预约须知
								this.toRouter(element.MedicalCardID);
							}
						});
					}
				})
				.finally(() => {
					this.$toast.clear();
					this.loding = false;
				});
		},
		/**
		 * 进入选择科室
		 */
		handleSelectDepartment(data) {
			// 如果是从选择号源页面过来，选择完就诊人后，则直接回到选择号源页面
			if (this.$route.query.select_patient) {
				this.$router.push({
					path: '/mother/select-time',
					query: {
						reservation_id: this.reservationId,
						medical_card_id: data.MedicalCardID
					}
				});
			}
			// 如果没有绑定his，需要先绑定his，再进入下一步
			else if (!data.PatientID || !data.CardNo) {
				this.$dialog
					.confirm({
						title: '提示',
						confirmButtonColor: '#FC8892',
						confirmButtonText: '确定',
						message: this.tipData[0].TipConent
					})
					.then(() => {
						MedicalCardsApi.resetBindCard(data.MedicalCardID).then(res => {
							if (res.Code === 0) {
								// 当重新绑定接口返回成功，但是没有病人id，不能进入下一步
								if (res.Body.PatientID) {
									this.toRouter(data.MedicalCardID);
								} else {
									this.$toast.fail('绑定失败，请重试');
								}
							} else {
								this.$toast.fail(res.Message);
							}
						});
					})
					.catch(() => {});
			} else {
				this.toRouter(data.MedicalCardID);
			}
		},
		/**
		 * 获取提示语
		 */
		getTips() {
			TipConfigsApi.GetByTipVals([2001]).then(res => {
				if (res.Code === 0 && res.Body) {
					this.tipData = res.Body;
				} else {
					this.$toast.fail(res.Message);
				}
			});
		},
		/**
		 * 添加就诊人
		 */
		addPatient() {
			this.$router.replace({
				path: '/mother/add-patient',
				query: this.reservationId
					? {
							reservation_id: this.reservationId
					  }
					: ''
			});
		},
		/**
		 * 如果有科室id，则直接跳转到该科室的预约须知
		 */
		toRouter(id) {
			if (this.reservationId) {
				this.$router.replace({
					path: '/mother/notice',
					query: {
						reservation_id: this.reservationId,
						medical_card_id: id
					}
				});
			} else {
				this.$router.replace({
					path: '/mother/select-department',
					query: {
						medical_card_id: id
					}
				});
			}
		}
	}
};
</script>
<style lang="less" scoped>
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-select-patient';
.@{inner-prefix} {
	height: 100%;
	background: #f8f8f8;
	&-tips {
		padding: 8px 10px 12px 21px;
		color: #ef8ea3;
		font-size: 14px;
	}
	&-body {
		padding-bottom: 10px;
		height: calc(100% - 97px);
		overflow: scroll;
		.select-array {
			margin-top: 8px;
			padding: 15px 10px 24px 25px;
			.name {
				font-size: 16px;
				color: #333333;
				margin-bottom: 13px;
				.select_tag {
					color: #ff7979;
					background: rgba(255, 98, 99, 0.16);
					font-size: 12px;
					margin-left: 8px;
				}
			}
			.info {
				font-size: 14px;
				color: #666666;
				margin-top: 5px;
			}
		}
		.add_button {
			text-align: center;
			margin-top: 24px;
			margin-bottom: 30px;
			button {
				padding-left: 15px;
				border: 1px dashed #facdc5;
				border-radius: 8px;
				height: 43px;
				width: 42%;
				font-size: 17px;
				color: #333333;
				svg {
					vertical-align: middle;
					position: relative;
					bottom: 1px;
					right: 5px;
				}
			}
		}
	}
}
</style>
