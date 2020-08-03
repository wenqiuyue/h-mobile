<template>
	<div :class="classRoot">
		<section-title :title="data['Title']" />
		<div :class="`${classRoot}-content`">
			<template v-for="item in data['SectionItems']">
				<van-card
					:key="item['SectionItemID']"
					:desc="item['SubContent']"
					:title="item['Title']"
					:thumb="item['Icon']"
					@click="$emit('onClick', item)"
				>
					<svg-icon
						v-if="!item['Icon']"
						slot="thumb"
						:size="1.5"
						value="icon-biaotiQianZui"
					/>
				</van-card>
			</template>
		</div>
		<van-button
			v-show="false"
			block
			:class="`${classRoot}-more`"
			@click="handleMore"
			:style="{ color: moreColor }"
		>
			查看更多
			<svg-icon value="icon-PinkOrange_right" />
		</van-button>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import SectionTitle from '../title';
import types from '../../../../../../commons/types';

export default {
	name: 'type3',
	components: { SectionTitle },
	props: {
		data: { type: Object, default: null }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		},
		...mapState({
			mode: state => state[types.MODE]
		}),
		moreColor() {
			if (this.mode === 'mother') {
				return '#ffbab7';
			}
			return '#F190BE';
		}
	},
	methods: {
		/**
		 * 右上角图标点击事件
		 */
		handleClickIcon() {
			// eslint-disable-next-line no-console
			console.log('右上角图标');
		},
		/**
		 * 点击跟多事件
		 */
		handleMore() {
			// eslint-disable-next-line no-console
			console.log('更多');
		}
	}
};
</script>

<style lang="less">
@import '../../../../../../style/variable.less';
@inner-prefix: ~'@{prefix}-type3';

.@{inner-prefix} {
	background-color: @background-color;
	padding-bottom: 1rem;
	border-radius: 5px;
	box-shadow: 0 1.5px 3px rgba(142, 142, 142, 0.2);

	&-content {
		// padding-left: 15px;
		padding-right: 5px;
	}

	.van-card {
		background-color: unset;
		border-bottom: 1px solid #e1e1e1;

		&:last-child {
			border: unset;
		}

		&__thumb {
			width: unset;
			height: unset;
			img {
				width: unset;
				height: 50px;
			}
		}

		&__content {
			min-height: unset;
		}

		&__title {
			font-size: 16px;
			color: #000000;
			line-height: 2rem;
		}

		&__desc {
			font-size: 14px;
			line-height: 1.9rem;
			color: #666666;
		}
	}

	&-more {
		border: unset;
		text-align: center;
		svg {
			position: relative;
			top: 2px;
		}
	}
}
</style>
