<template>
	<div :class="classRoot">
		<div :class="`${classRoot}-input-container`" @click="handleShow" />
		<van-popup v-model="show" position="bottom">
			<div ref="header" :class="`${classRoot}-header`">
				<template v-for="(item, index) in selectedList">
					<span
						:key="item['AreaID']"
						:class="currentLevel === index ? 'await' : 'selected'"
						@click="currentLevel = index"
					>
						{{ item['AreaName'] }}
					</span>
				</template>
				<span
					v-if="selectedList.length <= maxLevel"
					:class="currentLevel === selectedList.length ? 'unselected' : ''"
					@click="currentLevel = selectedList.length"
				>
					[请选择{{ labels[currentLevel] }}]
				</span>
			</div>
			<div ref="body" :class="`${classRoot}-body`">
				<transition-group ref="content" name="list-complete" tag="ul">
					<template v-for="item in dataList[currentLevel]">
						<li
							:key="item['AreaID']"
							:class="[
								'list-complete-item',
								selectedList.filter(m => m['AreaID'] === item['AreaID']).length
									? 'selected'
									: ''
							]"
							@click="handleItemClick(item)"
						>
							{{ item['AreaName'] }}
						</li>
					</template>
				</transition-group>
			</div>
			<div :class="`${classRoot}-floor`">
				<van-button size="small" type="default" @click.prevent="handleCancel()">
					取消
				</van-button>
				<van-button
					size="small"
					type="primary"
					:color="mode === 'mother' ? '#f59fb0' : '#ffc9dd'"
					@click.prevent="handleDone()"
				>
					确定
				</van-button>
			</div>
			<div v-show="loading" :class="`${classRoot}-mask`">
				<img src="../../assets/loading.gif" alt="" />
			</div>
		</van-popup>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import * as AreaApi from '../../apis/AreaApi';
import types from '../../commons/types';

export default {
	name: 'cascade',
	components: {},
	model: {
		prop: 'form',
		event: 'change'
	},
	props: {
		form: {
			type: Object,
			default: null
		}, // 表单
		keys: {
			type: Array,
			default: null
		}, // 表单每层结果的键值
		label: {
			type: String,
			default: 'cascade'
		},
		fullField: {
			type: String,
			default: null
		}, // 最终的文本
		maxLevel: {
			type: Number,
			default: 4
		}, // 最大加载等级
		labels: {
			type: Array,
			default: () => ['省', '市', '区县', '乡镇', '居委会']
		}, // 每层引导提示
		separator: {
			type: String,
			default: ' '
		} // 分隔符
	},
	data() {
		return {
			show: false, // 是否显示
			loading: false, // 是否加载中
			currentLevel: 0, // 当前等级
			dataList: [], // 原始数据列表
			selectedList: [] // 已选择列表
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		},
		values() {
			const result = [];
			const len = this.keys.length;
			for (let i = 0; i < len; i += 1) {
				const data = this.form[this.keys[i]];
				if (!data) {
					break;
				}
				result.push(data);
			}
			return result;
		},
		...mapState({
			mode: state => state[types.MODE]
		})
	},
	mounted() {
		this.initialize();
	},
	methods: {
		handleShow() {
			this.show = true;
			this.$nextTick(() => {
				this.repositionHeader();
			});
			if (this.dataList.length === 0 || this.selectedList.length === 0) {
				this.initialize();
			}
		},
		/**
		 * 初始化
		 */
		initialize() {
			this.dataList = [];
			this.selectedList = [];

			if (this.values.length) {
				this.loadByCodes(this.values);
			} else {
				this.loading = true;
				AreaApi.GetBySiteArea()
					.then(res => {
						// eslint-disable-next-line no-console
						console.log(res);
						const list = [];
						const getParentArea = node => {
							const result = node;
							const parent = result.ParentArea;
							delete result.ParentArea;
							list.unshift(result);
							if (parent) {
								getParentArea(parent);
							}
						};
						getParentArea(res);
						this.loadByCodes(list.map(m => m.AreaCode));
					})
					.finally(() => {
						this.loading = false;
					});
			}
		},
		/**
		 * 根据Codes加载
		 */
		loadByCodes(codeList) {
			this.loading = true;
			AreaApi.CodeList2(codeList)
				.then(res => {
					this.dataList = res.LevelData.map(m => this.listSort(m));
					this.selectedList = this.listSort(res.SelectedData);
					const len = this.selectedList.length;
					this.currentLevel = len > this.maxLevel ? this.maxLevel : len;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		/**
		 * 项目点击事件
		 * @param item
		 */
		handleItemClick(item) {
			// 加载中不可操作
			if (this.loading) {
				return false;
			}
			this.loading = true;

			// 设置当前等级为选中的等级
			this.currentLevel = item.AreaType;

			// 添加到已选择列表
			this.appendToSelected(item);

			// 如果到了最大等级就不再执行后续操作
			if (this.currentLevel === this.maxLevel) {
				this.loading = false;
				return false;
			}

			AreaApi.listByPid(item.AreaID)
				.then(res => {
					this.appendToList(this.listSort(res), this.currentLevel + 1).then(
						() => {
							this.$nextTick(() => {
								this.currentLevel += 1;
								this.repositionBody();
							});
						}
					);
				})
				.finally(() => {
					this.loading = false;
				});
			return false;
		},
		/**
		 * 获取下标
		 * @param item
		 */
		selectedIndexOf(item) {
			const len = this.selectedList.length;
			for (let i = 0; i < len; i += 1) {
				if (this.selectedList[i].AreaID === item.AreaID) {
					return i;
				}
			}
			return -1;
		},
		/**
		 * 是否已选择
		 * @param item
		 */
		hasSelected(item) {
			return this.selectedList.some(o => o.AreaID === item.AreaID);
		},
		/**
		 * 列表排序
		 * @param list
		 */
		listSort(list) {
			return list.sort((a, b) => a.AreaCode - b.AreaCode);
		},
		/**
		 * 完成按钮
		 */
		handleDone() {
			const { form } = this;
			form[this.fullField] = this.selectedList
				.map(m => m.AreaName)
				.join(this.separator);

			const len = this.keys.length;
			for (let i = 0; i < len; i += 1) {
				if (!this.selectedList[i]) {
					break;
				}
				form[this.keys[i]] = this.selectedList[i].AreaCode;
			}

			this.$emit('change', form);
			this.$emit('done', {
				data: this.selectedList,
				values: this.selectedList.map(m => m.AreaCode),
				fullText: this.selectedList.map(m => m.AreaName).join(this.separator)
			});
			this.handleCancel();
		},
		/**
		 * 取消按钮
		 */
		handleCancel() {
			this.show = false;
		},
		/**
		 * 添加已选择列表
		 * @param item
		 */
		appendToSelected(item) {
			// eslint-disable-next-line no-unused-vars
			return new Promise((resolve, reject) => {
				const index = item.AreaType;
				const list = [];
				for (let i = 0; i < index; i += 1) {
					list[i] = this.selectedList[i];
				}
				list[index] = item;
				this.selectedList = list;
				this.$nextTick(() => {
					this.repositionHeader();
					resolve();
				});
			});
		},
		/**
		 * 添加到列表
		 * @param item
		 * @param index
		 */
		appendToList(item, index) {
			// eslint-disable-next-line no-unused-vars
			return new Promise((resolve, reject) => {
				const list = [];
				for (let i = 0; i < index; i += 1) {
					list[i] = this.dataList[i];
				}
				list[index] = item;
				this.dataList = list;
				this.$nextTick(() => {
					this.repositionHeader();
					resolve();
				});
			});
		},
		/**
		 * 重新定位 header 内容
		 */
		repositionHeader() {
			const el = this.$refs.header;
			el.scroll({
				left: el.clientWidth + this.currentLevel * 5,
				behavior: 'smooth'
			});
		},
		/**
		 * 重新定位 body 内容
		 */
		repositionBody() {
			const el = this.$refs.body;
			el.scroll({
				top: 0,
				behavior: 'smooth'
			});
		}
	}
};
</script>

<style lang="less">
@import '../../style/variable';

@inner-prefix: ~'@{prefix}-cascade';
.@{inner-prefix} {
	&-header {
		padding: 10px;
		text-align: left;
		line-height: 20px;

		span {
			&.await {
				color: dodgerblue;
			}

			&.selected {
				color: #ee8ca1;
			}

			&.unselected {
				color: orangered;
			}

			&:not(:last-child) {
				&::after {
					content: '/';
				}
			}
		}
	}

	&-body {
		max-height: 300px;
		min-height: 100px;
		width: 100%;
		overflow: scroll;
		text-align: left;
		padding: 3px 0;
		border-top: 1px solid #e9e9e9;
		border-bottom: 1px solid #e9e9e9;

		ul {
			li {
				padding: 5px 5px;
				margin: 3px;
				background-color: #f2f2f2;
				color: #555555;

				&.selected {
					color: white;
					background-color: #ee8ca1;
					box-shadow: 0 0 3px 2px #d2d2d2;
				}
			}
		}
	}

	&-floor {
		text-align: right;
		height: 40px;
		line-height: 40px;

		button {
			margin-right: 8px;
			width: 80px;
			height: 35px;
		}
	}

	&-mask {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.25);
		text-align: center;

		img {
			position: absolute;
			height: 50px;
			bottom: calc(50% - 25px);
			left: calc(50% - 25px);
		}
	}

	.list-complete-item {
		transition: all 1s;
		display: inline-block;
	}

	.list-complete-enter, .list-complete-leave-to
      /* .list-complete-leave-active for below version 2.1.8 */ {
		opacity: 0;
		transform: translateY(30px);
	}

	.list-complete-leave-active {
		position: absolute;
	}
}
</style>
