<template>
	<div :class="classRoot">
		<van-panel :class="`${classRoot}-select`">
			<template #header>
				<van-grid :column-num="3" class="grid">
					<van-grid-item
						v-for="(selectItem, index) in data.SectionItems"
						:key="index"
						@click="$router.push({ path: selectItem.Url })"
					>
						<van-image
							:src="
								require(`../../../../../../assets/mother-child-manual/${selectItem.Icon}`)
							"
						/>
						<p>{{ selectItem.Title }}</p>
					</van-grid-item>
				</van-grid>
			</template>
		</van-panel>
	</div>
</template>
<script>
export default {
	name: 'select-type',
	data() {
		return {};
	},
	props: {
		data: { type: Object, default: null }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {},
	methods: {}
};
</script>
<style lang="less">
@import '../../../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-select-type';
.@{inner-prefix} {
	&-select {
		padding: 0 18px;
		margin-top: 5px;
		.sweet_time_title {
			font-size: 17px;
			color: #333333;
			font-weight: bold;
		}
		.grid {
			.van-grid-item {
				border: none;
				.van-image {
					width: 76px;
					height: 65px;
				}
				.van-hairline::after {
					border: none;
				}
				p {
					font-size: 14px;
					color: #333333;
					text-align: center;
				}
			}
		}
		.van-hairline--top::after {
			border: none;
		}
	}
}
</style>
