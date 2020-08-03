<template>
	<div :class="classRoot">
		<section-title :title="data['Title']" />
		<van-grid
			:class="`${classRoot}-grid`"
			:gutter="10"
			:column-num="2"
			:border="false"
		>
			<template v-for="item in data['SectionItems']">
				<van-grid-item
					:key="item['SectionItemID']"
					@click="$emit('onClick', item)"
				>
					<van-row
						:class="`${classRoot}-item`"
						:style="{ backgroundColor: item['Color'] || 'skyblue' }"
					>
						<van-col :class="`${classRoot}-item-left`" span="10">
							<svg-icon :value="item['Icon']" :size="2" />
						</van-col>
						<van-col :class="`${classRoot}-item-right`" span="14">
							{{ item['Title'] }}
						</van-col>
					</van-row>
				</van-grid-item>
			</template>
		</van-grid>
	</div>
</template>

<script>
import SectionTitle from '../title';

export default {
	name: 'type2',
	components: { SectionTitle },
	props: {
		data: { type: Object, default: null }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	}
};
</script>

<style lang="less">
@import '../../../../../../style/variable.less';
@inner-prefix: ~'@{prefix}-type2';

.@{inner-prefix} {
	&-grid {
		padding: 1rem 0;
		background-color: white;
		border-radius: 5px;
		box-shadow: 0 1.5px 3px rgba(142, 142, 142, 0.2);

		.van-grid-item__content {
			padding: unset;
		}
	}
	&-item {
		width: 100%;
		padding: 1rem 0;
		text-align: center;
		&-right {
			color: @font-color-middle;
			font-size: 1rem;
			line-height: 2rem;
		}
	}
}
</style>
