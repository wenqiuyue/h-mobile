<template>
	<div :class="classRoot">
		<ValidationProvider
			:rules="data.DefaultRegexs"
			:name="data.FieldName"
			v-slot="{ errors }"
		>
			<van-field
				class="cell"
				:class="data.IsValueMultiLine === 1 ? 'multiline' : ''"
				:label="data.FieldName"
				:required="data.IsRequire === 0 ? false : true"
				:error-message="errors.join('')"
				v-model="value"
			>
				<template #input>
					<van-radio-group
						v-model="value"
						direction="horizontal"
						:disabled="isEdit ? true : false"
					>
						<van-radio
							:name="item.val"
							checked-color="#F082A5"
							v-for="(item, index) in JSON.parse(data.Values)"
							:key="index"
							>{{ item.text }}</van-radio
						>
					</van-radio-group>
				</template>
			</van-field>
		</ValidationProvider>
	</div>
</template>
<script>
export default {
	name: 'type4',
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

@inner-prefix: ~'@{prefix-mother}-type4';
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
			.van-radio__icon--disabled .van-icon {
				background-color: #ffffff;
			}
			.van-radio__icon--checked .van-icon {
				background-color: #f082a5;
				border-color: #f082a5;
			}
			.van-radio__icon--disabled.van-radio__icon--checked .van-icon {
				color: #ffffff;
			}

			.van-radio__label--disabled {
				color: #323232;
			}
			.van-radio--horizontal {
				margin: 0 0 0 10px;
			}
		}
		.van-field__error-message {
			text-align: right;
		}
	}
	.multiline {
		padding: 10px 20px 10px 20px;
		flex-direction: column;
		.van-cell__value {
			margin-top: 10px;
		}
	}
}
</style>
