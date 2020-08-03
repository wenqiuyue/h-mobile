<template>
	<div :class="classRoot" v-if="patientData">
		<van-nav-bar
			title="就诊人信息"
			left-arrow
			@click-left="$router.back()"
		></van-nav-bar>
		<div :class="`${classRoot}-body`">
			<van-panel>
				<template #header>
					<div class="info-panel">
						<div v-if="form.CardNo">
							<div id="qrCode" />
							<p>{{ form.CardNo }}</p>
						</div>
						<van-cell-group class="cellgroup">
							<van-field
								:value="form.CardNo ? form.CardNo : '暂无就诊卡号'"
								label="就诊卡号"
								readonly
							/>
							<van-field
								v-model="form.MedicalType"
								name="MedicalType"
								label="就诊人关系"
								readonly
							/>
							<van-field
								v-model="form.Name"
								name="Name"
								label="姓名"
								readonly
							/>
							<van-field v-model="form.Sex" name="Sex" label="性别" readonly />
							<van-field
								v-model="form.IdType"
								name="IdType"
								label="证件类型"
								readonly
							/>
							<van-field
								v-model="form.IDNumber"
								name="IDNumber"
								label="证件号"
								readonly
							/>
							<van-field
								readonly
								name="BornDate"
								:value="form.BornDate"
								label="出生日期"
							/>
							<van-field
								v-model="form.Phone"
								name="phone"
								label="手机号码"
								readonly
							/>
						</van-cell-group>
					</div>
				</template>
			</van-panel>
			<van-panel>
				<template #header>
					<div class="default">
						<label>设为默认就诊人</label>
						<van-switch
							v-model="defaultChecked"
							size="24px"
							active-color="#FFB2BF"
							@change="changeDefault"
						/>
					</div>
				</template>
			</van-panel>
			<div class="relieve_button">
				<van-button
					@click="handleBinding"
					v-if="!patientData.PatientID || !patientData.CardNo"
				>
					立即绑定
				</van-button>
				<van-button v-else>
					已绑定
				</van-button>
			</div>
			<div class="relieve_button edit_button">
				<van-button @click="handlecancle">
					删除就诊人
				</van-button>
			</div>
		</div>
	</div>
</template>
<script>
import { bindQRCode } from '../../../../commons';
import * as MedicalCardsApi from '../../../../apis/MedicalCardsApi';
import * as EnumApi from '../../../../apis/EnumApi';

export default {
	name: 'patient-info',
	data() {
		return {
			sexPicker: false, // 性别选择
			birthdayPicker: false, // 出生日期选择
			minDate: new Date(new Date().setFullYear(new Date().getFullYear() - 90)),
			maxDate: new Date(),
			form: {
				CardNo: null,
				Name: null,
				IDNumber: null,
				BornDate: null,
				Phone: null,
				IsDefault: null
			},
			defaultChecked: true, // 是否设为默认人
			medicalCardId: this.$route.query.medical_card_id, // 就诊id
			patientData: null // 就诊人信息
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		this.getMedicalCardsInfo();
	},
	mounted() {
		// setTimeout(() => {
		// 	this.creatQrCode();
		// }, 1000);
	},
	methods: {
		/**
		 * 删除就诊人
		 */
		handlecancle() {
			this.$dialog
				.confirm({
					title: '提示',
					confirmButtonColor: '#FC8892',
					confirmButtonText: '确定',
					message: '您要删除就诊人吗？'
				})
				.then(() => {
					MedicalCardsApi.delMedicalCards(this.medicalCardId).then(res => {
						if (res.Code === 0) {
							this.$toast.success('删除成功');
							this.$router.replace({
								path: '/mother/patient-manage'
							});
						} else {
							this.$toast.fail(res.Message);
						}
					});
				})
				.catch(() => {});
		},
		/**
		 * 立即绑定
		 */
		handleBinding() {
			if (!this.patientData.PatientID || !this.patientData.CardNo) {
				MedicalCardsApi.resetBindCard(this.patientData.MedicalCardID).then(
					res => {
						if (res.Code === 0) {
							this.$toast.success('绑定成功');
							this.getMedicalCardsInfo();
						} else {
							this.$toast.fail(res.Message);
						}
					}
				);
			}
		},
		/**
		 * 获取就诊人详情
		 */
		getMedicalCardsInfo() {
			this.$toast.loading('正在加载...');
			const methods = [
				MedicalCardsApi.getMedicalCardsById(this.medicalCardId),
				EnumApi.GetList(
					['IdTypeAll', 'MedicalType', 'Sex'].map(m => `${m}Enum`)
				)
			];
			Promise.all(methods)
				.then(res => {
					if (res[0].Code === 0 && res[1].Code === 0) {
						this.patientData = res[0].Body;
						// 初始化页面数据
						Object.keys(res[0].Body).forEach(key => {
							if (key === 'BornDate') {
								this.$set(
									this.form,
									key,
									new Date(res[0].Body[key]).format('yyyy-MM-dd')
								);
							} else {
								this.$set(this.form, key, res[0].Body[key]);
								setTimeout(() => {
									this.creatQrCode();
								}, 1000);
							}
						});
						// 初始化是否为默认就诊人
						if (res[0].Body.IsDefault === 1) {
							this.defaultChecked = true;
						} else {
							this.defaultChecked = false;
						}
						const enums = res[1].Body;
						this.parseForm(enums, this.form);
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 数据转换
		 */
		parseForm(enums, form) {
			Object.keys(form).forEach(key => {
				if (Object.keys(enums).indexOf(key) !== -1) {
					form[key] = enums[key]
						.filter(m => {
							const keyString = form[key] !== null ? form[key].toString() : '';
							return keyString.indexOf(m.value) !== -1;
						})
						.map(m => m.text)
						.toString();
				}
				if (key === 'IdType') {
					form[key] = enums.IdTypeAll.filter(m => {
						const keyString = form[key] !== null ? form[key].toString() : '';
						return keyString.indexOf(m.value) !== -1;
					})
						.map(m => m.text)
						.toString();
				}
			});
			this.form = form;
		},
		/**
		 * 根据订单编号生成二维码
		 */
		creatQrCode() {
			if (this.form.CardNo) {
				bindQRCode(
					document.getElementById('qrCode'),
					this.form.CardNo,
					170,
					170
				);
			}
		},
		/**
		 * 修改默认人
		 */
		changeDefault() {
			MedicalCardsApi.setDefault({
				MedicalCardID: this.medicalCardId,
				IsDefault: this.form.IsDefault
			}).then(res => {
				if (res.Code === 0 && res.Body) {
					this.$toast.success('设置成功');
					this.form.IsDefault = 1;
				}
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-patient-info';
.@{inner-prefix} {
	height: 100%;
	background: #f8f8f8;
	&-body {
		height: calc(100% - 96px);
		overflow: scroll;
		padding: 10px 0 39px 0;
		.info-panel {
			padding: 28px 23px 5px 23px;
			#qrCode {
				text-align: center;
			}
			p {
				color: #333333;
				font-size: 14px;
				text-align: center;
				margin: 11px 0;
			}
			.cellgroup {
				margin-top: 30px;
				.van-cell {
					padding: 15px 5px;
					.van-field__label {
						font-size: 15px;
						color: #333333;
					}
					.van-field__control {
						text-align: right;
						color: #999999;
						font-size: 15px;
					}
				}
			}
		}
		.default {
			margin-top: 8px;
			padding: 19px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			label {
				font-size: 15px;
				color: #333333;
			}
			.van-switch--disabled {
				opacity: 1;
			}
		}
		.relieve_button {
			margin-top: 30px;
			text-align: center;
			.van-button {
				width: 325px;
				height: 45px;
				font-size: 16px;
				border-radius: 5px;
				color: #ffffff;
				background: #ffb2bf;
				box-shadow: 0px 2px 3px rgba(249, 219, 229, 1);
			}
		}
		.edit_button {
			margin-top: 10px;
			.van-button {
				color: #666666;
				background: #ffffff;
				box-shadow: 0px 2px 3px rgba(249, 219, 229, 1);
			}
		}
	}
}
</style>
