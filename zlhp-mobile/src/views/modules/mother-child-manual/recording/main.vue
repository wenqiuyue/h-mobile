<template>
	<div :class="classRoot">
		<div :class="`${classRoot}-body`">
			<div class="bar">
				<span class="cancle">取消</span>
				<van-button round>保存</van-button>
			</div>
			<van-cell
				:value="recordingTime.format('yyyy-MM-dd')"
				is-link
				class="recording_time"
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
			<van-field
				class="container"
				v-model="recordingContainer"
				rows="8"
				autosize
				type="textarea"
				placeholder="孕妈妈准爸爸快来留下你们珍贵的记忆吧"
			/>
			<van-uploader v-model="fileList" :after-read="afterRead" :max-count="1" />
		</div>
	</div>
</template>
<script>
export default {
	name: 'recording',
	data() {
		return {
			showPicker: false, // 记录时间选择显示
			recordingTime: new Date(), // 记录时间
			recordingContainer: null, // 记录内容
			fileList: [] // 上传的图片
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
		},
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
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-recording';
.@{inner-prefix} {
	height: 100%;
	&-body {
		padding: 16px 9px 16px 20px;
		.bar {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			.cancle {
				font-size: 15px;
				color: #bbbbbb;
			}
			.van-button {
				background: #f18bab;
				border: 1px solid #fc8a8a;
				color: #ffffff;
				height: 30px;
				width: 63px;
				line-height: 30px;
			}
		}
		.recording_time {
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
		.container {
			margin-top: 20px;
			padding: 0;
		}
		.van-cell:not(:last-child)::after {
			border-bottom: none;
		}
	}
}
</style>
