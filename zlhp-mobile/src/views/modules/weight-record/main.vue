<template>
	<div :class="classRoot">
		<van-nav-bar title="体重管理" left-arrow @click-left="$router.back()" />
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<simple-header
				:avatar="User && User['UserImage']"
				:title="Archive && Archive['Name']"
				:intro="
					Archive &&
						getGestationalWeekAndDayTitle(
							Archive['MenstrualHistories']['LastMenstrualDate']
						)
				"
				@onClick="$router.push({ path: '/archive/list' })"
			/>
			<van-row :class="`${classRoot}-info`" v-if="LimitType">
				<van-col span="5" :class="`${classRoot}-info-left`">
					<div>孕前</div>
					<div>信息</div>
				</van-col>
				<van-col span="13" :class="`${classRoot}-info-content`">
					<div>BMI {{ LimitType['BMI'] }}</div>
					<div>
						<span>身高 {{ LimitType['Stature'] || '未录入' }} cm ，</span>
						<span>体重{{ LimitType['BodyWeight'] || '未录入' }} kg</span>
					</div>
				</van-col>
				<van-col span="5" :class="`${classRoot}-info-right`">
					<van-button plain type="info" @click="handleOpenEdit"
						>编辑</van-button
					>
				</van-col>
			</van-row>
			<div :class="`${classRoot}-content`">
				<div :class="`${classRoot}-chart`">
					<div :class="`${classRoot}-chart-title`" v-if="LimitType">
						<div>孕前BMI{{ LimitType['BMIRange'] }}</div>
						<div>{{ LimitType['BodyWeightTypeVal'] }}</div>
					</div>
					<canvas id="myChart" />
				</div>
				<van-cell-group>
					<van-cell title="孕周">
						<van-stepper v-model="week" input-width="50px" max="40" integer />
					</van-cell>
					<van-cell title="体重（kg）">
						<van-stepper
							v-model="weight"
							:min="35.0"
							:max="200"
							:decimal-length="2"
							step="0.05"
							input-width="50px"
						/>
					</van-cell>
					<van-cell :class="`${classRoot}-weight_keep_button`">
						<van-button type="info" block @click="handleSave">保存</van-button>
					</van-cell>
				</van-cell-group>
			</div>
		</van-pull-refresh>
		<van-popup
			:class="`${classRoot}-popup`"
			v-model="show"
			position="bottom"
			closeable
		>
			<h3>孕前体重</h3>
			<van-cell-group>
				<van-field
					label="身高"
					input-align="right"
					v-model="editForm.stature"
					placeholder="请输入身高"
				>
					<van-stepper
						slot="input"
						v-model="editForm.stature"
						:min="80"
						:max="250"
						:decimal-length="2"
						step="0.1"
						input-width="50px"
					/>
					<span slot="right-icon">cm</span>
				</van-field>
				<van-field
					label="体重"
					input-align="right"
					v-model="editForm.weight"
					placeholder="请输入体重"
				>
					<van-stepper
						slot="input"
						v-model="editForm.weight"
						:min="35"
						:max="200"
						step="0.05"
						:decimal-length="2"
						input-width="50px"
					/>
					<span slot="right-icon">kg</span>
				</van-field>
				<van-cell title="BMI">{{
					(editForm.weight / (editForm.stature / 100) ** 2).toFixed(3)
				}}</van-cell>
			</van-cell-group>
			<p>BMI=体重(kg)÷身高^2(m) 一个人的正常BMI范围为：18.5~24</p>
			<h4>
				请认真填写孕前身高、体重信息，准确的信息将会帮助您更好的观察孕期状态。
			</h4>
			<div :class="`${classRoot}-popup-footer`">
				<van-button
					class="cancle_button"
					type="default"
					size="small"
					@click="show = false"
					>取消</van-button
				>
				<van-button
					type="info"
					size="small"
					class="keep_button"
					@click="handleEditSave"
					>保存</van-button
				>
			</div>
		</van-popup>
	</div>
</template>
<script>
import F2 from '@antv/f2/dist/f2-all.min';
import _ from 'lodash';
import { Dialog } from 'vant';
import {
	disposeResult,
	getGestationalWeek,
	getGestationalWeekAndDayTitle
} from '../../../commons';
import * as BodyWeightRecordsApi from '../../../apis/BodyWeightRecordsApi';
import * as UserApi from '../../../apis/UserApi';
import * as ArchiveApi from '../../../apis/ArchiveApi';

export default {
	name: 'weight-record',
	data() {
		return {
			isLoading: false,
			show: false,
			chart: null,
			week: 0,
			weight: 0,
			editForm: {
				stature: 0,
				weight: 0
			},
			LimitType: null,
			Limits: [],
			Records: [],
			User: null,
			Archive: null,
			maxWeek: 5
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		},
		/**
		 * 图表数据
		 */
		chartData() {
			const DownLimitList = this.Limits.map(item => {
				return {
					week: item.Week,
					value: item.DownLimit,
					type: '下限'
				};
			});
			const UpperLimitList = this.Limits.map(item => {
				return {
					week: item.Week,
					value: item.UpperLimit,
					type: '上限'
				};
			});
			const records = this.Records.map(item => {
				return {
					week: item.Week,
					value: item.Weight - this.LimitType.BodyWeight,
					type: '体重'
				};
			});
			return [...DownLimitList, ...UpperLimitList, ...records];
		}
	},
	watch: {
		maxWeek() {
			if (this.maxWeek <= 5) {
				this.maxWeek = 5;
			} else if (this.maxWeek > 37) {
				this.maxWeek = 42;
			}
			this.renderChart();
		}
	},
	created() {
		this.onRefresh(true);
	},
	mounted() {},
	methods: {
		getGestationalWeekAndDayTitle,
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
					height: 220,
					pixelRatio: window.devicePixelRatio
				});
				// 加载数据源
				chart.source(this.chartData, {
					week: {
						type: 'linear',
						// 滚动条包含几个
						min: this.maxWeek - 5,
						max: this.week <= 5 ? this.maxWeek : this.week,
						alias: '孕周',
						formatter: text => `${text}周`
					},
					value: {
						formatter: text => `${text}kg`,
						max: 6
					}
				});
				chart.tooltip({
					alwaysShow: true,
					custom: true, // 自定义 tooltip 内容框
					onShow: obj => {
						const weight = obj.items.filter(item => item.name === '体重')[0];
						if (weight) {
							this.week = weight.origin.week;
							this.weight = weight.origin.value;
						}
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
					.position('week*value')
					.color('type')
					.shape('type', type => {
						if (type === '上限' || type === '下限') {
							return 'dash';
						}
						if (type === '体重') {
							return 'line';
						}
						return type;
					});

				// 小圆点;
				chart
					.point()
					.position('week*value')
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
				const item = {
					week: this.week,
					value: this.weight
				}; // 要展示 tooltip 的数据
				const point = chart.getPosition(item); // 获取该数据的画布坐标
				chart.showTooltip(point); // 展示该点的 tooltip
			}
		},
		/**
		 * 刷新
		 */
		onRefresh(init) {
			this.isLoading = true;
			this.$toast.loading('加载中...');
			const keys = ['User', 'Archive'];
			const methods = [
				UserApi.GetUser(),
				ArchiveApi.Current(),
				BodyWeightRecordsApi.GetAll()
			];
			Promise.all(methods)
				.then(results => {
					for (let i = 0; i < keys.length; i += 1) {
						disposeResult({
							$vm: this,
							response: results[i],
							key: keys[i]
						});
					}
					if (results[2].Code === 0) {
						this.LimitType = results[2].Body.LimitType;
						this.Limits = results[2].Body.Limits;
						this.Records = results[2].Body.Records;
						this.weight = this.LimitType.BodyWeight;
						this.editForm.weight = this.LimitType.BodyWeight;
						this.editForm.stature = this.LimitType.Stature;
						this.renderChart();
					}
					if (init) {
						this.week = getGestationalWeek(
							this.Archive.MenstrualHistories.LastMenstrualDate
						);
						this.maxWeek = this.week;
					}
				})
				.finally(() => {
					this.isLoading = false;
					this.$toast.clear();
				});
		},
		/**
		 * 编辑
		 */
		handleOpenEdit() {
			this.show = true;
		},
		handleCloseEdit() {
			this.show = false;
		},
		/**
		 * 编辑保存
		 */
		handleEditSave() {
			this.$toast.loading('正在保存...');
			ArchiveApi.UpdateWeightAndStature(this.editForm)
				.then(response => {
					if (response.Code === 0 && response.Body) {
						this.onRefresh();
						this.handleCloseEdit();
					} else {
						Dialog.alert({
							title: '系统提示',
							message: '保存失败'
						});
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 保存
		 */
		handleSave() {
			this.$toast.loading('正在保存...');
			BodyWeightRecordsApi.Post({
				Week: this.week,
				Weight: this.weight
			})
				.then(response => {
					if (response.Code === 0) {
						this.onRefresh();
						this.maxWeek = this.week;
					}
				})
				.finally(this.$toast.clear);
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';
@inner-prefix: ~'@{prefix-mother}-weight-record';
.@{inner-prefix} {
	height: 100%;
	background-color: #ffffff;
	.van-pull-refresh {
		height: calc(100% - 46px);
		overflow: scroll;
		&__track {
			min-height: 100%;
		}
	}

	&-chart {
		&-title {
			background-color: @background-color;
			padding: 10px 15px 10px 15px;
			div {
				line-height: 1.5rem;
			}
		}
		canvas {
			width: 100%;
			background-color: white;
			height: 200px;
		}
	}
	&-weight_keep_button {
		.van-cell__value {
			box-shadow: @box-shadow;
			button {
				background: @next-button-color;
				border: @next-button-color;
			}
		}
	}
	&-popup {
		padding-bottom: 15px;
		h3 {
			text-align: center;
		}
		h4 {
			padding: 0 20px;
			text-indent: 2rem;
			color: #ee8ca1;
			line-height: 1.7rem;
		}
		p {
			font-size: 0.9rem;
			padding: 0 50px;
		}
		&-footer {
			text-align: center;
			button {
				width: 30%;
				box-shadow: @box-shadow;
				&:last-child {
					border: unset;
					margin-left: 10%;
				}
			}
			.cancle_button {
				background: @back-button-color;
			}
			.keep_button {
				background: @next-button-color;
			}
		}
	}

	&-info {
		margin: 20px 0 5px 0;
		padding: 10px 0;
		height: 40px;
		background-color: rgba(252, 246, 246, 1);
		&-content {
			color: @font-color;
			margin-left: 10px;
		}
		&-left {
			position: relative;
			color: #ee8ca1;
			font-size: 1.1rem;
			text-align: center;
			&:after {
				position: absolute;
				right: 5px;
				top: 0;
				content: ' ';
				border: 1px solid #ee8ca1;
				height: 100%;
			}
		}
		&-right {
			text-align: center;
			button {
				background-color: unset;
				border: unset;
				span {
					color: #ee8ca1;
				}
			}
		}
	}
}
</style>
