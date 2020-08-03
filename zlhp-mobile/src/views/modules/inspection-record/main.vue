<template>
	<div :class="classRoot">
		<van-nav-bar title="检查记录" left-arrow @click-left="$router.back()" />
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<template v-if="list && list.length">
				<template v-for="(item, index) in list">
					<van-cell :key="index">
						<template slot="title">
							<svg-icon value="icon-erbao_qz" />
							{{ item['年龄'] }} 儿保记录
						</template>
						<span
							slot="right-icon"
							@click="handleClick(item)"
							style="color: #6E9FF0"
						>
							查看详情
						</span>
						<template slot="label">
							<div>挂号单：{{ item['挂号单'] }}</div>
							<div>姓名：{{ item['姓名'] }}</div>
							<div>医生：{{ item['医生姓名'] }}</div>
							<div>检查日期：{{ item['体检时间'] }}</div>
						</template>
					</van-cell>
				</template>
			</template>
			<hint v-else />
		</van-pull-refresh>
	</div>
</template>
<script>
import * as ChildrenCheckRecordApi from '../../../apis/ChildrenCheckRecordApi';

export default {
	name: 'inspection-record',
	data() {
		return {
			isLoading: false,
			list: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_CHILDREN}-${this.$options.name}`;
		}
	},
	mounted() {
		this.onRefresh();
	},
	methods: {
		/**
		 * 点击事件
		 */
		handleClick(item) {
			this.$router.push({
				path: '/children/inspection-record-details',
				query: {
					id: item['保健ID']
				}
			});
		},
		/**
		 * 刷新
		 */
		onRefresh() {
			this.isLoading = true;
			this.$toast.loading('加载中...');
			ChildrenCheckRecordApi.GetHisCheckRecordList()
				.then(response => {
					this.list = response.Body;
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
@inner-prefix: ~'@{prefix-children}-inspection-record';
.@{inner-prefix} {
	height: 100%;
	.van-pull-refresh {
		height: calc(100% - 46px);
		overflow: scroll;
		background-color: @background-color-container;
		&__track {
			min-height: calc(100% - 30px);
			padding: 5px;
		}
	}
}
</style>
