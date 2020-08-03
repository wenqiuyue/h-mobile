<template>
	<div :class="classRoot">
		<section-title :title="data['Title']" />
		<van-grid
			:class="`${classRoot}-grid`"
			:gutter="10"
			:column-num="3"
			:border="false"
		>
			<template v-for="item in data['SectionItems']">
				<van-grid-item
					:key="item['SectionItemID']"
					@click="$emit('onClick', item)"
				>
					<div
						:class="`${classRoot}-item`"
						:style="{ backgroundColor: item['Color'] }"
					>
						<svg-icon :value="item['Icon']" :size="4" />
						<div>{{ item['Title'] }}</div>
						<div>{{ item['SubContent'] }}</div>
					</div>
				</van-grid-item>
			</template>
		</van-grid>
	</div>
</template>

<script>
import SectionTitle from '../title';

export default {
	name: 'type4',
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
@inner-prefix: ~'@{prefix}-type4';

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
		text-align: center;
		padding: 1rem 1rem;
		div {
			color: @font-color-middle;
			font-size: 0.9rem;
			margin-top: 5px;
			line-height: 1.2rem;
		}
	}
}
</style>
