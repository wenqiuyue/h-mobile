<template>
	<div :class="classRoot">
		<van-nav-bar title="医生列表" left-arrow @click-left="$router.back()" />
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh">
			<van-list
				v-model="loading"
				:finished="finished"
				:error="error"
				finished-text="没有更多了"
				@load="getDoctorData"
			>
				<template v-if="doctorList && doctorList.length">
					<div
						class="list-panel"
						v-for="(item, index) in doctorList"
						:key="index"
						@click="handelDoctorInfo(item.OnlineDoctorID)"
					>
						<div class="doctor-pic">
							<van-image
								v-if="item.MedicalStaff.Avatar"
								round
								width="55px"
								height="55px"
								fit="cover"
								:src="item.MedicalStaff.Avatar"
							/>
							<svg-icon
								v-else
								value="icon-Headportrait"
								:size="4"
								class="doctor-pic"
							/>
						</div>
						<div class="doctor-info">
							<div class="name">
								{{ item.MedicalStaff.Name }}
								<span
									>{{ item.MedicalStaff.Departments.DName }}
									<label
										v-for="(type, index) in item.MedicalStaff
											.MedicalStaffOfType"
										:key="index"
										>· {{ type.MedicalStaffType.MedicalStaffTypeName }}</label
									></span
								>
							</div>
							<div class="favorable">
								<span
									>评分：<van-rate
										:value="item.CommentScore / 2"
										readonly
										size="15px"/></span
								><span> 咨询数：{{ item.ConsultationCount }}</span>
							</div>
							<div class="speciality">
								擅长：{{
									item.MedicalStaff.Introduction
										? item.MedicalStaff.Introduction.replace(/&lt;.+?&gt;/g, '')
										: '暂无介绍'
								}}
							</div>
							<div class="price">
								<label>￥{{ item.ConsultationFee }}元/次</label
								><van-button
									round
									type="info"
									plain
									color="#FB5E5E"
									@click.stop="consultationNow(item.UserID)"
									>立即咨询</van-button
								>
							</div>
						</div>
					</div>
				</template>
				<hint v-else-if="!loading" message="这里好冷清，没有任何消息" />
			</van-list>
		</van-pull-refresh>
	</div>
</template>
<script>
import * as OnlineDoctorApi from '../../../apis/OnlineDoctorApi';

export default {
	name: 'interrogation-doctor-list',
	data() {
		return {
			doctorList: [], // 医生列表数据
			paramData: {
				SortField: null,
				Level: null,
				ConsultationFeeMin: null,
				ConsultationFeeMax: null,
				ProfessionalTitle: null,
				IsAssignation: null,
				page: 0,
				limit: 10
			},
			loading: false,
			finished: false,
			error: false,
			refreshing: false,
			sourceId: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {},
	methods: {
		/**
		 * 刷新
		 */
		onRefresh() {
			this.doctorList = [];
			this.loading = true;
			this.finished = false;
			this.getDoctorData();
		},
		/**
		 * 获取医生列表数据
		 */
		getDoctorData() {
			if (this.refreshing) {
				this.doctorList = [];
				this.refreshing = false;
			}
			this.paramData.page =
				Math.floor(this.doctorList.length / this.paramData.limit) + 1;
			OnlineDoctorApi.DoctorList(this.paramData)
				.then(res => {
					if (res.Code === 0) {
						this.doctorList.push(...res.Body);
						if (res.Body.length !== this.paramData.limit) {
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
		 * 查看医生详情
		 */
		handelDoctorInfo(id) {
			this.$router.push({
				path: '/mother/interrogation-doctor-info',
				query: {
					doctor_id: id
				}
			});
		},
		/**
		 * 筛选下拉框隐藏
		 */
		onConfirm() {
			this.$refs.item.toggle();
		},
		/**
		 * 立即咨询
		 */
		consultationNow(id) {
			this.$router.push({
				path: '/mother/interrogation-pay-page',
				query: {
					duser_id: id,
					type: 0
				}
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-interrogation-doctor-list';
.@{inner-prefix} {
	background: #f8f8f8;
	height: 100%;
	.van-nav-bar__title {
		max-width: 75%;
	}
	&-title-search {
		padding: 6px 0;
		background: none;
		.van-search__content {
			background: rgba(255, 255, 255, 0.72);
		}
	}
	&-screen {
		.van-dropdown-menu__title {
			font-size: 13px;
		}
		.screen {
			padding: 0 19px 20px 19px;
			.title {
				color: #666666;
				margin-top: 20px;
			}
			.tags {
				margin-top: 13px;
				.van-tag {
					padding: 5px 14px;
					font-size: 13px;
					margin-right: 8px;
				}
				.sel-tag {
					border: 1px solid #ef749b;
					color: #ef749b;
					background: #ffeff4;
				}
			}
		}
	}
	.van-pull-refresh {
		padding: 7px 5px;
		height: calc(100% - 60px);
		overflow: scroll;
		.list-panel {
			border-radius: 10px;
			display: flex;
			flex-direction: row;
			padding: 20px 15px 20px 15px;
			margin-bottom: 5px;
			background: #ffffff;
			.doctor-pic {
			}
			.doctor-info {
				padding-left: 15px;
				width: 100%;
				.name {
					font-size: 16px;
					color: #000000;
					span {
						margin-left: 10px;
						font-size: 14px;
						color: #bbbbbb;
					}
				}
				.favorable {
					color: #666666;
					margin-top: 12px;
					display: flex;
					flex-direction: row;
					span:first-child {
						display: flex;
						align-items: center;
						margin-right: 40px;
					}
				}
				.speciality {
					width: 100%;
					margin-top: 11px;
					font-size: 14px;
					color: #999999;
					line-height: 18px;
					letter-spacing: 2px;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-box-orient: vertical;
				}
				.price {
					margin-top: 20px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					color: #fb5e5e;
					label {
						font-weight: bold;
					}
					.van-button {
						height: 30px;
						line-height: 10px;
						padding: 8px 20px;
					}
				}
			}
		}
	}
}
</style>
