<template>
	<div :class="classRoot">
		<van-nav-bar title="产检记录" left-arrow @click-left="$router.back()" />
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
			<hint v-if="!list || !list.length" />
			<template v-else>
				<simple-header
					:avatar="User['UserImage']"
					:title="Archive ? Archive['Name'] : null"
					:intro="
						Archive
							? getGestationalWeekAndDayTitle(
									Archive['MenstrualHistories']['LastMenstrualDate']
							  )
							: null
					"
					@onClick="$router.push({ path: '/archive/list' })"
				/>
				<template v-for="item in list">
					<div :key="item['ArchiveRecordID']" :class="`${classRoot}-item`">
						<div :class="`${classRoot}-item-line`"></div>
						<van-row :class="`${classRoot}-item-timeline`">
							<van-col span="16" :class="`${classRoot}-item-timeline-title`">
								<svg-icon value="icon-introduce_RoundBuckle" />
								孕周：{{ item['ArchiveWeeks'] }}周
								<label v-if="item['ArchiveDays'] && item['ArchiveDays'] !== 0"
									>+{{ item['ArchiveDays'] }}天</label
								>
							</van-col>
							<van-col span="8" :class="`${classRoot}-item-timeline-button`">
								<van-button @click="handleViewReport(item['RegistrationNo'])">
									<van-icon name="search" />
									查看报告
								</van-button>
							</van-col>
						</van-row>
						<van-panel>
							<div
								slot="header"
								:class="['van-panel__title', 'van-hairline--bottom']"
							>
								<van-row>
									<van-col span="12">
										日期：{{
											new Date(item['ArchiveDate']).format('yyyy-MM-dd')
										}}
									</van-col>
									<van-col span="12">
										妊娠风险评估：
										<van-tag :color="getRiskColor(item['RiskLevel'])" />
									</van-col>
								</van-row>
							</div>
							<template>
								<van-row>
									<van-col span="8">体重：{{ item['BodyWeight'] }}kg</van-col>
									<van-col span="8">宫高：{{ item['FundalHeight'] }}cm</van-col>
									<van-col span="8">
										腹围：{{ item['AbdominalCircumference'] }}cm
									</van-col>
								</van-row>
							</template>
							<div slot="footer" :class="`${classRoot}-footer`">
								<van-row>
									<van-col span="18" class="left">
										下次产检时间：
										<span>
											{{
												item['NextCheckDate']
													? new Date(item['NextCheckDate']).format('yyyy-MM-dd')
													: '无'
											}}
										</span>
									</van-col>
									<van-col span="6" class="right">
										<van-button @click="handleDetails(item)">
											查看详情
										</van-button>
									</van-col>
								</van-row>
							</div>
						</van-panel>
					</div>
				</template>
			</template>
		</van-pull-refresh>
		<van-popup
			:class="`${classRoot}-popup`"
			v-model="show"
			position="bottom"
			round
		>
			<template v-if="details">
				<van-cell-group :class="`${classRoot}-popup-header`">
					<van-row>
						<van-col span="12">
							<b>孕周：</b>
							{{ getGestationalWeekAndDayTitle(details['LastMenstrualDate']) }}
						</van-col>
						<van-col span="12">
							<b>检查日期：</b>
							{{ new Date(details['ArchiveDate']).format('yyyy-MM-dd') }}
						</van-col>
					</van-row>
					<div>
						<b>下次检查时间：</b>
						{{ new Date(details['NextCheckDate']).format('yyyy-MM-dd') }}
					</div>
				</van-cell-group>
				<div :class="`${classRoot}-popup-table`">
					<van-row>
						<van-col span="12">
							血压： {{ details['Diastolic'] }}/{{ details['Systolic'] }}
						</van-col>
						<van-col span="12">体重：{{ details['BodyWeight'] }}</van-col>
					</van-row>
					<van-row>
						<van-col span="12">宫高：{{ details['FundalHeight'] }}</van-col>
						<van-col span="12">
							腹围：{{ details['AbdominalCircumference'] }}
						</van-col>
					</van-row>
					<van-row>
						<van-col span="12">胎位：{{ details['FetalPositionVal'] }}</van-col>
						<van-col span="12">胎心：{{ details['FetalHeart'] }}</van-col>
					</van-row>
					<van-row>
						<van-col span="12">
							胎先露：{{ details['FetalPresentation'] }}
						</van-col>
						<van-col span="12">衔接：{{ details['Engagement'] }}</van-col>
					</van-row>
					<van-row>
						<van-col span="12">胎动：{{ details['FetalMovement'] }}</van-col>
						<van-col span="12">浮肿：{{ details['Edema'] }}</van-col>
					</van-row>
				</div>
				<van-panel>
					<div slot="header" class="van-cell van-panel__header">
						<svg-icon value="icon-star" />
						妊娠风险评估
					</div>
					<div>{{ details['Risk'] || '无' }}</div>
				</van-panel>
				<van-panel>
					<div slot="header" class="van-cell van-panel__header">
						<svg-icon value="icon-star" />
						辅助检查项目
					</div>
					<div>
						<ul>
							<template v-for="(item, index) in details['AuxiliaryProject']">
								<li :key="index">{{ item['Name'] }}</li>
							</template>
						</ul>
					</div>
				</van-panel>
				<van-panel>
					<div slot="header" class="van-cell van-panel__header">
						<svg-icon value="icon-star" />
						异常情况及处理
					</div>
					<div>{{ details['Abnormal'] || '无' }}</div>
				</van-panel>
				<van-panel>
					<div slot="header" class="van-cell van-panel__header">
						<svg-icon value="icon-star" />
						卫生指导
					</div>
					<div>
						<ul>
							<template v-for="(item, index) in details['HealthGuidances']">
								<li :key="index">
									{{ item['Name'] }}
									<div
										v-html="
											item['Content'].replace(new RegExp('\n', 'g'), '<br/>')
										"
									/>
								</li>
							</template>
						</ul>
					</div>
				</van-panel>
				<van-panel>
					<div slot="header" class="van-cell van-panel__header">
						<svg-icon value="icon-star" />
						下次随访嘱托
					</div>
					<div>{{ details['NextCheckEntrust'] || '无' }}</div>
				</van-panel>
				<van-panel>
					<div slot="header" class="van-cell van-panel__header">
						<svg-icon value="icon-star" />
						总体评估
					</div>
					<div>{{ details['Diagnosis'] || '无' }}</div>
				</van-panel>
			</template>
		</van-popup>
	</div>
</template>
<script>
import * as UserApi from '../../../apis/UserApi';
import * as ArchiveApi from '../../../apis/ArchiveApi';
import * as ArchiveRecordsApi from '../../../apis/ArchiveRecordsApi';
import {
	disposeResult,
	getRiskColor,
	getGestationalWeekAndDayTitle
} from '../../../commons';

export default {
	name: 'prenatal-record',
	data() {
		return {
			show: false,
			isLoading: false,
			details: null,
			list: null,
			User: null,
			Archive: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		this.onRefresh();
	},
	methods: {
		getRiskColor,
		getGestationalWeekAndDayTitle,
		/**
		 * 查看报告
		 */
		handleViewReport(RegistrationNo) {
			this.$router.push({
				path: '/mother/inspection/check',
				query: { RegistrationNo }
			});
		},
		/**
		 * 刷新
		 */
		onRefresh() {
			this.isLoading = true;
			this.$toast.loading('加载中...');
			const keys = ['User', 'Archive', 'list'];
			const methods = [
				UserApi.GetUser(),
				ArchiveApi.Current(),
				ArchiveRecordsApi.Get()
			];
			Promise.all(methods)
				.then(results => {
					results.forEach((item, index) => {
						disposeResult({
							$vm: this,
							response: results[index],
							key: keys[index]
						});
					});
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
			this.show = true;
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';
@inner-prefix: ~'@{prefix-mother}-prenatal-record';
.@{inner-prefix} {
	height: 100%;
	background-color: #f9f9f9;

	.van-pull-refresh {
		height: calc(100% - calc(46px + 1.5rem));
		overflow: scroll;
		padding-bottom: 1.5rem;

		&__track {
			min-height: 100%;
		}
	}

	&-item {
		margin: 0 0.5rem 0 1rem;
		position: relative;

		&-line {
			position: absolute;
			left: -0.2rem;
			background-color: #fcd3d3;
			width: 0.2rem;
			height: 100%;
			z-index: 1;
		}

		&-timeline {
			height: 1.5rem;
			line-height: 1.5rem;
			padding-top: 1rem;
			padding-bottom: 0.5rem;

			&-title {
				color: #6e9ff0;
				svg {
					vertical-align: middle;
					position: relative;
					left: -0.6rem;
					bottom: 0.1rem;
					z-index: 2;
				}
			}
			&-button {
				text-align: right;

				button {
					color: white;
					width: 66px;
					height: 22px;
					line-height: 22px;
					background-color: #ee8ca1;
					padding: 0 0.25rem;
					font-size: 0.75rem;
					border: unset;
				}
			}
		}

		.van-panel {
			box-shadow: 0px -1px 3px rgba(0, 0, 0, 0.16);

			&__title {
				padding: 0.5rem;
				line-height: 1.5rem;
				font-size: 0.85rem;
				color: @font-color-middle;
				.van-tag {
					height: 0.5rem;
					width: 0.75rem;
					vertical-align: middle;
				}
			}
			&__content {
				padding: 0.5rem;
				color: @font-color-secondary;
				font-size: 0.85rem;
			}
			&__footer {
				padding: 0.3rem 0.5rem;
				line-height: 1rem;
				font-size: 0.85rem;
				color: @font-color-middle;
				background-color: #eaeaea;
				.left {
					span {
						color: orangered;
					}
				}
				.right {
					text-align: right;
				}
				button {
					color: #ee8ca1;
					background-color: unset;
					padding: unset;
					height: unset;
					line-height: unset;
					font-size: 0.85rem;
				}
			}
		}
	}

	&-popup {
		max-height: 90%;
		background-color: white;
		font-size: 0.85rem;
		&-header {
			padding: 10px;
			background-color: rgba(105, 150, 255, 0.3);
		}

		&-table {
			padding: 0.25rem;
			border: 1px solid rgba(110, 159, 240, 0.3);
			margin: 0.75rem;
			box-shadow: 0.25rem 0.3rem 0.1rem 0.1rem rgba(110, 159, 240, 0.3);
		}

		.van-panel {
			&__header {
				height: 2.5rem;
				line-height: 1.5rem;
				padding: 0.5rem 1rem;
				svg {
					position: relative;
					top: 0.1rem;
					margin-right: 0.25rem;
					vertical-align: middle;
				}
			}
			&__content {
				padding: 1rem;
			}
		}
	}
}
</style>
