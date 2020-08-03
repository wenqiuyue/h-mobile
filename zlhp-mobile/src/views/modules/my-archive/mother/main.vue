<template>
	<div :class="classRoot" v-if="archiveData">
		<van-nav-bar title="我的档案" left-arrow @click-left="$router.back()" />
		<div :class="`${classRoot}-number`">
			档案编号: {{ archiveData.ArchiveNo }}
			<!-- <svg-icon value="icon-Refresh-green" /> -->
		</div>
		<div :class="`${classRoot}-body`">
			<title-style :title="'基本信息'" />
			<div class="archive-container">
				<div class="archive-bg">
					<div class="archive-text">
						<span v-if="archiveData.Name">{{ archiveData.Name }}</span>
						<span class="archive-national" v-if="archiveData.Race">
							{{ archiveData.Race }}
						</span>
					</div>
					<div class="archive-text" v-if="archiveData.IDNumber">
						身份证: {{ archiveData.IDNumber }}
					</div>
					<div class="archive-text" v-if="archiveData.HusPhone">
						手机号: {{ archiveData.HusPhone }}
					</div>
					<div class="archive-text" v-if="archiveData.BodyWeight">
						孕前体重: {{ archiveData.BodyWeight }}KG
					</div>
					<div class="archive-text" v-if="archiveData.Stature">
						身高: {{ archiveData.Stature }}CM
					</div>
					<div class="archive-text" v-if="archiveData.Educational">
						文化程度: {{ archiveData.Educational }}
					</div>
					<div class="archive-text" v-if="archiveData.MaritalStatus">
						婚姻状况: {{ archiveData.MaritalStatus }}
					</div>
					<div class="archive-text" v-if="archiveData.MarriageAge">
						结婚年龄: {{ archiveData.MarriageAge }}
					</div>
					<div class="archive-text" v-if="archiveData.Profession">
						职业: {{ archiveData.Profession }}
					</div>
					<div class="archive-text" v-if="archiveData.Employer">
						工作单位: {{ archiveData.Employer }}
					</div>
					<div class="archive-text" v-if="archiveData.RegAddress">
						户籍地址: {{ archiveData.RegAddress }}
					</div>
					<div class="archive-text" v-if="archiveData.RegAddressInfo">
						详细地址: {{ archiveData.RegAddressInfo }}
					</div>
					<div class="archive-text" v-if="archiveData.CurrAddress">
						现居地址: {{ archiveData.CurrAddress }}
					</div>
					<div class="archive-text" v-if="archiveData.CurrAddressInfo">
						详细地址: {{ archiveData.CurrAddressInfo }}
					</div>
					<div class="archive-text" v-if="archiveData.RestAddress">
						修养地址: {{ archiveData.RestAddress }}
					</div>
					<div class="archive-text" v-if="archiveData.RestAddressInfo">
						详细地址: {{ archiveData.RestAddressInfo }}
					</div>
					<svg-icon
						class="icon-botton"
						value="icon-decorate_pinkFlower"
						:size="2"
					/>
				</div>
			</div>
			<title-style :title="'联系人信息'" />
			<div class="archive-container">
				<div class="archive-bg">
					<div class="archive-text">
						{{ archiveData.ContactRelationship }}: {{ archiveData.HusName }}
					</div>
					<div class="archive-text" v-if="archiveData.HusIDNumber">
						身份证: {{ archiveData.HusIDNumber }}
					</div>
					<div class="archive-text" v-if="archiveData.HusRace">
						民族: {{ archiveData.HusRace }}
					</div>
					<div class="archive-text" v-if="archiveData.HusPhone">
						手机号: {{ archiveData.HusPhone }}
					</div>
					<div class="archive-text" v-if="archiveData.HusEducational">
						文化程度: {{ archiveData.HusEducational }}
					</div>
					<div class="archive-text" v-if="archiveData.HusProfession">
						职业: {{ archiveData.HusProfession }}
					</div>
					<div class="archive-text" v-if="archiveData.HusEmployer">
						工作单位: {{ archiveData.HusEmployer }}
					</div>
					<div class="archive-text" v-if="archiveData.HusBloodABO">
						血型ABO: {{ archiveData.HusBloodABO }}
					</div>
					<div class="archive-text" v-if="archiveData.HusBloodRH">
						血型RH: {{ archiveData.HusBloodRH }}
					</div>
					<div class="archive-text" v-if="archiveData.HusPhysicalCondition">
						身体情况: {{ archiveData.HusPhysicalCondition }}
					</div>
					<div class="archive-text">
						既往情况:
						{{ archiveData.HusPastDisease ? archiveData.HusPastDisease : '无' }}
					</div>
					<div class="archive-text">
						肺部疾病:
						{{
							archiveData.HusPulmonaryDisease
								? archiveData.HusPulmonaryDisease
								: '无'
						}}
					</div>
					<div class="archive-text">
						肾脏疾病:
						{{
							archiveData.HusKidneyDisease ? archiveData.HusKidneyDisease : '无'
						}}
					</div>
					<div class="archive-text" v-if="archiveData.HusSomking">
						吸烟: {{ archiveData.HusSomking }}
					</div>
					<div class="archive-text" v-if="archiveData.HusDrink">
						喝酒: {{ archiveData.HusDrink }}
					</div>
					<svg-icon
						class="icon-botton"
						value="icon-decorate_pinkFlower"
						:size="2"
					/>
				</div>
			</div>
			<title-style :title="'基本情况'" />
			<div class="archive-container">
				<div class="archive-bg">
					<div class="archive-text">
						<span class="situation">月经史:</span>
						<div v-if="archiveData.MenstrualHistories.LastMenstrualDate">
							末次月经时间:
							{{
								new Date(
									archiveData.MenstrualHistories.LastMenstrualDate
								).format('yyyy-MM-dd')
							}}
						</div>
						<div v-if="archiveData.MenstrualHistories.MenarcheAge">
							初潮年龄: {{ archiveData.MenstrualHistories.MenarcheAge }}
						</div>
						<div
							v-if="
								archiveData.MenstrualHistories.MenstrualCycleMin &&
									archiveData.MenstrualHistories.MenstrualCycleMax
							"
						>
							月经周期: {{ archiveData.MenstrualHistories.MenstrualCycleMin }} -
							{{ archiveData.MenstrualHistories.MenstrualCycleMax }}天
						</div>
						<div
							v-if="
								archiveData.MenstrualHistories.MenstrualPeriodMin &&
									archiveData.MenstrualHistories.MenstrualPeriodMax
							"
						>
							经期天数:
							{{ archiveData.MenstrualHistories.MenstrualPeriodMin }} -
							{{ archiveData.MenstrualHistories.MenstrualPeriodMax }}天
						</div>
						<div>
							月经色{{ archiveData.MenstrualHistories.IsMenarcheColor }}、
							月经量{{ archiveData.MenstrualHistories.MenarcheBV }}、 痛经{{
								archiveData.MenstrualHistories.Dysmenorrhea
							}}、 血块{{ archiveData.MenstrualHistories.IsBloodClot }}
						</div>
					</div>
					<div class="archive-text">
						<span class="situation">孕产史:</span>
						<span
							>怀孕{{ archiveData.GestationHistories.PregnancyTimes }}次、</span
						>
						<span v-if="archiveData.GestationHistories.BirthTimes">
							生产{{ archiveData.GestationHistories.BirthTimes }}次、
						</span>
						<span v-if="archiveData.GestationHistories.VaginalDeliveryTimes">
							阴道产{{
								archiveData.GestationHistories.VaginalDeliveryTimes
							}}次、
						</span>
						<span v-if="archiveData.GestationHistories.CaesareanDeliveryTimes">
							剖宫产{{
								archiveData.GestationHistories.CaesareanDeliveryTimes
							}}次、
						</span>
						<span v-if="archiveData.GestationHistories.Girls"
							>女孩{{ archiveData.GestationHistories.Girls }}个、</span
						>
						<span v-if="archiveData.GestationHistories.Boys"
							>男孩{{ archiveData.GestationHistories.Boys }}个、</span
						>
						<span v-if="archiveData.GestationHistories.MiscarriageTimes">
							自然流产
							{{ archiveData.GestationHistories.MiscarriageTimes }}次、
						</span>
						<span v-if="archiveData.GestationHistories.AbortionTimes">
							人工流产
							{{ archiveData.GestationHistories.AbortionTimes }}次、
						</span>
						<span v-if="archiveData.GestationHistories.PrematureLaborTimes">
							早产
							{{ archiveData.GestationHistories.PrematureLaborTimes }}次、
						</span>
						<span v-if="archiveData.GestationHistories.StillBirthTimes">
							死胎（产）{{ archiveData.GestationHistories.StillBirthTimes }}次、
						</span>
						<span v-if="archiveData.GestationHistories.NewbornDeathTimes">
							新生儿死亡{{
								archiveData.GestationHistories.NewbornDeathTimes
							}}次、
						</span>
						<span v-if="archiveData.GestationHistories.IsBirthDefect">
							{{ archiveData.GestationHistories.IsBirthDefect }}既往出生缺陷、
						</span>
						<span v-if="archiveData.GestationHistories.IsComplication">
							{{
								archiveData.GestationHistories.IsComplication
							}}既往妊娠合并症和并发症
						</span>
						<div v-if="archiveData.GestationHistories.LastAbortionDate">
							末次流产时间:
							{{
								new Date(
									archiveData.GestationHistories.LastAbortionDate
								).format('yyyy-MM-dd')
							}}
						</div>
						<div v-if="archiveData.GestationHistories.LastBirthDate">
							末次分娩时间:
							{{
								new Date(archiveData.GestationHistories.LastBirthDate).format(
									'yyyy-MM-dd'
								)
							}}
						</div>
					</div>
					<div class="archive-text">
						<span class="situation">既往史:</span>
						{{ archiveData.PastHistory
						}}{{ archiveData.OtherPast ? ': ' + archiveData.OtherPast : '' }}
					</div>
					<div class="archive-text">
						<span class="situation">家族史:</span>
						{{ archiveData.FamilyHistory
						}}{{
							archiveData.OtherFamilyHistory
								? ': ' + archiveData.OtherFamilyHistory
								: ''
						}}
					</div>
					<div class="archive-text">
						<span class="situation">个人史:</span>
						{{ archiveData.PersonHistory
						}}{{
							archiveData.OtherPersonHistory
								? ': ' + archiveData.OtherPersonHistory
								: ''
						}}
					</div>
					<div class="archive-text">
						<span class="situation">妇产科手术史:</span>
						{{
							archiveData.SurgeryHistory === '无' && archiveData.OtherSurgery
								? ''
								: archiveData.SurgeryHistory
						}}{{
							archiveData.OtherSurgery ? ',' + archiveData.OtherSurgery : ''
						}}
					</div>
					<svg-icon
						class="icon-botton"
						value="icon-decorate_pinkFlower"
						:size="2"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import _ from 'lodash';
import * as EnumApi from '../../../../apis/EnumApi';
import * as CodeApi from '../../../../apis/CodeApi';
import * as ArchiveApi from '../../../../apis/ArchiveApi';

export default {
	name: 'my-archive',
	data() {
		return {
			archiveData: null // 档案详情
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		const eid = this.$route.query.edit_id;
		this.getArchiveData(eid);
	},
	methods: {
		// 获取用户的档案
		getArchiveData(eid) {
			const methods = [
				EnumApi.GetList(
					[
						'IdType',
						'Educational',
						'MaritalStatus',
						'Profession',
						'ContactRelationship',
						'HusIdType',
						'HusEducational',
						'HusProfession',
						'HusBloodABO',
						'HusBloodRH',
						'HusPhysicalCondition',
						'MenarcheBV',
						'Dysmenorrhea',
						'PastHistory',
						'FamilyHistory',
						'PersonHistory',
						'SurgeryHistory',
						'HaveOrNothing'
					].map(m => `${m}Enum`)
				),
				CodeApi.GetRace(),
				ArchiveApi.Get(eid)
			];
			Promise.all(methods).then(res => {
				if (res[0].Code === 0 && res[2].Code === 0) {
					const enums = res[0].Body;
					enums.HusSomking = [
						{ text: '从不', value: 0 },
						{ text: '偶尔', value: 1 },
						{ text: '经常', value: 2 }
					];
					enums.HusDrink = [
						{ text: '从不', value: 0 },
						{ text: '偶尔', value: 1 },
						{ text: '经常', value: 2 }
					];
					enums.IsMenarcheColor = [
						{ text: '异常', value: 0 },
						{ text: '正常', value: 1 }
					];
					const Race = res[1].map(m => {
						return {
							text: m.CodeName,
							value: parseInt(m.CodeVal, 0)
						};
					});
					enums.Race = Race;
					enums.HusRace = Race;
					this.parseForm(enums, res[2].Body);
				}
			});
		},
		parseForm(enums, form) {
			Object.keys(form).forEach(key => {
				if (Object.keys(enums).indexOf(key) !== -1) {
					form[key] = enums[key]
						.filter(m => {
							const keyString = form[key] !== null ? form[key].toString() : '';
							const keyArray = keyString.split(',').map(s => {
								return parseInt(_.trim(s), 0);
							});
							return keyArray.indexOf(m.value) !== -1;
						})
						.map(m => m.text)
						.toString();
				}
				// 月经史和孕产史
				if (key === 'MenstrualHistories' || key === 'GestationHistories') {
					Object.keys(form[key]).forEach(mens => {
						if (
							mens === 'IsBloodClot' ||
							mens === 'IsBirthDefect' ||
							mens === 'IsComplication'
						) {
							form[key][mens] = enums.HaveOrNothing.filter(f => {
								const mensString =
									form[key][mens] !== null ? form[key][mens].toString() : '';
								const array = mensString.split(',').map(a => {
									return parseInt(_.trim(a), 0);
								});
								return array.indexOf(f.value) !== -1;
							})
								.map(f => f.text)
								.toString();
						} else if (Object.keys(enums).indexOf(mens) !== -1) {
							form[key][mens] = enums[mens]
								.filter(f => {
									const mensString =
										form[key][mens] !== null ? form[key][mens].toString() : '';
									const array = mensString.split(',').map(a => {
										return parseInt(_.trim(a), 0);
									});
									return array.indexOf(f.value) !== -1;
								})
								.map(f => f.text)
								.toString();
						}
					});
				}
			});
			this.archiveData = form;
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-my-archive';

.@{inner-prefix} {
	height: 100%;
	overflow: hidden;
	&-number {
		box-shadow: 0px 1.5px 3px rgba(0, 0, 0, 0.16);
		color: #333333;
		font-size: 1rem;
		height: 1rem;
		line-height: 1rem;
		padding: 1rem;
		svg {
			float: right;
		}
	}
	&-body {
		height: calc(100% - calc(46px + 4rem));
		overflow: auto;
		padding: 0.5rem;

		.archive-container {
			padding: 0 0.5rem;
			.archive-bg {
				background: rgba(255, 249, 249, 1);
				padding: 0.5rem 1rem;
				.archive-text {
					font-size: 14px;
					padding: 0.5rem 0;
					line-height: 1.5rem;
					.archive-national {
						margin-left: 1.5rem;
					}
				}
				.situation {
					color: #ee8ca1;
					display: block;
				}
				.icon-botton {
					margin-left: 94%;
				}
			}
		}
	}
}
</style>
