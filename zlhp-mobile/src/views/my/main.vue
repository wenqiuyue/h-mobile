<template>
	<van-pull-refresh :class="classRoot" v-model="isLoading" @refresh="onRefresh">
		<div :class="`${classRoot}-header`" :style="{ background: headerbg }">
			<div :class="`${classRoot}-header-avatar`">
				<svg-icon
					:value="
						this.mode === 'mother'
							? 'icon-home_HeadDecoration'
							: 'icon-babyHome_Headwear'
					"
					:size="7.5"
				/>
				<img :src="avatar" alt="" />
			</div>
			<div :class="`${classRoot}-header-text`" v-if="Archive">
				<div :class="`${classRoot}-header-text-title`">
					哈喽，{{ Archive.Name }}
				</div>
				<div
					:class="`${classRoot}-header-text-subtitle`"
					v-if="typeof userInfo === 'string'"
				>
					{{ userInfo }}
				</div>
				<template v-else>
					<div
						:class="`${classRoot}-header-text-subtitle`"
						v-for="(item, index) in userInfo"
						:key="index"
					>
						{{ item }}
					</div>
				</template>
			</div>
			<div :class="`${classRoot}-header-text`" v-else>
				<div :class="`${classRoot}-header-notext-title`">
					您还未添加{{ this.mode === 'mother' ? '孕产' : '儿童' }}档案
				</div>
				<div
					:class="`${classRoot}-header-notext-subtitle`"
					@click="handleToArchiving"
				>
					添加{{ this.mode === 'mother' ? '孕产' : '儿童' }}档案 >
				</div>
			</div>
		</div>
		<div :class="`${classRoot}-body`">
			<div :class="`${classRoot}-body-separator`">
				<svg-icon
					v-for="index in 26"
					:key="index"
					value="icon-home_ClipDecoration"
					:size="0.8"
				/>
			</div>
			<van-cell-group>
				<template v-for="(item, index) in menuData[mode]">
					<van-cell
						:key="index"
						is-link
						:to="item['to']"
						:title="item['title']"
						:value="item['value']"
						:label="item['label']"
					>
						<svg-icon
							v-if="item['icon']"
							slot="icon"
							:class="[`${classRoot}-icon`, item['icon']]"
							:value="item['icon']"
						/>
					</van-cell>
				</template>
			</van-cell-group>
		</div>
	</van-pull-refresh>
</template>
<script>
import _ from 'lodash';
import { mapState } from 'vuex';
import types from '../../commons/types';
import { GetUser } from '../../apis/UserApi';
import { Current } from '../../apis/SiteApi';
import { Current as MotherArchive } from '../../apis/ArchiveApi';
import { Current as ChildrenArchive } from '../../apis/ChildrenArchivesApi';
import menuData from './menu';
import {
	disposeResult,
	getGestationalAllDay,
	getGestationalWeekAndDayTitle,
	getDueDay,
	getAgeByBirthDate
} from '../../commons';

const headerPic = require('../../assets/header-my.png');
const motherAvatar = require('../../assets/avatar-mother.png');
const childrenAvatar = require('../../assets/avatar-children.png');

export default {
	name: 'my',
	data() {
		return {
			types,
			isLoading: false,
			User: null,
			Site: null,
			Archive: null,
			menuData: _.cloneDeep(menuData)
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		},
		...mapState({
			mode: state => state[types.MODE]
		}),
		background() {
			return headerPic;
		},
		avatar() {
			if (this.User) {
				return this.User.UserImage;
			}
			if (this.mode === 'mother') {
				return motherAvatar;
			}
			return childrenAvatar;
		},
		headerbg() {
			if (this.mode === 'mother') {
				return 'linear-gradient(128deg,rgba(255, 221, 223, 1) 0%,rgba(249, 204, 204, 1) 100%';
			}
			return 'linear-gradient(128deg,rgba(239,219,233,1) 0%,rgba(245,215,236,1) 100%';
		},
		userInfo() {
			if (this.Archive) {
				if (this.mode === 'mother') {
					const result = [];
					const allDay = getGestationalAllDay(
						this.Archive.MenstrualHistories.LastMenstrualDate
					);
					const weekAndDay = getGestationalWeekAndDayTitle(
						this.Archive.MenstrualHistories.LastMenstrualDate
					);
					result.push(`您已怀孕${allDay}天，${weekAndDay}`);

					const dueDay = getDueDay(this.Archive.MenstrualHistories.DueDate);
					if (dueDay === 0) {
						result.push('预产期是今天');
					} else {
						result.push(
							dueDay > 0 ? `距离预产期还有${dueDay}天` : `预产期已过${dueDay}天`
						);
					}
					return result;
				}
				return getAgeByBirthDate(this.Archive.BirthDate);
			}
			return '';
		}
	},
	created() {
		this.onRefresh();
	},
	methods: {
		/**
		 * 去建档
		 */
		handleToArchiving() {
			this.$router.push({
				path: `/${this.mode}/binding`,
				query: { archiving: null }
			});
		},
		/**
		 * 刷新
		 */
		onRefresh() {
			this.isLoading = true;
			this.$toast.loading('加载中...');

			const keys = ['User', 'Site', 'Archive'];
			const methods = [
				GetUser(),
				Current(this.mode === 'mother' ? 0 : 1),
				this.mode === 'mother' ? MotherArchive() : ChildrenArchive()
			];
			Promise.all(methods)
				.then(results => {
					results.forEach((item, index) => {
						disposeResult({
							$vm: this,
							key: keys[index],
							response: item
						});
					});
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
@import '../../style/variable.less';
@inner-prefix: ~'@{prefix}-my';
.@{inner-prefix} {
	height: 100%;
	overflow: scroll;

	.van-pull-refresh__track {
		min-height: 100%;
	}

	&-header {
		position: relative;
		height: 178px;
		&-text {
			z-index: 1;
			position: absolute;
			top: 50px;
			left: 120px;

			&-title {
				font-size: 18px;
				font-family: Source Han Sans CN;
				line-height: 22px;
				color: #000000;
				padding-bottom: 3px;
			}

			&-subtitle {
				font-size: 14px;
				font-family: Source Han Sans CN;
				line-height: 16px;
				color: #444444;
				margin-top: 8px;
			}
		}
		&-notext {
			z-index: 1;
			position: absolute;
			top: 50px;
			left: 120px;

			&-title {
				font-size: 17px;
				font-family: Source Han Sans CN;
				line-height: 35px;
				color: #333333;
			}

			&-subtitle {
				font-size: 14px;
				font-family: Source Han Sans CN;
				line-height: 16px;
				color: #ba3c3c;
				margin-top: 8px;
				width: 100px;
				padding-bottom: 5px;
				border-bottom: 1px solid #ba3c3c;
			}
		}
		&-avatar {
			z-index: 1;
			position: absolute;
			left: 8px;
			top: 10px;

			img {
				position: absolute;
				left: 24px;
				bottom: -10px;
				width: 68px;
				height: 68px;
				border-radius: 50%;
				border: 2px solid rgba(248, 205, 200, 1);
			}
		}
	}

	&-body {
		background-color: white;
		border-radius: 12px 12px 0 0;
		padding-top: 18px;
		position: relative;
		top: -18px;

		&-separator {
			z-index: 0;
			position: absolute;
			top: -0.4rem;
			width: 100%;
			height: 0.8rem;
			display: flex;

			svg {
				flex-basis: 100% / 26;

				&:first-child {
					background-color: rgba(0, 0, 0, 0);
				}
			}
		}
	}
	.van-cell {
		align-items: center;
		padding-top: 12px;
		padding-bottom: 12px;
	}
	.van-cell__title {
		color: #333333;
		display: flex;
		align-items: center;
	}
	&-icon {
		margin-right: 0.5rem;
	}
}
</style>
