<template>
	<div :class="classRoot">
		<van-nav-bar title="高危评估" left-arrow @click-left="$router.back()" />
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<van-tabs
				class="risk-sel"
				v-model="active"
				:swipe-threshold="3"
				swipeable
				color="#EF98AB"
				line-width="90px"
				v-if="list && list.length"
			>
				<template v-for="(item, index) in list">
					<van-tab
						:key="index"
						:title="
							item['ArchiveDays'] && item['ArchiveDays'] !== 0
								? `孕${item['ArchiveWeeks']}周+${item['ArchiveDays']}天`
								: `孕${item['ArchiveWeeks']}周`
						"
					>
						<h3>
							评估结果：
							<template v-if="item['RiskLevel']">
								<van-tag
									v-for="(item, index) in item['RiskLevel'].split('、')"
									:key="index"
									:color="getRiskColor(item)"
								/>
							</template>
							<template v-else>未见异常</template>
						</h3>
						<!--妊娠风险评估  -->
						<div class="risk">
							<div class="risk-title">
								<svg-icon
									class="risk-icon"
									value="icon-decorate_tips"
									:size="1.5"
								/>
								<span>妊娠风险评估</span>
							</div>
							<div class="risk-main">
								{{ item['Risk'] || '无' }}
							</div>
						</div>
						<!-- 高危异常描述 -->
						<div class="risk">
							<div class="risk-title">
								<svg-icon
									class="risk-icon"
									value="icon-decorate_tips"
									:size="1.5"
								/>
								<span>高危异常描述</span>
							</div>
							<div class="risk-main">
								{{ item['Diagnosis'] || '无' }}
							</div>
						</div>
						<!-- 高危异常处置 -->
						<div class="risk">
							<div class="risk-title">
								<svg-icon
									class="risk-icon"
									value="icon-decorate_tips"
									:size="1.5"
								/>
								<span>高危异常处置</span>
							</div>
							<div class="risk-main">
								{{ item['Abnormal'] || '无' }}
							</div>
						</div>
					</van-tab>
				</template>
			</van-tabs>
			<hint v-else />
		</van-pull-refresh>
	</div>
</template>
<script>
import { GetRisks } from '../../../apis/ArchiveRecordsApi';
import { getRiskColor } from '../../../commons';

export default {
	name: 'risk-assessment',
	data() {
		return {
			isLoading: false,
			active: 0,
			list: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		this.onRefresh();
	},
	methods: {
		getRiskColor,
		/**
		 * 刷新
		 */
		onRefresh() {
			this.isLoading = true;
			this.$toast.loading('加载中...');
			GetRisks()
				.then(data => {
					if (data.Code === 0) {
						this.list = data.Body;
					}
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
@inner-prefix: ~'@{prefix-mother}-risk-assessment';
.@{inner-prefix} {
	height: 100%;
	// background-color: @background-color-container;
	.van-tabs--line .van-tabs__wrap {
		box-shadow: 0px 1.5px 3px rgba(0, 0, 0, 0.16);
	}
	.van-pull-refresh {
		height: calc(100% - 46px);
		overflow: scroll;
		&__track {
			min-height: 100%;
		}
		h3 {
			padding: 15px 15px;
			.van-tag {
				vertical-align: middle;
				height: 10px;
				width: 16px;
				border-radius: 2px;
				&:not(:first-child) {
					margin-left: 10px;
				}
			}
		}
		.risk {
			margin-bottom: 33px;
			padding: 0 15px;
			.risk-title {
				display: flex;
				flex-direction: row;
				align-items: center;
				span {
					margin-left: 10px;
					color: #333333;
					font-size: 16px;
				}
			}
			.risk-main {
				margin-top: 12px;
				color: #666666;
				text-indent: 2em;
				font-size: 12px;
				line-height: 22px;
			}
		}
		.van-panel {
			&__content {
				padding: 15px;
			}
		}
	}
}
</style>
