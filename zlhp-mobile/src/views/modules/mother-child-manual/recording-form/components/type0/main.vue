<template>
	<div :class="classRoot">
		{{ data.FieldName }}
	</div>
</template>
<script>
export default {
	name: 'type0',
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

@inner-prefix: ~'@{prefix-mother}-type0';
.@{inner-prefix} {
	font-size: 15px;
	color: #333333;
	font-weight: bold;
	padding: 9px 16px;
	line-height: 30px;
	background: #fff8f8;
	border-radius: 10px 10px 0 0;
}
</style>
