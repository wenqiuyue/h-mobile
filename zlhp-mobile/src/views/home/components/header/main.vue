<template>
	<div :class="classRoot" :style="{ background: headerBg }">
		<div :class="`${classRoot}-top`">
			<div @click="isChangeSite ? $emit('onChangeSite') : ''">
				<svg-icon value="icon-home_Hospital" :size="1.5" />
				{{ hospitalName }}
				<svg-icon
					v-if="isChangeSite"
					value="icon-home_BlackSwitching"
					:size="0.75"
				/>
			</div>
			<div @click="$emit('onQRCode')">
				<svg-icon value="icon-home_QRcode" />
				我的二维码
			</div>
		</div>
		<div :class="`${classRoot}-info`" v-if="userName !== '未建档'">
			<div
				:class="
					`${classRoot}-info-background ${
						mode === 'mother' ? '' : 'children_circle_background'
					}`
				"
			>
				<ul>
					<li v-for="index in 7" :key="index" />
				</ul>
			</div>
			<div :class="`${classRoot}-info-avatar`">
				<svg-icon :value="avatarIcon" :size="7.5" />
				<img :src="avatar" />
			</div>
			<div
				:class="`${classRoot}-info-footer`"
				:style="{ background: footerBg, border: footerBorder }"
			>
				<svg-icon value="icon-home_BabyDecoration1" :size="4" />
				<van-notice-bar :speed="25" :text="countDownTitle">
					<span v-if="countDown > 0">
						{{ countDownTitle }}
						<van-count-down :time="countDown">
							<template v-slot="timeData">
								<span>{{ timeData.days }} </span>天
								<span>{{ timeData.hours }} </span>:
								<span>{{ timeData.minutes }} </span>:
								<span>{{ timeData.seconds }} </span>
							</template>
						</van-count-down>
					</span>
					<span v-else>{{ mode === 'mother' ? '待预约产检' : '' }}</span>
				</van-notice-bar>
			</div>
			<div :class="`${classRoot}-info-text`">
				<div :class="`${classRoot}-info-text-title`">
					哈喽，{{ userName }}
					<svg-icon
						value="icon-switch_PinkPurple"
						:size="1.2"
						@click="handleChange"
					/>
				</div>
				<div
					:class="`${classRoot}-info-text-subtitle`"
					v-if="typeof userInfo === 'string'"
				>
					{{ userInfo }}
				</div>
				<template v-else>
					<div
						:class="`${classRoot}-info-text-subtitle`"
						v-for="(item, index) in userInfo"
						:key="index"
					>
						{{ item }}
					</div>
				</template>
			</div>
			<img :class="`${classRoot}-info-tree`" :src="treeImg" />
		</div>
		<div :class="`${classRoot}-info`" v-else>
			<div
				:class="
					`${classRoot}-info-background ${
						mode === 'mother' ? '' : 'children_circle_background'
					}`
				"
			>
				<ul>
					<li v-for="index in 7" :key="index" />
				</ul>
				<div :class="`${classRoot}-info-no-file`">
					<div class="no-file"></div>
					<svg-icon value="icon-NoFiles" :size="4.2" />
				</div>
				<div :class="`${classRoot}-info-no-text`">暂无档案信息</div>
				<div :class="`${classRoot}-info-no-button`">
					<van-button
						type="info"
						:class="
							this.mode === 'mother' ? 'mother_button' : 'children_button'
						"
						round
						@click="addFile"
						>{{
							`十 添加${this.mode === 'mother' ? '孕产' : '儿童'}档案`
						}}</van-button
					>
				</div>
				<div :class="`${classRoot}-info-no-tips`">
					已在医院建档，一键<label @click="relation">快速关联</label>
				</div>
			</div>
		</div>
		<div :class="`${classRoot}-separator`">
			<svg-icon
				v-for="index in 26"
				:key="index"
				value="icon-home_ClipDecoration"
				:size="0.8"
			/>
		</div>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import types from '../../../../commons/types';
import { getSession } from '../../../../commons/session';

const treeImg = require('../../../../assets/tree.gif');

export default {
	name: 'home-header',
	data() {
		return {
			treeImg
		};
	},
	props: {
		// 头像
		avatar: { type: String, default: null },
		// 用户名
		userName: { type: String, default: null },
		// 医院名
		hospitalName: { type: String, default: null },
		// 倒计时
		countDown: { type: Number, default: null },
		// 倒计时标题
		countDownTitle: { type: String, default: null },
		// 详情数据
		userInfo: { type: [String, Array], default: null },
		// 头部颜色
		headerBg: { type: String, default: '#ffdddf' },
		footerBg: { type: String, default: 'rgba(238, 140, 161, 1)' },
		footerBorder: { type: String, default: '1px solid rgba(255, 204, 209, 1)' },
		// 头像icon
		avatarIcon: { type: String, default: null }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		},
		...mapState({
			mode: state => state[types.MODE]
		}),
		isChangeSite() {
			const fromSite = getSession(types.FROMSITE);
			if (this.$route.query.fromSite || fromSite) {
				return false;
			}
			return true;
		}
	},
	methods: {
		/**
		 * 快速关联
		 */
		relation() {
			this.$router.push({
				path: `/${this.mode}/binding`
			});
		},
		/**
		 * 添加档案
		 */
		addFile() {
			this.$router.push({
				path: `/${this.mode}/binding`,
				query: { archiving: true }
			});
		},
		/**
		 * 切换档案
		 */
		handleChange() {
			if (this.mode === 'mother') {
				this.$router.push({ path: `/archive/list` });
			} else {
				this.$router.push({ path: `/${this.mode}/archive/list` });
			}
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';
@inner-prefix: ~'@{prefix}-home-header';
.@{inner-prefix} {
	position: relative;
	height: 19rem;
	z-index: 1;
	&-top {
		padding: 7px 12px 0 15px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		div:last-child {
			font-size: 12px;
		}
	}
	&-separator {
		z-index: 0;
		position: absolute;
		bottom: -0.4rem;
		width: 100%;
		height: 0.8rem;
		display: flex;

		svg {
			flex-basis: 100% / 26;
		}
	}

	&-info {
		position: relative;
		height: 184px;
		padding: 10px;
		margin-top: 5px;

		&-text {
			z-index: 1;
			position: absolute;
			top: 40px;
			left: 120px;

			&-title {
				font-size: 17px;
				font-family: Source Han Sans CN;
				font-weight: 550;
				line-height: 22px;
				color: rgba(121, 85, 72, 1);
				padding-bottom: 3px;
			}

			&-subtitle {
				font-size: 14px;
				font-family: Source Han Sans CN;
				font-weight: 400;
				line-height: 16px;
				color: rgba(154, 126, 117, 1);
				margin-top: 7px;
			}
		}

		&-tree {
			z-index: 1;
			position: absolute;
			bottom: 0;
			right: 0;
			height: 60px;
		}

		&-footer {
			z-index: 1;
			position: absolute;
			left: 50px;
			bottom: 20px;
			height: 28px;
			line-height: 28px;
			padding-left: 30px;
			color: white;
			width: 240px;
			font-size: 13px;
			border-radius: 10px;

			.van-notice-bar {
				z-index: 2;
				height: 28px;
				line-height: 28px;
				background-color: unset;
				color: white;

				.van-count-down {
					display: inline-block;
					line-height: 28px;
					z-index: 2;
					color: white;
				}
			}

			svg {
				position: absolute;
				left: -16px;
				bottom: -2px;
			}
		}

		&-avatar {
			z-index: 1;
			position: absolute;
			left: 10px;
			top: -3px;

			img {
				position: absolute;
				left: 24px;
				bottom: -10px;
				width: 68px;
				height: 68px;
				border-radius: 50%;
				border: 2px solid rgba(248, 205, 200, 1);
			}
		}

		&-background {
			z-index: 0;
			position: absolute;
			width: calc(100% - 20px);
			height: calc(100% - 20px);
			background: rgba(243, 240, 240, 1);
			box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.16);
			border-radius: 6px;

			ul {
				padding-left: 22px;
				padding-right: 2px;
				li {
					position: relative;
					height: 1.6rem;
					border-bottom: 1px solid #e1dede;

					&:not(:first-child) {
						&:before {
							position: absolute;
							top: 5px;
							left: -18px;
							content: '';
							border-radius: 50%;
							border: 6px solid @main-color;
						}
					}
				}
			}
		}
		.children_circle_background {
			ul {
				li {
					&:not(:first-child) {
						&:before {
							border: 6px solid @van-nav-bar-background-children;
						}
					}
				}
			}
		}
		&-no-file {
			z-index: 1;
			position: absolute;
			left: 146px;
			top: 5px;
		}
		&-no-text {
			z-index: 1;
			top: 75px;
			position: absolute;
			left: 136px;
			font-size: 13px;
			color: #333333;
		}
		&-no-button {
			position: absolute;
			bottom: 40px;
			left: 68px;
			button {
				font-size: 14px;
				padding: 0 58px;
			}
			.mother_button {
				background: @next-button-color;
				border: @next-button-color;
			}
			.children_button {
				background: @next-button-color-children;
				border: @next-button-color-children;
			}
		}
		&-no-tips {
			position: absolute;
			bottom: 13px;
			left: 90px;
			font-size: 13px;
			color: #555555;
			label {
				color: #ee8ca1;
			}
		}
	}

	.van-cell {
		background-color: unset;

		&::after {
			border: unset;
		}

		&__title {
			line-height: 1.5rem;
			position: relative;
			padding-left: 1.75rem;
			padding-right: 0.25rem;
			color: @font-color;

			svg:first-child {
				position: absolute;
				left: 0;
			}
		}
		&__value {
			line-height: 1.5rem;
			color: @font-color;
			font-size: 12px;

			svg {
				position: relative;
				top: 2px;
				margin-right: 2px;
			}
		}
	}
}
</style>
