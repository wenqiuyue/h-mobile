<template>
	<div :class="classRoot">
		<div :class="shape">{{ title }}</div>
	</div>
</template>
<script>
export default {
	name: 'title-bg',
	props: {
		title: String,
		shape: { type: String, default: 'triangle' }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	}
};
</script>
<style lang="less">
@import '../../style/variable.less';
@inner-prefix: ~'@{prefix}-title-bg';
.@{inner-prefix} {
	padding: 1rem;
	text-align: center;
	.triangle {
		@bg-color: #a8c5f6;
		@height: 2rem;
		display: inline-block;
		position: relative;
		background-color: @bg-color;
		height: @height;
		line-height: @height;
		width: 5rem;
		margin: 0 1rem;
		text-align: center;
		color: white;
		font-size: 0.85rem;

		&::before {
			width: 0;
			height: 0;
			border-width: @height / 2;
			border-style: solid;
			border-color: transparent @bg-color transparent transparent;
			position: absolute;
			left: -@height;
			content: ' ';
		}

		&::after {
			width: 0;
			height: 0;
			border-width: @height / 2;
			border-style: solid;
			border-color: transparent transparent transparent @bg-color;
			position: absolute;
			right: -@height;
			content: ' ';
		}
	}
}
</style>
