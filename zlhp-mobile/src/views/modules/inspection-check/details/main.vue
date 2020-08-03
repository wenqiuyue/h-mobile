<template>
	<div :class="classRoot">
		<van-nav-bar :title="title" left-arrow @click-left="$router.back()" />
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<van-notice-bar mode="closeable">
				检验结果以打印纸质报告为准
			</van-notice-bar>
			<table cellspacing="0" cellpadding="0">
				<thead>
					<tr>
						<th>分析项目</th>
						<th>结果</th>
						<th>参考</th>
						<th>单位</th>
					</tr>
				</thead>
				<tbody v-if="list && list.length">
					<tr v-for="(item, index) in list" :key="index">
						<td>{{ item['ZBMC'] }}</td>
						<td :style="{ color: item['state'] ? 'red' : 'unset' }">
							{{ item['BCZ'] }}
						</td>
						<td>{{ item['CKZ'] }}</td>
						<td>{{ item['DW'] }}</td>
					</tr>
				</tbody>
			</table>
		</van-pull-refresh>
	</div>
</template>

<script>
import * as ArchiveRecordsApi from '../../../../apis/ArchiveRecordsApi';
import { disposeResult } from '../../../../commons';

export default {
	name: 'inspection-check-details',
	data() {
		return {
			isLoading: false,
			list: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		},
		title() {
			return `《${this.$route.query.title}》结果`;
		}
	},
	mounted() {
		this.onRefresh();
	},
	methods: {
		/**
		 * 刷新
		 */
		onRefresh() {
			this.isLoading = true;
			this.$toast.loading('加载中...');
			ArchiveRecordsApi.GetViewReportDetail(this.$route.query.sampleId)
				.then(response => {
					disposeResult({
						$vm: this,
						response,
						key: 'list',
						parser: data => {
							data = JSON.parse(data);
							return data.map(item => {
								if (item.CKGZ && item.CKDZ) {
									if (
										Number(item.BCZ) < Number(item.CKDZ) ||
										Number(item.BCZ) > Number(item.CKGZ)
									) {
										item.state = true;
									}
								}
								return item;
							});
						}
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
@import '../../../../style/variable';

@inner-prefix: ~'@{prefix-mother}-inspection-check-details';
.@{inner-prefix} {
	height: 100%;
	background-color: @background-color;
	.van-pull-refresh {
		height: calc(100% - 46px);
		overflow: scroll;
		&__track {
			min-height: 100%;
		}
	}

	table {
		text-align: center;
		font-size: 1rem;
		margin: 0.5rem;
		border: unset;
		width: calc(100% - 1rem);
		background-color: @background-color-container;

		thead {
			color: white;
			background-color: skyblue;

			tr {
				th {
					min-width: 2rem;
					padding: 0.5rem;
					&:first-child {
						text-align: left;
					}
				}
			}
		}
		tbody {
			text-align: right;
			font-size: 0.85rem;
			tr {
				td {
					padding: 0.25rem 0.5rem;
					&:first-child {
						text-align: left;
					}
				}
			}
		}
	}
}
</style>
