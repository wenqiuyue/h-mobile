<template>
	<div :class="classRoot">
		<ValidationProvider
			:rules="data.DefaultRegexs"
			:name="data.FieldName"
			v-slot="{ errors }"
		>
			<van-field
				class="cell"
				readonly
				clickable
				v-model="value"
				:required="data.IsRequire === 0 ? false : true"
				:label="data.FieldName"
				:placeholder="data.Prompt"
				:error-message="errors.join('')"
				@click="isEdit ? '' : (picker = true)"
			/>
		</ValidationProvider>
		<van-popup v-model="picker" position="bottom">
			<van-picker
				show-toolbar
				:columns="JSON.parse(this.data.Values)"
				@confirm="onTypeConfirm"
				@cancel="picker = false"
			/>
		</van-popup>
	</div>
</template>
<script>
export default {
	name: 'type3',
	data() {
		return {
			picker: false,
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
		onTypeConfirm(val) {
			this.value = val.text;
			this.picker = false;
		}
	}
};
</script>
<style lang="less">
@import '../../../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-type3';
.@{inner-prefix} {
	.cell {
		padding: 20px;
		border-bottom: 1px solid #eeeeee;
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
