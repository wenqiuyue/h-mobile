<template>
	<div :class="classRoot">
		<van-nav-bar title="查看报告" left-arrow @click-left="$router.back()" />
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<template v-if="list && list.length">
				<van-cell-group>
					<template v-for="(item, index) in list">
						<van-cell
							:key="index"
							:title="item['YZNR']"
							:label="item['KZSJ'] || new Date().format()"
							is-link
							center
							@click="handleClick(item)"
						/>
					</template>
				</van-cell-group>
			</template>
			<template v-else>
				<hint message="暂无报告" />
			</template>
		</van-pull-refresh>
	</div>
</template>
<script>
import * as ArchiveRecordsApi from '../../../apis/ArchiveRecordsApi';
import { disposeResult } from '../../../commons';

export default {
	name: 'view-report',
	data() {
		return {
			isLoading: false,
			list: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	},
	created() {
		this.onRefresh();
	},
	methods: {
		/**
		 * 点击事件
		 */
		handleClick(item) {
			if (item.ZLLB === 'C') {
				this.$router.push({
					path: '/mother/inspection/check/details',
					query: {
						sampleId: item.BBID,
						title: item.YZNR
					}
				});
			} else if (item.ZLLB === 'D') {
				this.$router.push({
					path: '/mother/inspection/check/pdf',
					query: {
						caseHistoryId: item.BLID,
						zyzid: item.ZYZID,
						title: item.YZNR
					}
				});
			}
		},
		/**
		 * 刷新
		 */
		onRefresh() {
			this.isLoading = true;
			this.$toast.loading('加载中...');
			ArchiveRecordsApi.GetViewReportMenu(this.$route.query.RegistrationNo)
				.then(response => {
					disposeResult({
						$vm: this,
						response,
						key: 'list',
						parser: data => JSON.parse(data)
					});
				})
				.finally(() => {
					this.isLoading = false;
					this.$toast.clear();
				});
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable';
@inner-prefix: ~'@{prefix}-view-report';
.@{inner-prefix} {
	height: 100%;
	background-color: @background-color-container;
	.van-pull-refresh {
		height: calc(100% - 46px);
		overflow: scroll;
		&__track {
			min-height: 100%;
		}
	}

	.van-cell-group {
		.van-cell {
			font-size: 0.85rem;
			&__title {
			}
		}
	}
}
</style>
