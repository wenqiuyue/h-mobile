<template>
	<div :class="classRoot">
		<van-row @click="$emit('click')">
			<van-col :class="`${classRoot}-icon`" span="5">
				<img :src="iconImg" />
			</van-col>
			<van-col span="16" :class="`${classRoot}-content`">
				<template v-if="data && data.length">
					<ul>
						<li
							v-for="item in data"
							:key="item['MessageID']"
							class="van-ellipsis"
						>
							{{ item['Title'] }}
						</li>
					</ul>
				</template>
				<template v-else>
					<div :class="`${classRoot}-content-empty`">暂无消息</div>
				</template>
			</van-col>
			<van-col span="3" :class="`${classRoot}-action`">
				<van-icon name="arrow" size="1.5rem" />
			</van-col>
		</van-row>
	</div>
</template>
<script>
const iconImg = require('../../../../assets/notice.gif');

export default {
	name: 'remind',
	data() {
		return {
			iconImg
		};
	},
	props: {
		data: { type: Array, default: null }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	},
	methods: {}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';
@inner-prefix: ~'@{prefix}-remind';
.@{inner-prefix} {
	z-index: 0;
	position: relative;
	height: 4.4rem;
	padding-top: 0.4rem;
	background-color: white;
	margin-bottom: 2px;
	box-shadow: 0px 2px 3px rgba(191, 188, 188, 0.22);

	.van-row {
		background-color: @background-color;
		.van-col {
			height: 4rem;
		}
	}
	&-content {
		ul {
			padding: 0.75rem 0;

			li {
				color: #795548;
				font-size: 13px;
				line-height: 1.5rem;
			}
		}
		&-empty {
			font-size: 1rem;
			text-align: left;
			line-height: 4rem;
		}
	}

	&-icon,
	&-action {
		text-align: center;
		line-height: 4rem;

		img {
			position: relative;
			bottom: 2px;
			height: 22px;
			vertical-align: middle;
		}

		svg,
		.van-icon {
			vertical-align: middle;
			color: @font-color-secondary;
		}
	}
}
</style>
