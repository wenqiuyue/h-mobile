<template>
	<van-cell-group>
		<template v-for="node in value">
			<template v-if="node['Child'].length">
				<van-collapse-item
					:key="node['HighRiskFactorID']"
					:title="node['Name']"
					:name="node['HighRiskFactorID']"
				>
					<high-risk-self-assessment-item v-model="node['Child']" />
				</van-collapse-item>
			</template>
			<template v-else>
				<van-cell
					:key="node['HighRiskFactorID']"
					clickable
					:title="node['Name']"
					@click="toggle(node['HighRiskFactorID'])"
				>
					<van-checkbox
						:ref="node['HighRiskFactorID']"
						slot="right-icon"
						:name="node['HighRiskFactorID']"
					/>
					<template v-if="node['Effect']">
						<van-icon
							slot="icon"
							name="question-o"
							style="line-height: 24px;margin-right: 5px;"
							size="20px"
							@click.stop="dialogEffect(node)"
						/>
					</template>
				</van-cell>
			</template>
		</template>
	</van-cell-group>
</template>
<script>
import { Dialog } from 'vant';

export default {
	name: 'high-risk-self-assessment-item',
	props: {
		value: { type: Array, default: null }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	methods: {
		/**
		 * 切换
		 */
		toggle(HighRiskFactorID) {
			this.$refs[HighRiskFactorID][0].toggle();
		},
		/**
		 * 显示Effect 信息
		 * @param obj
		 */
		dialogEffect(obj) {
			Dialog.alert({
				title: obj.Name,
				message: obj.Effect.trim()
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';
@inner-prefix: ~'@{prefix-mother}-high-risk-self-assessment-item';
.@{inner-prefix} {
}
</style>
