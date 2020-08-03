<template>
	<van-field
		readonly
		clickable
		:required="required"
		:label="label"
		:value="value ? new Date(value).format('yyyy-MM-dd') : null"
		:placeholder="placeholder || `请选择${label}`"
		@click="showPicker = true"
		:error-message="rulesErrors.join('')"
	>
		<van-popup
			slot="right-icon"
			v-model="showPicker"
			position="bottom"
			get-container="body"
		>
			<van-datetime-picker
				v-if="minDate && maxDate"
				v-model="dateVal"
				type="date"
				:min-date="minDate"
				:max-date="maxDate"
				:formatter="formatter"
				@confirm="handleDone"
				@cancel="handleCancel"
			/>
			<van-datetime-picker
				v-else-if="minDate"
				v-model="dateVal"
				type="date"
				:min-date="minDate"
				:formatter="formatter"
				@confirm="handleDone"
				@cancel="handleCancel"
			/>
			<van-datetime-picker
				v-else-if="maxDate"
				v-model="dateVal"
				type="date"
				:max-date="maxDate"
				:formatter="formatter"
				@confirm="handleDone"
				@cancel="handleCancel"
			/>
			<van-datetime-picker
				v-else
				v-model="dateVal"
				type="date"
				:formatter="formatter"
				@confirm="handleDone"
				@cancel="handleCancel"
			/>
		</van-popup>
	</van-field>
</template>
<script>
export default {
	name: 'date',
	data() {
		return {
			showPicker: false,
			dateVal: this.value ? this.value : this.maxDate
		};
	},
	model: { prop: 'value', event: 'input' },
	props: {
		value: { type: Date, default: new Date() },
		minDate: {
			type: Date,
			default: () =>
				new Date(new Date().setFullYear(new Date().getFullYear() - 30))
		},
		maxDate: { type: Date, default: () => new Date() },
		label: { type: String, default: null },
		placeholder: { type: String, default: null },
		required: { type: Boolean, default: false },
		rulesErrors: { type: Array, default: () => [] }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	},
	methods: {
		handleCancel() {
			this.showPicker = false;
		},
		handleDone(value) {
			this.$emit('input', value);
			this.showPicker = false;
		},
		formatter(type, value) {
			if (type === 'year') {
				return `${value}年`;
			}
			if (type === 'month') {
				return `${value}月`;
			}
			if (type === 'day') {
				return `${value}日`;
			}
			return value;
		}
	}
};
</script>
<style lang="less">
@import '../../style/variable.less';

@inner-prefix: ~'@{prefix}-date';
.@{inner-prefix} {
}
</style>
