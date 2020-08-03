<template>
	<div :class="classRoot">
		<div class="quadrilateral">{{ title }}</div>
		<div class="qblique"></div>
		<div class="qblique second-qblique"></div>
	</div>
</template>
<script>
export default {
	name: 'title-style',
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
@inner-prefix: ~'@{prefix}-title-style';
.@{inner-prefix} {
	margin: 20px 0;
	width: 100%;
	border-top: 1px dashed #ee8ca1;
	.quadrilateral {
		@bg-color: #ee8ca1;
		@height: 30px;
		display: inline-block;
		position: relative;
		background-color: @bg-color;
		height: @height;
		line-height: @height;
		width: 7rem;
		text-align: center;
		color: white;
		font-size: 16px;
		z-index: 99;
		&::after {
			width: 0;
			height: 0;
			border-width: @height / 2;
			border-style: solid;
			border-color: @bg-color transparent transparent @bg-color;
			position: absolute;
			right: -@height;
			content: ' ';
		}
	}
	.qblique {
		@bg-color: #ee8ca1;
		@height: 30px;
		display: inline;
		position: relative;
		background-color: @bg-color;
		left: 1rem;
		opacity: 0.6;
		z-index: 98;
		&::before {
			width: 0;
			height: 0;
			border-width: @height / 2;
			border-style: solid;
			border-color: transparent @bg-color @bg-color transparent;
			position: absolute;
			left: -@height;
			content: ' ';
		}
		&::after {
			width: 0;
			height: 0;
			border-width: @height / 2;
			border-style: solid;
			border-color: @bg-color transparent transparent @bg-color;
			position: absolute;
			right: -@height;
			content: ' ';
		}
	}
	.second-qblique {
		left: 2rem;
		opacity: 0.2;
	}
}
</style>
