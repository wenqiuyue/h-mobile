<template>
	<div :class="classRoot">
		<div :class="`${classRoot}-knowledge`">
			<div class="title"><span class="title_line"></span>孕期知识</div>
			<div class="content_array" v-for="(item, index) in 3" :key="index">
				<van-row class="content" v-if="index === 0">
					<van-col span="16" class="content_title">
						怀孕初期症状有哪些怀孕初期症状有哪些怀孕初期症状有哪些怀孕初期症状有哪些怀孕初期症状有哪些
					</van-col>
					<van-col span="8" class="img">
						<van-image
							:src="require('../../../../../assets/Independentfiling.png')"
						/>
					</van-col>
				</van-row>
				<van-row class="content" v-else-if="index === 1">
					<van-col span="24" class="content_title">
						怀孕初期症状有哪些怀孕初期症状有哪些怀孕初期症状有哪些怀孕初期症状有哪些怀孕初期症状有哪些
					</van-col>
				</van-row>
				<van-row class="content" v-else-if="index === 2">
					<van-col span="24" class="content_title">
						怀孕初期症状有哪些怀孕初期症状有哪些怀孕初期症状有哪些怀孕初期症状有哪些怀孕初期症状有哪些
					</van-col>
					<van-col span="24" class="imgs">
						<van-image
							v-for="(item, index) in 3"
							:key="index"
							:src="require('../../../../../assets/Independentfiling.png')"
						/>
					</van-col>
				</van-row>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'type6',
	props: {
		data: { type: Object, default: null }
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

@inner-prefix: ~'@{prefix-mother}-type6';
.@{inner-prefix} {
	&-knowledge {
		margin-top: 5px;
		background: #ffffff;
		padding-top: 13px;
		border-radius: 5px;
		.title {
			font-size: 18px;
			color: #323232;
			.title_line {
				border-left: 5px solid #ff7979;
				margin-right: 15px;
				border-radius: 5px;
			}
		}
		.content_array {
			.content {
				padding: 23px 10px;
				border-bottom: 1px solid #eeeeee;
				.content_title {
					padding-right: 16px;
					font-size: 17px;
					color: #333333;
					letter-spacing: 1px;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-box-orient: vertical;
				}
				.img {
					text-align: center;
					.van-image {
						width: 100px;
						height: 70px;
						border-radius: 10px;
					}
				}
				.imgs {
					margin-top: 12px;
					.van-image {
						width: 100px;
						height: 70px;
						border-radius: 10px;
						margin-right: 10px;
					}
				}
			}
		}
	}
}
</style>
