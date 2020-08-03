<template>
	<van-pull-refresh :class="classRoot" v-model="isLoading" @refresh="onRefresh">
		下拉刷新
	</van-pull-refresh>
</template>
<script>
export default {
	name: 'example',
	data() {
		return {
			isLoading: false
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	},
	beforeCreate() {},
	created() {},
	beforeMount() {},
	mounted() {},
	beforeDestroy() {},
	methods: {
		/**
		 * 刷新
		 */
		onRefresh() {
			this.isLoading = true;
			setTimeout(() => {
				this.isLoading = false;
			}, 3000);
		}
	}
};
</script>
<style lang="less">
@import '../../style/variable.less';
@inner-prefix: ~'@{prefix}-example';
.@{inner-prefix} {
	height: 100%;
	overflow: scroll;
	.van-pull-refresh__track {
		min-height: 100%;
	}
}
</style>
