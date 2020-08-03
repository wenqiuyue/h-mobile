<template>
	<div :class="classRoot">
		<van-cell
			:value="recordingTime.format('yyyy-MM-dd')"
			is-link
			:class="`${classRoot}-recording_time`"
			@click="showPicker = true"
		>
			<template #title>
				<van-icon name="clock-o" size="18" />
				<span class="custom-title">记录日期</span>
			</template>
		</van-cell>
		<van-popup v-model="showPicker" position="bottom">
			<van-datetime-picker
				type="date"
				@confirm="onTimeConfirm"
				@cancel="showPicker = false"
			/>
		</van-popup>
	</div>
</template>
<script>
export default {
	name: 'first-form-time',
	props: {
		data: { type: Object, default: null }
	},
	data() {
		return {
			showPicker: false, // 记录时间选择显示
			recordingTime: new Date() // 记录时间
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	methods: {
		/**
		 * 记录时间选择
		 */
		onTimeConfirm(time) {
			this.recordingTime = time;
			this.showPicker = false;
		}
	}
};
</script>
<style lang="less">
@import '../../../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-first-form-time';
.@{inner-prefix} {
	&-recording_time {
		margin-top: 35px;
		border-top: 1px solid #e6e0e0;
		border-bottom: 1px solid #e6e0e0;
		padding: 13px 0;
		font-size: 16px;
		color: #333333;
		.van-cell__title {
			display: flex;
			align-items: center;
			.custom-title {
				margin-left: 7px;
			}
		}
	}
}
</style>
