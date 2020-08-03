<template>
	<div :class="classRoot">
		<van-nav-bar
			:title="isArchiving ? '儿童建档' : '实名认证'"
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
					<van-divider content-position="left">儿童信息</van-divider>
					<van-cell-group>
						<ValidationProvider
							rules="required|name"
							name="姓名"
							v-slot="{ errors }"
						>
							<van-field
								v-model="form.ChildrenName"
								required
								label="姓名"
								placeholder="请输入姓名"
								:error-message="errors.join('')"
							/>
						</ValidationProvider>
						<ValidationProvider>
							<combobox
								label="证件类型"
								v-model="form.ChildrenIdType"
								:options="
									options.ChildrenIdType
										? options.ChildrenIdType.filter(
												m =>
													m['value'] === 1 ||
													m['value'] === 6 ||
													m['value'] === 7
										  )
										: null
								"
							/>
						</ValidationProvider>
						<ValidationProvider
							:rules="{
								idCard: form.ChildrenIdType === 1
							}"
							name="证件号"
							v-slot="{ errors }"
						>
							<van-field
								v-model="form.ChildrenIdNumber"
								label="证件号"
								placeholder="请输入证件号"
								:error-message="errors.join('')"
							/>
						</ValidationProvider>
					</van-cell-group>
					<van-divider content-position="left">监护人信息</van-divider>
					<van-cell-group>
						<ValidationProvider
							rules="required"
							name="关系"
							v-slot="{ errors }"
						>
							<combobox
								label="关系"
								required
								un-null
								v-model="form.ContactRelation"
								:error-message="errors.join('')"
								:options="
									options.RelationType
										? options.RelationType.filter(m => m['value'] !== 0)
										: null
								"
							/>
						</ValidationProvider>
						<ValidationProvider
							rules="required"
							name="证件类型"
							v-slot="{ errors }"
						>
							<combobox
								label="证件类型"
								required
								un-null
								v-model="form.ContactIdType"
								:error-message="errors.join('')"
								:options="
									options.ChildrenIdType
										? options.ChildrenIdType.filter(
												m =>
													m['value'] === 1 ||
													m['value'] === 6 ||
													m['value'] === 7
										  )
										: null
								"
							/>
						</ValidationProvider>
						<ValidationProvider
							:rules="{
								required: true,
								idCard: form.ContactIdType === 1
							}"
							name="证件号"
							v-slot="{ errors }"
						>
							<van-field
								v-model="form.ContactIdNumber"
								label="证件号"
								required
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
									slot="right-icon"
									size="small"
									type="info"
									color="#FFC2D3"
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
					icon="icon-babySuccess_Green"
					:message="successMessage"
				/>
				<!-- 第四步-->
				<hint
					v-show="step === 3"
					icon="icon-babySuccess_Green"
					:message="successMessage"
					:size="7"
				/>
				<!-- 按钮 -->
				<van-cell :class="`${classRoot}-form-footer`">
					<van-button
						v-if="step !== 0 && step < 2"
						slot="title"
						size="small"
						@click="handlePrev"
						:disabled="step === 0"
					>
						上一步
					</van-button>
					<van-button
						size="small"
						type="info"
						@click="handleNext"
						class="button-next"
					>
						{{ step > 1 ? (isAutoSignIn ? '去签到' : '完成') : '下一步' }}
					</van-button>
				</van-cell>
			</div>
		</div>
	</div>
</template>
<script>
import _ from 'lodash';
import { Dialog } from 'vant';
import { getDistance, setLocation } from '../../../../commons/weixin';
import { has } from '../../../../tools';
import {
	getSession,
	setSession,
	removeSession
} from '../../../../commons/session';
import types from '../../../../commons/types';
import * as EnumApi from '../../../../apis/EnumApi';
import * as ValidateCodeApi from '../../../../apis/ValidateCodeApi';
import * as CertificationApi from '../../../../apis/CertificationApi';

export default {
	name: 'binding',
	data() {
		return {
			step: 0,
			uuidInterval: null, // 定位定时器
			distance: null,
			isHisArchiving: true, // 医院是否有档案
			isAutoSignIn: false, // 是否需要进入首页时自动弹出签到
			successMessage: null, // 成功消息
			form: {
				ChildrenName: null, // 儿童姓名
				ChildrenIdType: 1, // 儿童证件类型
				ChildrenIdNumber: null, // 儿童证件号
				ContactRelation: 1, // 联系人关系
				ContactIdType: 1, // 联系人证件类型
				ContactIdNumber: null, // 联系人证件号
				Phone: null, // 手机号
				Code: null, // 验证码
				HisPhone: null, // 预留手机号
				Captcha: '' // 验证码
			},
			options: {},
			captchaVersion: Math.random(), // 图形验证码版本控制
			captchaErrorMessage: null,
			smsInterval: null,
			smsCount: 0
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_CHILDREN}-${this.$options.name}`;
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
			const token = this.$store.state[types.TOKEN];
			const version = this.captchaVersion;
			return `/v1/ValidateCode/GetCaptcha?token=${token}&version=${version}`;
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
		EnumApi.GetList(
			['IdType', 'RelationType', 'ChildrenIdType', 'FirstFew'].map(
				m => `${m}Enum`
			)
		).then(response => {
			if (response.Code === 0) {
				_.forEach(response.Body, (item, key) => {
					this.$set(this.options, key, item);
				});
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
			if (cacheStr) {
				const fromData = JSON.parse(cacheStr);
				this.form.ChildrenName = fromData.form.ChildrenName;
				this.form.ChildrenIdType = fromData.form.ChildrenIdType;
				this.form.ChildrenIdNumber = fromData.form.ChildrenIdNumber;
				this.form.ContactRelation = fromData.form.ContactRelation;
				this.form.ContactIdType = fromData.form.ContactIdType;
				this.form.ContactIdNumber = fromData.form.ContactIdNumber;
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
					path: '/children/home',
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
				removeSession(types.FROM_BINDING);
				this.$router.push({
					path: '/children/home',
					query: this.isAutoSignIn
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
							setLocation(this.distance).finally(() => {
								if (!this.form.HisPhone) {
									this.handleBindHis();
								} else {
									this.handleUpdateAndBind();
								}
							});
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
			CertificationApi.ChildrenAuthenticationHis({
				...this.form,
				IsArchiving: this.isArchiving
			})
				.then(response => this.disposeResponse(response, true))
				.finally(this.$toast.clear);
		},
		/**
		 * 绑定医院
		 */
		handleBindHis() {
			this.$toast.loading('正在绑定...');
			CertificationApi.ChildrenBindHis({
				...this.form,
				IsArchiving: this.isArchiving
			})
				.then(this.disposeResponse)
				.finally(this.$toast.clear);
		},
		/**
		 * 更新医院数据并绑定
		 */
		handleUpdateAndBind() {
			this.$toast.loading('正在更新手机号...');
			CertificationApi.ChildrenUpdateHisPhoneAndBind(this.form.Code)
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
						path: '/children/archiving',
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
							CertificationApi.ChildrenGetBindHisRedisData().then(res => {
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
							this.$router.push({ path: '/children/home' });
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
			return new Promise(resolve => {
				this.initInterval();
				this.smsCount = 60;
				this.smsInterval = setInterval(() => {
					this.smsCount -= 1;
					if (this.smsCount <= 0) {
						this.initInterval();
					}
				}, 1000);
				resolve();
			});
		},
		/**
		 * 发送短信验证码
		 */
		handleSendSMS() {
			this.$toast.loading('发送中...');
			if (this.form.HisPhone) {
				CertificationApi.ChildrenSendHisSMS(this.form.Captcha).then(
					response => {
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
					}
				);
			} else {
				ValidateCodeApi.SendSMS({
					Phone: this.form.Phone,
					Answer: this.form.Captcha,
					UserName: this.form.ChildrenName,
					SystemType: 1
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
@inner-prefix: ~'@{prefix-children}-binding';
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
		padding: 5px;
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
			.van-cell__title,
			.van-cell__value {
				text-align: center;
				overflow: unset;

				button {
					height: 40px;
					width: 90%;
					font-size: 16px;
					border: unset;
					box-shadow: @box-shadow-children;
					border-radius: 5px;
					background-color: @back-button-color;
					color: #666666;
				}
			}
			.van-cell__value {
				.button-next {
					color: white;
					background-color: @next-button-color-children;
				}
			}
		}
		&-captcha {
			vertical-align: middle;
		}
	}
	.van-divider {
		&:before {
			max-width: 0;
		}
	}
}
</style>
