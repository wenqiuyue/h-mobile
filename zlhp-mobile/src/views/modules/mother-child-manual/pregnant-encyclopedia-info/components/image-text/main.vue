<template>
	<div :class="classRoot">
		<van-nav-bar left-arrow @click-left="$router.back()"></van-nav-bar>
		<div :class="`${classRoot}-body`" v-if="data" ref="body">
			<div class="top">
				<span class="title">{{ data.Title }}</span>
				<span class="subtitle"
					><label>{{ data.ParentArticle.Title }}</label></span
				>
			</div>
			<!-- <van-image v-if="data.ImagePath" class="info_img" :src="data.ImagePath" /> -->
			<div class="info_container" v-html="data.Content"></div>
			<div class="recommend" v-if="data.Recommend.length">
				<div class="recommend_title">相关内容推荐</div>
				<div
					class="content_array"
					v-for="(item, index) in data.Recommend"
					:key="index"
				>
					<van-row class="content" @click="handleInfo(item)">
						<van-col :span="item.ImagePath ? 16 : 24" class="content_title">
							<div class="title">
								{{ item.Title }}
							</div>
							<span class="recommend_subtitle"
								><label>{{ item.ParentArticle.Title }}</label></span
							>
						</van-col>
						<van-col span="8" class="content_img" v-if="item.ImagePath">
							<van-image :src="item.ImagePath" />
						</van-col>
					</van-row>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'image-text',
	props: {
		data: { type: Object, default: null }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	methods: {
		handleInfo(item) {
			this.$emit('articlesInfo', item);
			this.scrollTop(0);
		},
		/**
		 * 定位到
		 * @param distance
		 */
		scrollTop(distance) {
			this.$refs.body.scroll({
				top: distance,
				behavior: 'smooth'
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-image-text';
.@{inner-prefix} {
	height: 100%;
	&-body {
		height: calc(100% - 46px);
		overflow: scroll;
		background: #f8f8f8;
		.top {
			padding: 14px 15px 15px 20px;
			background: #ffffff;
			span {
				display: block;
			}
			.title {
				font-size: 18px;
				color: #333333;
			}
			.subtitle {
				margin-top: 7px;
				display: flex;
				justify-content: space-between;
				color: #bbbbbb;
			}
		}
		.info_img {
			height: 225px;
			width: 100%;
		}
		.info_container {
			background: #ffffff;
			padding: 1px 20px 20px 20px;
			p {
				font-size: 15px;
				color: #666666;
				line-height: 23px;
				text-indent: 2rem;
			}
		}
		.recommend {
			margin-top: 10px;
			background: #ffffff;
			border-radius: 5px;
			.recommend_title {
				font-size: 18px;
				color: #323232;
				padding: 13px;
				border-bottom: 1px solid #eeeeee;
			}
			.content_array {
				.content {
					padding: 23px 15px;
					border-bottom: 1px solid #eeeeee;
					.content_title {
						padding-right: 16px;
						font-size: 17px;
						color: #333333;
						.title {
							letter-spacing: 1px;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							overflow: hidden;
							text-overflow: ellipsis;
							-webkit-box-orient: vertical;
						}
						.recommend_subtitle {
							display: flex;
							justify-content: space-between;
							margin-top: 10px;
							font-size: 13px;
							color: #bbbbbb;
						}
					}
					.content_img {
						text-align: center;
						.van-image {
							width: 100px;
							height: 70px;
							border-radius: 10px;
							img {
								border-radius: 10px;
							}
						}
					}
				}
			}
		}
	}
}
</style>
