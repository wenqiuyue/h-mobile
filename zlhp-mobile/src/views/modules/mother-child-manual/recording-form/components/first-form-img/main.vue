<template>
	<div :class="classRoot">
		<van-uploader v-model="value" :after-read="afterRead" :max-count="1" />
	</div>
</template>
<script>
export default {
	name: 'first-form-img',
	props: {
		data: { type: Object, default: null }
	},
	data() {
		return {
			value: []
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	methods: {
		/**
		 * 上传图片
		 */
		afterRead(file) {
			// 此时可以自行将文件上传至服务器
			// eslint-disable-next-line no-console
			console.log(file);
		}
	}
};
</script>
<style lang="less">
@import '../../../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-first-form-img';
.@{inner-prefix} {
	background: #ffffff;
	padding: 8px 0 0 5px;
}
</style>
