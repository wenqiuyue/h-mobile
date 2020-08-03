<template>
	<div :class="classRoot">
		<van-nav-bar title="发表评价" left-arrow @click-left="$router.back()">
			<!-- <template #right>
				<span class="release" @click="handelRelease">发布</span>
			</template> -->
		</van-nav-bar>
		<div :class="`${classRoot}-body`">
			<div class="evaluate">
				<div class="evaluate-title">
					<span>您对医生的服务满意吗？</span
					><span v-if="false"
						>匿名提交
						<van-checkbox
							v-model="anonymousChecked"
							checked-color="#F7BA2A"
							icon-size="14px"
						></van-checkbox>
					</span>
				</div>
				<!-- 医生介绍 -->
				<div
					class="evaluate-doctor-info"
					v-if="doctorInfo"
					@click="handledoctorInfo"
				>
					<span>
						<span>
							<van-image
								v-if="doctorInfo.MedicalStaff.Avatar"
								round
								width="38px"
								height="38px"
								fit="cover"
								:src="doctorInfo.MedicalStaff.Avatar"
							/>
							<svg-icon
								v-else
								value="icon-Headportrait"
								:size="2.9"
								class="doctor-pic"
							/>
						</span>
						<span class="info">
							<div class="name">
								{{ doctorInfo.MedicalStaff.Name }}
								<label
									v-for="(type, index) in doctorInfo.MedicalStaff
										.MedicalStaffOfType"
									:key="index"
								>
									| {{ type.MedicalStaffType.MedicalStaffTypeName }}</label
								>
							</div>
							<div class="introduce">
								介绍：{{
									doctorInfo.MedicalStaff.Introduction
										? doctorInfo.MedicalStaff.Introduction.replace(
												/&lt;.+?&gt;/g,
												''
										  )
										: '暂无介绍'
								}}
							</div>
						</span>
					</span>
					<van-icon name="arrow" color="#F082A5" />
				</div>
				<!-- 评分 -->
				<div class="evaluate-score">
					评分
					<van-rate
						v-model="scoreValue"
						allow-half
						void-icon="star"
						void-color="#eee"
					/>
				</div>
				<!-- 标签 -->
				<div class="evaluate-tag">
					<van-tag
						plain
						round
						:class="
							selTagsArray.indexOf(tag.PositiveTagID) === -1
								? 'init-tag'
								: 'sel-tag'
						"
						v-for="(tag, index) in positiveTagsData"
						:key="index"
						@click="selTag(tag)"
						>{{ tag.Name }}</van-tag
					>
				</div>
				<!-- 文字评价 -->
				<div class="evaluate-text">
					<van-field
						v-model="evaluateText"
						rows="7"
						autosize
						type="textarea"
						placeholder="请在这里写下对医生的评价"
					/>
				</div>
				<van-button class="release-button" @click="handelRelease"
					>发布</van-button
				>
			</div>
		</div>
	</div>
</template>
<script>
import _ from 'lodash';
import * as OnlineDoctorApi from '../../../apis/OnlineDoctorApi';
import * as InquiryCommitsApi from '../../../apis/InquiryCommitsApi';
import * as PositiveTagsApi from '../../../apis/PositiveTagsApi';

export default {
	name: 'interrogation-publication-evaluation',
	data() {
		return {
			scoreValue: 5,
			evaluateText: null, // 文字评价
			fileList: [],
			anonymousChecked: true,
			doctorInfo: null, // 医生信息
			positiveTagsData: null, // 所有标签
			selTagsArray: [], // 被选择的标签
			releaseParam: {
				// 发布评论的参数
				InquiryRecordID: this.$route.query.inquiry_record_iD, // 咨询id
				OnlineDoctorID: null, // 在线医生id
				Score: null, // 分数
				Content: null, // 评价内容
				PositiveTags: null // 标签
			},
			onlineDoctorID: this.$route.query.online_doctor_id // 咨询医生id
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		this.getDoctorInfo();
	},
	methods: {
		/**
		 * 获取医生和评价标签数据
		 *
		 */
		getDoctorInfo() {
			const methods = [
				OnlineDoctorApi.GetDoctor(this.onlineDoctorID),
				PositiveTagsApi.getPositiveTags()
			];
			this.$toast.loading('加载中...');
			Promise.all(methods)
				.then(result => {
					if (result[0].Code === 0 && result[1].Code === 0) {
						this.doctorInfo = result[0].Body;
						this.positiveTagsData = result[1].Body;
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 进入医生详情
		 */
		handledoctorInfo() {
			this.$router.push({
				path: '/mother/interrogation-doctor-info',
				query: {
					doctor_id: this.onlineDoctorID
				}
			});
		},
		/**
		 * 标签选择
		 */
		selTag(tag) {
			if (this.selTagsArray.indexOf(tag.PositiveTagID) === -1) {
				this.selTagsArray.push(tag.PositiveTagID);
			} else {
				this.selTagsArray.forEach((ele, index) => {
					if (ele === tag.PositiveTagID) {
						this.selTagsArray.splice(index, 1);
					}
				});
			}
		},
		/**
		 * 发布评论
		 */
		handelRelease() {
			if (this.evaluateText && this.evaluateText.trim()) {
				this.releaseParam.Score = this.scoreValue * 2;
				this.releaseParam.Content = this.evaluateText;
				this.releaseParam.OnlineDoctorID = this.doctorInfo.OnlineDoctorID;
				this.releaseParam.PositiveTags = _.join(this.selTagsArray, ',');
				this.$toast.loading('正在发布...');
				InquiryCommitsApi.AddInquiryCommits(this.releaseParam)
					.then(res => {
						// eslint-disable-next-line no-console
						console.log(res);
						if (res.Code === 0) {
							this.$toast.success('发布评价成功');
							this.$router.push({
								path: '/mother/interrogation-details-inquiring',
								query: {
									inquiry_record_id: this.releaseParam.InquiryRecordID
								}
							});
						} else {
							this.$toast.fail('发布评价失败，请重试');
						}
					})
					.finally(this.$toast.clear);
			} else {
				this.$toast.fail('您还未写下对医生的评价！');
			}
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-interrogation-publication-evaluation';
.@{inner-prefix} {
	background: #f8f8f8;
	height: 100%;
	.release {
		color: #f082a5;
	}
	&-body {
		height: calc(100% - 57px);
		overflow: scroll;
		padding: 5px;
		.evaluate {
			padding: 25px 13px;
			background: #ffffff;
			.evaluate-title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				span:first-child {
					font-size: 17px;
					color: #000000;
				}
				span:last-child {
					display: flex;
					flex-direction: row;
					.van-checkbox {
						margin-left: 10px;
					}
				}
			}
			.evaluate-doctor-info {
				margin-top: 33px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				background: #fbf5f5;
				border-radius: 23px;
				padding: 16px 15px 16px 20px;
				span:first-child {
					display: flex;
					flex-direction: row;
					.info {
						margin-left: 5px;
						.name {
							label {
								color: #999999;
								font-size: 12px;
							}
						}
						.introduce {
							margin-top: 8px;
							font-size: 12px;
							color: #999999;
							display: -webkit-box;
							-webkit-line-clamp: 1;
							overflow: hidden;
							text-overflow: ellipsis;
							-webkit-box-orient: vertical;
						}
					}
				}
			}
			.evaluate-score {
				display: flex;
				align-items: center;
				font-size: 17px;
				color: #000000;
				margin-top: 25px;
				.van-rate {
					margin-left: 10px;
				}
			}
			.evaluate-tag {
				margin-top: 22px;
				.van-tag {
					font-size: 13px;
					padding: 3px 9px;
					margin: 0 6px 15px 0;
				}
				.sel-tag {
					border-color: #ffd4d4;
					color: #ff8888;
					background: #fff8f8;
				}
				.init-tag {
					color: #999999;
				}
			}
			.evaluate-text {
				background: #fafafa;
				margin-top: 10px;
				border-radius: 10px;
				.van-field {
					background: #fafafa;
					border-radius: 10px;
				}
			}
			.release-button {
				background: @next-button-color;
				box-shadow: @box-shadow;
				color: #ffffff;
				border-radius: 10px;
				font-size: 16px;
				width: 100%;
				height: 45px;
				margin-top: 25px;
			}
		}
	}
}
</style>
