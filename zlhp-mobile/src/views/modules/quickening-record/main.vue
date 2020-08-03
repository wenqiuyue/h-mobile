<template>
	<div :class="classRoot">
		<van-nav-bar title="胎动记录" left-arrow @click-left="$router.back()" />
		<div :class="`${classRoot}-chart`">
			<canvas id="myChart" />
		</div>
		<van-dropdown-menu>
			<van-dropdown-item v-model="form.week" :options="optionWeek" />
			<van-dropdown-item v-model="form.day" :options="optionDay" />
		</van-dropdown-menu>
		<van-cell-group>
			<van-field
				:class="`${classRoot}-field`"
				label="12小时总数"
				label-align="center"
				v-model="count"
				input-align="right"
				disabled
			>
				<span slot="right-icon">次</span>
			</van-field>
			<!-- <van-cell title="孕周">
					<van-stepper v-model="week" input-width="50px" max="40" />
				</van-cell> -->
			<van-cell title="早" :class="`${classRoot}-input_num`">
				<van-stepper v-model="form.morning" :min="0" />
				<span class="num_text" slot="right-icon">次</span>
			</van-cell>
			<van-cell title="中" :class="`${classRoot}-input_num`">
				<van-stepper v-model="form.noon" :min="0" />
				<span class="num_text" slot="right-icon">次</span>
			</van-cell>
			<van-cell title="晚" :class="`${classRoot}-input_num`">
				<van-stepper v-model="form.night" :min="0" />
				<span class="num_text" slot="right-icon">次</span>
			</van-cell>
			<div :class="`${classRoot}-button-group`">
				<van-button @click="handleReset" class="cancel">清空</van-button>
				<van-button @click="handleSubmit" class="keep_button">保存</van-button>
			</div>
		</van-cell-group>
		<tips
			title="注意事项"
			icon="icon-sign_Tips"
			:size="1.4"
			:list="[
				'如何数胎动？准妈妈在妊娠28周以后，开始要每天计算胎动。',
				'孕妈妈选择舒适体位，每天早、中、晚在相对固定时间集 中精力数胎动。',
				'每时段各数1小时，将3小时胎动数相加后乘以 4，就是12小时胎动总数。',
				'如果为30次12小时为正常，&lt;20次 112小时说明胎动异常，&lt;10次/12小时说明胎儿宫内缺氧:或者胎动计数为3次，小时(胎动计数为6次12小时)为正常，&lt;3次小时(&lt;6次12小时)、胎动数比平时减少50%、胎动幅度明显减弱、或胎动频繁之后忽然减少均提示胎儿缺氧可能，应立即去医院。'
			]"
		/>
	</div>
</template>
<script>
import F2 from '@antv/f2/dist/f2-all.min';
import _ from 'lodash';
import { Dialog } from 'vant';
import * as FetalRecordsApi from '../../../apis/FetalRecordsApi';
import * as ArchiveApi from '../../../apis/ArchiveApi';
import { getGestationalWeek } from '../../../commons';

export default {
	name: 'quickening-record',
	data() {
		return {
			list: [],
			chart: null,
			Archive: null,
			form: {
				week: 1,
				day: 0,
				morning: 0,
				noon: 0,
				night: 0
			},
			optionWeek: (() => {
				const result = [];
				for (let i = 1; i <= 40; i += 1) {
					result.push({
						text: `${i}周`,
						value: i
					});
				}
				return result;
			})(),
			optionDay: (() => {
				const result = [];
				for (let i = 0; i < 7; i += 1) {
					result.push({
						text: `+ ${i + 1}天`,
						value: i
					});
				}
				return result;
			})()
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		},
		count() {
			return 4 * (this.form.morning + this.form.noon + this.form.night);
		},
		chartData() {
			return this.list.map(item => {
				return {
					type: '胎动次数',
					week: item.Week,
					day: item.Day,
					count: item.Week * 7 + item.Day,
					value: item.Total,
					morning: item.Morning,
					noon: item.Noon,
					night: item.Night
				};
			});
		}
	},
	created() {
		this.onRefresh();
	},
	methods: {
		/**
		 * 渲染图表
		 */
		renderChart() {
			if (this.chart) {
				this.chart.changeData(this.chartData);
			} else {
				// F2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。
				const chart = new F2.Chart({
					id: 'myChart',
					pixelRatio: window.devicePixelRatio
				});
				// 加载数据源
				chart.source(this.chartData, {
					count: {
						type: 'linear',
						// 滚动条包含几个
						min: 28 * 7,
						max: 29 * 7 - 1,
						alias: '孕周',
						formatter: text => {
							const week = Math.floor(text / 7);
							const day = Math.ceil(text % 7) + 1;
							return `${week}周+${day}天`;
						}
					},
					value: {
						formatter: text => `${text}次`
					}
				});
				chart.tooltip({
					alwaysShow: true,
					custom: true, // 自定义 tooltip 内容框
					onShow: obj => {
						const item = obj.items[0].origin;
						this.form.week = item.week;
						this.form.day = item.day;
						this.form.morning = item.morning;
						this.form.noon = item.noon;
						this.form.night = item.night;
					}, // tooltip 显示时的回调函数
					onChange: obj => {
						const legend = chart.get('legendController').legends.top[0];
						const tooltipItems = obj.items;
						const legendItems = legend.items;
						const map = {};
						legendItems.forEach(item => {
							map[item.name] = _.clone(item);
						});
						tooltipItems.forEach(item => {
							const { name } = item;
							const { value } = item;
							if (map[name]) {
								map[name].value = value;
							}
						});
						legend.setItems(_.values(map));
					}
				});
				// 画线
				chart
					.line()
					.position('count*value')
					.color('type');

				// 小圆点
				chart
					.point()
					.position('count*value')
					.style({
						lineWidth: 1,
						stroke: '#fff'
					});

				chart.interaction('pan');
				// 定义进度条
				chart.scrollBar({
					mode: 'x',
					xStyle: {
						offsetY: -5
					}
				});

				chart.render();
			}
		},
		/**
		 * 刷新
		 */
		onRefresh(init) {
			this.isLoading = true;
			this.$toast.loading('加载中...');
			const methods = [FetalRecordsApi.GetAll()];
			if (init) {
				methods.push(ArchiveApi.Current());
			}
			Promise.all(methods)
				.then(results => {
					if (results[0].Code === 0) {
						this.list = results[0].Body.sort((a, b) => {
							const aW = parseInt(a.Week, 0);
							const aD = parseInt(a.Day, 0);
							const bW = parseInt(b.Week, 0);
							const bD = parseInt(b.Day, 0);
							const aSort = aW * 10 + aD;
							const bSort = bW * 10 + bD;
							return aSort - bSort;
						});
						this.renderChart();
					}
					if (init && results[1].Code === 1) {
						this.Archive = results[1].Body;
						this.form.week = getGestationalWeek(
							this.Archive.MenstrualHistories.LastMenstrualDate
						);
					}
				})
				.finally(() => {
					this.$toast.clear();
					this.isLoading = false;
				});
		},
		/**
		 * 重置
		 */
		handleReset() {
			this.form.morning = 0;
			this.form.noon = 0;
			this.form.night = 0;
		},
		/**
		 * 提交
		 */
		handleSubmit() {
			if (this.form.week < 28) {
				Dialog.alert({
					title: '系统提示',
					message: '孕28周以后才可开始数胎动！'
				});
			} else {
				this.$toast.loading('正在保存...');
				FetalRecordsApi.Post({
					Week: this.form.week,
					Day: this.form.day,
					Morning: this.form.morning,
					Noon: this.form.noon,
					Night: this.form.night
				})
					.then(response => {
						if (response.Code === 0) {
							this.$toast.success(response.Message);
							this.onRefresh();
						}
					})
					.finally(this.$toast.clear);
			}
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';
@inner-prefix: ~'@{prefix-mother}-quickening-record';
.@{inner-prefix} {
	height: 100%;
	.van-pull-refresh {
		height: calc(100% - 46px);
		overflow: scroll;
		&__track {
			min-height: 100%;
		}
	}
	&-field {
		.van-cell__title {
			color: #333333;
		}
	}
	&-input_num {
		.van-cell__title {
			padding: 0 25px;
		}
		.van-stepper {
			margin-right: 10px;
		}
		.num_text {
			color: #969799;
		}
	}
	&-chart {
		canvas {
			width: 100%;
			background-color: white;
		}
	}

	&-button-group {
		line-height: 60px;
		text-align: center;

		button {
			width: 43%;
			box-shadow: @box-shadow;
			&:not(:first-child) {
				margin-left: 5%;
			}
		}
		.cancel {
			color: #666666 !important;
			background: @back-button-color;
		}
		.keep_button {
			background: @next-button-color;
			color: #ffffff;
			border: @next-button-color;
		}
	}
}
</style>
