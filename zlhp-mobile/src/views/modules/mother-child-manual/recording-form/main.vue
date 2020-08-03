<template>
	<div :class="classRoot" v-if="formData">
		<div :class="`${classRoot}-bar`" v-if="formData.FormTypes.FormTypeID === 3">
			<span class="cancle" @click="$router.back()">取消</span>
			<van-button round @click="submitForm" v-if="formData.FormItems.length"
				>保存</van-button
			>
		</div>
		<van-nav-bar
			v-else
			:title="formData.Title"
			left-arrow
			:right-text="formData.FormItems.length ? (isEdit ? '编辑' : '保存') : ''"
			@click-left="$router.back()"
			@click-right="submitForm"
		></van-nav-bar>

		<div :class="`${classRoot}-body`" v-if="formData.FormItems.length">
			<ValidationObserver ref="form">
				<div class="form_array">
					<div v-for="(formitems, index) in formData.FormItems" :key="index">
						<type0
							v-if="formitems.FormModel === 0"
							:data="formitems"
							:isEdit="isEdit"
						></type0>
						<type1
							v-else-if="formitems.FormModel === 1"
							:data="formitems"
							:isEdit="isEdit"
						></type1>
						<type2
							v-else-if="formitems.FormModel === 2"
							:data="formitems"
							:isEdit="isEdit"
						></type2>
						<type3
							v-else-if="formitems.FormModel === 3"
							:data="formitems"
							:isEdit="isEdit"
						></type3>
						<type4
							v-else-if="formitems.FormModel === 4"
							:data="formitems"
							:isEdit="isEdit"
						></type4>
						<type5
							v-else-if="formitems.FormModel === 5"
							:data="formitems"
							:isEdit="isEdit"
						></type5>
						<type6
							v-else-if="formitems.FormModel === 6"
							:data="formitems"
							:isEdit="isEdit"
						></type6>
						<type78
							v-else-if="formitems.FormModel === 7 || formitems.FormModel === 8"
							:data="formitems"
							:isEdit="isEdit"
						></type78>
						<type10
							v-else-if="formitems.FormModel === 10"
							:data="formitems"
							:isEdit="isEdit"
						></type10>
						<type12
							v-else-if="formitems.FormModel === 12"
							:data="formitems"
							:isEdit="isEdit"
						></type12>
					</div>
				</div>
			</ValidationObserver>
		</div>
		<hint v-else message="目前没有要填写的内容" />
	</div>
</template>
<script>
import Vue from 'vue';
import components from './components';
import * as FormsApi from '../../../../apis/FormsApi';
import * as FormDataApi from '../../../../apis/FormDataApi';

Vue.use(components);
// 自定义模板
export default {
	name: 'recording-form',
	data() {
		return {
			formData: null, // 表单类型
			fromVal: this.$route.query.FromVal, // 栏目值
			formJson: {}, // 表单json
			formDataData: null, // 表单填写的信息数据
			isEdit: false, // 是否是编辑
			formDataID: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},

	created() {
		this.getFormData();
	},
	methods: {
		/**
		 * 获取表单类型
		 */
		getFormData() {
			this.$toast.loading('加载中...');
			FormsApi.GetFormTypesByFromVal(this.fromVal)
				.then(res => {
					if (res.Code === 0) {
						this.formData = res.Body;
						// 获取表单数据
						FormDataApi.getFormData(this.formData.FormID).then(result => {
							if (result.Code === 0) {
								// 如果表单有填写记录，
								if (result.Body) {
									this.formDataData = JSON.parse(result.Body.JsonData);
									this.formDataID = result.Body.FormDataID;
									// 如果填写的表单记录是甜蜜时刻，则跳转到查看甜蜜时刻页面
									// if (this.$route.query.Sweet) {
									// 	this.$router.replace({
									// 		path: '/mother/recording-after',
									// 		query: {
									// 			form_id: this.formData.FormID
									// 		}
									// 	});
									// }
									// 如果填写的表单记录是表单，则将填写记录渲染到页面
									this.$refs.form.$children.forEach(element => {
										const key = element.data.FieldCode;
										Object.keys(this.formDataData).forEach(datakey => {
											if (key === datakey) {
												element.value = this.formDataData[datakey];
											}
										});
									});
									// this.isEdit = true;
								}
							} else {
								this.$toast.fail(result.Message);
							}
						});
					} else {
						this.$toast.fail(res.Message);
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 表单保存
		 */
		submitForm() {
			if (!this.isEdit) {
				this.$refs.form.validate().then(result => {
					console.log(this.$refs.form.$children);
					if (result) {
						this.$refs.form.$children.forEach(element => {
							const key = element.data.FieldCode;
							const { value } = element;

							if (key) this.formJson[key] = value;
						});

						const form = {
							FormID: this.formData.FormID,
							JsonData: JSON.stringify(this.formJson)
						};
						let api = null;
						// 编辑保存
						if (this.formDataID) {
							api = FormDataApi.putFormData(this.formDataID, form);
						} else {
							api = FormDataApi.postFormData(0, form);
						}
						// 添加保存
						this.$toast.loading(
							`${this.formDataID ? '修改中...' : '保存中...'}`
						);
						api
							.then(res => {
								if (res.Code === 0) {
									this.$toast.success({
										forbidClick: true,
										message: `${this.formDataID ? '修改成功' : '保存成功'}`,
										onClose: () => {
											this.getFormData();
										}
									});
								} else {
									this.$toast.fail(res.Message);
								}
							})
							.finally(this.$toast.clear);
					}
				});
			} else {
				// this.isEdit = !this.isEdit;
			}
		}
	}
};
</script>
<style lang="less">
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-recording-form';
.@{inner-prefix} {
	height: 100%;
	background: #f8f8f8;
	&-bar {
		padding: 16px 9px 16px 20px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background: #ffffff;
		.cancle {
			font-size: 15px;
			color: #bbbbbb;
		}
		.van-button {
			background: #f18bab;
			border: 1px solid #fc8a8a;
			color: #ffffff;
			height: 30px;
			width: 63px;
			line-height: 30px;
		}
	}
	&-body {
		height: calc(100% - 46px);
		overflow: scroll;
		.form_array {
			margin-bottom: 10px;
		}
	}
}
</style>
