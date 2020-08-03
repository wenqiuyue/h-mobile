<template>
	<div :class="classRoot">
		<div :class="`${classRoot}-top-panel`">
			<div class="top" v-if="userName !== '未建档'">
				<div class="info-avatar">
					<svg-icon :value="avatarIcon" :size="7.5" />
					<van-image class="img" fit="cover" round :src="avatar" />
				</div>
				<div class="info-text">
					<div class="title" @click="handleChange">
						<span>{{ userName }}</span>
						<svg-icon value="icon-home_RightArrow" :size="0.7" />
					</div>
					<div class="subtitle" v-if="typeof userInfo === 'string'">
						{{ userInfo }}
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
						<span class="week_info" v-if="mode === 'mother'"
							><label
								>{{
									getGestationalWeek(data.MenstrualHistories.LastMenstrualDate)
								}}<sup
									>+{{
										getGestationalDay(data.MenstrualHistories.LastMenstrualDate)
									}}</sup
								></label
							>
							周</span
						>
						<span class="week_info" v-else>{{
							getAgeByBirthDate(data.BirthDate)
						}}</span>
						<span class="check_title">{{ countDownTitle }}倒计时</span>
					</div>
					<div class="count_down_time">
						<van-count-down
							:time="
								data.NextCheckTime
									? new Date(data.NextCheckTime).getTime() -
									  new Date().getTime()
									: 0
							"
							class="down_time"
						>
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
						<div class="check_time" v-if="data.NextArchivePlanRecord">
							{{
								`${countDownTitle}时间：${new Date(
									data.NextArchivePlanRecord.PlanTime
								).format('yyyy-MM-dd')}`
							}}
						</div>
						<div class="check_time" v-else>
							您还没有{{ countDownTitle }}计划
						</div>
					</div>
					<svg-icon
						v-if="data.NextArchivePlanRecord"
						value="icon-home_RightArrow"
						@click="handleCountDown"
					/>
				</div>
			</div>
			<div class="top_info" v-else>
				<div class="info">
					<div class="no-file">
						<svg-icon value="icon-NoFiles" :size="4.2" />
					</div>
					<div class="no-text">暂无档案信息</div>
					<div class="no-button">
						<van-button
							type="info"
							:class="mode === 'mother' ? 'mother_button' : 'child_button'"
							round
							@click="addFile"
							>{{
								`十 添加${this.mode === 'mother' ? '孕产' : '儿童'}档案`
							}}</van-button
						>
					</div>
					<div class="no-tips">
						已在医院建档，一键<label @click="relation">快速关联</label>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import types from '../../../../commons/types';
import {
	// eslint-disable-next-line no-unused-vars
	getGestationalWeek,
	getGestationalDay,
	getAgeByBirthDate
} from '../../../../commons';
// import { setLocal } from '../../../../commons/local';

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
		avatarIcon: { type: String, default: null },
		data: { type: Object, default: null }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		},
		...mapState({
			mode: state => state[types.MODE]
		})
	},
	methods: {
		getGestationalWeek,
		getGestationalDay,
		getAgeByBirthDate,
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
		 * 点击产检倒计时
		 */
		handleCountDown() {
			this.$router.push({
				path: `/mother/production-inspection-plan`,
				query: this.data.NextArchivePlanRecord
					? {
							archive_plan_record_id: this.data.NextArchivePlanRecord
								.ArchivePlanRecordID
					  }
					: ''
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
@import '../../../../style/variable';

@inner-prefix: ~'@{prefix}-header-wite';
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
					display: flex;
					align-items: center;
					svg {
						margin-left: 4px;
					}
				}
				.subtitle {
					font-size: 14px;
					font-family: Source Han Sans CN;
					font-weight: 400;
					line-height: 22px;
					color: rgba(154, 126, 117, 1);
					margin-top: 7px;
					width: 190px;
				}
			}
			.count_down {
				padding: 18px 8px 17px 14px;
				background: #fafafa;
				margin-top: 120px;
				display: flex;
				flex-direction: row;
				align-items: center;
				border-radius: 5px;
				.week {
					display: flex;
					flex-direction: column;
					.week_info {
						text-align: center;
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
					padding: 0 25px 0 20px;
					display: flex;
					flex-direction: column;
					align-items: center;
					.down_time {
						display: flex;
						flex-direction: row;
						align-items: center;
						.day {
							background: #ffffff;
							color: #f25b55;
							font-size: 18px;
							border: 3px solid #fed3dd;
							min-width: 25px;
							max-width: 35px;
							height: 25px;
							display: inline-block;
							text-align: center;
							border-radius: 3px;
							line-height: 25px;
							padding-right: 2px;
						}
						.day_text {
							color: #000000;
							font-size: 12px;
							margin: 0 6px;
						}
						.time {
							background: #fed3dd;
							color: #ffffff;
							width: 98px;
							height: 31px;
							display: flex;
							flex-direction: row;
							align-items: center;
							justify-content: center;
							border-radius: 3px;
							.hour {
								display: block;
								background: #ffffff;
								color: #333333;
								font-size: 14px;
								text-align: center;
								width: 25px;
								height: 25px;
								border-radius: 3px;
								line-height: 25px;
							}
							label {
								margin: 0 2px;
								font-weight: bold;
							}
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
		.top_info {
			height: 184px;
			padding: 20px 15px 23px 15px;
			margin-top: 5px;
			.info {
				background: #fafafa;
				text-align: center;
				padding: 12px;
				.no-file {
				}
				.no-text {
					margin-top: 10px;
					font-size: 14px;
					color: #888888;
				}
				.no-button {
					margin-top: 10px;
					button {
						font-size: 14px;
						padding: 0 58px;
						box-shadow: 1px 1px 2px rgba(252, 160, 169, 1);
					}
					.mother_button {
						background: linear-gradient(
							126deg,
							rgba(252, 160, 169, 1) 0%,
							rgba(238, 140, 161, 1) 100%
						);
						border: none;
					}
					.child_button {
						background: @next-button-color-children;
						border: none;
					}
				}
				.no-tips {
					margin-top: 13px;
					font-size: 13px;
					color: #999999;
					label {
						color: #ee8ca1;
					}
				}
			}
		}
	}
}
</style>
