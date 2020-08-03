<template>
	<van-popup :class="classRoot" v-model="show" closeable>
		<template v-if="step === 0">
			<div :class="`${classRoot}-not`">
				<div :class="`${classRoot}-not-date`">
					检查时间：{{ new Date().format('yyyy-MM-dd') }}
				</div>
				<div :class="`${classRoot}-not-scan`" :style="{ color: scanColor }">
					<svg-icon
						:value="
							this.mode === 'mother'
								? 'icon-SignIn_scan'
								: 'icon-babySignIn_scan'
						"
						@click="handleScan"
					/>
					<template v-if="TipConfigs">
						{{ TipConfigs.filter(m => m['type'] === 1303)[0]['text'] }}
					</template>
				</div>
				<van-field
					v-model="input"
					center
					clearable
					:error-message="errorMessage"
					:placeholder="
						TipConfigs
							? TipConfigs.filter(m => m['type'] === 1303)[0]['text']
							: '请输入'
					"
				>
					<van-button
						slot="button"
						size="small"
						type="info"
						:disabled="!input"
						:class="`${classRoot}-button`"
						@click="handleSubmit"
						:style="{ background: btColor }"
					>
						手动签到
					</van-button>
				</van-field>
				<div :class="`${classRoot}-not-intro`">
					<svg-icon value="icon-SignIn_notice" />
					{{
						TipConfigs
							? TipConfigs.filter(m => m['type'] === 1305)[0]['text']
							: ''
					}}
				</div>
			</div>
		</template>
		<template v-else-if="step === 2">
			<div :class="`${classRoot}-success`">
				<div :class="`${classRoot}-success-depend`">已签到</div>
				<svg-icon value="icon-SignIn_Wait" :size="7.5" />
				<h3 v-if="TipConfigs">
					{{ TipConfigs.filter(m => m['type'] === 1306)[0]['text'] }}
				</h3>
			</div>
		</template>
		<hint
			v-else-if="step === 1"
			:icon="
				this.mode === 'mother'
					? 'icon-SignIn_Success'
					: 'icon-babySignIn_Success'
			"
			message="签到成功"
			color="#333333"
		/>
		<hint
			v-else-if="step === 3"
			:icon="
				this.mode === 'mother'
					? 'icon-SignIn_MissingLocation'
					: 'icon-babySignIn_MissingLocation'
			"
			message="当前位置不能签到"
			color="#333333"
			:intro="
				locationError ? locationError : '距离医院200米范围内才能签到成功哟！'
			"
		/>
	</van-popup>
</template>
<script>
import { Dialog } from 'vant';
import { mapState } from 'vuex';
import types from '../../../commons/types';
import * as TipConfigsApi from '../../../apis/TipConfigsApi';
import { OpenCamera, getDistance, setLocation } from '../../../commons/weixin';
import * as BespeakApi from '../../../apis/BespeakApi';
import { disposeResult } from '../../../commons';

export default {
	name: 'sign-in',
	data() {
		return {
			show: false,
			TipConfigs: null, // 提示数组
			distance: null, // 定位数据
			uuidInterval: null, // 定位定时器
			step: 0, // 0 未签到 1 签到成功 2 已签到 3 位置不到
			input: null,
			errorMessage: null,
			locationError: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		},
		...mapState({
			mode: state => state[types.MODE]
		}),
		type() {
			return this.mode === 'mother' ? 1 : 2;
		},
		scanColor() {
			if (this.mode === 'mother') {
				return '#ee8ca1';
			}
			return '#F190BE';
		},
		btColor() {
			if (this.mode === 'mother') {
				return '#f59fb0';
			}
			return '#FFB1D6';
		}
	},
	watch: {
		show(newValue) {
			if (!newValue) {
				clearInterval(this.uuidInterval);
				this.uuidInterval = null;
			}
		}
	},
	created() {
		this.onRefresh();
	},
	methods: {
		/**
		 * 签到
		 */
		handleSubmit() {
			this.$toast.loading('正在查询...');
			BespeakApi.IsUserCardNo(this.type, this.input)
				.then(response => {
					// 当Code===0时，提示Message内容，用户点击确定后进行签到操作
					if (response.Code === 0) {
						Dialog.confirm({
							title: '系统提示',
							message: response.Message
						})
							.then(this.handleSignIn)
							.catch(() => {
								this.$toast.fail('用户取消');
							});
					} else {
						this.errorMessage = response.Message;
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 签到
		 * @param noneError 显示错误
		 */
		handleSignIn(noneError = false) {
			this.$toast.loading('正在签到...');
			setLocation(this.distance)
				.catch(r => r)
				.finally(() => {
					BespeakApi.SignIn({
						Type: this.type,
						Number: this.input
					})
						.then(response => {
							this.disposeResult(response, noneError);
						})
						.finally(this.$toast.clear);
				});
		},
		/**
		 * 结果处理
		 * @param response
		 * @param auto
		 */
		disposeResult(response, auto) {
			if (response.Code === 3) {
				this.locationError = response.Message;
				// 位置不到
				this.step = 3;
			} else if (response.Code === 0) {
				// 签到成功
				this.step = auto ? 1 : 2;
			} else {
				this.step = 0;
				this.errorMessage = auto ? '' : response.Message;
			}
		},
		/**
		 * 扫码
		 */
		handleScan() {
			OpenCamera()
				.then(response => {
					if (response.Code === 0) {
						this.input = response.Body;
						this.errorMessage = null;
					} else {
						this.errorMessage = response.Message;
					}
				})
				.catch(() => {
					this.$toast.fail('用户取消');
				});
		},
		/**
		 * 开关
		 */
		handleToggle() {
			this.show = !this.show;
			if (this.show) {
				this.initData();
				this.onRefresh();
				this.handleSignIn(true);

				const disposeDistance = () => {
					getDistance().then(distance => {
						this.distance = distance;
					});
				};
				disposeDistance();
				this.uuidInterval = setInterval(disposeDistance, 3000);
			}
		},
		/**
		 * 初始化数据
		 */
		initData() {
			this.step = 0;
			this.input = null;
			this.errorMessage = null;
			this.locationError = null;
		},
		/**
		 * 刷新
		 */
		onRefresh() {
			TipConfigsApi.GetByTipVals([1303, 1304, 1305, 1306, 1307])
				.then(response => {
					disposeResult({
						$vm: this,
						key: 'TipConfigs',
						response,
						parser: data => {
							return data.map(item => {
								return { type: item.TipVal, text: item.TipConent };
							});
						}
					});
				})
				.finally();
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';
@inner-prefix: ~'@{prefix}-sign-in';
.@{inner-prefix} {
	width: calc(95% - 40px);
	min-height: 200px;
	border-radius: 5px;
	padding: 10px 20px;

	&-button {
		color: white;
		border: unset;
	}

	&-not {
		padding-bottom: 20px;

		&-date {
			line-height: 2.5rem;
			color: @font-color;
		}

		&-scan {
			line-height: 2.5rem;
			font-size: 1.1rem;

			svg {
				position: relative;
				bottom: 0.1rem;
				margin-right: 2px;
				vertical-align: middle;
			}
		}
		&-intro {
			margin-top: 20px;
			line-height: 25px;
			font-size: 13px;
			svg {
				vertical-align: middle;
			}
		}

		.van-field {
			margin-top: 5px;
			background-color: @background-color-container;
		}
	}
	&-success {
		text-align: center;
		padding-top: 20px;

		&-depend {
			position: absolute;
			top: 15px;
			left: -40px;
			font-size: 1.2rem;
			width: 150px;
			line-height: 40px;
			color: white;
			transform: rotate(-45deg);
			background-color: #3eb45d;
			box-shadow: 0 0 5px #3eb45d;
		}
	}
}
</style>
