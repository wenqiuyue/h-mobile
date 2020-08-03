<template>
	<div :class="classRoot">
		<van-nav-bar title="标题" left-text="返回" right-text="按钮" left-arrow />
		<div :class="`${classRoot}-body`">
			<van-list
				v-model="loading"
				:finished="finished"
				finished-text="没有更多了"
				direction="up"
				@load="onLoad"
			>
				<van-cell
					v-for="item in list"
					:key="item"
					:title="item"
					style="height: 50px"
				/>
			</van-list>
		</div>
	</div>
</template>
<script>
export default {
	name: 'test-chat-list',
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	},
	data() {
		return {
			list: [],
			loading: false,
			finished: false
		};
	},
	created() {},
	methods: {
		onLoad(refresh) {
			if (refresh) this.list = [];

			console.log('onLoad');

			// 异步更新数据
			// setTimeout 仅做示例，真实场景中一般为 ajax 请求
			setTimeout(() => {
				for (let i = 0; i < 10; i += 1) {
					this.list.push(this.list.length + 1);
				}

				// 加载状态结束
				this.loading = false;

				this.finished = true;
				// 数据全部加载完成
				if (this.list.length >= 100) {
					this.finished = true;
				}
			}, 1000);
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable';

@inner-prefix: ~'@{prefix}-test-chat-list';
.@{inner-prefix} {
	height: 100%;
	overflow-x: hidden;
	overflow-y: auto;

	&-body {
		height: calc(100% - 46px);
	}
}
</style>
