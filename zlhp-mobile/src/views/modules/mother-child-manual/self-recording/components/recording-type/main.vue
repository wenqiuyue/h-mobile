<template>
	<div :class="classRoot">
		<van-panel :class="`${classRoot}-recording`">
			<template #header>
				<div class="recording_title">{{ data.Title }}</div>
				<span
					class="recording_contant"
					v-for="(item, index) in data.SectionItems"
					:key="index"
					@click="$router.push({ path: item.Url })"
					><svg-icon value="icon-mother_record_pre" :size="1.5" />{{
						item.Title
					}}</span
				>
			</template>
		</van-panel>
	</div>
</template>
<script>
export default {
	name: 'recording-type',
	data() {
		return {};
	},
	props: {
		data: { type: Object, default: null }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {},
	methods: {}
};
</script>
<style lang="less">
@import '../../../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-recording-type';
.@{inner-prefix} {
	&-recording {
		margin-top: 5px;
		padding: 20px 18px 15px 18px;
		.recording_title {
			font-size: 17px;
			color: #333333;
			font-weight: bold;
			margin-bottom: 22px;
		}
		.recording_contant {
			margin-bottom: 10px;
			display: block;
			background: #fff5f6;
			display: flex;
			align-items: center;
			padding: 19px 16px;
			font-size: 16px;
			svg {
				margin-right: 12px;
			}
		}
	}
}
</style>
