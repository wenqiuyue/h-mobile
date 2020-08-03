<template>
	<div :class="classRoot" v-if="formDataData">
		<van-nav-bar
			:title="formDataData.Forms.Title"
			left-arrow
			@click-left="$router.back()"
		></van-nav-bar>
		<div :class="`${classRoot}-body`">
			<p class="time">记录时间：{{ recordingtime }}</p>
			<p class="recording_container" v-html="content"></p>
		</div>
	</div>
</template>
<script>
import * as FormDataApi from '../../../../apis/FormDataApi';

export default {
	name: 'recording-after',
	data() {
		return {
			formDataData: null, // 填写记录
			formId: this.$route.query.form_id,
			recordingtime: null, // 记录时间
			content: null // 记录内容
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		this.getFormData();
	},
	methods: {
		getFormData() {
			this.$toast.loading('加载中...');
			// 获取表单数据
			FormDataApi.getFormData(this.formId)
				.then(result => {
					if (result.Code === 0) {
						// 如果表单有填写记录
						this.formDataData = result.Body;
						this.formDataData.JsonParseData = JSON.parse(result.Body.JsonData);
						Object.keys(this.formDataData.JsonParseData).forEach(
							(datakey, index) => {
								if (index === 0) {
									this.recordingtime = this.formDataData.JsonParseData[datakey];
								} else if (index === 1) {
									this.content = this.formDataData.JsonParseData[datakey];
								}
							}
						);
					} else {
						this.$toast.fail(result.Message);
					}
				})
				.finally(this.$toast.clear);
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-recording-after';
.@{inner-prefix} {
	background: #f9f9f9;
	height: 100%;
	&-body {
		height: calc(100% - 46px);
		overflow: scroll;
		.time {
			padding: 0 13px;
			color: #f18bab;
			font-size: 15px;
		}
		.recording_container {
			color: #666666;
			font-size: 15px;
			text-indent: 2em;
			padding: 0 20px;
			line-height: 23px;
		}
	}
}
</style>
