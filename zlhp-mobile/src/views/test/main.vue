<template>
	<div>test</div>
</template>
<script>
export default {
	name: 'test',
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	},
	methods: {}
};
</script>
<style lang="less">
@import '../../style/variable';

@inner-prefix: ~'@{prefix}-test';
.@{inner-prefix} {
	margin: unset;
	font-size: 1rem;
}
</style>
