<template>
	<div :class="classRoot">
		<van-nav-bar
			:title="teletextStatus === 'check' ? '病情描述' : '填写信息'"
			left-arrow
			@click-left="$router.back()"
		>
		</van-nav-bar>
		<div :class="`${classRoot}-body`">
			<!-- <van-panel>
				<template #header>
					<div class="interrogation-person-info">
						<span>问诊人信息</span>
						<span>{{ username }}</span>
					</div>
				</template>
			</van-panel> -->
			<van-panel class="description-illness">
				<template #header>
					<div class="title">
						病情描述
					</div>
					<div class="text">
						<van-field
							v-model="descriptionIllness"
							rows="4"
							autosize
							type="textarea"
							:readonly="teletextStatus === 'check' ? true : false"
							placeholder="为了帮助医生更好的为您诊断，请详细描述您的病情和症状，患病时长，用药和就医情况。（不多于300字）"
						/>
					</div>
				</template>
			</van-panel>
			<van-panel class="description-illness">
				<template #header>
					<div class="title">
						病情照片
					</div>
					<div class="tips" v-if="teletextStatus !== 'check'">
						请上传病情照片或者纸质检查报告，照片仅自己和医生可见。
					</div>
					<div class="pic">
						<van-uploader
							v-if="teletextStatus !== 'check'"
							multiple
							preview-size="70px"
							v-model="fileList"
							:after-read="uploadImages"
							:max-count="4"
						/>
						<van-image
							v-else
							v-for="(img, index) in fileList"
							:key="index"
							width="80px"
							height="80px"
							fit="cover"
							:src="img"
							@click="browsePic(index)"
						/>
						<label v-if="fileList.length === 0">{{
							teletextStatus === 'check' ? '没有上传病情照片' : '添加图片'
						}}</label>
					</div>
				</template>
			</van-panel>
			<div class="reminder" v-if="teletextStatus !== 'check'">
				<span>温馨提示</span>
				<span
					>1. 未支付的问诊订单需在30分钟内完成支付，逾期订单自动取消。<br />
					2.医生48小时内无回复，费用自动按原路退回。<br />
					3.提交问题后，医生首条回复则开始问诊倒计时，问诊结束或问诊倒计时结束，则此次问诊结束，请及时咨询相关健康问题。</span
				>
			</div>
			<van-button
				class="doctorinfo-button"
				@click="handelRelease"
				v-if="teletextStatus !== 'check'"
				>确定</van-button
			>
		</div>
	</div>
</template>
<script>
import { ImagePreview } from 'vant';
import * as InquiryRecordApi from '../../../apis/InquiryRecordApi';
import * as UploadApi from '../../../apis/UploadApi';

export default {
	name: 'interrogation-teletext',
	data() {
		return {
			descriptionIllness: null, // 病情描述
			fileList: [], // 上传的病情照片
			teletextParam: {
				// 图文问诊参数
				Content: null,
				Images: null
			},
			uploadImage: [], // 上传的图片
			sourceId: this.$route.query.source_id,
			teletextStatus: this.$route.query.teletext_status,
			username: null // 问诊人姓名
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		if (this.$route.query.inquiry_record_id) {
			this.getInquiryRecordData();
		}
	},
	methods: {
		/**
		 * 获取图文问诊内容
		 */
		getInquiryRecordData() {
			this.$toast.loading('加载中');
			InquiryRecordApi.inquiryRecordInfo(this.$route.query.inquiry_record_id)
				.then(res => {
					if (res.Code === 0) {
						if (this.teletextStatus === 'check') {
							if (res.Body.Images) {
								this.fileList = res.Body.Images.split('|').map(s => {
									return s;
								});
							}
							this.descriptionIllness = res.Body.Content;
						}
						this.username = res.Body.DUser.UserName;
					} else {
						this.$toast.fail(res.Message);
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 浏览图片
		 */
		browsePic(index) {
			ImagePreview({
				images: this.fileList,
				startPosition: index,
				closeable: true
			});
		},
		/**
		 * 发布图文问诊
		 */
		handelRelease() {
			if (this.descriptionIllness) {
				this.teletextParam.Content = this.descriptionIllness;
				this.teletextParam.Images = this.uploadImage.join('|');
				this.$toast.loading('上传中...');
				InquiryRecordApi.addInquiryRecord(this.sourceId, this.teletextParam)
					.then(res => {
						if (res.Code === 0) {
							this.$toast.success('问诊上传成功');
							this.$router.push({
								path: '/mother/interrogation-rapid-interrogation',
								query: {
									source_id: this.sourceId,
									steps: 2,
									consult_type: 0
								}
							});
						}
					})
					.finally(this.$toast.clear);
			} else {
				this.$toast.fail('请描述您的病情和症状!');
			}
		},
		/**
		 * 图片上传
		 */
		uploadImages(file) {
			this.$toast.loading('上传中...');
			let files = [];
			// 多图处理
			if (file instanceof Array) {
				files = file.map(item => {
					return {
						content: item.content,
						name: item.file.name
					};
				});
			} else {
				files.push({
					content: file.content,
					name: file.file.name
				});
			}
			// 统一多图上传
			UploadApi.UploadImages(files)
				.then(data => {
					if (data.Code === 0) {
						Object.keys(data.Body).forEach(key => {
							this.uploadImage.push(data.Body[key]);
						});
					}
				})
				.finally(this.$toast.clear);
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-interrogation-teletext';
.@{inner-prefix} {
	background: #f8f8f8;
	height: 100%;
	&-body {
		padding-top: 5px;
		padding-bottom: 25px;
		height: calc(100% - 78px);
		overflow: scroll;
		.interrogation-person-info {
			padding: 15px 21px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			span:first-child {
				color: #666666;
			}
			span:last-child {
				display: flex;
				align-items: center;
			}
		}
		.description-illness {
			margin-top: 5px;
			padding: 15px 21px 15px 21px;
			.title {
				color: #000000;
			}
			.text {
				margin-top: 5px;
				.van-cell {
					padding-left: 0;
					padding-right: 0;
				}
			}
			.tips {
				font-size: 12px;
				color: #999999;
				margin-top: 9px;
			}
			.pic {
				margin-top: 20px;
				display: flex;
				align-items: center;
				.van-uploader__upload {
					border: 1px dashed #ef749b;
				}
				label {
					font-size: 12px;
					color: #999999;
				}
			}
		}
		.reminder {
			padding: 23px 16px;
			span {
				display: block;
			}
			span:first-child {
				color: #000000;
			}
			span:last-child {
				font-size: 13px;
				color: #666666;
				line-height: 23px;
				padding: 14px 0 0 3px;
			}
		}
		.doctorinfo-button {
			margin-top: 45px;
			background: #ffb2bf;
			box-shadow: 0px 3px 6px rgba(249, 219, 229, 1);
			color: #ffffff;
			border-radius: 10px;
			left: 27px;
			font-size: 16px;
			width: 325px;
			height: 45px;
		}
	}
}
</style>
