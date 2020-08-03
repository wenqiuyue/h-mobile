<template>
	<div :class="classRoot">
		<van-nav-bar title="保健指导" left-arrow @click-left="$router.back()" />
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<van-tabs
				v-model="active"
				animated
				swipeable
				:swipe-threshold="3"
				color="#EF98AB"
				line-width="90px"
				v-if="list && list.length"
			>
				<template v-for="(item, index) in list">
					<van-tab
						:key="index"
						:title="`孕${item['ArchiveWeeks']}周+${item['ArchiveDays']}天`"
					>
						<hint
							v-if="JSON.parse(item['HealthGuidance']).length === 0"
							message="未找到健康指导"
						/>
						<template
							v-else
							v-for="(t, i) in JSON.parse(item['HealthGuidance'])"
						>
							<van-slider :key="i" content-position="left">
								{{ t['Name'] }}
							</van-slider>
							<div
								:key="i"
								v-html="t['Content'].replace(new RegExp('\n', 'g'), '<br/>')"
							/>
						</template>
					</van-tab>
				</template>
			</van-tabs>
			<hint v-else />
		</van-pull-refresh>
	</div>
</template>
<script>
import { GetHealthGuidances } from '../../../apis/ArchiveRecordsApi';

export default {
	name: 'health-instruction',
	data() {
		return {
			isLoading: false,
			active: 0,
			list: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		this.onRefresh();
	},
	methods: {
		/**
		 * 刷新
		 */
		onRefresh() {
			this.isLoading = true;
			this.$toast.loading('加载中');
			GetHealthGuidances()
				.then(data => {
					if (data.Code === 0) {
						this.list = data.Body;
					}
				})
				.finally(() => {
					this.$toast.clear();
					this.isLoading = false;
				});
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';
@inner-prefix: ~'@{prefix-mother}-health-instruction';
.@{inner-prefix} {
	height: 100%;
	background-color: @background-color-container;
	.van-pull-refresh {
		height: calc(100% - 46px);
		&__track {
			min-height: 100%;
		}
	}
}
</style>
