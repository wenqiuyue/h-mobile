<template>
	<div :class="classRoot">
		<div :class="`${classRoot}-bar`">
			<span class="cancle" @click="$router.back()">取消</span>
			<van-button round @click="handleTakeNotes" :disabled="!mainContents"
				>保存</van-button
			>
		</div>

		<div :class="`${classRoot}-body`" v-if="courseSignUpData">
			<div class="title">{{ courseSignUpData.CourseInfo.Title }}</div>
			<div class="notes">
				<div class="notes_title">主要内容</div>
				<van-field
					v-model="mainContents"
					rows="10"
					autosize
					type="textarea"
					placeholder="在这里记录下这堂课的精彩内容吧！"
				/>
			</div>
		</div>
	</div>
</template>
<script>
import * as CourseSignUpApi from '../../../../apis/CourseSignUpApi';

export default {
	name: 'take-notes',
	data() {
		return {
			mainContents: null,
			courseSignupId: this.$route.query.course_signup_id, // 课程报名id
			courseSignUpData: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		this.getNotesData();
	},
	methods: {
		/**
		 * 查看笔记
		 */
		getNotesData() {
			this.$toast.loading('正在加载...');
			CourseSignUpApi.getCourseSignUpById(this.courseSignupId)
				.then(res => {
					if (res.Code === 0) {
						this.courseSignUpData = res.Body;
						this.mainContents = this.courseSignUpData.TakeNotes;
					} else {
						this.$toast.fail(res.Message);
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 记笔记
		 */
		handleTakeNotes() {
			this.$toast.loading('正在保存...');
			CourseSignUpApi.TakeNotes(this.courseSignupId, {
				TakeNotes: this.mainContents
			})
				.then(res => {
					if (res.Code === 0) {
						this.$router.replace({
							path: '/mother/look-notes',
							query: {
								course_signup_id: this.courseSignupId
							}
						});
					} else {
						this.$toast.fail(res.Message);
					}
				})
				.finally(this.$toast.clear);
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-take-notes';
.@{inner-prefix} {
	height: 100%;
	&-bar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 16px 9px 16px 20px;
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

	&-body {
		// height: calc(100% - 62px);
		// overflow: scroll;
		.title {
			font-size: 18px;
			color: #333333;
			font-weight: bold;
			padding: 16px 9px 35px 20px;
		}
		.notes {
			// box-shadow: 1px 1px 3px rgba(221, 221, 221, 1);
			margin-bottom: 10px;
			.notes_title {
				font-size: 15px;
				color: #333333;
				font-weight: bold;
				padding: 9px 16px;
				line-height: 30px;
				background: #fff8f8;
				border-radius: 10px 10px 0 0;
			}
		}
	}
}
</style>
