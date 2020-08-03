<template>
	<div :class="classRoot">
		<span :class="`${classRoot}-flower`">{{ title }}</span>
	</div>
</template>
<script>
export default {
	name: 'petal',
	props: {
		title: {
			type: Number,
			default: null
		}
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	}
};
</script>
<style lang="less" scoped>
@import '../../style/variable.less';
@inner-prefix: ~'@{prefix}-petal';
.@{inner-prefix} {
	&-flower {
		float: left;
		width: 25px;
		height: 25px;
		background: #ec0465;
		border-radius: 50px 0 50px 50px;
		text-align: center;
		color: #f082a5;
		font-size: 17px;
		background: #fbdfe8;
	}
}
</style>
