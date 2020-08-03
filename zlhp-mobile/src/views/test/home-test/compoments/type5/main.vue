<template>
	<div :class="classRoot">
		<div :class="`${classRoot}-top_select`">
			<van-grid class="grid" :border="false">
				<template v-for="(item, index) in 4">
					<van-grid-item :key="index">
						<van-image width="47px" height="47px" fit="cover" :src="src" />
						<div class="title">{{ title }}</div>
					</van-grid-item>
				</template>
			</van-grid>
		</div>
	</div>
</template>
<script>
export default {
	name: 'type5',
	props: {
		// 功能图片
		src: { type: String, default: null },
		// 功能标题
		title: { type: String, default: null }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	}
};
</script>
<style lang="less">
@import '../../../../../style/variable';

@inner-prefix: ~'@{prefix-mother}-type5';
.@{inner-prefix} {
	&-top_select {
		margin-top: 8px;
		border-top: none;
		.grid {
			text-align: center;
			.van-image {
				background: #f6f6f6;
				padding: 9px;
				border-radius: 50%;
			}
			.title {
				margin-top: 5px;
				color: #000000;
			}
		}
	}
}
</style>
