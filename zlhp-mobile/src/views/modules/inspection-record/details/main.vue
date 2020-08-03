<template>
	<div :class="classRoot">
		<van-nav-bar title="检查记录详情" left-arrow @click-left="$router.back()" />
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<van-search placeholder="请输入搜索关键词" v-model="searchValue" />
			<table>
				<thead>
					<tr>
						<th>项目</th>
						<th>结果</th>
					</tr>
				</thead>
				<transition-group
					name="staggered-fade"
					tag="tbody"
					:css="false"
					@before-enter="beforeEnter"
					@enter="enter"
					@leave="leave"
				>
					<template v-for="(item, index) in dataView">
						<tr
							:key="item['key']"
							:data-index="index"
							:class="[index === active ? 'active' : null]"
							@click="active === index ? (active = null) : (active = index)"
							@dblclick="onDblclick(item['key'], item['value'])"
						>
							<td>{{ item['key'] }}</td>
							<td>
								{{ item['value'] }}
								<span v-if="unitMap[item['key']]">
									{{ unitMap[item['key']] }}
								</span>
							</td>
						</tr>
					</template>
				</transition-group>
			</table>
		</van-pull-refresh>
	</div>
</template>
<script>
import Velocity from 'velocity-animate';
import { Dialog } from 'vant';
import * as ChildrenCheckRecordApi from '../../../../apis/ChildrenCheckRecordApi';

export default {
	name: 'inspection-record-details',
	data() {
		return {
			active: null,
			isLoading: false,
			searchValue: null,
			data: null,
			// 单位映射
			unitMap: {
				身高: 'cm',
				体重: 'kg',
				头围: 'cm',
				'蛋/蛋黄': '个/周',
				配方奶量: 'ml/日',
				添加辅食: '次/日',
				大便次数: '次/日',
				户外活动: '小时/日',
				服用维生素D情况: 'IU/日',
				服用维生素A情况: 'IU/日',
				肺炎: '次',
				腹泻: '次',
				外伤: '次',
				龋齿: '颗',
				出牙数: '颗'
			}
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_CHILDREN}-${this.$options.name}`;
		},
		// 数据视图
		dataView() {
			return this.data
				? this.data.filter(o => {
						if (this.searchValue) {
							const { key } = o;
							const value = o.value.toString();
							const unit = this.unitMap[key] ? this.unitMap[key] : '';
							const search = key + value + unit;
							return search.indexOf(this.searchValue) !== -1;
						}
						return true;
				  })
				: null;
		}
	},
	mounted() {
		this.onRefresh();
	},
	methods: {
		/**
		 * 双击显示弹窗
		 * @param key
		 * @param value
		 */
		onDblclick(key, value) {
			Dialog({ title: key, message: `${value} ${this.unitMap[key] || ''}` });
		},
		beforeEnter(el) {
			el.style.opacity = '0';
			el.style.height = '0';
		},
		enter(el, done) {
			const delay = el.dataset.index * 50;
			setTimeout(() => {
				Velocity(el, { opacity: 1, height: '1.6em' }, { complete: done });
			}, delay);
		},
		leave(el, done) {
			const delay = el.dataset.index * 50;
			setTimeout(() => {
				Velocity(el, { opacity: 0, height: 0 }, { complete: done });
			}, delay);
		},
		/**
		 * 刷新
		 */
		onRefresh() {
			this.isLoading = true;
			this.$toast.loading('加载中...');
			ChildrenCheckRecordApi.GetHisCheckRecordDetail(this.$route.query.id)
				.then(response => {
					if (response.Code === 0) {
						this.data = this.JsonToArray(response.Body).filter(m => m.value);
					}
				})
				.finally(() => {
					this.$toast.clear();
					this.isLoading = false;
				});
		},
		/**
		 * Json 转 Array
		 * @param data
		 */
		JsonToArray(data) {
			const result = [];
			Object.keys(data).forEach(key => {
				result.push({ key, value: data[key] });
			});
			return result;
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';
@inner-prefix: ~'@{prefix-children}-inspection-record-details';
.@{inner-prefix} {
	height: 100%;
	.van-pull-refresh {
		height: calc(100% - 46px);
		overflow: scroll;
		background-color: @background-color-container;
		&__track {
			min-height: calc(100% - 30px);
			padding: 0;
		}
	}
	table {
		width: 100%;

		tr {
			background-color: @background-color;
			width: 100%;
			font-size: 12px;

			td,
			th {
				padding: 5px;
				transition: all 0.5s;

				&:first-child {
					width: 30%;
				}
			}
		}

		tbody {
			tr {
				td {
					color: @font-color-secondary;

					span {
						padding: 0 3px;
						border: 1px solid skyblue;
					}
				}

				&.active {
					color: @font-color;
					box-shadow: 0 0 10px skyblue;
				}
			}
		}
	}
}
</style>
