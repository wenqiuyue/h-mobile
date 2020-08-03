<template>
	<div :class="classRoot">
		<div :class="`${classRoot}-white`"></div>
	</div>
</template>
<script>
export default {
	name: 'type12',
	props: {
		data: { type: Object, default: null }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	methods: {}
};
</script>
<style lang="less">
@import '../../../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-type12';
.@{inner-prefix} {
	padding-bottom: 10px;
	&-white {
		height: 20px;
		background: #ffffff;
		border-radius: 0 0 10px 10px;
		box-shadow: 1px 1px 3px rgba(221, 221, 221, 1);
	}
}
</style>
