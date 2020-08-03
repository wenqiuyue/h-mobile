<template>
	<div :class="classRoot">
		<van-nav-bar
			title="添加就诊人"
			left-arrow
			@click-left="$router.back()"
		></van-nav-bar>
		<div :class="`${classRoot}-body`">
			<ValidationObserver ref="form" class="form" v-if="optionsData">
				<ValidationProvider name="是否是新生儿">
					<van-field label="是否是新生儿">
						<template #input>
							<van-radio-group v-model="form.IsNewborn" direction="horizontal">
								<van-radio
									:name="item.value"
									v-for="(item, index) in optionsData.YesOrNo"
									:key="index"
									>{{ item.text }}</van-radio
								>
							</van-radio-group>
						</template>
					</van-field>
				</ValidationProvider>
				<ValidationProvider
					rules="required"
					name="就诊人关系"
					v-slot="{ errors }"
					v-if="form.IsNewborn !== 1"
				>
					<combobox
						label="就诊人关系"
						unNull
						required
						:error-message="errors.join('')"
						v-model="form.MedicalType"
						:options="optionsData.MedicalType"
					/>
				</ValidationProvider>
				<ValidationProvider
					rules="required|name"
					:name="form.IsNewborn === 1 ? '儿童姓名' : '就诊人姓名'"
					v-slot="{ errors }"
				>
					<van-field
						required
						v-model="form.Name"
						name="username"
						label="姓名"
						:placeholder="
							form.IsNewborn === 1 ? '请填写儿童姓名' : '请填写就诊人姓名'
						"
						:error-message="errors.join('')"
					/>
				</ValidationProvider>
				<ValidationProvider
					rules="required"
					:name="form.IsNewborn === 1 ? '儿童性别' : '就诊人性别'"
					v-slot="{ errors }"
				>
					<combobox
						title="性别"
						:label="form.IsNewborn === 1 ? '儿童性别' : '就诊人性别'"
						un-null
						required
						v-model="form.Sex"
						:error-message="errors.join('')"
						:options="optionsData.Sex"
					/>
				</ValidationProvider>
				<ValidationProvider
					rules="required"
					:name="form.IsNewborn === 1 ? '监护人证件类型' : '就诊人证件类型'"
					v-slot="{ errors }"
				>
					<combobox
						title="证件类型"
						:label="form.IsNewborn === 1 ? '监护人证件类型' : '就诊人证件类型'"
						unNull
						required
						:error-message="errors.join('')"
						v-model="form.IdType"
						:options="optionsData.IdTypeAll"
					/>
				</ValidationProvider>
				<ValidationProvider
					:rules="{
						required: true,
						officerCard: form.IdType === 2,
						passPortCard: form.IdType === 1,
						error: form.IdType === 0 ? iDNumberErrorMessage : ''
					}"
					:name="form.IsNewborn === 1 ? '监护人证件号' : '就诊人证件号'"
					v-slot="{ errors }"
				>
					<van-field
						v-model.trim="form.IDNumber"
						label="证件号"
						required
						:placeholder="
							form.IsNewborn === 1 ? '请输入监护人证件号' : '请输入就诊人证件号'
						"
						:error-message="errors.join('')"
					/>
				</ValidationProvider>
				<van-popup v-model="birthdayPicker" position="bottom">
					<van-datetime-picker
						type="date"
						:min-date="minDate"
						:max-date="maxDate"
						@confirm="onBirthdayConfirm"
						@cancel="birthdayPicker = false"
					/>
				</van-popup>
				<ValidationProvider
					rules="required|phone"
					name="手机号"
					v-slot="{ errors }"
				>
					<van-field
						v-model.trim="form.Phone"
						name="phone"
						required
						label="手机号码"
						:placeholder="
							form.IsNewborn === 1 ? '请填写手机号码' : '请填写手机号码'
						"
						:error-message="errors.join('')"
					/>
				</ValidationProvider>
				<ValidationProvider
					ref="captcha"
					:rules="{
						required: true,
						length: 4,
						error: captchaErrorMessage
					}"
					name="图形验证码"
					v-slot="{ errors }"
				>
					<van-field
						v-model.trim="Captcha"
						center
						required
						clearable
						label="图形验证码"
						placeholder="请输入图形验证码"
						:error-message="errors.join('')"
					>
						<template #button>
							<img
								slot="right-icon"
								class="captcha"
								:src="captchaUrl"
								@click="handleRefreshCaptcha"
							/>
						</template>
					</van-field>
				</ValidationProvider>
				<ValidationProvider
					rules="required|length:4"
					name="短信验证码"
					v-slot="{ errors }"
				>
					<van-field
						v-model.trim="form.Code"
						center
						required
						clearable
						label="短信验证"
						placeholder="请输入短信验证码"
						:error-message="errors.join('')"
					>
						<template #button>
							<van-button
								size="small"
								class="sms_button"
								:disabled="
									!!(
										!form.Phone ||
										form.Phone.length !== 11 ||
										!Captcha ||
										Captcha.length !== 4 ||
										captchaErrorMessage ||
										smsInterval
									)
								"
								@click="handleSendSMS"
								><span v-show="!smsInterval">发送验证码</span>
								<span v-show="smsInterval">{{ smsCount }}</span></van-button
							>
						</template>
					</van-field>
				</ValidationProvider>
				<van-panel>
					<template #header>
						<div class="default">
							<label>设为默认就诊人</label>
							<van-switch
								v-model="defaultChecked"
								size="24px"
								active-color="#FFB2BF"
							/>
						</div>
					</template>
				</van-panel>
				<van-panel>
					<template #header>
						<div class="notice">
							<label @click="handleBindingNotice">绑定须知</label>
							<van-checkbox
								v-model="noticeChecked"
								@click="handleBindingNotice"
							></van-checkbox>
						</div>
					</template>
				</van-panel>
				<div class="submit_button">
					<van-button @click="onBinding">
						立即绑定
					</van-button>
				</div>
			</ValidationObserver>
		</div>
	</div>
</template>
<script>
import { Dialog } from 'vant';
import types from '../../../../commons/types';
import * as ValidateCodeApi from '../../../../apis/ValidateCodeApi';
import * as MedicalCardsApi from '../../../../apis/MedicalCardsApi';
import * as EnumApi from '../../../../apis/EnumApi';
import * as TipConfigsApi from '../../../../apis/TipConfigsApi';

export default {
	name: 'add-patient',
	data() {
		return {
			birthdayPicker: false,
			minDate: new Date(new Date().setFullYear(new Date().getFullYear() - 90)),
			maxDate: new Date(),
			form: {
				MedicalType: null, // 就诊人类型
				Name: null, // 姓名
				Sex: null, // 性别
				IdType: null,
				IDNumber: null, // 身份证号
				Phone: null, // 手机号
				Code: null, // 短信验证码
				IsDefault: null,
				IsNewborn: 0 // 是否是新生儿
			},
			Captcha: null, // 图形验证码
			captchaVersion: Math.random(), // 图形验证码版本控制
			defaultChecked: true, // 设为默认就诊人开关
			noticeChecked: false, // 绑定须知
			captchaErrorMessage: null,
			smsInterval: null,
			smsCount: 0,
			optionsData: null, // 选择类型数据
			bindNotice: null, // 须知内容
			iDNumberErrorMessage: null,
			reservationId: this.$route.query.reservation_id // 科室id
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		},
		/**
		 * 图形验证码
		 */
		captchaUrl() {
			return `/v1/ValidateCode/GetCaptcha?token=${
				this.$store.state[types.TOKEN]
			}&version=${this.captchaVersion}`;
		},
		/**
		 * 图片验证码验证
		 */
		watchCaptcha() {
			return this.Captcha;
		},
		/**
		 * 证件号
		 */
		iDNumber() {
			return this.form.IDNumber;
		},
		/**
		 * 性别
		 */
		sex() {
			return this.form.Sex;
		},
		/**
		 * 证件类型
		 */
		idType() {
			return this.form.IdType;
		},
		/**
		 * 是否新生儿
		 */
		isNewborn() {
			return this.form.IsNewborn;
		}
	},
	watch: {
		// 当性别改变时，重新验证身份证
		iDNumber() {
			// 身份证空格替换
			if (this.form.IDNumber) {
				this.form.IDNumber = this.form.IDNumber.replace(' ', '');
			}
			this.idCardNoTips();
		},
		// 当性别改变时，重新验证身份证
		sex() {
			this.idCardNoTips();
		},
		// 图片验证码监听
		watchCaptcha() {
			this.validateCaptcha();
		},
		// 当证件类型改变时，证件号清空
		idType() {
			this.form.IDNumber = null;
		},
		// 当是否新生儿改变时，重新验证身份证
		isNewborn() {
			this.idCardNoTips();
		}
	},
	created() {
		this.getEnumData();
	},
	methods: {
		/**
		 * 选择值数据加载
		 */
		getEnumData() {
			this.$toast.loading('加载中...');
			const methods = [
				EnumApi.GetList(
					['IdTypeAll', 'MedicalType', 'YesOrNo', 'Sex'].map(m => `${m}Enum`)
				),
				TipConfigsApi.GetByTipVals([6])
			];

			Promise.all(methods)
				.then(res => {
					if (res[0].Code === 0 && res[1].Code === 0) {
						this.optionsData = res[0].Body;
						this.bindNotice = res[1].Body[0].TipConent;
					} else {
						this.$toast.fail('数据获取失败');
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 立即绑定
		 */
		onBinding() {
			this.$refs.form.validate().then(result => {
				if (result) {
					if (this.noticeChecked === false) {
						this.$dialog.alert({
							title: '提示',
							confirmButtonColor: '#FC8892',
							confirmButtonText: '确定',
							message: '请先阅读绑定须知'
						});
					} else {
						if (this.defaultChecked) {
							this.form.IsDefault = 1;
						} else {
							this.form.IsDefault = 0;
						}
						this.$toast.loading('绑定中...');
						MedicalCardsApi.bindingMedicalCards(this.form)
							.then(res => {
								if (res.Code === 0) {
									if (this.$route.query.is_back === 1) {
										this.$router.back();
									} else {
										this.toRouter(res.Body.MedicalCardID);
									}
								} else {
									this.$dialog.alert({
										title: '提示',
										confirmButtonColor: '#FC8892',
										confirmButtonText: '确定',
										message: res.Message
									});
								}
							})
							.finally(this.$toast.clear);
					}
				}
			});
		},
		/**
		 * 如果有科室id，则直接跳转到该科室的预约须知
		 */
		toRouter(id) {
			if (this.reservationId) {
				this.$router.push({
					path: '/mother/notice',
					query: {
						reservation_id: this.reservationId,
						medical_card_id: id
					}
				});
			} else {
				this.$router.push({
					path: '/mother/select-department',
					query: {
						medical_card_id: id
					}
				});
			}
		},
		/**
		 * 出生日期选择
		 */
		onBirthdayConfirm(value) {
			this.form.BornDate = new Date(value).format('yyyy-MM-dd');
			this.birthdayPicker = false;
		},
		/**
		 * 绑定须知
		 */
		handleBindingNotice() {
			this.$dialog
				.confirm({
					title: '绑定须知',
					messageAlign: 'left',
					confirmButtonColor: '#FC8892',
					cancelButtonColor: '#999999',
					confirmButtonText: '确定',
					className: `${this.classRoot}-notice_dialog`,
					message: this.bindNotice
				})
				.then(() => {
					this.noticeChecked = true;
				})
				.catch(() => {
					this.noticeChecked = false;
				});
		},
		/**
		 * 刷新图形验证码
		 */
		handleRefreshCaptcha() {
			this.Captcha = null;
			this.form.Code = null;
			this.captchaVersion = Math.random();
		},
		/**
		 * 图片验证码校验
		 */
		validateCaptcha() {
			this.captchaErrorMessage = null;
			this.$refs.captcha.validate().then(result => {
				if (result.valid) {
					ValidateCodeApi.CaptchaVerify({
						Answer: encodeURI(this.Captcha)
					}).then(response => {
						// 校验通过
						if (response.Code === 0 && response.Body) {
							this.captchaErrorMessage = null;
						} else {
							this.captchaErrorMessage = response.Message;
						}
					});
				}
			});
		},
		/**
		 * 初始化定时器
		 */
		initInterval() {
			clearInterval(this.smsInterval);
			this.smsCount = 0;
			this.smsInterval = null;
		},
		/**
		 * 开始定时器
		 */
		startInterval() {
			this.initInterval();
			this.smsCount = 60;
			this.smsInterval = setInterval(() => {
				this.smsCount -= 1;
				if (this.smsCount <= 0) {
					this.initInterval();
				}
			}, 1000);
		},
		/**
		 * 发送短信验证码
		 */ handleSendSMS() {
			this.$toast.loading('发送中...');
			ValidateCodeApi.SendSMS({
				Phone: this.form.Phone,
				Answer: this.Captcha,
				UserName: this.form.Name,
				isBindArchive: false,
				SMSTypeEnum: 7
			})
				.then(response => {
					if (response.Code === 0 && response.Body) {
						this.startInterval();
						this.$toast.success(response.Message);
					}
					// 图片验证码过期
					else if (response.Code === 600008) {
						this.Captcha = null;
						this.captchaVersion = Math.random();
						Dialog.alert({
							title: '系统提示',
							message: '验证码已过期，请重新输入'
						});
					} else {
						this.$toast.fail(response.Message);
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 身份证提示
		 */
		idCardNoTips() {
			// 不指定男女
			let sex = 0;
			if (this.form.Sex === 0) {
				// 男
				sex = 1;
			} else if (this.form.Sex === 1) {
				// 女
				sex = 2;
			}
			if (this.form.IsNewborn === 1) {
				sex = 0;
			}
			if (this.idType === 0 && this.form.IDNumber) {
				if (this.isIdCardNo(this.form.IDNumber, sex, true)) {
					this.iDNumberErrorMessage = null;
				} else {
					this.iDNumberErrorMessage = '不正确';
				}
			}
		},
		/**
		 * 身份证校验
		 */
		isIdCardNo(value, gender, strictMode) {
			gender = gender || 0;
			if (gender !== 0 && gender !== 1 && gender !== 2) return false;
			strictMode = strictMode || false;
			if (this.trim(value) === '') {
				return false;
			}
			value = this.trim(value.replace(/ /g, ''));
			if (value.length !== 18) {
				return false;
			}
			const convertNumber = Number(value.toLowerCase().replace(/x$/, '10'));
			if (Number.isNaN(convertNumber)) {
				return false;
			}
			// 男
			if (gender === 1) {
				// 倒数第二位不为奇数, 验证未通过
				if (value[16] % 2 !== 1) {
					return false;
				}
			} else if (gender === 2) {
				// 女
				// 倒数第二位不为奇数, 验证未通过
				if (value[16] % 2 !== 0) {
					return false;
				}
			}
			const birthDate = this.getDateFromIdCard(value);
			// 弱模式不遵守身份证规则
			if (!strictMode) {
				if (
					!this.isDateString(`${birthDate[0]}-${birthDate[1]}-${birthDate[2]}`)
				) {
					return false;
				}
				if (gender === '0') {
					return true;
				}
				return true;
			}
			const wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
			const valideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
			let sum = 0; // 声明加权求和变量
			if (value[17].toLowerCase() === 'x') value = value.substring(0, 17) + 10; // 将最后位为x的验证码替换为10方便后续操作
			for (let i = 0; i < 17; i += 1) sum += wi[i] * value[i]; // 加权求和
			const valCodePosition = sum % 11; // 得到验证码所位置
			if (
				value.length === 18 &&
				value[17] === valideCode[valCodePosition].toString()
			)
				return true;
			if (
				value.length === 19 &&
				value.substring(17, 19) === valideCode[valCodePosition].toString()
			)
				return true;
			return false;
		},
		/**
		 *获取身份证出生日期
		 */
		getDateFromIdCard(idCard) {
			if (!idCard) return '';
			try {
				return [
					idCard.substring(6, 10),
					idCard.substring(10, 12),
					idCard.substring(12, 14)
				];
			} catch (e) {
				return '';
			}
		},

		isDateString(date) {
			return new Date(date).getDate() === date.substring(date.length - 2);
		},
		trim(str) {
			return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '');
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-add-patient';
.@{inner-prefix} {
	height: 100%;
	background: #f8f8f8;
	.notice_dialog {
		color: red;
	}
	&-body {
		height: calc(100% - 47px);
		overflow: scroll;
		.form {
			padding-bottom: 60px;
			.van-cell {
				padding: 18px;
				border-bottom: 1px solid #eeeeee;
				&__title {
					span {
						color: #666666;
					}
				}
				&__value {
					font-size: 15px;
				}
				.captcha {
					height: 35px;
				}
				.sms_button {
					background: @next-button-color;
					color: #ffffff;
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
		}
		.notice {
			margin-top: 8px;
			padding: 17px 19px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			label {
				font-size: 15px;
				color: #ff7979;
				border-bottom: 1px solid #ff7979;
				padding-bottom: 5px;
			}
		}
		.submit_button {
			margin-top: 26px;
			text-align: center;
			margin-bottom: 20px;
			.van-button {
				width: 325px;
				height: 45px;
				font-size: 16px;
				color: #ffffff;
				background: @next-button-color;
				box-shadow: @box-shadow;
				border-radius: 5px;
			}
		}
	}
	&-notice_dialog {
		.van-dialog__header {
			color: #ff7979;
			font-size: 18px;
		}
		.van-dialog__message {
			line-height: 23px;
			color: #666666;
			margin-top: 11px;
		}
	}
}
</style>
