<template>
	<div :class="classRoot">
		<ValidationProvider
			:rules="data.DefaultRegexs"
			:name="data.FieldName"
			v-slot="{ errors }"
		>
			<van-field
				:required="data.IsRequire === 0 ? false : true"
				v-model="value"
				:readonly="isEdit ? true : false"
				rows="7"
				autosize
				type="textarea"
				:placeholder="data.Prompt"
				:error-message="errors.join('')"
			/>
		</ValidationProvider>
	</div>
</template>
<script>
export default {
	name: 'type2',
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

@inner-prefix: ~'@{prefix-mother}-type2';
.@{inner-prefix} {
}
</style>
