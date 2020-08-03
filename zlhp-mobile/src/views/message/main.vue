<template>
	<div :class="classRoot">
		<van-nav-bar
			title="消息"
			left-arrow
			@click-left="$router.back()"
			@click-right="onRefresh()"
		>
			<van-icon name="replay" slot="right" />
		</van-nav-bar>
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
			<van-list
				v-model="loading"
				:finished="finished"
				:error="error"
				finished-text="没有更多了"
				@load="onLoad"
			>
				<template v-if="list && list.length">
					<template v-for="item in list">
						<van-panel :key="item['MessageID']">
							<template slot="header">
								<div :class="[`${classRoot}-header`, 'van-hairline--bottom']">
									<svg-icon value="icon-hospital" :size="1.5" />
									{{ item['HName'] }}
									<van-tag v-show="item['IsRead'] !== 1" type="danger" />
								</div>
								<div :class="`${classRoot}-date`">
									{{
										new Date(item['CreateTime']).format('yyyy年MM月dd日 hh:mm')
									}}
								</div>
							</template>
							<div style="padding: 0 15px">
								<h3 class="van-ellipsis">{{ item['Title'] }}</h3>
								<p class="van-ellipsis">{{ item['Remark'] }}</p>
							</div>
							<template slot="footer">
								<van-cell title="查看详情" is-link @click="handleClick(item)" />
							</template>
						</van-panel>
					</template>
				</template>
				<hint v-else-if="!loading" message="这里好冷清，没有任何消息" />
			</van-list>
		</van-pull-refresh>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import types from '../../commons/types';
import * as MessageApi from '../../apis/MessageApi';

export default {
	name: 'message',
	data() {
		return {
			list: [],
			error: false,
			loading: false,
			finished: false,
			refreshing: false
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		},
		...mapState({
			mode: state => state[types.MODE]
		})
	},
	methods: {
		/**
		 * 刷新数据
		 * @param load
		 */
		onRefresh() {
			this.list = [];
			this.loading = true;
			this.finished = false;
			this.refreshing = false;
			this.onLoad();
		},
		/**
		 * 加载数据
		 */
		async onLoad() {
			if (this.refreshing) {
				this.list = [];
				this.refreshing = false;
			}
			let page = 0;
			const limit = 10;
			page = Math.floor(this.list.length / limit);
			let api = MessageApi.GetPage(page + 1, limit);
			if (this.mode === 'children') {
				api = MessageApi.GetChildrenPage(page + 1, limit);
			}
			api
				.then(response => {
					if (response.Code === 0) {
						this.list.push(...response.Body);
						if (response.Body.length !== limit) {
							this.finished = true;
						}
					} else {
						this.error = true;
					}
				})
				.catch(() => {
					this.finished = true;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		/**
		 * 点击事件
		 * @param item
		 */
		handleClick(item) {
			this.$router.push({
				path:
					this.mode === 'children'
						? `/${this.mode}/message/details`
						: '/message/details',
				query: {
					id: item.MessageID
				}
			});
		}
	}
};
</script>
<style lang="less">
@import '../../style/variable.less';
@inner-prefix: ~'@{prefix}-message';
.@{inner-prefix} {
	height: 100%;
	overflow-x: hidden;
	overflow-y: auto;

	.van-panel {
		margin-bottom: 0.5rem;

		&__content {
			p {
				color: @font-color-middle;
			}
		}

		&__footer {
			padding: unset;

			&::after {
				border-color: #fcd3d3;
			}
		}
	}

	.van-pull-refresh {
		height: calc(100% - 55px);
		overflow: scroll;
		padding-top: 9px;
		&__track {
			min-height: 100%;
		}
	}

	&-date {
		padding-left: 1rem;
	}

	&-header {
		position: relative;
		padding: 0.5rem 2rem 0.5rem 1rem;
		font-size: 1.3rem;
		font-weight: bold;

		&::after {
			border: unset;
		}

		.van-tag {
			padding: 0.4rem;
			border-radius: 0.5rem;
			position: absolute;
			right: 1rem;
		}

		svg {
			vertical-align: middle;
			margin-bottom: 0.5rem;
		}
	}
}
</style>
