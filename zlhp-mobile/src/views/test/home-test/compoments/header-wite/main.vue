<template>
	<div :class="classRoot">
		<div :class="`${classRoot}-top-panel`">
			<div class="top">
				<div class="info-avatar">
					<svg-icon :value="avatarIcon" :size="7.5" />
					<van-image class="img" fit="cover" round :src="avatar" />
				</div>
				<div class="info-text">
					<div class="title">哈喽,{{ userName }}</div>
					<div class="subtitle" v-if="true">
						您已怀孕131天，18周6天 距离预产期还有129天
					</div>
					<template v-else>
						<div
							class="subtitle"
							v-for="(item, index) in userInfo"
							:key="index"
						>
							{{ item }}
						</div>
					</template>
				</div>
				<div class="count_down">
					<div class="week">
						<span class="week_info"
							><label>12<sup>+6</sup></label> 周</span
						>
						<span class="check_title">{{ countDownTitle }}倒计时</span>
					</div>
					<div class="count_down_time">
						<van-count-down :time="countDown">
							<template v-slot="timeData">
								<span class="day">{{ timeData.days }}</span
								><label class="day_text">天</label>
								<span class="time">
									<span class="hour">{{ timeData.hours }}</span>
									<label>:</label
									><span class="hour">{{ timeData.minutes }}</span
									><label>:</label
									><span class="hour">{{ timeData.seconds }}</span>
								</span>
							</template>
						</van-count-down>
						<div class="check_time">{{ countDownTitle }}时间：2020-04-13</div>
					</div>
					<svg-icon value="icon-home_RightArrow" />
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'header-wite',
	data() {
		return {};
	},
	props: {
		// 头像
		avatar: { type: String, default: null },
		// 用户名
		userName: { type: String, default: null },
		// 倒计时
		countDown: { type: Number, default: null },
		// 倒计时标题
		countDownTitle: { type: String, default: null },
		// 详情数据
		userInfo: { type: [String, Array], default: null },
		// 头像icon
		avatarIcon: { type: String, default: null }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	}
};
</script>
<style lang="less">
@import '../../../../../style/variable';

@inner-prefix: ~'@{prefix-mother}-header-wite';
.@{inner-prefix} {
	&-top-panel {
		left: 10px;
		right: 10px;
		width: calc(100%-20px);
		border-radius: 10px 10px 0 0;
		position: absolute;
		top: 65px;
		background: #ffffff;
		.top {
			padding: 0 15px 15px 15px;
			.info-avatar {
				z-index: 1;
				position: absolute;
				left: 5px;
				top: -18px;
				.img {
					position: absolute;
					left: 24px;
					bottom: -10px;
					width: 68px;
					height: 68px;
					border: 2px solid rgba(248, 205, 200, 1);
				}
			}
			.info-text {
				z-index: 1;
				position: absolute;
				top: 27px;
				left: 115px;
				.title {
					font-size: 17px;
					font-family: Source Han Sans CN;
					line-height: 22px;
					color: #674539;
					padding-bottom: 3px;
				}
				.subtitle {
					font-size: 14px;
					font-family: Source Han Sans CN;
					font-weight: 400;
					line-height: 22px;
					color: rgba(154, 126, 117, 1);
					margin-top: 7px;
					width: 169px;
				}
			}
			.count_down {
				padding: 18px 8px 17px 14px;
				background: #fafafa;
				margin-top: 120px;
				display: flex;
				flex-direction: row;
				align-items: center;
				.week {
					display: flex;
					flex-direction: column;
					.week_info {
						font-size: 14px;
						color: #ff6263;
						sup {
							font-size: 14px;
						}
						label {
							font-size: 24px;
						}
					}
					.check_title {
						font-size: 14px;
						color: #795548;
						margin-top: 7px;
					}
					border-right: 3px solid #ffffff;
					padding-right: 14px;
				}
				.count_down_time {
					padding: 0 35px 0 20px;
					display: flex;
					flex-direction: column;
					align-items: center;
					.day {
						background: #ffffff;
						color: #f25b55;
						font-size: 18px;
						border: 3px solid #fed3dd;
						width: 20px;
						height: 20px;
						display: inline-block;
						text-align: center;
					}
					.day_text {
						color: #000000;
						font-size: 12px;
						margin: 0 6px;
					}
					.time {
						background: #fed3dd;
						padding: 3px;
						color: #ffffff;
						.hour {
							background: #ffffff;
							color: #333333;
							font-size: 14px;
							width: 20px;
							height: 20px;
							display: inline-block;
							text-align: center;
						}
						label {
							margin: 0 2px;
							font-weight: bold;
						}
					}
					.check_time {
						font-size: 12px;
						color: #9a7e75;
						margin-top: 11px;
					}
				}
			}
		}
	}
}
</style>
