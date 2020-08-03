<template>
	<div :class="classRoot">
		剩余号源：{{
			data.ResidueNumberTotal
				? data.ResidueNumberTotal > 0
					? data.ResidueNumberTotal
					: 0
				: '无限号'
		}}
		<div :class="`${classRoot}-appointment_button`">
			<van-button v-if="isRegister" class="gray_button">
				已预约
			</van-button>
			<van-button
				v-else
				@click="
					data.ResidueNumberTotal > 0 || !data.ResidueNumberTotal
						? $emit('handleAppointment', 1)
						: ''
				"
				:class="
					data.ResidueNumberTotal > 0 || !data.ResidueNumberTotal
						? 'pink_button'
						: 'gray_button'
				"
			>
				点我预约
			</van-button>
		</div>
	</div>
</template>
<script>
export default {
	name: 'type2',
	data() {
		return {
			time: true
		};
	},
	props: {
		data: { type: Object, default: null },
		isRegister: { type: Boolean, default: false }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	methods: {}
};
</script>
<style lang="less">
@import '../../../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-type2';
.@{inner-prefix} {
	font-size: 20px;
	color: #333333;
	text-align: center;
	padding: 28px 0 20px 0;
	&-appointment_button {
		margin-top: 38px;
		text-align: center;
		.van-button {
			width: 325px;
			height: 45px;
			font-size: 16px;
			color: #ffffff;
			box-shadow: @box-shadow;
			border-radius: 5px;
		}
		.pink_button {
			background: @next-button-color;
			border-color: @next-button-color;
		}
		.gray_button {
			background: #e1d9d9;
			border-color: #e1d9d9;
		}
	}
}
</style>
