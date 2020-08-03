<template>
	<div :class="classRoot">
		<van-nav-bar title="消息详情" left-arrow @click-left="$router.back()" />
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<van-panel v-if="data" :title="data['HName']" :desc="data['Remark']">
				<div v-html="data['Content']"></div>
				<div slot="footer">
					{{ new Date(data['CreateTime']).format('yyyy年MM月dd日 hh:mm:ss') }}
				</div>
			</van-panel>
		</van-pull-refresh>
	</div>
</template>
<script>
import { GetAndRead } from '../../../apis/MessageApi';

export default {
	name: 'message-details',
	data() {
		return {
			isLoading: false,
			data: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
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
			this.$toast.loading('加载中...');
			GetAndRead(this.$route.query.id, !this.data)
				.then(response => {
					if (response.Code === 0) {
						this.data = response.Body;
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
@inner-prefix: ~'@{prefix}-message-details';
.@{inner-prefix} {
	height: 100%;
	background-color: @background-color-container;
	.van-pull-refresh {
		height: calc(100% - 46px);
		overflow: scroll;
		&__track {
			min-height: 100%;
		}
	}

	.van-cell__title {
		font-size: 1.2rem;
	}
	.van-panel__content {
		padding: 15px;
		text-indent: 2rem;
	}
	.van-panel__footer {
		color: @font-color-secondary;
		text-align: right;
	}
}
</style>
