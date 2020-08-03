<template>
	<div :class="classRoot">
		<ValidationProvider>
			<van-field
				class="cell"
				:label="data.FieldName"
				:required="data.IsRequire === 0 ? false : true"
			>
				<template #input>
					<van-switch
						v-model="value"
						size="22"
						active-color="#F082A5"
						:disabled="isEdit ? true : false"
					/>
				</template>
			</van-field>
		</ValidationProvider>
	</div>
</template>
<script>
export default {
	name: 'type5',
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

@inner-prefix: ~'@{prefix-mother}-type5';
.@{inner-prefix} {
	.cell {
		padding: 20px;
		border-bottom: 1px solid #eeeeee;
		.van-field__label {
			color: #666666;
			width: auto;
		}
		.van-field__control {
			display: flex;
			justify-content: flex-end;
			font-size: 15px;
			.van-switch--disabled {
				opacity: 1;
			}
		}
		.van-field__error-message {
			text-align: right;
		}
	}
}
</style>
