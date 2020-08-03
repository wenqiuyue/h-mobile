<template>
	<div :class="classRoot">
		<van-nav-bar title="切换站点" left-arrow @click-left="$router.back()" />
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<template v-for="item in list">
				<van-card
					:key="item['SiteID']"
					:desc="`地址：${item['Address']}`"
					:title="item['HospitalName']"
				>
					<van-image
						slot="thumb"
						round
						width="4rem"
						height="4rem"
						:src="
							item['Image']
								? item['Image']
								: require('../../../assets/hospital.jpg')
						"
					/>
					<div slot="tags" :class="`${classRoot}-tags`">
						<van-tag plain type="primary">{{ item['LevelName'] }}</van-tag>
					</div>
					<div slot="footer">
						<van-button size="small" @click="handleDetails(item)">
							详情
						</van-button>
						<van-button size="small" @click="handleChange(item)">
							切换
						</van-button>
					</div>
				</van-card>
			</template>
		</van-pull-refresh>
		<van-popup
			:class="`${classRoot}-popup`"
			v-model="open"
			position="bottom"
			closeable
		>
			<van-panel v-if="details">
				<template slot="header">
					<div :class="[`${classRoot}-popup-header`, 'van-hairline--bottom']">
						<div :class="`${classRoot}-popup-header-title`">
							{{ details['HospitalName'] }}
							<van-tag type="primary">{{ details['LevelName'] }}</van-tag>
						</div>
						<div :class="`${classRoot}-popup-header-desc`">
							<van-icon name="location-o" /> {{ details['Address'] }}
						</div>
					</div>
				</template>
				<div>{{ details['Description'] }}</div>
				<div slot="footer">
					<van-button size="small" @click="handleChange(details)">
						切换
					</van-button>
				</div>
			</van-panel>
		</van-popup>
	</div>
</template>
<script>
import { mapState } from 'vuex';
import types from '../../../commons/types';
import * as SiteApi from '../../../apis/SiteApi';
import { ChangeSite } from '../../../apis/UserApi';
import { setDocumentTitle } from '../../../commons';

export default {
	name: 'site-list',
	data() {
		return {
			isLoading: false,
			list: [],
			open: false,
			details: null
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
			SiteApi.GetAll()
				.then(response => {
					if (response.Code === 0) {
						this.list = response.Body;
					}
				})
				.finally(() => {
					this.$toast.clear();
					this.isLoading = false;
				});
		},
		/**
		 * 详情
		 * @param item
		 */
		handleDetails(item) {
			this.details = item;
			this.open = true;
		},
		/**
		 * 切换
		 * @param item
		 */
		handleChange(item) {
			this.$toast.loading('加载中...');
			ChangeSite(item.SiteID)
				.then(response => {
					if (response.Code === 0) {
						setDocumentTitle(response.Body.HospitalName);
						if (this.mode === 'mother') {
							this.$router.push({ path: '/' });
						} else {
							this.$router.push({ path: `/${this.mode}/home` });
						}
					} else {
						this.$toast.fail(response.Message);
					}
				})
				.finally(this.$toast.clear);
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';
@inner-prefix: ~'@{prefix}-site-list';
.@{inner-prefix} {
	height: 100%;
	.van-pull-refresh {
		height: calc(100% - 46px);
		overflow: scroll;
		background-color: @background-color-container;
		&__track {
			min-height: calc(100% - 8px);
		}

		.van-card {
			background-color: @background-color;
			margin: 0 0 8px 0;
			.van-card__header {
				.van-card__thumb {
					width: 60px;
					height: 60px;
				}
				.van-card__content {
					min-height: unset;
					.van-card__title {
						font-size: 1.1rem;
					}
				}
			}
		}
	}
	&-popup {
		&-header {
			padding: 10px 50px 0 10px;
			&-title {
				text-align: center;
				font-weight: bold;
				color: @font-color;
				font-size: 1.2rem;
			}
			&-desc {
				font-weight: bold;
				padding: 10px;
				color: @font-color-middle;
				.van-icon {
					vertical-align: middle;
				}
			}
		}
		.van-panel__content {
			text-indent: 2rem;
			padding: 15px;
		}
		.van-panel__footer {
			text-align: right;
			button {
				&:not(:last-child) {
					margin-right: 5px;
				}
			}
		}
	}
}
</style>
