<template>
	<div :class="classRoot">
		<van-grid :column-num="2">
			<template v-for="item in data['SectionItems']">
				<van-grid-item
					:key="item['SectionItemID']"
					@click="$emit('onClick', item)"
				>
					<van-row :class="`${classRoot}-item`">
						<van-col :class="`${classRoot}-item-right`" span="15">
							<div :class="`${classRoot}-item-right-title`">
								{{ item['Title'] }}
							</div>
							<div :class="`${classRoot}-item-right-intro`">
								{{ item['SubContent'] }}
							</div>
						</van-col>
						<van-col :class="`${classRoot}-item-left`" span="8">
							<svg-icon :value="item['Icon']" :size="3.5" />
						</van-col>
					</van-row>
				</van-grid-item>
			</template>
		</van-grid>
	</div>
</template>

<script>
export default {
	name: 'type0',
	props: {
		data: { type: Object, default: null }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	}
};
</script>

<style lang="less">
@import '../../../../../../style/variable.less';
@inner-prefix: ~'@{prefix}-type0';

.@{inner-prefix} {
	margin-top: 5px;

	&-item {
		width: 100%;
		padding-left: 10px;
		&-left {
			background: rgba(246, 216, 216, 0.35);
			border-radius: 50%;
			text-align: center;
		}
		&-right {
			&-title {
				color: #000000;
				font-size: 17px;
			}

			&-intro {
				color: #888888;
				font-size: 13px;
				margin-top: 0.5rem;
			}
		}
	}

	.van-grid {
		&::after {
			border: unset;
		}

		&-item {
			box-shadow: 0 2px 3px rgba(191, 188, 188, 0.22);
			&:first-child {
				padding-right: 2px;
				.van-grid-item__content {
					border-radius: 10px 0 0 10px;
					&::after {
						border: unset;
					}
				}
			}
			&:last-child {
				padding-left: 2px;
				.van-grid-item__content {
					border-radius: 0 10px 10px 0;
					&::after {
						border: unset;
					}
				}
			}
		}
	}
}
</style>
