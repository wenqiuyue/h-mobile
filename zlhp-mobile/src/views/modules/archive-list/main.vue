<template>
	<div :class="classRoot">
		<van-nav-bar
			:title="title"
			left-arrow
			:right-text="isEditor ? '添加' : ''"
			@click-left="$router.back()"
			@click-right="handleToArchiving"
		>
		</van-nav-bar>
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<div :class="`${classRoot}-tips`" v-if="tipsShow">
				<div class="tips-icon">
					<svg-icon value="icon-sign_Tips" :size="1.2" />
				</div>
				<div class="tips-container">
					<div>
						设置当前档案可切换不同的档案；未上传医院的档案在有效期内可进行修改，已上传医院的档案只可查看档案，未上传已过期档案可以刷新获取新档案编号。
					</div>
					<div class="tips-close" @click="tipsClose">
						<svg-icon value="icon-Close_Black" :size="0.7" />
					</div>
				</div>
			</div>
			<div class="archive-cell">
				<template v-if="list && list.length" :class="`${classRoot}-group-list`">
					<van-cell
						value="内容"
						v-for="item in list"
						:key="item['ArchiveID']"
						center
					>
						<template>
							<span class="archive_no" v-if="isEditor">
								档案编号:
								{{
									mode === 'mother'
										? item['ArchiveNo']
										: item['ChildrenArchiveNo']
								}}
							</span>
							<div class="archive-list-container">
								<div class="name-info">
									<span style="display:block">{{ item['Name'] }}</span>
									<van-tag
										color="#A1A1A1"
										plain
										round
										v-if="item[mode === 'mother' ? 'IDNumber' : 'IdNumber']"
									>
										<svg-icon value="icon-RealName" :size="0.7" />
										<span class="real-name">已实名</span>
									</van-tag>
									<van-tag type="primary" color="#A1A1A1" plain round v-else>
										<svg-icon value="icon-NonRealName" />
										<span class="real-name">未实名</span>
									</van-tag>
								</div>
								<div
									:class="
										item['IDNumber'] || item['IdNumber'] ? '' : 'age-info'
									"
								>
									<div v-if="mode === 'mother'">
										{{
											getMotherTitle(
												item['IDNumber'],
												item['MenstrualHistories']['LastMenstrualDate']
											)
										}}
									</div>
									<div v-else>
										{{ getChildrenTitle(item['BirthDate'], item['Sex']) }}
									</div>
									<div v-if="item['IDNumber'] || item['IdNumber']">
										{{
											idCordEncrypt(
												mode === 'mother' ? item['IDNumber'] : item['IdNumber']
											)
										}}
									</div>
								</div>
								<div
									class="status"
									:style="`color:${item['color']}`"
									v-if="isEditor"
								>
									{{ item['tag'] }}
								</div>
								<div class="status" v-else>
									<van-radio-group v-model="currentRadio">
										<van-radio
											@click="handleClick(item)"
											:checked-color="mode === 'mother' ? '#EF8EA3' : '#F39FC7'"
											:name="
												mode === 'mother'
													? item.ArchiveID
													: item.ChildrenArchiveID
											"
										></van-radio>
									</van-radio-group>
								</div>
							</div>
						</template>
						<template slot="default" v-if="isEditor">
							<van-divider class="line_divider" />
							<div class="bottom">
								<van-radio-group v-model="currentRadio">
									<van-radio
										@click="disposeChange(item)"
										icon-size="18px"
										:checked-color="mode === 'mother' ? '#EF8EA3' : '#F39FC7'"
										:name="
											mode === 'mother'
												? item.ArchiveID
												: item.ChildrenArchiveID
										"
										><span
											:style="
												`color:${item.IsCurrent === 1 ? '#EF8EA3' : '#999999'}`
											"
											>当前档案</span
										></van-radio
									>
								</van-radio-group>
								<div class="operation">
									<span
										@click="
											handleDelete(
												mode === 'mother'
													? item.ArchiveID
													: item.ChildrenArchiveID
											)
										"
										><svg-icon value="icon-delete1" :size="1" />删除</span
									>
									<span @click="handleClick(item)">
										<svg-icon :value="item['icon']" :size="1" />
										<label v-if="item['tag'] === '有效'">修改</label>
										<label v-else-if="item['tag'] === '已上传'">查看</label>
										<label v-else>刷新</label>
									</span>
								</div>
							</div>
						</template>
					</van-cell>
				</template>
				<template v-else
					>
					<div :class="`${classRoot}-archiving`">
						<hint icon="icon-noFind" message="无档案" />
						<van-button @click="handleToArchiving" round>
							<svg-icon value="icon-Add_Pink" :size="2" />
							<label>添加档案</label>
						</van-button>
					</div>
				</template>
			</div>
		</van-pull-refresh>
	</div>
</template>
<script>
import { Dialog } from 'vant';
import { mapState } from 'vuex';
import {
	getAge,
	getAgeByBirthDate,
	getGestationalDay,
	getGestationalWeek,
	idCordEncrypt
} from '../../../commons';
import types from '../../../commons/types';
import * as UserApi from '../../../apis/UserApi';
import * as ArchiveApi from '../../../apis/ArchiveApi';
import * as ChildrenArchiveApi from '../../../apis/ChildrenArchivesApi';
import { has } from '../../../tools';

export default {
	name: 'archive-list',
	data() {
		return {
			isLoading: false,
			list: [],
			checkAll: false, // 全选
			tipsShow: true, // 提示是否显示
			isDel: false, // 是否删除
			currentRadio: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		},
		...mapState({
			mode: state => state[types.MODE]
		}),
		// 是否编辑
		isEditor() {
			return has.call(this.$route.query, 'editor');
		},
		title() {
			const type = '档案';
			return this.isEditor ? `${type}管理` : `切换${type}`;
		}
	},
	watch: {
		// 将每人档案数据添加档案编号的状态属性
		list() {
			if (this.list !== null) {
				this.list.forEach(element => {
					// 档案编号已上传
					if (element.IsBindHis === 1) {
						this.setArchiveObjData(element, '#EF8EA3', '已上传', 'icon-look');
					} else {
						// 档案编号未上传
						const date = new Date(element.ArchiveNoUpdateTime);
						const expire = new Date(
							new Date().setDate(new Date().getDate() - 7)
						);
						// 有效
						if (date >= expire) {
							if (this.mode === 'mother') {
								this.setArchiveObjData(
									element,
									'#A5C8FF',
									'有效',
									'icon-modify'
								);
							} else {
								this.setArchiveObjData(
									element,
									'#F190BE',
									'有效',
									'icon-modify'
								);
							}
						} else {
							this.setArchiveObjData(
								element,
								'#BBBBBB',
								'过期',
								'icon-refresh'
							);
						}
					}
					// 筛选当前孕期
					if (element.IsCurrent === 1) {
						if (this.mode === 'mother') {
							this.currentRadio = element.ArchiveID;
						} else {
							this.currentRadio = element.ChildrenArchiveID;
						}
					}
				});
			}
		},
		// 全选
		checkAll() {
			if (this.checkAll) {
				this.$refs.checkboxGroup.toggleAll(true);
			} else {
				this.$refs.checkboxGroup.toggleAll();
			}
		}
	},
	created() {
		this.onRefresh();
		if (!this.isEditor) {
			this.tipsShow = false;
		}
	},
	methods: {
		idCordEncrypt,
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
		 * 删除
		 */
		handleDelete(id) {
			Dialog.confirm({
				title: '系统提示',
				message: '是否立即删除？',
				confirmButtonText: '立即删除',
				cancelButtonText: '点错了'
			})
				.then(() => {
					this.$toast.loading('正在删除...');
					const api = this.mode === 'mother' ? ArchiveApi : ChildrenArchiveApi;
					api
						.DeleteArchive(id)
						.then(res => {
							if (res.Code === 0 && res.Body) {
								this.$toast.success('删除成功！');
								this.onRefresh();
							} else {
								this.$toast.fail(res.Message);
							}
						})
						.finally(this.$toast.clear);
				})
				.catch(() => {
					this.$toast.fail('用户取消');
				});
		},
		/**
		 * 刷新
		 */
		onRefresh() {
			this.isLoading = true;
			this.$toast.loading('加载中...');
			if (this.mode === 'mother') {
				ArchiveApi.GetAll()
					.then(response => {
						if (response.Code === 0) {
							this.list = response.Body;
						}
					})
					.finally(() => {
						this.$toast.clear();
						this.isLoading = false;
					});
			} else {
				ChildrenArchiveApi.GetAll()
					.then(response => {
						if (response.Code === 0) {
							this.list = response.Body;
						}
					})
					.finally(() => {
						this.$toast.clear();
						this.isLoading = false;
					});
			}
		},
		/**
		 * 点击事件
		 * @param item
		 */
		handleClick(item) {
			if (this.isEditor) {
				if (item.tag === '有效') {
					this.disposeEdit(item);
				} else if (item.tag === '已上传') {
					this.myArchive(item);
				} else if (item.tag === '过期') {
					this.handleRefreshArchiveNo(item);
				}
			} else {
				this.disposeChange(item);
			}
		},
		/**
		 * 编辑
		 * @param item
		 */
		disposeEdit(item) {
			this.$router.push({
				path: `/${this.mode}/archiving`,
				query: {
					edit_id:
						this.mode === 'mother' ? item.ArchiveID : item.ChildrenArchiveID
				}
			});
		},
		/**
		 * 档案信息
		 * @param item
		 */
		myArchive(item) {
			if (this.mode === 'mother') {
				this.$router.push({
					path: '/mother/my-archive',
					query: {
						edit_id: item.ArchiveID
					}
				});
			} else {
				this.$router.push({
					path: '/children/my-archive',
					query: {
						edit_id: item.ChildrenArchiveID
					}
				});
			}
		},
		/**
		 * 切换
		 * @param item
		 */
		disposeChange(item) {
			const dispose = () => {
				this.$toast.loading('正在切换档案...');
				let api = null;
				if (this.mode === 'mother') {
					api = UserApi.ChangeArchive(item.ArchiveID);
				} else {
					api = ChildrenArchiveApi.ChangeArchive(item.ChildrenArchiveID);
				}
				api
					.then(response => {
						if (response.Code === 0) {
							if (!this.isEditor) {
								this.$router.back();
							} else {
								this.onRefresh();
							}
						} else {
							this.$toast.fail(response.Message);
							this.onRefresh();
						}
					})
					.finally(this.$toast.clear);
			};
			if (item.IsCurrent === 1) {
				Dialog.confirm({
					title: '系统提示',
					message: '此档案已为当前档案，是否强制刷新当前档案？'
				})
					.then(dispose)
					.catch(() => this.$toast.fail('用户取消'));
			} else {
				dispose();
			}
		},
		/**
		 * 获取孕产妇标题
		 * @param IDNumber
		 * @param LastMenstrualDate
		 */
		getMotherTitle(IDNumber, LastMenstrualDate) {
			const age = getAge(IDNumber);
			const week = getGestationalWeek(LastMenstrualDate);
			const day = getGestationalDay(LastMenstrualDate);
			if (week === 0) {
				return `${age}岁，孕${day}天`;
			}
			if (day === 0) {
				return `${age}岁，孕${week}周`;
			}
			return `${age}岁，孕${week}周 +${day}天`;
		},
		/**
		 * 获取儿童标题
		 * @param BirthDate
		 * @param Sex
		 */
		getChildrenTitle(BirthDate, Sex) {
			return `${Sex === 1 ? '男' : '女'}，年龄：${getAgeByBirthDate(
				BirthDate
			)}`;
		},
		/**
		 * 提示关闭
		 */
		tipsClose() {
			this.tipsShow = false;
		},
		/**
		 * 点击删除图标
		 */
		handleDel() {
			this.isDel = true;
		},
		/**
		 * 给档案列表数据添加属性
		 */
		setArchiveObjData(obj, color, tag, icon) {
			this.$set(obj, 'color', color);
			this.$set(obj, 'tag', tag);
			this.$set(obj, 'icon', icon);
		},
		/**
		 * 刷新编号
		 */
		handleRefreshArchiveNo(obj) {
			this.$toast.loading('正在刷新...');
			const api = this.mode === 'mother' ? ArchiveApi : ChildrenArchiveApi;
			api
				.GetAndRefreshNo(
					this.mode === 'mother' ? obj.ArchiveID : obj.ChildrenArchiveID
				)
				.then(response => {
					if (response.Code === 0) {
						this.$set(obj, 'ArchiveNo', response.Body.ArchiveNo);
						this.$set(obj, 'UpdateTime', response.Body.UpdateTime);
						this.$toast.success('编号刷新成功！');
						this.onRefresh();
					} else {
						this.$toast.fail('编号刷新失败！');
					}
				})
				.finally(this.$toast.clear);
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';
@inner-prefix: ~'@{prefix}-archive-list';
.@{inner-prefix} {
	height: 100%;
	background-color: #f9f9f9;
	&-tips {
		padding: 10px 15px 0 15px;
		background-color: #fff;
		display: flex;
		flex-direction: row;
		margin-bottom: 8px;
		border-bottom: 0.5px dashed #ffd9e2;
		.tips-icon {
			padding-top: 5px;
		}
		.tips-container {
			margin-left: 5px;
			font-size: 12px;
			line-height: 25px;
			color: #666666;
			.tips-close {
				float: right;
			}
		}
	}
	&-group-list {
		padding-bottom: 30px;
	}
	.van-pull-refresh {
		height: calc(100% - 66px);
		overflow: scroll;
		padding-bottom: 20px;
		.archive-cell {
			padding: 0 5px 20px 5px;
		}
		&__track {
			min-height: calc(100% - 8px);
			.del {
				padding: 10px 10px;
				.del-button {
					margin-left: 11rem;
					.button {
						margin-left: 10px;
					}
				}
			}
		}

		.van-cell {
			padding-top: 15px;
			margin-bottom: 10px;
			border-radius: 5px;
			.van-cell__title {
				flex: 0.5;
			}
			.van-cell__value {
				text-align: left;
				flex: 4;
				color: @font-color;
				font-size: 1rem;
				.tag {
					margin-left: 10px;
					opacity: 0.6;
					padding: 1px 8px;
					border-radius: 4px;
				}
				.archive_no {
					color: #999999;
				}
				.archive-list-container {
					display: flex;
					justify-content: space-around;
					width: 100%;
					margin-top: 10px;
					.name-info {
						width: 30%;
						font-size: 16px;
						.van-tag {
							.real-name {
								font-size: 9px;
								margin-left: 3px;
							}
						}
					}
					.age-info {
						display: flex;
						align-items: center;
						// flex-direction: column;
					}
					.status {
						width: 35%;
						// text-align: right;
						font-size: 16px;
						display: flex;
						justify-content: flex-end;
					}
				}
				.line_divider {
					margin: 15px 0 10px 0;
				}
				.bottom {
					display: flex;
					justify-content: space-between;
					flex-direction: row;
					align-items: center;
					.operation {
						display: flex;
						flex-direction: row;
						span {
							margin-left: 26px;
							font-size: 14px;
							color: #666666;
							display: flex;
							align-items: center;
							svg {
								margin-right: 5px;
							}
						}
					}
				}
			}
		}
	}
	&-right {
		width: 70px;
		line-height: 48px;
		right: 0;
		position: absolute;
		text-align: center;
		&-icon {
			vertical-align: middle;
			&:last-child {
				margin: 0 9px;
			}
		}
	}
	&-archiving {
		text-align: center;
		button {
			padding-left: 15px;
			color: @font-color;
			svg {
				vertical-align: middle;
				position: relative;
				bottom: 1px;
				right: 5px;
			}
			label {
				font-size: 16px;
			}
		}
	}
}
</style>
