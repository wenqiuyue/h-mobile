<template>
	<div :class="classRoot">
		<div :class="`${classRoot}-number`">
			<van-grid :column-num="4">
				<van-grid-item
					v-for="(item, index) in data"
					:key="index"
					@click="
						item.NumberSoureStatus !== '已过期' && item.SurplusTotal == 1
							? $emit('handleSelectNum', item)
							: ''
					"
					:class="
						`optional ${
							item.NumberSoureStatus === '已过期' || item.SurplusTotal == 0
								? 'not_optional'
								: ''
						}`
					"
				>
					<span class="num">{{ item.ShowSequenceNumber }}</span
					><span>{{ item.BeginTeim ? item.BeginTeim.slice(0, 5) : '' }}</span>
				</van-grid-item>
			</van-grid>
		</div>
	</div>
</template>
<script>
export default {
	name: 'type0',
	props: {
		data: { type: Array, default: null }
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	methods: {
		/**
		 * 选择号
		 */
		selectNum(data) {
			this.$router.push({
				path: '/mother/information-confirmation',
				query: {
					depart_id: this.schedulingInfoData.DepartmentId,
					medical_card_id: this.medicalCardId,
					number: data.Number
				}
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-type0';
.@{inner-prefix} {
	&-number {
		margin-top: 6px;
		.optional {
			.van-grid-item__content {
				flex-direction: row;
				align-items: center;
				border: 1px solid #f2f2f2;
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
			color: #dddddd;
			.van-grid-item__content {
				.num {
					color: #dddddd;
					border: 1px solid #ececec;
				}
			}
		}
	}
}
</style>
