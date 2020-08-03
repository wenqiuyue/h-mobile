<template>
	<div :class="classRoot">
		<div
			:class="`${classRoot}-manual`"
			v-if="data"
			@click="$emit('onClick', data.SectionItems[0])"
		>
			<van-image
				:src="require(`../../../../../../assets/${data.SectionItems[0].Icon}`)"
			/>
		</div>
	</div>
</template>
<script>
export default {
	name: 'type7',
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
@import '../../../../../../style/variable';

@inner-prefix: ~'@{prefix}-type7';
.@{inner-prefix} {
	&-manual {
		margin-top: 25px;
		text-align: center;
		.van-image {
			width: 330px;
			height: 110px;
		}
	}
}
</style>
