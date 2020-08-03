<template>
	<div :class="classRoot">
		<section-title :title="data['Title']" />
		<van-grid :class="`${classRoot}-grid`" :border="false">
			<template v-for="item in data['SectionItems']">
				<van-grid-item
					:key="item['SectionItemID']"
					:text="item['Title']"
					@click="$emit('onClick', item)"
				>
					<svg-icon slot="icon" :value="item['Icon']" :size="2.2" />
				</van-grid-item>
			</template>
		</van-grid>
	</div>
</template>

<script>
import SectionTitle from '../title';

export default {
	name: 'type1',
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
@inner-prefix: ~'@{prefix}-type1';

.@{inner-prefix} {
	margin-top: 8px;
	&-grid {
		background-color: @background-color;
		padding-bottom: 5px;
		border-radius: 0 0 10px 10px;
		.van-grid-item__text {
			margin-top: 0.5rem;
			font-size: 13px;
			color: #666666;
		}
	}
}
</style>
