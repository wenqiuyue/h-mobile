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
				@click="handleShowPicker"
			/>
		</ValidationProvider>
		<van-popup v-model="showPicker" position="bottom">
			<van-datetime-picker
				:value="currentTime"
				:type="data.FormModel === 7 ? 'date' : 'time'"
				:min-date="new Date(data.DateMin)"
				:max-date="new Date(data.DateMax)"
				@confirm="onConfirm"
				@cancel="showPicker = false"
			/>
		</van-popup>
	</div>
</template>
<script>
export default {
	name: 'type78',
	data() {
		return {
			value: null,
			showPicker: false,
			currentTime: new Date(this.data.DateMax)
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
		 * 时间选择器时间
		 * 当value有值时，时间选择器的时间为value值，否则时间选择器的时间为最大时间
		 */
		handleShowPicker() {
			if (!this.isEdit) {
				this.showPicker = true;
				if (this.value) {
					this.currentTime = new Date(this.value);
				} else {
					this.currentTime = new Date(this.data.DateMax);
				}
			}
		},
		onConfirm(time) {
			if (this.data.FormModel === 7) {
				this.value = new Date(time).format('yyyy-MM-dd');
			} else {
				this.value = time;
			}
			this.showPicker = false;
		}
	}
};
</script>
<style lang="less">
@import '../../../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-type78';
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
