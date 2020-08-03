<template>
	<div :class="classRoot">
		<div :class="`${classRoot}-message`">
			<van-row @click="$emit('click')">
				<van-col class="title" span="8">
					<span class="big_bg">
						<span class=" small_bg">{{ new Date().format('MM月dd日') }}</span>
						<van-image :src="require('../../../../assets/tips.png')" />
					</span>
				</van-col>
				<van-col span="16" class="content">
					<template v-if="data && data.length">
						<ul>
							<li v-for="item in data" :key="item['MessageID']">
								<label>·</label> {{ item['Title'] }}
							</li>
						</ul>
					</template>
					<template v-else>
						<div class="empty">暂无消息</div>
					</template>
				</van-col>
			</van-row>
		</div>
	</div>
</template>
<script>
export default {
	name: 'message',
	props: {
		data: { type: Array, default: null }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable';

@inner-prefix: ~'@{prefix}-message';
.@{inner-prefix} {
	&-message {
		height: 4.4rem;
		margin-top: 20px;
		.van-row {
			.van-col {
				height: 4rem;
			}
		}
		.title {
			position: relative;
			.big_bg {
				@bg-color: #fff1f1;
				@height: 46px;
				display: inline-block;
				position: absolute;
				background-color: @bg-color;
				height: @height;
				line-height: @height;
				width: 51px;
				text-align: center;
				color: white;
				font-size: 0.85rem;
				z-index: 99;
				left: 58px;
				bottom: 0;
				&::after {
					width: 0;
					height: 0;
					border-width: @height / 2;
					border-style: solid;
					border-color: transparent @bg-color @bg-color transparent;
					position: absolute;
					left: -@height;
					content: ' ';
				}
				.small_bg {
					@bg-color: #fdcacd;
					@height: 19px;
					display: inline-block;
					position: absolute;
					background-color: @bg-color;
					height: @height;
					line-height: @height;
					width: 55px;
					text-align: center;
					color: white;
					font-size: 0.85rem;
					z-index: 99;
					left: -4px;
					bottom: 0;
					&::after {
						width: 0;
						height: 0;
						border-width: @height / 2;
						border-style: solid;
						border-color: transparent @bg-color @bg-color transparent;
						position: absolute;
						left: -@height;
						content: ' ';
					}
				}
				.van-image {
					z-index: 999;
					position: absolute;
					right: 3px;
					width: 68px;
					height: 18px;
				}
			}
		}
		.content {
			padding-right: 10px;
			display: flex;
			align-items: center;
			ul {
				padding: 0.75rem 0;
				margin-left: 5px;
				li {
					color: #666666;
					font-size: 13px;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-box-orient: vertical;
					margin-top: 8px;

					label {
						font-size: 12px;
						color: #666666;
						font-weight: bold;
					}
				}
			}
			.empty {
				font-size: 1rem;
				text-align: left;
				line-height: 4rem;
			}
		}
	}
}
</style>
