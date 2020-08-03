<template>
	<div :class="classRoot">
		<ValidationProvider
			:rules="data.DefaultRegexs"
			:name="data.FieldName"
			v-slot="{ errors }"
		>
			<van-field
				class="cell"
				v-model="value"
				readonly
				clickable
				:label="data.FieldName"
				:placeholder="data.Prompt"
				:required="data.IsRequire === 0 ? false : true"
				:error-message="errors.join('')"
				@click="isEdit ? '' : $refs['curr'].handleShow()"
			/>
		</ValidationProvider>
		<cascade
			ref="curr"
			v-model="address"
			:keys="curAreaKeys"
			full-field="CurrAddress"
			@done="handleCurAreaDone"
		/>
	</div>
</template>
<script>
export default {
	name: 'type10',
	data() {
		return {
			curAreaKeys: ['Province', 'City', 'District', 'Village', 'Community'], // 行政区划基础字段

			address: {
				CurrAddress: this.data.FieldCode,
				RestProvince: null,
				RestAddress: null
			},
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
	methods: {
		/**
		 * 现地址确认回调
		 */
		handleCurAreaDone(data) {
			if (!this.address.RestProvince) {
				for (let i = 0; i < data.values.length; i += 1) {
					if (!data.values[i]) {
						break;
					}
					this.curAreaKeys[i] = data.values[i];
				}
				this.address.RestAddress = data.fullText;
				this.value = this.address.CurrAddress;
			}
		}
	}
};
</script>
<style lang="less">
@import '../../../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-type10';
.@{inner-prefix} {
	.cell {
		padding: 20px;
		border-bottom: 1px solid #eeeeee;
		.van-field__label {
			color: #666666;
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
