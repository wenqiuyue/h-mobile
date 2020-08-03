<template>
	<div :class="classRoot" v-if="patientData">
		<van-nav-bar
			title="就诊人列表"
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
					@click="handleInfo(item.MedicalCardID)"
				>
					<template #header>
						<div class="select-array">
							<div>
								<div class="name">
									姓名：{{ item.Name }}
									<van-tag class="select_tag" v-if="item.IsDefault"
										>默认</van-tag
									>
								</div>
								<div class="info">身份证号：{{ item.IDNumber }}</div>
								<div class="info">
									就诊卡号：{{ item.CardNo ? item.CardNo : '暂无就诊卡号' }}
								</div>
							</div>
							<div class="code" v-if="item.CardNo">
								<div :id="`qrCode-${index}`" />
								<p>刷码出示</p>
							</div>
						</div>
					</template>
				</van-panel>
			</div>
			<hint v-else message="暂无就诊人" />
			<div class="add_button" v-if="patientData.length < 5">
				<van-button @click="addPatient">
					<svg-icon value="icon-Add_Pink" :size="2" />添加就诊人
				</van-button>
			</div>
		</div>
	</div>
</template>
<script>
import { bindQRCode } from '../../../../commons';
import * as MedicalCardsApi from '../../../../apis/MedicalCardsApi';

export default {
	name: 'patient-manage',
	data() {
		return {
			patientData: null, // 就诊人列表数据
			limit: 5,
			page: 1
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	mounted() {
		setTimeout(() => {
			this.creatQrCode();
		}, 1000);
	},
	created() {
		this.getPatientData();
	},
	methods: {
		/**
		 * 获取就诊人
		 */
		getPatientData() {
			this.$toast.loading('加载中...');
			MedicalCardsApi.getMedicalCardsList(this.page, this.limit)
				.then(res => {
					if (res.Code === 0) {
						this.patientData = res.Body;
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 根据订单编号生成二维码
		 */
		creatQrCode() {
			if (this.patientData && this.patientData.length) {
				for (let i = 0; i < this.patientData.length; i += 1) {
					if (this.patientData[i].CardNo) {
						bindQRCode(
							document.getElementById(`qrCode-${i}`),
							this.patientData[i].CardNo,
							50,
							50
						);
					}
				}
			}
		},
		/**
		 * 添加就诊人
		 */
		addPatient() {
			this.$router.push({
				path: '/mother/add-patient',
				query: {
					is_back: 1
				}
			});
		},
		/**
		 * 查看就诊人详情
		 */
		handleInfo(id) {
			this.$router.push({
				path: '/mother/patient-info',
				query: {
					medical_card_id: id
				}
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-patient-manage';
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
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			.code {
				padding: 5px 13px 0 29px;
				border-left: 1px dashed #bbbbbb;
				text-align: center;
				p {
					margin: 5px 0;
					font-size: 12px;
					color: #bbbbbb;
				}
			}
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
