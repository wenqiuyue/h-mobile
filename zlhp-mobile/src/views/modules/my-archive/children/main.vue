<template>
	<div :class="classRoot" v-if="childrenArchiveData">
		<van-nav-bar
			title="我的档案"
			left-arrow
			@click-left="$router.back()"
		></van-nav-bar>
		<div :class="`${classRoot}-number`">
			档案编号:{{ childrenArchiveData.ChildrenArchiveNo }}
			<!-- <svg-icon value="icon-Refresh-green" /> -->
		</div>
		<div :class="`${classRoot}-body`">
			<div class="archive-container">
				<svg-icon class="icon-left" value="icon-baby_Rainbow" :size="3" />
				<svg-icon class="icon-right" value="icon-baby_Rainbow" :size="3" />
				<span class="horn1"></span>
				<span class="horn2"></span>
				<span class="horn3"></span>
				<span class="horn4"></span>
				<div class="archive-container-title">
					<div class="circle"></div>
					<span>自我介绍</span>
					<div class="circle"></div>
				</div>
				<div class="archive-text" v-if="childrenArchiveData.Name">
					姓名: {{ childrenArchiveData.Name }}
				</div>
				<div class="archive-text" v-if="childrenArchiveData.Sex">
					性别: {{ childrenArchiveData.Sex }}
				</div>
				<div class="archive-text" v-if="childrenArchiveData.Race">
					民族: {{ childrenArchiveData.Race }}
				</div>
				<div class="archive-text" v-if="childrenArchiveData.BirthDate">
					出生日期:
					{{ new Date(childrenArchiveData.BirthDate).format('yyyy-MM-dd') }}
				</div>
				<div
					class="archive-text"
					v-if="
						childrenArchiveData.IdNumber && childrenArchiveData.ChildrenIdType
					"
				>
					{{ childrenArchiveData.ChildrenIdType }}:
					{{ childrenArchiveData.IdNumber }}
				</div>
				<div class="archive-text" v-if="childrenArchiveData.FirstFew">
					多胎序号: {{ childrenArchiveData.FirstFew }}
				</div>
				<div class="archive-text" v-if="childrenArchiveData.IsInflow">
					流入: {{ childrenArchiveData.IsInflow }}
				</div>
				<div class="archive-text" v-if="childrenArchiveData.IsFlow">
					流动人口: {{ childrenArchiveData.IsFlow }}
				</div>
				<div class="archive-text" v-if="childrenArchiveData.RegAddress">
					户籍地址: {{ childrenArchiveData.RegAddress }}
				</div>
				<div class="archive-text" v-if="childrenArchiveData.RegAddressInfo">
					详细户籍地址: {{ childrenArchiveData.RegAddressInfo }}
				</div>
				<div class="archive-text" v-if="childrenArchiveData.CurrAddress">
					现居地址: {{ childrenArchiveData.CurrAddress }}
				</div>
				<div class="archive-text" v-if="childrenArchiveData.CurrAddressInfo">
					详细现居地址: {{ childrenArchiveData.CurrAddressInfo }}
				</div>
				<div class="archive-container-title">
					<div class="circle"></div>
					<span>我的联系人</span>
					<div class="circle"></div>
				</div>
				<div v-if="childrenArchiveData.MotherName" class="contacts">
					<div class="archive-text" v-if="childrenArchiveData.MotherName">
						母亲: {{ childrenArchiveData.MotherName }}
					</div>
					<div class="archive-text" v-if="childrenArchiveData.MotherIdNumber">
						出生日期:
						{{ getBirthDateByIdCard(childrenArchiveData.MotherIdNumber) }}
					</div>
					<div
						class="archive-text"
						v-if="
							childrenArchiveData.MotherIdType ||
								childrenArchiveData.MotherIdNumber
						"
					>
						{{ childrenArchiveData.MotherIdType }}:
						{{ childrenArchiveData.MotherIdNumber }}
					</div>
					<div class="archive-text" v-if="childrenArchiveData.MotherPhone">
						联系电话: {{ childrenArchiveData.MotherPhone }}
					</div>
					<div class="archive-text" v-if="childrenArchiveData.MotherProfession">
						职业: {{ childrenArchiveData.MotherProfession }}
					</div>
				</div>
				<div v-if="childrenArchiveData.FatherName" class="contacts">
					<div class="archive-text" v-if="childrenArchiveData.FatherName">
						父亲: {{ childrenArchiveData.FatherName }}
					</div>
					<div class="archive-text" v-if="childrenArchiveData.FatherIdNumber">
						出生日期:
						{{ getBirthDateByIdCard(childrenArchiveData.FatherIdNumber) }}
					</div>
					<div
						class="archive-text"
						v-if="
							childrenArchiveData.FatherIdType ||
								childrenArchiveData.FatherIdNumber
						"
					>
						{{ childrenArchiveData.FatherIdType }}:
						{{ childrenArchiveData.FatherIdNumber }}
					</div>
					<div class="archive-text" v-if="childrenArchiveData.FatherPhone">
						联系电话: {{ childrenArchiveData.FatherPhone }}
					</div>
					<div class="archive-text" v-if="childrenArchiveData.FatherProfession">
						职业: {{ childrenArchiveData.FatherProfession }}
					</div>
				</div>
				<div v-if="childrenArchiveData.OtherGuardian" class="contacts">
					<div class="archive-text" v-if="childrenArchiveData.OtherGuardian">
						其他监护人: {{ childrenArchiveData.OtherGuardian }}
					</div>
					<div
						class="archive-text"
						v-if="childrenArchiveData.OtherGuardianPhone"
					>
						联系电话: {{ childrenArchiveData.OtherGuardianPhone }}
					</div>
				</div>
				<div class="archive-container-title special">
					<div class="circle"></div>
					<span>我的专案信息</span>
					<div class="circle"></div>
				</div>
				<div class="archive-text" v-if="childrenArchiveData.BirthWeek">
					分娩孕周: {{ childrenArchiveData.BirthWeek }}周
				</div>
				<div class="archive-text" v-if="childrenArchiveData.BirthDay">
					分娩孕天: {{ childrenArchiveData.BirthDay }}天
				</div>
				<div class="archive-text" v-if="childrenArchiveData.BirthAddress">
					分娩地点: {{ childrenArchiveData.BirthAddress }}
				</div>
				<div class="archive-text" v-if="childrenArchiveData.BirthBodyHeignt">
					出生身长: {{ childrenArchiveData.BirthBodyHeignt }}CM
				</div>
				<div class="archive-text" v-if="childrenArchiveData.BirthBodyWeight">
					出生体重: {{ childrenArchiveData.BirthBodyWeight }}KG
				</div>
				<div class="archive-text" v-if="childrenArchiveData.BirthSituation">
					出生情况: {{ childrenArchiveData.BirthSituation }}
				</div>
				<div class="archive-text">
					<span v-if="childrenArchiveData.FetalTimes"
						>第{{ childrenArchiveData.FetalTimes }}胎</span
					>
					<span v-if="childrenArchiveData.BirthTimes"
						>第{{ childrenArchiveData.BirthTimes }}产</span
					>
					<span v-if="childrenArchiveData.HearingScreening"
						>{{ childrenArchiveData.HearingScreening }}听力筛查</span
					>
					<span v-if="childrenArchiveData.NewbornApnea"
						>{{ childrenArchiveData.NewbornApnea }}新生儿窒息</span
					>
					<span v-if="childrenArchiveData.NewbornMalformation"
						>{{
							childrenArchiveData.NewbornMalformation === '否'
								? '非'
								: childrenArchiveData.NewbornMalformation
						}}新生儿畸形</span
					>
				</div>
				<svg-icon
					class="icon-botton"
					value="icon-babyDecorate_Footprint"
					:size="2"
				/>
			</div>
		</div>
	</div>
</template>
<script>
import _ from 'lodash';
import { getBirthDateByIdCard } from '../../../../commons';
import * as EnumApi from '../../../../apis/EnumApi';
import * as CodeApi from '../../../../apis/CodeApi';
import * as ChildrenArchiveApi from '../../../../apis/ChildrenArchivesApi';

export default {
	name: 'my-archive',
	data() {
		return {
			childrenArchiveData: null // 档案详情
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_CHILDREN}-${this.$options.name}`;
		}
	},
	created() {
		const eid = this.$route.query.edit_id;
		this.getChildrenArchiveData(eid);
	},
	methods: {
		getBirthDateByIdCard,
		// 获取用户的档案
		getChildrenArchiveData(eid) {
			const methods = [
				EnumApi.GetList(
					[
						'IdType',
						'Profession',
						'RelationType',
						'ChildrenIdType',
						'BirthSituation',
						'HearingScreening',
						'NewbornApnea',
						'FirstFew',
						'YesOrNo'
					].map(m => `${m}Enum`)
				),
				CodeApi.GetRace(),
				ChildrenArchiveApi.Get(eid)
			];
			Promise.all(methods).then(res => {
				if (res[0].Code === 0 && res[2].Code === 0) {
					const enums = res[0].Body;
					enums.Sex = [
						{ text: '男', value: 1 },
						{ text: '女', value: 2 }
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
		/**
		 * 将档案的选择项的数据进行处理
		 */
		parseForm(enums, form) {
			Object.keys(form).forEach(key => {
				if (
					key === 'IsInflow' ||
					key === 'IsFlow' ||
					key === 'NewbornMalformation'
				) {
					this.formFilter(form, enums, key, 'YesOrNo');
				} else if (key === 'MotherIdType' || key === 'FatherIdType') {
					this.formFilter(form, enums, key, 'IdType');
				} else if (key === 'MotherProfession' || key === 'FatherProfession') {
					this.formFilter(form, enums, key, 'Profession');
				} else if (Object.keys(enums).indexOf(key) !== -1) {
					this.formFilter(form, enums, key, key);
				}
			});
			this.childrenArchiveData = form;
		},
		formFilter(form, enums, key, ekey) {
			form[key] = enums[ekey]
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
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-children}-my-archive';
.@{inner-prefix} {
	height: 94%;
	padding-bottom: 30px;
	overflow: hidden;
	&-number {
		border: 1px solid #ffd9e2;
		border-left: none;
		border-right: none;
		color: #f39fc7;
		font-size: 1rem;
		height: 1rem;
		line-height: 1rem;
		padding: 1rem;
		box-shadow: 0px 1.5px 3px rgba(0, 0, 0, 0.16);
		svg {
			float: right;
		}
	}
	&-body {
		height: calc(100% - calc(46px + 4rem));
		overflow: auto;
		padding: 36px 10px;
		.archive-container {
			position: relative;
			border: 5px solid rgba(245, 215, 236, 0.26);
			background: #fffdfd;
			.archive-container-title {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				color: #c1b1ea;
				font-size: 16px;
				padding: 30px 0 20px 0;
				.circle {
					height: 4px;
					width: 4px;
					border-radius: 50%;
					border: 2px solid #c1b1ea;
					margin-left: 8px;
				}
				span {
					margin-left: 8px;
				}
			}
			.special {
				padding: 0 0 20px 0;
			}
			.contacts {
				padding-bottom: 30px;
			}
			.archive-text {
				font-size: 13px;
				color: #333333;
				padding: 10px 10px 10px 33px;
				span {
					margin-right: 5px;
				}
			}
			.icon-left {
				position: absolute;
				top: -34px;
			}
			.icon-right {
				position: absolute;
				top: -34px;
				right: 0;
			}
			.icon-botton {
				margin-left: 87%;
				margin-bottom: 10px;
			}
			.horn1 {
				position: absolute;
				left: -5px;
				top: -5px;
				padding: 22px;
				border-style: solid;
				border-color: #e4c5d8;
				border-width: 5px 0 0 5px;
			}
			.horn2 {
				position: absolute;
				right: -5px;
				top: -5px;
				padding: 22px;
				border-style: solid;
				border-color: #e4c5d8;
				border-width: 5px 5px 0 0;
			}
			.horn3 {
				position: absolute;
				right: -5px;
				bottom: -5px;
				padding: 22px;
				border-style: solid;
				border-color: #e4c5d8;
				border-width: 0 5px 5px 0;
			}
			.horn4 {
				position: absolute;
				left: -5px;
				bottom: -5px;
				padding: 22px;
				border-style: solid;
				border-color: #e4c5d8;
				border-width: 0 0 5px 5px;
			}
		}
	}
}
</style>
