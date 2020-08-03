<template>
	<div :class="classRoot">
		<van-image
			:class="`${classRoot}__avatar`"
			round
			height="3rem"
			width="3rem"
			:src="avatar"
		/>
		<div :class="`${classRoot}__title`" :style="{ color: color }">
			{{ title }} {{ intro }}
		</div>
		<svg-icon
			:class="`${classRoot}__icon`"
			:value="icon"
			:size="1.2"
			@click="$emit('onClick')"
		/>
	</div>
</template>
<script>
export default {
	name: 'simple-header',
	props: {
		avatar: { type: String, default: null },
		title: { type: String, default: null },
		intro: { type: String, default: null },
		icon: { type: String, default: 'icon-switch_PinkPurple' },
		color: { type: String, default: '#333333' }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	}
};
</script>
<style lang="less">
@import '../../style/variable.less';
@inner-prefix: ~'@{prefix}-simple-header';
.@{inner-prefix} {
	height: 3rem;
	line-height: 3rem;
	padding-top: 1rem;
	text-align: center;
	background-image: url('../../assets/bg_Production.png');
	background-size: contain;
	background-repeat: no-repeat;

	&__avatar,
	&__title,
	&__icon {
		font-size: 1rem;
		vertical-align: middle;
	}
	&__avatar {
		display: inline-block;
	}
	&__title {
		display: inline-block;
		padding: 0 10px;
	}
	&__icon {
		right: 1.5rem;
		top: 1.25rem;
	}
}
</style>
