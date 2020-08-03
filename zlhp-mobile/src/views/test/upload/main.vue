<template>
	<div>
		<van-uploader :after-read="afterRead" multiple />
	</div>
</template>
<script>
import { UploadImage, UploadImages } from '../../../apis/UploadApi';

export default {
	name: 'test-upload',
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	},
	methods: {
		afterRead(file) {
			if (file instanceof Array) {
				UploadImages(
					file.map(item => {
						return {
							content: item.content,
							name: item.file.name
						};
					})
				).then(data => {
					// eslint-disable-next-line no-console
					console.log(data);
				});
			} else {
				UploadImage({
					content: file.content,
					name: file.file.name
				}).then(data => {
					// eslint-disable-next-line no-console
					console.log(data);
				});
			}
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable';

@inner-prefix: ~'@{prefix}-test-pay';
.@{inner-prefix} {
	margin: unset;
	font-size: 1rem;
}
</style>
