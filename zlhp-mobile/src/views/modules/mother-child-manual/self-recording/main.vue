<template>
	<div :class="classRoot">
		<van-nav-bar
			title="自我记录"
			left-arrow
			@click-left="$router.back()"
		></van-nav-bar>
		<div :class="`${classRoot}-body`">
			<div v-for="(item, index) in sectionData" :key="index">
				<sweet-time-type
					v-if="item.Type === 4 && item.IsShowTitle === 1"
					:data="item"
				></sweet-time-type>
				<recording-type
					v-if="item.Type === 3 && item.IsShowTitle === 1"
					:data="item"
				></recording-type>
				<select-type
					v-if="item.Type === 4 && item.IsShowTitle === 0"
					:data="item"
				></select-type>
			</div>
		</div>
	</div>
</template>
<script>
import Vue from 'vue';
import components from './components';
import * as SectionModelsApi from '../../../../apis/SectionModelsApi';
import * as SectionsApi from '../../../../apis/SectionsApi';

Vue.use(components);
export default {
	name: 'self-recording',
	data() {
		return {
			sectionModelsData: null,
			sectionData: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		this.getSectionModelsData();
	},
	methods: {
		/**
		 * 获取自我记录栏目
		 */
		getSectionModelsData() {
			this.$toast.loading('加载中...');
			SectionModelsApi.getSectionModels(4)
				.then(res => {
					if (res.Code === 0) {
						this.sectionModelsData = res.Body;
						// 根据模式获取板块
						SectionsApi.getSectionByModels(
							this.sectionModelsData.SectionModelVal
						).then(result => {
							if (result.Code === 0) {
								this.sectionData = result.Body;
							} else {
								this.$toast.fail(result.Message);
							}
						});
					} else {
						this.$toast.fail(res.Message);
					}
				})
				.finally(this.$toast.clear);
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-self-recording';
.@{inner-prefix} {
	background: #f9f9f9;
	height: 100%;
	&-body {
		padding-bottom: 40px;
		height: calc(100% - 86px);
		overflow: scroll;
	}
}
</style>
