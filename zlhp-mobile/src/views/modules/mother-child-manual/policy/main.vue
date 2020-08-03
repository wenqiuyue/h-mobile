<template>
	<div :class="classRoot">
		<van-nav-bar
			title="惠民政策"
			left-arrow
			@click-left="$router.back()"
		></van-nav-bar>
		<div :class="`${classRoot}-body`">
			<div class="content_array" v-for="(item, index) in 3" :key="index">
				<van-row class="content">
					<van-col :span="index === 0 ? 16 : 24" class="policy_content">
						<span class="policy_content_title"
							>怀孕初期症状有哪些怀孕初期症状有哪些怀孕初期症状有哪些怀孕初期症状有哪些怀孕初期症状有哪些</span
						>
						<span class="subtitle">
							<label>惠民政策</label>
							<label>浏览次数：24</label>
						</span>
						<span class="policy_content_container">
							怀孕初期有哪些症状？专家表示怀孕初期最明显的症状就是的症状就是的症状就是的症状就是的症状就是的症状就是的症状就是的症状就是的症状就是
						</span>
					</van-col>
					<van-col span="8" class="policy_img" v-if="index === 0">
						<van-image src="https://img.yzcdn.cn/vant/cat.jpeg" />
					</van-col>
				</van-row>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'policy',
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-policy';
.@{inner-prefix} {
	&-body {
		margin-top: 5px;
		background: #ffffff;
		border-radius: 5px;
		.content_array {
			.content {
				padding: 22px 10px;
				border-bottom: 1px solid #eeeeee;
				.policy_content {
					padding-right: 16px;
					display: flex;
					flex-direction: column;
					.policy_content_title {
						font-size: 17px;
						color: #333333;
						letter-spacing: 1px;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						overflow: hidden;
						text-overflow: ellipsis;
						-webkit-box-orient: vertical;
					}
					.subtitle {
						font-size: 13px;
						color: #bbbbbb;
						margin-top: 5px;
						label {
							margin-right: 20px;
						}
					}
					.policy_content_container {
						font-size: 14px;
						color: #999999;
						margin-top: 12px;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						overflow: hidden;
						text-overflow: ellipsis;
						-webkit-box-orient: vertical;
					}
				}
				.policy_img {
					text-align: center;
					.van-image {
						width: 100px;
						height: 70px;
						img {
							border-radius: 10px;
						}
					}
				}
			}
		}
	}
}
</style>
