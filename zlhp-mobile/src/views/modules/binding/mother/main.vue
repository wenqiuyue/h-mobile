<template>
	<div :class="classRoot">
		<van-nav-bar
			:title="isArchiving ? '自主建档' : '实名认证'"
			left-arrow
			@click-left="handleBack"
		/>
		<van-steps :active="step">
			<van-step>身份验证</van-step>
			<van-step>手机验证</van-step>
			<van-step>完善信息</van-step>
			<van-step>完成</van-step>
		</van-steps>
		<div :class="`${classRoot}-body`" ref="body">
			<div :class="`${classRoot}-form`">
				<!-- 第一步 -->
				<ValidationObserver ref="form-0" v-show="step === 0">
					<van-cell-group>
						<ValidationProvider
							rules="required|name"
							name="姓名"
							v-slot="{ errors }"
						>
							<van-field
								v-model="form.Name"
								required
								label="姓名"
								placeholder="请输入姓名"
								:error-message="errors.join('')"
							/>
						</ValidationProvider>
						<ValidationProvider>
							<combobox
								label="证件类型"
								v-model="form.IdType"
								:options="options.IdType"
							/>
						</ValidationProvider>
						<ValidationProvider
							:rules="{
								required: true,
								idCard: form.IdType === 1 ? { gender: 2 } : false,
								officerCard: form.IdType === 2,
								passPortCard: form.IdType === 4
							}"
							name="证件号"
							v-slot="{ errors }"
						>
							<van-field
								v-model="form.IdNumber"
								required
								label="证件号"
								placeholder="请输入证件号"
								:error-message="errors.join('')"
							/>
						</ValidationProvider>
					</van-cell-group>
				</ValidationObserver>
				<!-- 第二步 -->
				<ValidationObserver ref="form-1" v-show="step === 1">
					<van-cell-group>
						<ValidationProvider
							v-if="!form.HisPhone"
							rules="required|phone"
							name="预留手机号"
							v-slot="{ errors }"
						>
							<van-field
								v-model="form.Phone"
								required
								label="预留手机号"
								placeholder="请输入预留手机号"
								:error-message="errors.join('')"
							/>
						</ValidationProvider>
						<template v-if="form.HisPhone">
							<van-field
								v-model="form.HisPhone"
								required
								label="预留手机号"
								placeholder="请输入预留手机号"
								disabled
							/>
						</template>
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
								v-model="form.Captcha"
								required
								label="图形验证码"
								placeholder="请输入图形验证码"
								:error-message="errors.join('')"
							>
								<img
									slot="right-icon"
									:class="`${classRoot}-form-captcha`"
									:src="captchaUrl"
									@click="handleRefreshCaptcha"
								/>
							</van-field>
						</ValidationProvider>
						<ValidationProvider
							rules="required|length:4"
							name="短信验证码"
							v-slot="{ errors }"
						>
							<van-field
								v-model="form.Code"
								required
								label="短信验证码"
								placeholder="请输入短信验证码"
								:error-message="errors.join('')"
							>
								<van-button
									color="#f59fb0"
									slot="right-icon"
									size="small"
									type="info"
									:disabled="
										!!(
											!form.Captcha ||
											form.Captcha.length !== 4 ||
											captchaErrorMessage ||
											smsInterval
										)
									"
									@click="handleSendSMS"
								>
									<span v-show="!smsInterval">发送验证</span>
									<span v-show="smsInterval">{{ smsCount }}</span>
								</van-button>
							</van-field>
						</ValidationProvider>
						<template v-if="form.HisPhone">
							<van-field
								v-model="form.Phone"
								required
								label="新手机号"
								placeholder="请输入新手机号"
								disabled
							/>
						</template>
					</van-cell-group>
				</ValidationObserver>
				<!-- 第三步-->
				<hint
					v-show="step === 2"
					icon="icon-success_green"
					:message="successMessage"
				/>
				<!-- 第四步-->
				<hint
					v-show="step === 3"
					icon="icon-success_green"
					:message="successMessage"
					:size="7"
				/>
				<!-- 按钮 -->
				<van-cell :class="`${classRoot}-form-footer`">
					<van-button
						slot="title"
						size="small"
						@click="handlePrev"
						:disabled="step === 0"
						v-if="step !== 0 && step < 2"
					>
						上一步
					</van-button>
					<van-button
						size="small"
						:class="`${classRoot}-button`"
						@click="handleNext"
					>
						{{
							step > 1 ? (isAutoSignIn && signIn ? '去签到' : '完成') : '下一步'
						}}
					</van-button>
				</van-cell>
			</div>
			<tips
				v-if="step === 0"
				:size="1.4"
				:icon="'icon-sign_Tips'"
				title="温馨提示"
				:list="[
					'姓名一栏，请输入在<span style=\'color: #EE868F\'>医院建档</span>时填写的姓名；',
					'证件号一栏，请输入在<span style=\'color: #EE868F\'>医院建档</span>时所填写的证件号码；',
					'此处填写的证件号，本院只用于验证您的身份信息，我们将对您的信息严格保密，请放心填写！'
				]"
			/>
			<tips
				v-else-if="step === 1"
				:size="1.4"
				:icon="'icon-sign_Tips'"
				title="温馨提示"
				:list="[
					'手机号一栏，请输入在我院产科门诊<span style=\'color: #EE868F\'>建立“孕期档案”时</span>所填写的手机号码；',
					'图形验证一栏，请根据右图填写相应字母或数字，如果您输入正确依然提示错误，可能是停留时间过程，图形验证码失效，点击右图刷新图形验证码即可；',
					'短信验证一栏，当您点击“发送验证码”按钮后，本院将发送短信到您手机上，请在<span style=\'color: #EE868F\'>有效时间内</span>将验证码填写到此栏。'
				]"
			/>
		</div>
	</div>
</template>
<script>
import { Dialog } from 'vant';
import types from '../../../../commons/types';
import { GetSingle } from '../../../../apis/EnumApi';
import * as CertificationApi from '../../../../apis/CertificationApi';
import * as ValidateCodeApi from '../../../../apis/ValidateCodeApi';
import * as SiteApi from '../../../../apis/SiteApi';
import {
	getSession,
	setSession,
	removeSession
} from '../../../../commons/session';
import { getDistance, setLocation } from '../../../../commons/weixin';
import { has } from '../../../../tools';

export default {
	name: 'binding',
	data() {
		return {
			step: 0,
			uuidInterval: null, // 定位定时器
			distance: null, // 定位数据
			isHisArchiving: true, // 医院是否有档案
			isAutoSignIn: false, // 是否需要进入首页时自动弹出签到
			successMessage: null, // 成功消息
			form: {
				Name: null,
				IdType: 1,
				IdNumber: null,
				Phone: null, // 输入手机号
				HisPhone: null, // 医院预留手机号
				Captcha: null, // 图形验证码
				Code: null // 短信验证码
			},
			options: {
				IdType: []
			},
			captchaVersion: Math.random(), // 图形验证码版本控制
			captchaErrorMessage: null,
			smsInterval: null,
			smsCount: 0,
			signIn: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		},
		/**
		 * 是否为建档进入
		 * @returns {boolean}
		 */
		isArchiving() {
			return has.call(this.$route.query, 'archiving');
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
		 * 图片验证码
		 */
		watchCaptcha() {
			return this.form.Captcha;
		}
	},
	watch: {
		// 图片验证码监听
		watchCaptcha() {
			this.validateCaptcha();
		}
	},
	created() {
		this.isSignIn();
		GetSingle('IdTypeEnum').then(response => {
			if (response.Code === 0) {
				this.$set(this.options, response.Message, response.Body);
			}
		});

		const disposeDistance = () => {
			getDistance().then(distance => {
				this.distance = distance;
			});
		};
		disposeDistance();
		this.uuidInterval = setInterval(disposeDistance, 6000);
	},
	mounted() {
		this.disposeQuery();
		// 加载缓存数据
		this.loadCacheData();
	},
	beforeDestroy() {
		removeSession(types.FROM_ARCHIVING);
		clearInterval(this.uuidInterval);
		this.uuidInterval = null;
	},
	methods: {
		/**
		 * 当前距离是否可以签到
		 */
		isSignIn() {
			SiteApi.canSignIn()
				.then(res => {
					this.signIn = res;
				})
				.catch(() => {
					this.signIn = false;
				});
		},
		/**
		 * 处理请求参数
		 */
		disposeQuery() {
			if (has.call(this.$route.query, types.FROM_ARCHIVING)) {
				const fromData = JSON.parse(getSession(types.FROM_ARCHIVING));
				this.step = 3;
				this.successMessage = fromData.message;
				this.isAutoSignIn = fromData.Code !== 0;
			}
		},
		/**
		 * 加载缓存数据
		 */
		loadCacheData() {
			// 判断是否有缓存的历史数据
			const cacheStr = getSession(types.FROM_BINDING);
			if (cacheStr && this.isArchiving) {
				const fromData = JSON.parse(cacheStr);
				this.form.Name = fromData.form.Name;
				this.form.IdType = fromData.form.IdType;
				this.form.IdNumber = fromData.form.IdNumber;
				this.form.Phone = fromData.form.Phone;
			}
		},
		/**
		 * 左上角箭头返回
		 */
		handleBack() {
			if (this.step > 1) {
				removeSession(types.FROM_BINDING);
				this.$router.push({
					path: '/home',
					query: this.isAutoSignIn
						? {
								method: 'handleSignIn'
						  }
						: null
				});
				return;
			}
			this.$router.back();
		},
		/**
		 * 上一步
		 */
		handlePrev() {
			this.step -= 1;
			this.scrollTop(0);
		},
		/**
		 * 下一步
		 */
		handleNext() {
			if (this.step > 1) {
				this.$router.push({
					path: '/home',
					query:
						this.isAutoSignIn && this.signIn
							? {
									method: 'handleSignIn'
							  }
							: null
				});
			} else {
				this.$refs[`form-${this.step}`].validate().then(result => {
					if (result) {
						if (this.step === 0) {
							this.handleHisAuth();
						} else if (this.step === 1) {
							const dispose = () => {
								if (this.form.HisPhone) {
									this.handleUpdateAndBind();
								} else {
									this.handleBindHis();
								}
							};
							setLocation(this.distance)
								.then(dispose)
								.catch(dispose);
						}
					}
				});
			}
		},
		/**
		 * 医院数据认证
		 */
		handleHisAuth() {
			this.$toast.loading('正在查询...');
			CertificationApi.AuthenticationHis(this.form)
				.then(response => this.disposeResponse(response, true))
				.finally(this.$toast.clear);
		},
		/**
		 * 绑定医院
		 */
		handleBindHis() {
			this.$toast.loading('正在绑定...');
			CertificationApi.BindHis(this.form)
				.then(this.disposeResponse)
				.finally(this.$toast.clear);
		},
		/**
		 * 更新医院数据并绑定
		 */
		handleUpdateAndBind() {
			this.$toast.loading('正在更新手机号...');
			CertificationApi.UpdateHisPhoneAndBind(this.form.Code)
				.then(this.disposeResponse)
				.finally(this.$toast.clear);
		},
		/**
		 * 结果处理
		 * @param response
		 * @param isAuth 是否为身份验证结果
		 */
		disposeResponse(response, isAuth) {
			if (
				response.Code === 0 ||
				response.Code === 600011 ||
				response.Code === 600012
			) {
				this.step += 1;
				this.scrollTop(0);
				this.successMessage = response.Message;
				if (isAuth) {
					this.isHisArchiving = true;
					removeSession(types.FROM_BINDING);
					this.captchaVersion = Math.random();
				}
				if (response.Code === 600011) {
					this.isAutoSignIn = true;
				}
			}
			// 医院无档案
			else if (response.Code === 600004) {
				if (isAuth) {
					this.isHisArchiving = false;
					this.step += 1;
					this.scrollTop(0);
					this.captchaVersion = Math.random();
				} else {
					setSession(
						types.FROM_BINDING,
						JSON.stringify({
							is_bind: !this.isHisArchiving,
							form: this.form
						})
					);
					// 需要进入自主建档界面
					this.$router.push({
						path: '/mother/archiving',
						query: {
							[types.FROM_BINDING]: null
						}
					});
				}
			} else {
				Dialog.alert({
					title: '系统提示',
					message: response.Message,
					confirmButtonText: '确定'
				})
					.then(() => {
						// 预留手机号不一致
						if (response.Code === 600006) {
							// 获取医院预留手机号
							CertificationApi.GetBindHisRedisData().then(res => {
								if (res.Code === 0) {
									this.form.HisPhone = res.Body.HisPhone;
									this.form.Captcha = null;
									this.form.Code = null;
									this.captchaVersion = Math.random();
									this.initInterval();
								}
							});
						}
						// 验证码过期
						else if (response.Code === 600008) {
							this.captchaVersion = Math.random();
						} else if (response.Code === 110003) {
							this.$router.push({ path: '/home' });
						}
					})
					.catch(() => {
						this.$toast.fail('用户取消');
					});
			}
		},
		/**
		 * 刷新图形验证码
		 */
		handleRefreshCaptcha() {
			this.form.Captcha = null;
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
						Answer: encodeURI(this.form.Captcha)
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
		 */
		handleSendSMS() {
			this.$toast.loading('发送中...');
			if (this.form.HisPhone) {
				CertificationApi.SendHisSMS(this.form.Captcha)
					.then(response => {
						if (response.Code === 0 && response.Body) {
							this.startInterval();
							this.$toast.success(response.Message);
						} else if (response.Code === 600008) {
							// 发送短信时，图片验证码过期
							this.form.Captcha = null;
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
			} else {
				ValidateCodeApi.SendSMS({
					Phone: this.form.Phone,
					Answer: this.form.Captcha,
					UserName: this.form.Name
				})
					.then(response => {
						if (response.Code === 0 && response.Body) {
							this.startInterval();
							this.$toast.success(response.Message);
						}
						// 图片验证码过期
						else if (response.Code === 600008) {
							this.form.Captcha = null;
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
			}
		},
		/**
		 * 回到顶部
		 */
		scrollTop(distance) {
			this.$refs.body.scroll({
				top: distance,
				behavior: 'smooth'
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';
@inner-prefix: ~'@{prefix-mother}-binding';
.@{inner-prefix} {
	height: 100%;
	background-color: @background-color-container;
	.van-steps {
		.van-step__title {
			font-size: 14px;
		}
		.van-step__icon {
			font-size: 14px;
		}
		.van-step--horizontal:last-child .van-step__circle-container {
			right: -0.3286rem;
			left: auto;
			width: 1rem;
		}
		.van-step--horizontal:first-child .van-step__circle-container {
			padding-left: 1.5rem;
			left: 0rem;
		}
	}
	&-body {
		height: calc(100% - 107px);
		overflow: auto;
	}

	&-form {
		margin: 10px;
		border-radius: 5px;
		padding: 15px;
		background-color: white;

		.van-cell-group {
			&::after {
				border: unset;
			}
			> span {
				> .van-cell {
					border-bottom: 1px solid #f2f2f2;
				}
			}
		}
		&-footer {
			padding: 1.8rem 0 0.5rem 0;
			.van-cell__title,
			.van-cell__value {
				text-align: center;
				overflow: unset;

				button {
					height: 40px;
					width: 90%;
					font-size: 16px;
					border: unset;
					border-radius: 5px;
				}
			}
			.van-cell__title {
				button {
					color: #666666;
					background-color: #f2f2f2;
					box-shadow: @box-shadow;
				}
			}
			.van-cell__value {
				button {
					color: white;
					background-color: @next-button-color;
					box-shadow: -1px 1.5px 3px rgba(0, 0, 0, 0.16);
				}
			}
		}
		&-captcha {
			vertical-align: middle;
		}
	}
}
</style>
