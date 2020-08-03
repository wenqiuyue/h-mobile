<template>
	<div :class="classRoot" v-if="courseSignUpData">
		<van-nav-bar
			title="学习笔记"
			left-arrow
			right-text="编辑"
			@click-right="editNotes"
			@click-left="$router.back()"
		></van-nav-bar>
		<div :class="`${classRoot}-body`">
			<van-row class="content">
				<van-col span="16" class="content_title">
					<span>{{ courseSignUpData.CourseInfo.Title }}</span>
					<span class="time">{{
						new Date(courseSignUpData.CourseInfo.ClassData).format('yyyy-MM-dd')
					}}</span>
				</van-col>
				<van-col span="8" class="top_img">
					<van-image
						:src="
							require('../../../../assets/mother-child-manual/learning.svg')
						"
					/>
				</van-col>
			</van-row>
			<div class="notes_container">
				<div class="title">
					<span class="big_square">
						<span class="small_square"></span>
					</span>
					主要内容
					<span class="first_circle"></span>
					<span class="second_circle"></span>
				</div>
				<div class="notes_main">
					{{ courseSignUpData.TakeNotes }}
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import * as CourseSignUpApi from '../../../../apis/CourseSignUpApi';

export default {
	name: 'look-notes',
	data() {
		return {
			courseSignUpData: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		this.$toast.loading('正在加载...');
		CourseSignUpApi.getCourseSignUpById(this.$route.query.course_signup_id)
			.then(res => {
				if (res.Code === 0) {
					this.courseSignUpData = res.Body;
				} else {
					this.$toast.fail(res.Message);
				}
			})
			.finally(this.$toast.clear);
	},
	methods: {
		/**
		 * 编辑笔记
		 */
		editNotes() {
			this.$router.push({
				path: '/mother/take-notes',
				query: {
					course_signup_id: this.$route.query.course_signup_id
				}
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-look-notes';
.@{inner-prefix} {
	height: 100%;
	&-body {
		height: calc(100% - 46px);
		overflow: scroll;
		.content {
			background: #ffffff;
			padding: 15px 0 2px 17px;
			border-bottom: 5px solid #eeeeee;
			.content_title {
				padding-right: 5px;
				font-size: 18px;
				color: #333333;
				letter-spacing: 1px;
				span {
					display: block;
				}
				.time {
					font-size: 15px;
					color: #bbbbbb;
					margin-top: 10px;
				}
			}
			.top_img {
				text-align: center;
				.van-image {
					width: 110px;
					height: 75px;
				}
			}
		}
		.notes_container {
			background: #ffffff;
			margin-top: 5px;
			padding: 0 10px 30px 10px;
			.title {
				padding: 21px 0;
				font-size: 16px;
				color: #333333;
				font-weight: bold;
				display: flex;
				flex-direction: row;
				align-items: center;
				span {
					display: block;
				}
				.big_square {
					width: 20px;
					height: 20px;
					background: rgba(241, 139, 171, 0.2);
					transform: rotate(45deg);
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 10px;
					.small_square {
						width: 9px;
						height: 9px;
						background: #f18bab;
					}
				}
				.first_circle {
					width: 6px;
					height: 6px;
					background: #f8b3c3;
					border-radius: 50%;
					margin-left: 9px;
				}
				.second_circle {
					width: 6px;
					height: 6px;
					background: #ffdbdb;
					border-radius: 50%;
					margin-left: 4px;
				}
			}
			.notes_main {
				padding: 20px 7px;
				font-size: 15px;
				color: #666666;
				line-height: 30px;
				background: #fafafa;
				min-height: 310px;
			}
		}
	}
}
</style>
