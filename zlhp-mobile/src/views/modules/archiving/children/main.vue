<template>
	<div :class="classRoot">
		<van-nav-bar
			:title="title"
			left-arrow
			@click-left="$router.back()"
			@click-right="showMoreAction = true"
		>
			<van-icon name="weapp-nav" slot="right" />
		</van-nav-bar>
		<van-action-sheet
			v-model="showMoreAction"
			:actions="[
				{ name: '选择模板', action: 'template' },
				{ name: '重置表单', action: 'reset' }
			]"
			get-container="body"
			cancel-text="取消"
			@select="handleMoreActionSelect"
			@cancel="showMoreAction = false"
		/>
		<van-row :class="`${classRoot}-archive-no`" v-if="IsCurrent">
			<van-col span="18">
				<b>档案编号：</b>
				<van-tag plain size="medium" :class="ArchiveNoValid ? 'valid' : ''">{{
					ArchiveNo
				}}</van-tag>
				<span v-show="!ArchiveNoValid">（已过期）</span>
			</van-col>
			<van-col span="6" class="right">
				<van-button
					size="small"
					v-show="!ArchiveNoValid"
					@click="handleRefreshArchiveNo"
					>刷新</van-button
				>
			</van-col>
		</van-row>
		<van-steps :active="step">
			<van-step v-for="(item, index) in stepList" :key="index">{{
				item
			}}</van-step>
		</van-steps>
		<div
			ref="body"
			:class="[`${classRoot}-body`, IsCurrent ? 'exist-archive-no' : '']"
		>
			<!-- 双亲及监护人 -->
			<ValidationObserver ref="form-0" v-show="step === 0">
				<div :class="`${classRoot}-notice`">
					<svg-icon value="icon-babyNotice_red" />
					<span
						>母亲、父亲或者其他监护人必须填写一人，同时填写可以进行多人绑定！</span
					>
				</div>
				<van-divider content-position="left">
					<svg-icon value="icon-babyFatherHead" :size="1.7" />母亲基本信息
				</van-divider>
				<ValidationProvider
					:rules="{ required: ContactRelation === 1, name: true }"
					name="母亲姓名"
					v-slot="{ errors }"
				>
					<van-field
						label="姓名"
						v-model="form.MotherName"
						:required="ContactRelation === 1"
						placeholder="请输入姓名"
						:error-message="errors.join('')"
					/>
				</ValidationProvider>
				<ValidationProvider
					:rules="{ required: ContactRelation === 1 }"
					name="母亲证件类型"
					v-slot="{ errors }"
				>
					<combobox
						label="证件类型"
						v-model="form.MotherIdType"
						:required="ContactRelation === 1"
						:options="options.IdType"
						:error-message="errors.join('')"
						:disabled="MatherDisabled"
					/>
				</ValidationProvider>
				<ValidationProvider
					:rules="{
						required: ContactRelation === 1,
						idCard: form.MotherIdType === 1,
						officerCard: form.MotherIdType === 2,
						passPortCard: form.MotherIdType === 4
					}"
					name="母亲证件号"
					v-slot="{ errors }"
				>
					<van-field
						label="证件号"
						v-model="form.MotherIdNumber"
						:required="ContactRelation === 1"
						:disabled="MatherDisabled"
						placeholder="请输入证件号"
						:error-message="errors.join('')"
					/>
				</ValidationProvider>
				<ValidationProvider name="母亲出生日期">
					<van-field
						label="出生日期"
						:required="ContactRelation === 1"
						:value="getBirthDateByIdCard(form.MotherIdNumber)"
						placeholder="请输入出生日期"
						disabled
					/>
				</ValidationProvider>
				<ValidationProvider
					:rules="{
						required: ContactRelation === 1,
						phone: true
					}"
					name="母亲联系电话"
					v-slot="{ errors }"
				>
					<van-field
						label="联系电话"
						:required="ContactRelation === 1"
						v-model="form.MotherPhone"
						:disabled="MatherDisabled"
						placeholder="请输入联系电话"
						:error-message="errors.join('')"
					/>
				</ValidationProvider>
				<ValidationProvider>
					<combobox
						label="职业"
						v-model="form.MotherProfession"
						:options="options.Profession"
					/>
				</ValidationProvider>

				<van-divider content-position="left">
					<svg-icon value="icon-babyFatherHead-" :size="1.7" />父亲基本信息
				</van-divider>
				<ValidationProvider
					:rules="{ required: ContactRelation === 2, name: true }"
					name="父亲姓名"
					v-slot="{ errors }"
				>
					<van-field
						label="姓名"
						v-model="form.FatherName"
						:required="ContactRelation === 2"
						placeholder="请输入姓名"
						:error-message="errors.join('')"
					/>
				</ValidationProvider>
				<ValidationProvider
					:rules="{ required: ContactRelation === 2 }"
					name="父亲证件类型"
					v-slot="{ errors }"
				>
					<combobox
						label="证件类型"
						v-model="form.FatherIdType"
						:required="ContactRelation === 2"
						:options="options.IdType"
						:error-message="errors.join('')"
						:disabled="FatherDisabled"
					/>
				</ValidationProvider>
				<ValidationProvider
					:rules="{
						required: ContactRelation === 2,
						idCard: form.FatherIdType === 1,
						officerCard: form.FatherIdType === 2,
						passPortCard: form.FatherIdType === 4
					}"
					name="父亲证件号"
					v-slot="{ errors }"
				>
					<van-field
						label="证件号"
						v-model="form.FatherIdNumber"
						:required="ContactRelation === 2"
						:disabled="FatherDisabled"
						placeholder="请输入证件号"
						:error-message="errors.join('')"
					/>
				</ValidationProvider>
				<ValidationProvider
					:rules="{
						required: ContactRelation === 2,
						phone: true
					}"
					name="父亲联系电话"
					v-slot="{ errors }"
				>
					<van-field
						label="联系电话"
						:required="ContactRelation === 2"
						v-model="form.FatherPhone"
						:disabled="FatherDisabled"
						placeholder="请输入联系电话"
						:error-message="errors.join('')"
					/>
				</ValidationProvider>
				<ValidationProvider name="父亲出生日期">
					<van-field
						label="出生日期"
						:required="ContactRelation === 2"
						:value="getBirthDateByIdCard(form.FatherIdNumber)"
						placeholder="请输入出生日期"
						disabled
					/>
				</ValidationProvider>
				<ValidationProvider>
					<combobox
						label="职业"
						v-model="form.FatherProfession"
						:options="options.Profession"
					/>
				</ValidationProvider>

				<van-divider content-position="left">
					<svg-icon value="icon-babyOtherHead" :size="1.7" />其他监护人信息
				</van-divider>
				<ValidationProvider
					:rules="{ required: ContactRelation > 2, name: true }"
					name="其他监护人姓名"
					v-slot="{ errors }"
				>
					<van-field
						label="姓名"
						v-model="form.OtherGuardian"
						:required="ContactRelation > 2"
						placeholder="请输入姓名"
						:error-message="errors.join('')"
					/>
				</ValidationProvider>
				<ValidationProvider
					:rules="{
						required: ContactRelation > 2,
						phone: true
					}"
					name="其他监护人联系电话"
					v-slot="{ errors }"
				>
					<van-field
						label="联系电话"
						:required="ContactRelation > 2"
						v-model="form.OtherGuardianPhone"
						:disabled="OtherDisabled"
						placeholder="请输入联系电话"
						:error-message="errors.join('')"
					/>
				</ValidationProvider>
			</ValidationObserver>
			<!-- 专案信息 -->
			<ValidationObserver ref="form-1" v-show="step === 1">
				<ValidationProvider
					rules="required|name"
					name="姓名"
					v-slot="{ errors }"
				>
					<van-field
						label="姓名"
						v-model="form.Name"
						required
						placeholder="请输入姓名"
						:error-message="errors.join('')"
					/>
				</ValidationProvider>
				<ValidationProvider rules="required" name="性别" v-slot="{ errors }">
					<combobox
						label="性别"
						v-model="form.Sex"
						required
						un-null
						:options="[
							{ text: '男', value: 1 },
							{ text: '女', value: 2 }
						]"
						:error-message="errors.join('')"
					/>
				</ValidationProvider>
				<ValidationProvider>
					<combobox
						label="民族"
						un-null
						v-model="form.Race"
						:options="
							options.Race
								? options.Race.map(m => {
										return {
											text: m['CodeName'],
											value: parseInt(m['CodeVal'])
										};
								  })
								: null
						"
					/>
				</ValidationProvider>
				<ValidationProvider>
					<combobox
						label="证件类型"
						v-model="form.ChildrenIdType"
						:options="
							options.ChildrenIdType
								? options.ChildrenIdType.filter(
										m =>
											m['value'] === 1 || m['value'] === 6 || m['value'] === 7
								  )
								: null
						"
					/>
				</ValidationProvider>
				<ValidationProvider
					:rules="{
						idCard: form.ChildrenIdType === 1
					}"
					name="证件号"
					v-slot="{ errors }"
				>
					<van-field
						v-model="form.IdNumber"
						label="证件号"
						placeholder="请输入证件号"
						:error-message="errors.join('')"
					/>
				</ValidationProvider>
				<ValidationProvider
					rules="required"
					name="出生日期"
					v-slot="{ errors }"
				>
					<date
						label="出生日期"
						required
						:value="form.BirthDate"
						:max-date="form.BirthDateMax"
						:rulesErrors="errors"
						@input="inputBirthDate"
					/>
				</ValidationProvider>
				<ValidationProvider>
					<combobox
						label="多胎序号"
						un-null
						v-model="form.FirstFew"
						:options="options.FirstFew"
					/>
				</ValidationProvider>
				<ValidationProvider>
					<combobox
						label="流入"
						un-null
						v-model="form.IsInflow"
						:options="options.YesOrNo"
					/>
				</ValidationProvider>
				<ValidationProvider>
					<combobox
						label="流动人口"
						un-null
						v-model="form.IsFlow"
						:options="options.YesOrNo"
					/>
				</ValidationProvider>
				<ValidationProvider
					rules="required"
					name="户籍地址"
					v-slot="{ errors }"
				>
					<van-field
						v-model="form.RegAddress"
						required
						readonly
						clickable
						label="户籍地址"
						placeholder="请输入户籍地址"
						:error-message="errors.join('')"
						@click="$refs['reg'].handleShow()"
					/>
				</ValidationProvider>
				<cascade
					ref="reg"
					v-model="form"
					:keys="regAreaKeys"
					full-field="RegAddress"
					@done="handleRegAreaDone"
				/>
				<ValidationProvider name="详细地址" v-slot="{ errors }">
					<van-field
						v-model="form.RegAddressInfo"
						label="详细地址"
						placeholder="请输入详细地址"
						:error-message="errors.join('')"
					/>
				</ValidationProvider>
				<ValidationProvider
					rules="required"
					name="现居地址"
					v-slot="{ errors }"
				>
					<van-field
						v-model="form.CurrAddress"
						required
						readonly
						clickable
						label="现居地址"
						placeholder="请输入现居地址"
						:error-message="errors.join('')"
						@click="$refs['curr'].handleShow()"
					/>
				</ValidationProvider>
				<cascade
					ref="curr"
					v-model="form"
					:keys="curAreaKeys"
					full-field="CurrAddress"
				/>
				<ValidationProvider name="详细地址" v-slot="{ errors }">
					<van-field
						v-model="form.CurrAddressInfo"
						label="详细地址"
						placeholder="请输入详细地址"
						:error-message="errors.join('')"
					/>
				</ValidationProvider>
			</ValidationObserver>
			<!-- 出生情况 -->
			<ValidationObserver ref="form-2" v-show="step === 2">
				<ValidationProvider rules="integer" name="分娩孕周" v-slot="{ errors }">
					<van-field
						label="分娩孕周"
						v-model="form.BirthWeek"
						placeholder="请输入分娩孕周"
						:error-message="errors.join('')"
					/>
				</ValidationProvider>
				<ValidationProvider rules="integer" name="分娩孕天" v-slot="{ errors }">
					<van-field
						label="分娩孕天"
						v-model="form.BirthDay"
						placeholder="请输入分娩孕天"
						:error-message="errors.join('')"
					/>
				</ValidationProvider>
				<ValidationProvider rules="max:50" name="分娩地点" v-slot="{ errors }">
					<van-field
						label="分娩地点"
						v-model="form.BirthAddress"
						placeholder="请输入分娩地点"
						:error-message="errors.join('')"
					/>
				</ValidationProvider>
				<ValidationProvider
					rules="between:0,100"
					name="出生身长"
					v-slot="{ errors }"
				>
					<van-field
						label="出生身长"
						v-model="form.BirthBodyHeignt"
						placeholder="请输入出生身长"
						:error-message="errors.join('')"
					>
						<span slot="right-icon">CM</span>
					</van-field>
				</ValidationProvider>
				<ValidationProvider
					rules="between:0,100"
					name="出生体重"
					v-slot="{ errors }"
				>
					<van-field
						label="出生体重"
						v-model="form.BirthBodyWeight"
						placeholder="请输入出生体重"
						:error-message="errors.join('')"
					>
						<span slot="right-icon">KG</span>
					</van-field>
				</ValidationProvider>
				<ValidationProvider rules="integer" name="第几胎" v-slot="{ errors }">
					<van-field
						label="第几胎"
						v-model="form.FetalTimes"
						placeholder="请输入第几胎"
						:error-message="errors.join('')"
					/>
				</ValidationProvider>
				<ValidationProvider rules="integer" name="第几产" v-slot="{ errors }">
					<van-field
						label="第几产"
						v-model="form.BirthTimes"
						placeholder="请输入第几产"
						:error-message="errors.join('')"
					/>
				</ValidationProvider>
				<ValidationProvider>
					<combobox
						label="听力筛查"
						v-model="form.HearingScreening"
						:options="options.HearingScreening"
					/>
				</ValidationProvider>
				<ValidationProvider>
					<combobox
						label="新生儿窒息"
						v-model="form.NewbornApnea"
						:options="options.NewbornApnea"
					/>
				</ValidationProvider>
				<ValidationProvider>
					<combobox
						label="新生儿畸形"
						v-model="form.NewbornMalformation"
						:options="options.YesOrNo"
					/>
				</ValidationProvider>
				<van-divider content-position="left">出生情况</van-divider>
				<ValidationProvider>
					<van-checkbox-group v-model="form.BirthSituation">
						<van-cell-group>
							<van-cell
								v-for="(item, index) in options.BirthSituation"
								clickable
								:key="index"
								:title="item['text']"
								@click="$refs['BirthSituation'][index].toggle()"
							>
								<van-checkbox
									shape="square"
									:name="item['value']"
									ref="BirthSituation"
									slot="right-icon"
									checked-color="#ffc9dd"
								/>
							</van-cell>
						</van-cell-group>
					</van-checkbox-group>
				</ValidationProvider>
			</ValidationObserver>
			<van-cell :class="`${classRoot}-body-footer`">
				<van-button slot="title" @click="handlePrev">上一步</van-button>
				<van-button @click="handleNext" type="info">{{
					step === stepList.length - 1 ? '提交' : '下一步'
				}}</van-button>
			</van-cell>
		</div>
	</div>
</template>
<script>
import _ from 'lodash';
import { form, regAreaKeys, curAreaKeys } from './data';
import * as EnumApi from '../../../../apis/EnumApi';
import * as CodeApi from '../../../../apis/CodeApi';
import { getBirthDateByIdCard } from '../../../../commons';
import types from '../../../../commons/types';
import {
	getSession,
	setSession,
	removeSession
} from '../../../../commons/session';
import * as ChildrenArchiveApi from '../../../../apis/ChildrenArchivesApi';
import { getDistance, setLocation } from '../../../../commons/weixin';
import { has } from '../../../../tools';

export default {
	name: 'archiving',
	data() {
		return {
			isBind: false, // 是否为绑定界面跳转来
			showMoreAction: false, // 是否显示更多操作（右上角按钮）
			uuidInterval: null, // 定位用定时器
			distance: null, // 微信定位结果
			step: 0,
			stepList: ['双亲及监护人信息', '专案信息', '出生情况'],
			ContactRelation: 1, // 联系人关系类型 非编辑时使用
			form: _.cloneDeep(form),
			regAreaKeys,
			curAreaKeys,
			options: {
				Race: []
			}
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_CHILDREN}-${this.$options.name}`;
		},
		// 标题
		title() {
			if (this.id) {
				return '编辑档案';
			}
			if (this.isBind) {
				return '完善信息';
			}
			return '儿童建档';
		},
		// 编辑ID
		editId() {
			return has.call(this.$route.query, 'edit_id')
				? this.$route.query.edit_id
				: 0;
		},
		// 是否当前档案
		IsCurrent() {
			return has.call(this.form, 'IsCurrent') && this.form.IsCurrent === 1;
		},
		// 档案编号
		ArchiveNo() {
			return this.form.ChildrenArchiveNo;
		},
		/**
		 * 档案编号有效 true 有效， false 无效
		 * @return {boolean}
		 */
		ArchiveNoValid() {
			if (has.call(this.form, 'UpdateTime')) {
				const date = new Date(this.form.UpdateTime);
				const expire = new Date(new Date().setDate(new Date().getDate() - 7));
				return date >= expire;
			}
			return false;
		},
		// 母亲表单是否禁用
		MatherDisabled() {
			return this.editId === 0 && this.ContactRelation === 1;
		},
		// 父亲表单是否禁用
		FatherDisabled() {
			return this.editId === 0 && this.ContactRelation === 2;
		},
		// 其他联系人表单是否禁用
		OtherDisabled() {
			return (
				this.editId === 0 &&
				this.ContactRelation !== 1 &&
				this.ContactRelation !== 2
			);
		}
	},
	created() {
		const disposeDistance = () => {
			getDistance().then(distance => {
				this.distance = distance;
			});
		};
		disposeDistance();
		this.uuidInterval = setInterval(disposeDistance, 10 * 1000);
		this.loadData();
	},
	mounted() {
		this.disposeQuery();
	},
	beforeDestroy() {
		clearInterval(this.uuidInterval);
		this.uuidInterval = null;
	},
	methods: {
		getBirthDateByIdCard,
		/**
		 * 处理请求参数
		 */
		disposeQuery() {
			if (has.call(this.$route.query, types.FROM_BINDING)) {
				const fromData = JSON.parse(getSession(types.FROM_BINDING));
				this.isBind = fromData.is_bind;
				this.form.Name = fromData.form.ChildrenName;
				this.form.ChildrenIdType = fromData.form.ChildrenIdType;
				this.form.IdNumber = fromData.form.ChildrenIdNumber;
				this.ContactRelation = fromData.form.ContactRelation;
				if (this.ContactRelation === 1) {
					this.form.MotherIdType = fromData.form.ContactIdType;
					this.form.MotherIdNumber = fromData.form.ContactIdNumber;
					this.form.MotherPhone = fromData.form.Phone;
				} else if (this.ContactRelation === 2) {
					this.form.FatherIdType = fromData.form.ContactIdType;
					this.form.FatherIdNumber = fromData.form.ContactIdNumber;
					this.form.FatherPhone = fromData.form.Phone;
				} else {
					this.form.OtherGuardianPhone = fromData.form.Phone;
				}
			}
		},
		/**
		 * 出生日期选择
		 */
		inputBirthDate(val) {
			this.form.BirthDate = val;
		},
		/**
		 * 提交表单
		 */
		submit() {
			this.$toast.loading('正在保存...');
			setLocation(this.distance).finally(() => {
				ChildrenArchiveApi.insertOrUpdate(
					this.isBind,
					this.parseForm(this.form, true)
				)
					.then(response => {
						removeSession(types.FROM_BINDING);

						if (this.editId !== 0) {
							this.$toast.success({
								forbidClick: true,
								duration: 3000,
								message: '修改成功!',
								onClose: () => {
									this.$router.back();
								}
							});
						} else {
							setSession(
								types.FROM_ARCHIVING,
								JSON.stringify({
									code: response.Code,
									message: response.Message,
									is_bind: this.isBind
								})
							);
							this.$router.push({
								path: '/children/binding',
								query: this.isBind
									? { from_archiving: null }
									: { from_archiving: null, archiving: null }
							});
						}
					})
					.finally(this.$toast.clear);
			});
		},
		/**
		 * 更多按钮选中事件
		 */
		handleMoreActionSelect(item) {
			if (item.action === 'template') {
				this.$toast.fail('TODO：选择模板');
			}
			if (item.action === 'reset') {
				this.form = _.cloneDeep(form);
				this.disposeQuery();
				this.loadData();
			}
			this.showMoreAction = false;
		},
		/**
		 * 刷新编号
		 */
		handleRefreshArchiveNo() {
			this.$toast.loading('正在刷新...');
			ChildrenArchiveApi.GetAndRefreshNo(this.editId)
				.then(response => {
					if (response.Code === 0) {
						this.$set(
							this.form,
							'ChildrenArchiveNo',
							response.Body.ChildrenArchiveNo
						);
						this.$set(this.form, 'UpdateTime', response.Body.UpdateTime);
						this.$toast.success('编号刷新成功！');
					} else {
						this.$toast.fail('编号刷新失败！');
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 多选开关
		 * @param obj 对象
		 * @param value 项目值
		 * @param index 索引
		 * @param ref 多选框ref
		 * @param reValue 重选值
		 * @param reValueIndex 重选值索引
		 */

		handleCheckboxToggle(
			obj,
			value,
			index,
			ref,
			reValue = 0,
			reValueIndex = 0
		) {
			this.$refs[ref][index].toggle();
			if (value === reValue) {
				if (obj.indexOf(value) === -1) {
					this.$refs[`${ref}Group`].toggleAll(false);
				}
			} else {
				this.$refs[ref][reValueIndex].toggle(false);
			}
			this.$refs[ref][index].toggle();
		},
		/**
		 * 定位到
		 * @param distance
		 */
		scrollTop(distance) {
			this.$refs.body.scroll({
				top: distance,
				behavior: 'smooth'
			});
		},
		/**
		 * 上一步
		 */
		handlePrev() {
			if (this.step === 0) {
				this.$router.back();
			} else {
				this.step -= 1;
				this.scrollTop(0);
			}
		},
		/**
		 * 下一步
		 */
		handleNext() {
			const currentForm = this.$refs[`form-${this.step}`];
			currentForm.validate().then(result => {
				if (result) {
					if (this.step === this.stepList.length - 1) {
						this.submit();
					} else {
						this.step += 1;
						this.scrollTop(0);
					}
				} else {
					this.handleAlignmentError(currentForm);
				}
			});
		},
		/**
		 * 定位错误
		 * @param formEl 当前表单
		 */
		handleAlignmentError(formEl) {
			const list = formEl.$el.getElementsByClassName(
				'van-field__error-message'
			);
			let errorEl = null;
			for (let i = 0; i < list.length; i += 1) {
				if (list[i].textContent) {
					errorEl = list[i];
					break;
				}
			}
			if (errorEl) {
				const distance = errorEl.parentNode.parentNode.parentNode.offsetTop;
				const pNode = formEl.$el.parentNode;
				this.scrollTop(distance - pNode.offsetTop);
			}
		},
		/**
		 * 户籍地址确认回调
		 */
		handleRegAreaDone(data) {
			if (!this.form.Province) {
				for (let i = 0; i < data.values.length; i += 1) {
					if (!data.values[i]) {
						break;
					}
					this.form[this.curAreaKeys[i]] = data.values[i];
				}
				this.form.CurrAddress = data.fullText;
			}
		},
		/**
		 * 加载数据
		 */
		loadData() {
			this.$toast.loading('加载中...');

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
				CodeApi.GetRace()
			];
			// 添加查询档案方法
			if (this.editId) {
				methods.push(ChildrenArchiveApi.Get(this.editId));
			}
			// 基础数据加载
			Promise.all(methods)
				.then(results => {
					results.forEach((item, index) => {
						if (index === 0 && item.Code === 0) {
							Object.keys(item.Body).forEach(key => {
								this.$set(this.options, key, item.Body[key]);
							});
						}
						if (index === 1) {
							this.$set(this.options, 'Race', item);
						}
						if (index === 2 && item.Code === 0) {
							this.form = this.parseForm(item.Body);
						}
					});
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 解析对象
		 * @param formObj 表单对象
		 * @param reverse 反转（数组转字符串）
		 */
		parseForm(formObj, reverse) {
			if (this.editId === 0) {
				this.$delete(formObj, 'ChildrenArchiveID');
			}
			// 需要在Array/String之间转换的字段
			const convertArrayField = ['BirthSituation'];
			// 需要转换为Date的字段
			const convertDateField = ['BirthDate'];

			const dispose = obj => {
				Object.keys(obj).forEach(key => {
					if (convertArrayField.indexOf(key) !== -1) {
						if (reverse) {
							obj[key] = obj[key].toString();
						} else if (_.isEmpty(obj[key])) {
							obj[key] = [];
						} else {
							obj[key] = obj[key].split(',').map(m => parseInt(m, 0));
						}
					}
					if (convertDateField.indexOf(key) !== -1) {
						if (_.isEmpty(obj[key])) {
							obj[key] = null;
						} else if (reverse) {
							obj[key] = new Date(obj[key]).toLocaleDateString();
						} else {
							obj[key] = new Date(new Date(obj[key]).toJSON());
						}
					}
					if (obj[key] instanceof Object) {
						dispose(obj[key]);
					}
				});
			};
			// const result = _.cloneDeep(formObj);
			const result = JSON.parse(JSON.stringify(formObj));
			dispose(result);
			return result;
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';
@inner-prefix: ~'@{prefix-children}-archiving';
.@{inner-prefix} {
	height: 100%;
	background-color: @background-color-container;
	.van-steps {
		.van-step__title {
			font-size: 14px;
		}
		.van-step__icon {
			font-size: 14px;
		}
	}
	&-notice {
		padding: 5px 15px;
		font-size: 12px;
		color: rgb(255, 18, 0);
		display: flex;
		align-items: flex-start;
		span {
			margin-left: 8px;
		}
	}
	&-archive-no {
		padding: 0 15px;
		line-height: 35px;
		background-color: white;
		border-bottom: 1px dashed #d2d2d2;
		.right {
			text-align: right;
		}
		.van-tag {
			font-size: 1.1rem;
			&.valid {
				color: rgba(255, 64, 129, 0.75);
			}
		}
		span {
			color: rgba(255, 64, 129, 0.75);
		}
	}
	&-body {
		background-color: white;
		height: calc(100% - 107px);
		overflow-y: auto;

		&.exist-archive-no {
			height: calc(100% - 143px);
		}

		> span {
			> span {
				> .van-cell {
					border-bottom: 1px solid #f2f2f2;
				}
			}
		}
		&-footer {
			.van-cell__title,
			.van-cell__value {
				text-align: center;
				overflow: unset;

				button {
					width: 83%;
					height: 40px;
					border: unset;
					font-size: 16px;
					box-shadow: @box-shadow-children;
					border-radius: 5px;
				}
			}
			.van-cell__title {
				button {
					background-color: @back-button-color;
					color: #666666;
				}
			}
			.van-cell__value {
				button {
					color: white;
					background-color: @next-button-color-children;
				}
			}
		}
	}

	.van-divider {
		font-size: 16px;
		color: #333333;
		&:before {
			max-width: 0;
		}

		svg {
			margin-right: 5px;
		}
	}
}
</style>
