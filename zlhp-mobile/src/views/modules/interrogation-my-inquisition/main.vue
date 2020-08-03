<template>
	<div :class="classRoot">
		<van-nav-bar title="我的问诊" left-arrow @click-left="handelBack">
		</van-nav-bar>
		<van-panel>
			<template #header>
				<van-tabs
					v-model="tabsActive"
					title-active-color="#E26488"
					color="#FD9BB9"
				>
					<van-tab title="全部"></van-tab>
					<van-tab title="快速问诊"></van-tab>
					<van-tab title="图文问诊"></van-tab>
				</van-tabs>
			</template>
		</van-panel>
		<van-pull-refresh
			v-model="refreshing"
			@refresh="onRefresh"
			:class="`${classRoot}-body`"
		>
			<van-list
				v-model="loading"
				:finished="finished"
				:error="error"
				finished-text="没有更多了"
				@load="getInquiryRecord"
			>
				<div v-if="inquiryRecordData && inquiryRecordData.length">
					<van-panel
						class="panel"
						v-for="(item, index) in inquiryRecordData"
						:key="index"
						@click="handelViewDetails(item.InquiryRecordID)"
					>
						<template #header>
							<div class="doctor">
								<span v-if="item.DUser && item.DUser.OnlineDoctor">
									<van-image
										v-if="item.DUser.OnlineDoctor.MedicalStaff.Avatar"
										round
										width="40px"
										height="40px"
										fit="cover"
										:src="item.DUser.OnlineDoctor.MedicalStaff.Avatar"
									/>
									<svg-icon v-else value="icon-Headportrait" :size="3" />

									{{ item.DUser.OnlineDoctor.MedicalStaff.Name }}
									<van-icon name="arrow" color="#BBBBBB" />
								</span>
								<span style="color:#FF0049" v-if="item.ConsultStatus === 0"
									>待付款</span
								>
								<span style="color:#FF0049" v-else-if="item.ConsultStatus === 1"
									>待接诊</span
								>
								<span style="color:#FF0049" v-else-if="item.ConsultStatus === 2"
									>问诊中</span
								>
								<span style="color:#FF0049" v-else-if="item.ConsultStatus === 3"
									>待评价</span
								>
								<span style="color:#999999" v-else-if="item.ConsultStatus === 4"
									>已完成</span
								>
								<span style="color:#999999" v-else-if="item.ConsultStatus === 5"
									>已取消</span
								>
							</div>
							<div class="type">
								{{ item.ConsultType === 0 ? '图文问诊' : '快速问诊' }}
								{{
									item.InquiryStartTime
										? new Date(item.InquiryStartTime).format(
												'yyyy-MM-dd hh:mm:ss'
										  )
										: ''
								}}
							</div>
							<div class="interrogation-content">
								问诊内容：{{ item.Content ? item.Content : '暂无问诊内容' }}
							</div>
							<div class="action-button">
								<van-button
									round
									type="info"
									plain
									color="#FF0049"
									v-if="item.ConsultStatus === 0"
									@click.stop="handelPayment(item)"
									>立即付款</van-button
								>
								<van-button
									round
									type="info"
									plain
									color="#FF0049"
									v-if="item.ConsultStatus === 3"
									@click.stop="handelEvaluate(item)"
									>立即评价</van-button
								>
								<van-button
									round
									plain
									v-if="item.ConsultStatus === 0 || item.ConsultStatus === 1"
									@click.stop="handelCancel(item)"
									>取消订单</van-button
								>
							</div>
						</template>
					</van-panel>
				</div>
				<hint v-else-if="!loading" message="这里好冷清，没有任何记录" />
			</van-list>
		</van-pull-refresh>
	</div>
</template>
<script>
import * as InquiryRecordApi from '../../../apis/InquiryRecordApi';

export default {
	name: 'interrogation-my-inquisition',
	data() {
		return {
			tabsActive: 0,
			inquiryRecordData: [], // 我的问诊列表数据
			inquiryListParams: {
				// 我的问诊列表接口参数
				ConsultType: null,
				page: 1,
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
	watch: {
		/**
		 * 全部、快速问诊、图文问诊选择
		 */
		tabsActive() {
			if (this.tabsActive === 1) {
				this.inquiryListParams.ConsultType = 1;
			} else if (this.tabsActive === 2) {
				this.inquiryListParams.ConsultType = 0;
			} else {
				this.inquiryListParams.ConsultType = null;
			}
			this.onRefresh();
		}
	},
	created() {},
	methods: {
		/**
		 * 返回
		 */
		handelBack() {
			this.$router.push({
				path: '/my'
			});
		},
		/**
		 * 刷新
		 */
		onRefresh() {
			this.inquiryRecordData = [];
			this.loading = true;
			this.finished = false;
			this.getInquiryRecord();
		},
		/**
		 * 获取我的问诊数据
		 */
		getInquiryRecord() {
			if (this.refreshing) {
				this.inquiryRecordData = [];
				this.refreshing = false;
			}
			this.inquiryListParams.page =
				Math.floor(
					this.inquiryRecordData.length / this.inquiryListParams.limit
				) + 1;
			InquiryRecordApi.getInquiryRecordList(this.inquiryListParams)
				.then(res => {
					if (res.Code === 0) {
						this.inquiryRecordData.push(...res.Body);
						if (res.Body.length !== this.inquiryListParams.limit) {
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
		 * 查看详情
		 */
		handelViewDetails(id) {
			this.$router.push({
				path: '/mother/interrogation-details-inquiring',
				query: {
					inquiry_record_id: id
				}
			});
		},
		/**
		 * 立即付款
		 */
		handelPayment(data) {
			this.$router.push({
				path: '/mother/interrogation-pay-page',
				query: {
					duser_id: data.DUserID,
					type: data.ConsultType
				}
			});
		},
		/**
		 * 立即评价
		 */
		handelEvaluate(data) {
			this.$router.push({
				path: '/mother/interrogation-publication-evaluation',
				query: {
					inquiry_record_iD: data.InquiryRecordID,
					online_doctor_id: data.DUser.OnlineDoctor.OnlineDoctorID
				}
			});
		},
		/**
		 * 取消
		 * @param data
		 */
		handelCancel(data) {
			this.$dialog
				.confirm({
					title: '提示',
					message: '确认取消订单？'
				})
				.then(() => {
					this.$toast.loading('加载中');
					InquiryRecordApi.Cancel(data.InquiryRecordID)
						.then(res => {
							if (res.Code === 0) {
								// this.onRefresh();
								data.ConsultStatus = res.Body.ConsultStatus;
								data.UpdateTime = res.Body.UpdateTime;
								this.$toast.success('取消成功！');
							}
						})
						.finally(this.$toast.clear);
				})
				.catch(() => {
					this.$toast.fail('用户取消');
				});
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-interrogation-my-inquisition';
.@{inner-prefix} {
	background: #f8f8f8;
	height: 100%;
	&-body {
		padding: 10px 5px;
		height: calc(100% - 110px);
		overflow: scroll;
		.panel {
			padding: 10px 15px 25px 20px;
			border-radius: 5px;
			box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.16);
			margin-bottom: 9px;
			.doctor {
				display: flex;
				justify-content: space-between;
				align-items: center;
				span:first-child {
					display: flex;
					align-items: center;
					.van-image,
					svg {
						margin-right: 5px;
					}
				}
			}
			.type {
				color: #666666;
				margin-top: 17px;
			}
			.interrogation-content {
				font-size: 13px;
				color: #999999;
				margin-top: 15px;
				line-height: 23px;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				overflow: hidden;
				text-overflow: ellipsis;
				-webkit-box-orient: vertical;
			}
			.action-button {
				display: flex;
				justify-content: flex-end;
				margin-top: 23px;
				.van-button {
					margin-left: 5px;
					font-size: 13px;
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
</style>
