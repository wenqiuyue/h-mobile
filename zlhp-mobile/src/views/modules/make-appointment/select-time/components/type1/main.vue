<template>
	<div :class="classRoot">
		<van-collapse v-model="timeSlot">
			<van-collapse-item
				v-for="(item, index) in data.Scheduling.Row"
				:key="index"
				:name="index"
				><template #title>
					<div class="title">
						<span>14：00 - 14：30</span
						><span :style="index === 1 ? 'color:#EF8EA3' : 'color:#BBBBBB'">{{
							index === 1 ? '8剩余' : '约满'
						}}</span>
					</div>
				</template>
				<van-grid :column-num="4">
					<van-grid-item
						v-for="(item, index) in data"
						:key="index"
						@click="$emit('handleSelectNum', item)"
						:class="`optional ${index === 1 ? 'not_optional' : ''}`"
					>
						<span class="num">{{ item.Number }}</span
						><span>09:00</span>
					</van-grid-item>
				</van-grid></van-collapse-item
			>
		</van-collapse>
	</div>
</template>
<script>
export default {
	name: 'type1',
	data() {
		return {
			timeSlot: ['1']
		};
	},
	props: {
		data: { type: Object, default: null }
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

@inner-prefix: ~'@{prefix-mother}-type1';
.@{inner-prefix} {
	.van-cell {
		padding: 15px 20px;
		.title {
			display: flex;
			justify-content: space-between;
			font-size: 15px;
			color: #666666;
		}
	}
	.van-collapse-item__content {
		padding: 0;
		.optional {
			.van-grid-item__content {
				flex-direction: row;
				align-items: center;
				border: 1px solid #f2f2f2;
				font-size: 14px;
				color: #333333;
				.num {
					font-size: 14px;
					background: #ffffff;
					color: #333333;
					border: 1px solid #dddddd;
					width: 22px;
					height: 22px;
					border-radius: 10px;
					text-align: center;
					line-height: 22px;
					margin-right: 5px;
				}
			}
		}
		.not_optional {
			.van-grid-item__content {
				color: #dddddd;
				.num {
					color: #dddddd;
					border: 1px solid #ececec;
				}
			}
		}
	}
}
</style>
