<template>
	<div :class="classRoot">
		<van-nav-bar
			:title="data ? data['Title'] : '详情'"
			left-arrow
			@click-left="$router.back()"
		/>
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<div v-if="data" v-html="data['Content']" />
		</van-pull-refresh>
	</div>
</template>
<script>
import { Get } from '../../../apis/SectionItemApi';

export default {
	name: 'section-details',
	data() {
		return {
			isLoading: false,
			data: null
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
		 * 刷新
		 */
		onRefresh() {
			this.isLoading = true;
			this.$toast.loading('加载中...');
			Get(this.$route.query.id)
				.then(response => {
					if (response.Code === 0) {
						this.data = response.Body;
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
@inner-prefix: ~'@{prefix}-section-details';
.@{inner-prefix} {
	height: 100%;
	.van-pull-refresh {
		height: calc(100% - 46px);
		overflow: scroll;
		&__track {
			min-height: calc(100% - 30px);
			padding: 15px;
		}
	}
}
</style>
