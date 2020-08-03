<template>
	<div :class="classRoot">
		<div
			:class="`${classRoot}-title`"
			:style="{ color: titleColor, fontSize: `${size / 1.2}rem` }"
		>
			<svg-icon :value="icon" :size="size" />
			{{ title }}
		</div>
		<template v-if="list">
			<p
				v-for="(item, index) in list"
				:key="index"
				v-html="sequence ? `${index + 1}、${item}` : item"
			/>
		</template>
		<slot v-else />
	</div>
</template>
<script>
export default {
	name: 'tips',
	props: {
		title: { type: String, default: '提示' },
		titleColor: { type: String, default: '#333333' },
		icon: { type: String, default: 'sign_Tips' },
		size: { type: Number, default: 1.5 },
		// 数据列表
		list: { type: Array, default: null },
		// 编号
		sequence: { type: Boolean, default: true }
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
@inner-prefix: ~'@{prefix}-tips';
.@{inner-prefix} {
	padding: 15px;
	font-size: 0.85rem;

	&-title {
		font-weight: bold;
		padding: 10px 5px;
		font-size: 1rem;
		line-height: 2rem;

		svg {
			position: relative;
			bottom: 2px;
			vertical-align: middle;
		}
	}
	p {
		padding: 0 15px;
		line-height: 1.5rem;
		font-size: 12px;
		color: #666666;
	}
}
</style>
