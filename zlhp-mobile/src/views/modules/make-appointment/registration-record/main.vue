<template>
	<div :class="classRoot">
		<van-nav-bar
			title="我的预约"
			left-arrow
			@click-left="$router.push({ path: '/my' })"
		></van-nav-bar>
		<van-dropdown-menu :class="`${classRoot}-change`" active-color="#FF6060">
			<van-dropdown-item title="切换就诊人" disabled />
			<van-dropdown-item
				v-model="changeValue"
				:options="changeOption"
				@change="changePatient"
			/>
		</van-dropdown-menu>
		<van-pull-refresh
			v-model="refreshing"
			:class="`${classRoot}-body`"
			@refresh="onRefresh"
		>
			<van-list
				v-model="loading"
				:finished="finished"
				:error="error"
				finished-text="没有更多了"
				@load="getRecordListData"
			>
				<div v-if="recordList && recordList.length">
					<van-panel
						class="record_panel"
						v-for="(item, index) in recordList"
						:key="index"
						@click="handleRecord(item)"
					>
						<template #header>
							<div class="record">
								<div class="people_info">
									<span class="name"
										>{{ item.MedicalCards.Name
										}}<label>{{ item.MedicalCards.IDNumber }}</label></span
									>
									<span class="status" v-if="item.Status === 1">待报到</span>
									<span class="status" v-if="item.Status === 2">已签到</span>
									<span class="status" v-else-if="item.Status === 3"
										>已取消</span
									>
									<span class="status" v-else-if="item.Status === 4"
										>已过号</span
									>
								</div>
								<div class="record_info">
									<span class="info">
										<label>就诊科室：{{ item.DepartmentName }}</label>
										<label>预约时间：{{ item.BespeakDateTime }}</label>
									</span>
									<span class="number" v-if="item.ShowRegisterNumber"
										>{{ item.ShowRegisterNumber }}号</span
									>
								</div>
								<div class="action-button">
									<van-button
										round
										type="info"
										plain
										color="#F27198"
										v-if="
											item.CanCancel && item.Status === 1 && !item.CanCheckIn
										"
										@click.stop="cancleRegistration(item.RegisterRecordID)"
										>取消预约</van-button
									>
									<van-button
										round
										type="info"
										plain
										color="#F27198"
										v-if="
											item.CanCancel && item.Status === 1 && item.CanCheckIn
										"
										@click.stop="handleCheckIn(item.RegisterRecordID)"
										>立即签到</van-button
									>
									<van-button
										round
										type="info"
										plain
										color="#F27198"
										v-else-if="item.Status === 4"
										@click.stop="handleReschedule(item)"
										>重新预约</van-button
									>
									<!-- <van-button
										v-else
										round
										type="info"
										plain
										color="#666666"
										class="grey-button"
										>删除</van-button
									> -->
								</div>
							</div>
						</template>
					</van-panel>
				</div>
				<hint v-else-if="!loading" message="暂无挂号记录" />
			</van-list>
		</van-pull-refresh>
	</div>
</template>
<script>
import * as RegisterRecordsApi from '../../../../apis/RegisterRecordsApi';
import * as HisBespeakApi from '../../../../apis/HisBespeakApi';
import * as MedicalCardsApi from '../../../../apis/MedicalCardsApi';
import * as CheckInApi from '../../../../apis/CheckInApi';
import { getDistance, setLocation } from '../../../../commons/weixin';

export default {
	name: 'registration-record',
	data() {
		return {
			changeValue: 0,
			changeOption: [{ text: '全部', value: 0 }],
			param: {
				// 预约记录参数
				MedicalCardID: null,
				page: 0,
				limit: 10
			},
			loading: false,
			finished: false,
			error: false,
			refreshing: false,
			recordList: [], // 预约记录列表
			patientData: null, // 就诊人列表数据
			limit: 5, // 就诊人列表参数
			page: 1, // 就诊人列表参数
			uuidInterval: null // 定位定时器
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	beforeDestroy() {
		clearInterval(this.uuidInterval);
	},
	created() {
		this.getPatientData();
		const disposeDistance = () => {
			getDistance().then(distance => {
				this.distance = distance;
			});
		};
		disposeDistance();
		this.uuidInterval = setInterval(disposeDistance, 6000);
	},
	methods: {
		/**
		 * 签到
		 */
		handleCheckIn(id) {
			setLocation(this.distance)
				.then(this.checkIn(id))
				.catch('获取距离失败');
		},
		checkIn(id) {
			this.$toast.loading('签到中...');
			CheckInApi.CheckIn({
				RegisterRecordID: id
			})
				.then(res => {
					if (res.Code === 0) {
						this.$toast.success({
							forbidClick: true,
							message: '签到成功',
							onClose: () => {
								this.onRefresh();
							}
						});
					} else {
						this.$toast.fail({
							forbidClick: true,
							message: res.Message,
							onClose: () => {
								this.onRefresh();
							}
						});
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 重新预约
		 */
		handleReschedule(item) {
			this.$router.push({
				path: '/mother/notice',
				query: {
					reservation_id: item.ReservationID,
					medical_card_id: item.MedicalCardID
				}
			});
		},
		/**
		 * 查看预约详情
		 */
		handleRecord(data) {
			this.$router.push({
				path: '/mother/information-confirmation',
				query: {
					register_record_id: data.RegisterRecordID
				}
			});
		},
		/**
		 * 刷新
		 */
		onRefresh() {
			this.recordList = [];
			this.finished = false;
			this.loading = true;
			this.getRecordListData();
		},
		/**
		 * 获取预约挂号记录列表
		 */
		getRecordListData() {
			if (this.refreshing) {
				this.recordList = [];
				this.refreshing = false;
			}
			this.param.page =
				Math.floor(this.recordList.length / this.param.limit) + 1;
			RegisterRecordsApi.getRegisterRecordsList(this.param)
				.then(res => {
					if (res.Code === 0) {
						this.recordList.push(...res.Body);
						if (res.Body.length !== this.param.limit) {
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
		 * 获取就诊人
		 */
		getPatientData() {
			this.$toast.loading('加载中...');
			MedicalCardsApi.getMedicalCardsList(this.page, this.limit)
				.then(res => {
					if (res.Code === 0) {
						if (res.Body.length > 0) {
							res.Body.forEach(element => {
								this.changeOption.push({
									text: `${element.Name} ${element.IDNumber}`,
									value: element.MedicalCardID
								});
							});
						}
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 切换就诊人
		 */
		changePatient(value) {
			if (value === 0) {
				this.param.MedicalCardID = null;
			} else {
				this.param.MedicalCardID = value;
			}
			this.onRefresh();
		},
		/**
		 * 取消预约
		 */
		cancleRegistration(id) {
			this.$dialog
				.confirm({
					title: '温馨提示',
					message: '确定要取消预约吗？'
				})
				.then(() => {
					HisBespeakApi.appointmentRegisterCancelNoPay(id).then(res => {
						if (res.Code === 0) {
							this.$toast.success({
								forbidClick: true,
								message: '取消成功',
								onClose: () => {
									this.onRefresh();
								}
							});
						} else {
							this.$toast.fail({
								forbidClick: true,
								message: res.Message,
								onClose: () => {
									this.onRefresh();
								}
							});
						}
					});
				})
				.catch(() => {});
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-registration-record';
.@{inner-prefix} {
	height: 100%;
	background: #f8f8f8;
	&-change {
		padding: 0 18px;
		.van-dropdown-menu__item:first-child {
			justify-content: flex-start;
			-webkit-flex: 0.4;
			.van-dropdown-menu__title::after {
				content: none;
			}
			.van-dropdown-menu__title {
				color: #666666;
			}
		}
		.van-dropdown-menu__item:nth-child(2) {
			justify-content: flex-end;
		}
	}
	&-body {
		height: calc(100% - 110px);
		overflow: scroll;
		padding: 7px 5px;
		.record_panel {
			border-radius: 5px;
			margin-bottom: 10px;
			.record {
				padding: 18px 16px 16px 28px;
				.people_info {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.name {
						color: #333333;
						font-size: 17px;
						label {
							color: #666666;
							font-size: 14px;
							margin-left: 10px;
						}
					}
					.status {
						// color: #fb5e5e;
						color: #666666;
						font-size: 14px;
					}
				}
				.record_info {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					.info {
						display: flex;
						flex-direction: column;
						color: #999999;
						font-size: 14px;
						label {
							margin-top: 10px;
						}
					}
					.number {
						color: #333333;
						font-size: 18px;
					}
				}
				.action-button {
					display: flex;
					justify-content: flex-end;
					margin-top: 13px;
					.van-button {
						margin-left: 5px;
						font-size: 14px;
						height: 30px;
						line-height: 10px;
						padding: 8px 20px;
					}
					.grey-button {
						border-color: #dddddd !important;
					}
				}
			}
		}
	}
}
</style>
