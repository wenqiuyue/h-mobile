<template>
	<div :class="classRoot">
		<van-nav-bar
			title="产检计划"
			left-arrow
			@click-left="$router.push({ path: '/' })"
		>
		</van-nav-bar>
		<van-notice-bar color="#666666" background="#fff" mode="closeable">
			该产检计划根据您的预产期制定，请参考
			<template #left-icon>
				<svg-icon
					value="icon-sign_Tips"
					:size="1.25"
					style="margin-right: 6px"
				/>
			</template>
		</van-notice-bar>
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
				@load="getPlanListData"
			>
				<div v-if="planList && planList.length">
					<van-panel
						class="project-panel"
						v-for="(item, index) in planList"
						:key="index"
						@click="handleInfo(item.ArchivePlanRecordID)"
						:id="item.ArchivePlanRecordID"
					>
						<template #header>
							<svg-icon
								value="icon-mother_productionPlane_completed"
								:size="6"
								class="finish"
								v-if="item.IsArchived"
							/>
							<div class="title">
								<petal :title="index + 1"></petal
								><label class="time_title">
									{{ item.ArchiveTimeStr || item.PlanTimeStr }}
									孕{{ item.ArchivePlan.ArchiveWeeks }}周产检
								</label>
							</div>
							<div class="week">
								适宜孕周（孕{{ getWeekDay(item.ArchivePlan.StartDate) }}
								~
								{{ getWeekDay(item.ArchivePlan.EndDate) }}）
							</div>
							<div class="project">
								【检查项目】{{ item.ArchivePlan.CheckItems }}
							</div>
						</template>
					</van-panel>
				</div>
				<hint v-else-if="!loading" message="暂无产检计划" />
			</van-list>
		</van-pull-refresh>
	</div>
</template>
<script>
import * as ArchivePlanRecordsApi from '../../../apis/ArchivePlanRecordsApi';
import { getWeekDay } from '../../../commons';

export default {
	name: 'production-inspection-plan',
	data() {
		return {
			loading: false,
			finished: false,
			error: false,
			refreshing: false,
			planList: [], // 产检计划列表
			page: 0,
			limit: 30,
			archivePlanRecordId: this.$route.query.archive_plan_record_id // 从产检倒计时传过来的id
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	mounted() {},
	methods: {
		getWeekDay,
		/**
		 * 刷新
		 */
		onRefresh() {
			this.planList = [];
			this.finished = false;
			this.loading = true;
			this.getPlanListData();
		},
		/**
		 * 获取产检计划列表
		 */
		getPlanListData() {
			if (this.refreshing) {
				this.planList = [];
				this.refreshing = false;
			}
			this.page = Math.floor(this.planList.length / this.limit) + 1;
			ArchivePlanRecordsApi.archivePlanRecordsAll()
				.then(res => {
					if (res.Code === 0) {
						this.planList.push(...res.Body);
						if (res.Body.length !== this.limit) {
							this.finished = true;
						}
						// 当从产检倒计时有传产检计划id时，则跳到相应的锚点
						if (this.archivePlanRecordId) {
							this.$nextTick(function() {
								window.location.href = `#${this.archivePlanRecordId}`;
							});
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
		handleInfo(archivePlanRecordID) {
			this.$router.push({
				path: '/mother/production-inspection-info',
				query: {
					archive_plan_record_id: archivePlanRecordID
				}
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-production-inspection-plan';
.@{inner-prefix} {
	height: 100%;
	background: #f8f8f8;
	&-title-tips {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 9px;
		margin-top: 5px;
		span {
			font-size: 13px;
			color: #666666;
			display: flex;
			align-items: center;
			svg {
				margin-right: 5px;
			}
		}
	}
	&-body {
		padding: 10px 5px;
		height: calc(100% - 115px);
		overflow-y: scroll;
		overflow-x: hidden;
		.project-panel {
			padding: 17px 13px 17px 17px;
			border-radius: 5px;
			margin-bottom: 10px;
			.finish {
				position: absolute;
				right: -20px;
				top: -28px;
				z-index: 99;
			}
			.title {
				font-size: 16px;
				color: #333333;
				display: flex;
				align-items: center;
				.time_title {
					margin-left: 10px;
				}
			}
			.week {
				margin-top: 19px;
				padding-left: 5px;
				color: #bbbbbb;
				font-size: 13px;
			}
			.project {
				font-size: 13px;
				line-height: 23px;
				font-size: 14px;
				color: #999999;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				overflow: hidden;
				text-overflow: ellipsis;
				-webkit-box-orient: vertical;
				margin-top: 10px;
			}
		}
	}
}
</style>
