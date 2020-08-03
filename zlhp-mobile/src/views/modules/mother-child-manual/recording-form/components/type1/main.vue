<template>
	<div :class="classRoot">
		<ValidationProvider
			:rules="data.DefaultRegexs"
			:name="data.FieldName"
			v-slot="{ errors }"
		>
			<van-field
				:disabled="isEdit ? true : false"
				class="cell"
				:required="data.IsRequire === 0 ? false : true"
				v-model="value"
				:label="data.FieldName"
				:placeholder="data.Prompt"
				:error-message="errors.join('')"
			>
				<span slot="right-icon" v-if="data.Unit">{{ data.Unit }}</span>
			</van-field>
		</ValidationProvider>
	</div>
</template>
<script>
export default {
	name: 'type1',
	data() {
		return {
			value: null
		};
	},
	props: {
		data: { type: Object, default: null },
		isEdit: { type: Boolean, default: false }
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

@inner-prefix: ~'@{prefix-mother}-type1';
.@{inner-prefix} {
	.cell {
		padding: 20px;
		border-bottom: 1px solid #eeeeee;
		justify-content: space-between;
		.van-field__label {
			color: #666666;
			width: auto;
		}
		.van-field__control {
			text-align: right;
			font-size: 15px;
		}
		.van-field__error-message {
			text-align: right;
		}
	}
}
</style>
