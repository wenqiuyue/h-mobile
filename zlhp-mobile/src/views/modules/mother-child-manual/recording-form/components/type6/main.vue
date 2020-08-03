<template>
	<div :class="classRoot">
		<ValidationProvider>
			<van-field
				:label="data.FieldName"
				class="cell"
				:class="data.IsValueMultiLine === 1 ? 'multiline' : ''"
				:required="data.IsRequire === 0 ? false : true"
			>
				<template #input>
					<van-checkbox-group
						v-model="value"
						direction="horizontal"
						:disabled="isEdit ? true : false"
					>
						<van-checkbox
							class="checkbox"
							:name="item.val"
							checked-color="#F082A5"
							v-for="(item, index) in JSON.parse(data.Values)"
							:key="index"
							>{{ item.text }}</van-checkbox
						>
					</van-checkbox-group>
				</template>
			</van-field>
		</ValidationProvider>
	</div>
</template>
<script>
export default {
	name: 'type6',
	data() {
		return {
			checkboxGroup: [],
			value: []
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
	created() {
		// if (!this.data.FieldCode) {
		// 	this.data.FieldCode = [];
		// }
	},
	methods: {}
};
</script>
<style lang="less">
@import '../../../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-type6';
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
			.checkbox {
				margin-bottom: 8px;
			}
			.van-checkbox__icon--disabled .van-icon {
				background-color: #ffffff;
			}
			.van-checkbox__icon--checked .van-icon {
				background-color: #f082a5;
				border-color: #f082a5;
			}
			.van-checkbox__icon--disabled.van-checkbox__icon--checked .van-icon {
				color: #ffffff;
			}

			.van-checkbox__label--disabled {
				color: #323232;
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
