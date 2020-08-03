<template>
	<div :class="classRoot">
		<svg-icon :value="icon" :size="size" />
		<h3 v-if="message" :style="{ color: color }">
			{{ message }}
		</h3>
		<p v-if="intro">{{ intro }}</p>
	</div>
</template>
<script>
export default {
	name: 'hint',
	props: {
		icon: { type: String, default: 'icon-noNews' },
		message: { type: String, default: '无数据' },
		color: { type: String, default: null },
		intro: { type: String, default: null },
		size: { type: Number, default: 7.5 }
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
@inner-prefix: ~'@{prefix}-hint';
.@{inner-prefix} {
	text-align: center;
	padding: 20px 0;
	h3 {
		color: #333333;
		margin: unset;
	}
	p {
		color: @font-color-secondary;
		margin-bottom: unset;
	}
}
</style>
