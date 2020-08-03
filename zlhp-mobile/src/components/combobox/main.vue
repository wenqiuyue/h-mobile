<template>
	<van-field
		v-model="showText"
		readonly
		:clickable="!disabled"
		:disabled="disabled"
		:error-message="errorMessage"
		:label="label"
		:placeholder="placeholder || `请选择${label}`"
		@click="handleShow"
	>
		<div slot="label" :class="required ? 'van-cell--required' : ''">
			{{ title ? title : label }}
		</div>
		<van-popup
			slot="button"
			v-model="showPicker"
			position="bottom"
			get-container="body"
		>
			<van-picker
				show-toolbar
				:columns="
					unNull ? options : [{ text: '请选择', value: 'unselect' }, ...options]
				"
				:default-index="defaultIndex"
				value-key="text"
				@cancel="showPicker = false"
				@confirm="onConfirm"
			/>
		</van-popup>
	</van-field>
</template>
<script>
export default {
	name: 'combobox',
	data() {
		return {
			showPicker: false
		};
	},
	model: { prop: 'value', event: 'input' },
	props: {
		value: { type: Number, default: null },
		options: { type: Array, default: null },
		label: { type: String, default: null },
		placeholder: { type: String, default: null },
		required: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		errorMessage: { type: String, default: null },
		title: { type: String, default: null },
		unNull: { type: Boolean, default: false } // 没有空数据
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		},
		showText() {
			if (!this.options) {
				return null;
			}
			const item = this.options.filter(m => m.value === this.value)[0];
			return item ? item.text : null;
		},
		defaultIndex() {
			if (!this.options) {
				return 0;
			}
			for (let i = 0; i < this.options.length; i += 1) {
				if (this.options[i].value === this.value) {
					if (this.unNull) {
						return i;
					}
					return i + 1;
				}
			}
			return 0;
		}
	},
	methods: {
		/**
		 * 显示
		 */
		handleShow() {
			if (!this.disabled) {
				this.showPicker = true;
			}
		},
		/**
		 * 完成
		 * @param item
		 */
		onConfirm(item) {
			if (item.value === 'unselect') {
				this.$emit('input', null);
			} else {
				this.$emit('input', item.value);
			}
			this.showPicker = false;
		}
	}
};
</script>
<style lang="less">
@import '../../style/variable.less';
@inner-prefix: ~'@{prefix}-combobox';
.@{inner-prefix} {
}
</style>
