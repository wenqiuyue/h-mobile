<template>
	<div :class="classRoot">
		<van-nav-bar
			title="选择科室"
			left-arrow
			@click-left="$router.back()"
		></van-nav-bar>
		<div :class="`${classRoot}-body`" v-if="departsData && departsData.length">
			<van-panel
				class="department_panel"
				v-for="(item, index) in departsData"
				:key="index"
				@click="notice(item)"
			>
				<template #header>
					<div class="department">
						<label>{{ item.Title }}</label>
						<svg-icon value="icon-home_RightArrow" :size="1.1" />
					</div>
				</template>
			</van-panel>
		</div>
		<hint v-else-if="!loding" message="这里好冷清，没有任何科室" />
	</div>
</template>
<script>
import * as HisBespeakApi from '../../../../apis/HisBespeakApi';

export default {
	name: 'select-department',
	data() {
		return {
			departsData: null, // 科室数据
			loding: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		this.getDepartmentsData();
	},
	methods: {
		/**
		 * 获取科室列表
		 */
		getDepartmentsData() {
			this.$toast.loading('加载中...');
			this.loding = true;
			HisBespeakApi.getDeparts()
				.then(res => {
					if (res.Code === 0) {
						this.departsData = res.Body;
					} else {
						this.$toast.fail(res.Message);
					}
				})
				.finally(() => {
					this.$toast.clear();
					this.loding = false;
				});
		},
		/**
		 * 选择就诊时间
		 */
		notice(data) {
			this.$router.push({
				path: '/mother/notice',
				query: {
					reservation_id: data.ReservationID,
					medical_card_id: this.$route.query.medical_card_id
				}
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-select-department';
.@{inner-prefix} {
	height: 100%;
	background: #f8f8f8;
	&-body {
		height: calc(100% - 67px);
		overflow: scroll;
		padding: 10px 5px;
		.department_panel {
			border-radius: 10px;
			.department {
				margin-bottom: 5px;
				padding: 19px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-radius: 10px;
				label {
					font-size: 16px;
					color: #333333;
				}
			}
		}
	}
}
</style>
