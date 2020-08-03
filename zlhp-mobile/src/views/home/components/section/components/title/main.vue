<template>
	<div :class="classRoot">
		<div :class="`${classRoot}-title`">
			<span class="title_line"></span>{{ title }}
			<svg-icon v-if="icon" :value="icon" @click="$emit('onClickIcon')" />
		</div>
	</div>
</template>

<script>
export default {
	name: 'section-title',
	props: {
		title: { type: String, default: null },
		icon: { type: String, default: null }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	}
};
</script>

<style lang="less">
@import '../../../../../../style/variable.less';
@inner-prefix: ~'@{prefix}-section-title';

.@{inner-prefix} {
	height: 2rem;
	line-height: 1rem;
	font-size: 17px;
	font-weight: bold;
	padding-top: 27px;
	color: @font-color;
	background-color: @background-color;
	border-radius: 10px 10px 0 0;
	svg {
		position: absolute;
		right: 25px;
	}
	&-title {
		font-size: 18px;
		color: #323232;
		.title_line {
			border-left: 5px solid #ff7979;
			margin-right: 15px;
			border-radius: 5px;
		}
	}
}
</style>
