<!-- 甜蜜时刻 -->
<template>
	<div :class="classRoot">
		<van-panel :class="`${classRoot}-sweet_time`">
			<template #header>
				<div class="sweet_time_title">{{ data.Title }}</div>
				<van-grid :column-num="3" class="grid">
					<van-grid-item
						v-for="(sweettime, index) in data.SectionItems"
						:key="index"
						@click="$router.push({ path: sweettime.Url })"
					>
						<van-image
							:src="
								require(`../../../../../../assets/mother-child-manual/${sweettime.Icon}`)
							"
						/>
						<p>{{ sweettime.Title }}</p>
					</van-grid-item>
				</van-grid>
			</template>
		</van-panel>
	</div>
</template>
<script>
export default {
	name: 'sweet-time-type',
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

@inner-prefix: ~'@{prefix-mother}-sweet-time-type';
.@{inner-prefix} {
	&-sweet_time {
		padding: 20px 18px 0 18px;
		.sweet_time_title {
			font-size: 17px;
			color: #333333;
			font-weight: bold;
		}
		.grid {
			margin-top: 15px;
			.van-grid-item {
				border: none;
				.van-image {
					width: 65px;
					height: 67px;
					img {
						border-radius: 10px;
					}
				}
				.van-hairline::after {
					border: none;
				}
				p {
					font-size: 14px;
					color: #333333;
				}
			}
		}
		.van-hairline--top::after {
			border: none;
		}
	}
}
</style>
