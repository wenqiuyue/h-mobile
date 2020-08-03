<template>
	<div :class="classRoot">
		<van-nav-bar title="高危自评" left-arrow @click-left="$router.back()">
			<van-button
				type="primary"
				size="mini"
				slot="right"
				color="#EE8CA1"
				@click="show = true"
				>查看结果</van-button
			>
		</van-nav-bar>
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<van-tabs
				v-model="active"
				swipeable
				:ellipsis="false"
				:lazy-render="false"
				color="#EF98AB"
				line-width="90px"
				animated
				:swipe-threshold="3"
			>
				<template v-for="(item, index) in list">
					<van-tab :key="index" :title="item['Name']">
						<van-checkbox-group v-model="result" checked-color="#f59fb0">
							<van-collapse v-model="activeNames">
								<item v-model="item['Child']" />
							</van-collapse>
						</van-checkbox-group>
					</van-tab>
				</template>
			</van-tabs>
		</van-pull-refresh>
		<div :class="`${classRoot}-footer`">
			<!-- <van-button size="small" @click="show = true">查看结果</van-button> -->
			<van-button size="small" type="info" @click="submit">保存</van-button>
		</div>
		<van-popup v-model="show" position="bottom" closeable>
			<template v-if="resultData && resultData.length">
				<h2>自评结果</h2>
				<div :class="`${classRoot}-tags`">
					<template
						v-for="(item, index) in resultData.filter(
							m =>
								!m['HighRiskFactor']['Effect'] &&
								!m['HighRiskFactor']['TreatPlan']
						)"
					>
						<van-tag :key="index" plain size="large">
							{{ item['HighRiskFactor']['Name'] }}
						</van-tag>
					</template>
				</div>
				<van-collapse v-model="popupActionName">
					<template
						v-for="(item, index) in resultData.filter(
							m =>
								m['HighRiskFactor']['Effect'] ||
								m['HighRiskFactor']['TreatPlan']
						)"
					>
						<van-collapse-item
							:key="index"
							:title="item['HighRiskFactor']['Name']"
						>
							<van-divider content-position="left">影响</van-divider>
							<p>{{ item['HighRiskFactor']['Effect'] }}</p>
							<van-divider content-position="left">治疗计划</van-divider>
							<p>{{ item['HighRiskFactor']['TreatPlan'] }}</p>
						</van-collapse-item>
					</template>
				</van-collapse>
				<div :class="`${classRoot}-footer`">
					<van-button @click="show = false">关闭</van-button>
				</div>
			</template>
			<hint v-else />
		</van-popup>
	</div>
</template>
<script>
import * as HighRiskApi from '../../../apis/HighRiskApi';
import Item from './item';
import { disposeResult } from '../../../commons';

export default {
	name: 'high-risk-self-assessment',
	components: { Item },
	data() {
		return {
			show: false,
			isLoading: false,
			active: 0,
			activeNames: [],
			popupActionName: [],
			list: [],
			result: [],
			resultData: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	mounted() {
		this.onRefresh();
	},
	methods: {
		/**
		 * 提交
		 */
		submit() {
			this.resultData = null;
			this.show = false;
			this.$toast.loading('正在保存...');
			HighRiskApi.Post(this.result)
				.then(response => {
					if (response.Code === 0) {
						this.resultData = response.Body;
						if (this.resultData.length) {
							this.show = true;
						}
					}
					this.$toast.fail(response.Message);
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 刷新
		 */
		onRefresh() {
			this.isLoading = true;
			this.$toast.loading('加载中');

			const keys = ['list', 'resultData'];
			const methods = [HighRiskApi.GetAllFactor(), HighRiskApi.GetAll()];
			Promise.all(methods)
				.then(results => {
					results.forEach((item, index) => {
						const options = {
							$vm: this,
							key: keys[index],
							response: item
						};
						if (index === 0) {
							options.parser = data => {
								return data
									.map(m => {
										m.Child = data.filter(
											c => c.ParentID === m.HighRiskFactorID
										);
										return m;
									})
									.filter(m => !m.ParentID);
							};
						}
						disposeResult(options);
					});
				})
				.finally(() => {
					this.$toast.clear();
					this.isLoading = false;
				});
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';
@inner-prefix: ~'@{prefix-mother}-high-risk-self-assessment';
.@{inner-prefix} {
	height: 100%;
	background-color: @background-color-container;
	.van-pull-refresh {
		height: calc(100% - 102px);
		overflow: scroll;
		&__track {
			min-height: 100%;
		}
	}

	&-footer {
		text-align: center;
		line-height: 54px;
		button {
			width: 30%;
			border: unset;
			height: 46px;
			font-size: 18px;
			&:last-child {
				color: white;
				width: 90%;
				border-radius: 5px;
				background-color: @next-button-color;
				box-shadow: @box-shadow;
			}
		}
	}

	&-tags {
		padding: 15px;
		.van-tag {
			margin-top: 5px;
			margin-right: 5px;
		}
	}

	.van-popup {
		max-height: calc(100% - 46px);
		h2 {
			text-align: center;
			margin-bottom: unset;
		}
		p {
			text-indent: 2rem;
		}
	}
}
</style>
