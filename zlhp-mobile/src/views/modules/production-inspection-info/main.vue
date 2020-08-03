<template>
	<div :class="classRoot">
		<van-nav-bar title="产检详情" left-arrow @click-left="$router.back()">
		</van-nav-bar>
		<div :class="`${classRoot}-body`" v-if="archivePlanRecordsInfoData">
			<div class="status">
				<span class="status_left">
					孕{{ archivePlanRecordsInfoData.ArchivePlan.ArchiveWeeks }}周产检
				</span>
				<span class="status_right" @click="onSwitchIsArchive">
					{{ archivePlanRecordsInfoData.IsArchived ? '已产检' : '待产检' }}
					<van-checkbox
						:value="archivePlanRecordsInfoData.IsArchived === 1"
						checked-color="#FFC6CB"
					/>
				</span>
			</div>
			<div class="status">
				<span class="status_left">
					适宜孕周
				</span>
				<span class="status_right"
					>孕{{ getWeekDay(archivePlanRecordsInfoData.ArchivePlan.StartDate) }}
					~
					{{ getWeekDay(archivePlanRecordsInfoData.ArchivePlan.EndDate) }}
				</span>
			</div>
			<div class="status">
				<span class="status_left">
					产检时间
				</span>
				<span
					class="status_right"
					@click="showPicker = true"
					style="color: #F082A5"
				>
					{{
						archivePlanRecordsInfoData.ArchiveTimeStr ||
							archivePlanRecordsInfoData.PlanTimeStr
					}}
					<van-icon name="arrow" color="#999999" />
				</span>
			</div>
			<van-popup v-model="showPicker" position="bottom">
				<van-datetime-picker
					:value="
						new Date(
							archivePlanRecordsInfoData.ArchiveTime ||
								archivePlanRecordsInfoData.PlanTime
						)
					"
					type="date"
					@confirm="onPlanTimeConfirm"
					@cancel="showPicker = false"
				/>
			</van-popup>
			<van-panel class="container-panel">
				<template #header>
					<div class="check_content">
						<div class="title">
							<van-image :src="require('../../../assets/flower.png')" />产检目的
						</div>
						<div class="content">
							{{ archivePlanRecordsInfoData.ArchivePlan.Pourpose }}
						</div>
					</div>
					<div class="check_content">
						<div class="title">
							<van-image :src="require('../../../assets/flower.png')" />产检项目
						</div>
						<div class="content">
							{{ archivePlanRecordsInfoData.ArchivePlan.CheckItems }}
						</div>
					</div>
					<div class="check_content">
						<div class="title">
							<van-image :src="require('../../../assets/flower.png')" />注意事项
						</div>
						<div class="content">
							{{ archivePlanRecordsInfoData.ArchivePlan.Notes }}
						</div>
					</div>
				</template>
			</van-panel>
		</div>
	</div>
</template>
<script>
import * as ArchivePlanRecordsApi from '../../../apis/ArchivePlanRecordsApi';
import { getWeekDay } from '../../../commons';

export default {
	name: 'production-inspection-info',
	data() {
		return {
			isCheckUp: true, // 是否待产检
			archivePlanRecordID: this.$route.query.archive_plan_record_id,
			archivePlanRecordsInfoData: null, // 产检计划详情数据
			showPicker: false // 时间选择器
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		this.getArchivePlanRecordsInfoData();
	},
	methods: {
		getWeekDay,
		/**
		 * 获取产检详情
		 */
		getArchivePlanRecordsInfoData() {
			this.$toast.loading('加载中...');
			ArchivePlanRecordsApi.archivePlanRecordsInfo(this.archivePlanRecordID)
				.then(res => {
					if (res.Code === 0) {
						this.archivePlanRecordsInfoData = res.Body;
					}
				})
				.finally(this.$toast.clear());
		},
		/**
		 * 修改是否产检
		 */
		onSwitchIsArchive() {
			if (this.archivePlanRecordsInfoData.IsArchived) return;
			if (this.archivePlanRecordsInfoData.CanModify) {
				this.$dialog
					.confirm({
						title: '提示',
						message: `确认已完成【孕${this.archivePlanRecordsInfoData.ArchivePlan.ArchiveWeeks}周产检】吗？`
					})
					.then(() => {
						ArchivePlanRecordsApi.Finish(this.archivePlanRecordID).then(res => {
							if (res.Code === 0) {
								this.$toast.success('修改成功！');
								this.archivePlanRecordsInfoData = res.Body;
							}
						});
					})
					.catch(() => {
						this.$toast.fail('已取消！');
					});
			} else {
				this.$dialog.alert({
					title: '提示',
					message: '当前孕周无法修改此次产检状态'
				});
			}
		},
		/**
		 * 修改产检时间
		 */
		onPlanTimeConfirm(time) {
			ArchivePlanRecordsApi.PutArchivePlanRecords(this.archivePlanRecordID, {
				ArchiveTime: new Date(new Date(time).valueOf()).format('yyyy-MM-dd')
			}).then(res => {
				if (res.Code === 0) {
					this.$toast.success('修改成功！');
					this.archivePlanRecordsInfoData = res.Body;
				}
			});
			this.showPicker = false;
		}
	}
};
</script>
<style lang="less" scoped>
@import '../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-production-inspection-info';
.@{inner-prefix} {
	height: 100%;
	background: #f8f8f8;
	&-body {
		height: calc(100% - 47px);
		overflow: scroll;
		.status {
			padding: 15px 21px 15px 16px;
			display: flex;
			justify-content: space-between;
			background: #ffffff;
			margin-bottom: 2px;
			.status_left {
				font-size: 16px;
				color: #666666;
			}
			.status_right {
				font-size: 16px;
				color: #333333;
				display: flex;
				flex-direction: row;
				align-items: center;
				.van-checkbox {
					margin-left: 7px;
				}
			}
		}

		.container-panel {
			margin-top: 6px;
			padding: 25px 17px 40px 20px;
			.check_content {
				margin-bottom: 25px;
				.title {
					font-size: 16px;
					color: #000000;
					display: flex;
					align-items: center;
					.van-image {
						margin-right: 7px;
					}
				}
				.content {
					font-size: 15px;
					color: #888888;
					margin-top: 15px;
					line-height: 23px;
					text-indent: 2rem;
				}
			}
		}
	}
}
</style>
