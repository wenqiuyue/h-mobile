<template>
	<div :class="classRoot">
		<van-nav-bar
			title="讲师介绍"
			left-arrow
			@click-left="$router.back()"
		></van-nav-bar>
		<div :class="`${classRoot}-body`" v-if="medicalStaffData">
			<div class="fram-one">
				<div class="fram-tow">
					<div class="introduce">
						<!-- 讲师照片 -->
						<van-image
							width="116"
							height="128"
							class="teacher-pic"
							fit="cover"
							:src="
								medicalStaffData.Avatar
									? medicalStaffData.Avatar
									: require(`../../../assets/mother-school/teacherHead.jpg`)
							"
						/>
						<!-- 讲师基本信息 -->
						<div class="information">
							<span class="introduce-name">{{ medicalStaffData.Name }}</span>
							<span class="introduce-department"
								>{{ medicalStaffData.Departments.DName }}<br />{{
									medicalStaffData.Departments.Hospitals.HName
								}}
							</span>
							<van-tag
								v-for="(type, index) in medicalStaffData.MedicalStaffOfType"
								:key="index"
								plain
								type="danger"
								color="#FCD3D3"
								text-color="#FCA4A4"
								>{{ type.MedicalStaffType.MedicalStaffTypeName }}</van-tag
							>
						</div>
						<!-- 专业特长 -->
						<div class="speciality">
							<div class="speciality-title">
								<svg-icon value="icon-introduce_MedalPrefix" :size="1.5" />
								<span>专业特长</span>
							</div>
							<div class="speciality-main" v-if="medicalStaffData.Introduction">
								{{ medicalStaffData.Introduction.replace(/&lt;.+?&gt;/g, '') }}
							</div>
							<div class="speciality-main" v-else>暂无专业特长介绍</div>
						</div>
						<!-- 个人介绍 -->
						<div class="speciality">
							<div class="speciality-title">
								<svg-icon value="icon-introduce_MedalPrefix" :size="1.5" />
								<span>个人介绍</span>
							</div>
							<div class="speciality-main" v-if="medicalStaffData.Resume">
								{{ medicalStaffData.Resume.replace(/&lt;.+?&gt;/g, '') }}
							</div>
							<div class="speciality-main" v-else>暂无个人介绍</div>
						</div>
						<svg-icon
							class="botton-icon"
							value="icon-introduce_RoundBuckle"
							:size="3"
						/>
					</div>
				</div>
			</div>
			<span class="haspital">{{
				medicalStaffData.Departments.Hospitals.HName
			}}</span>
		</div>
	</div>
</template>
<script>
import * as MedicalStaffApi from '../../../apis/MedicalStaffApi';

export default {
	name: 'teacher-introduction',
	data() {
		return {
			medicalStaffId: this.$route.query.teacher_id, // 讲师id
			medicalStaffData: null // 讲师医务人员详情数据
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		this.getMedicalStaffData();
	},
	methods: {
		/**
		 * 根据讲师id获取讲师详情
		 */
		getMedicalStaffData() {
			MedicalStaffApi.GetMedicalStaffById(this.medicalStaffId).then(res => {
				if (res.Code === 0) {
					this.medicalStaffData = res.Body;
				} else {
					this.$toast.fail(res.Message);
				}
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-teacher-introduction';
.@{inner-prefix} {
	height: 100%;
	[class*='van-hairline']::after {
		border: none;
	}
	&-body {
		height: calc(100% - 132px);
		overflow: scroll;
		background: #ffdede;
		padding: 46px 10px 40px 10px;
		.fram-one {
			background: rgba(255, 255, 255, 0.3);
			border-radius: 10px;
			padding-bottom: 7px;
			box-shadow: 0px 1.5px 3px rgba(254, 125, 125, 0.27);
			.fram-tow {
				background: rgba(255, 255, 255, 0.5);
				border-radius: 10px;
				padding-bottom: 7px;
				box-shadow: 0px 1.5px 3px rgba(249, 92, 92, 0.2);
				.introduce {
					padding: 20px 18px 70px 18px;
					background: #fff;
					border-radius: 10px;
					position: relative;
					box-shadow: 0px 1.5px 3px rgba(249, 125, 125, 0.16);
					.information {
						padding-bottom: 15px;
						.introduce-name {
							display: block;
							font-size: 17px;
							color: #333333;
							font-weight: bold;
							letter-spacing: 3px;
						}
						.introduce-department {
							display: block;
							font-size: 14px;
							color: #999999;
							margin-top: 11px;
						}
						.van-tag {
							padding: 3px 4px;
							margin: 12px 6px 0 0;
							border-radius: 3px;
							font-size: 12px;
							border: 1px solid #fcd3d3;
						}
					}
					.teacher-pic {
						position: absolute;
						top: -35px;
						right: 8px;
						border: 2px solid #fff;
						border-radius: 10px;
						box-shadow: 0 1.5px 3px rgba(0, 0, 0, 0.16);
						img {
							border-radius: 10px;
						}
					}
					.speciality {
						margin-top: 40px;
						.speciality-title {
							display: flex;
							align-items: center;
							span {
								margin-left: 5px;
								font-size: 16px;
								color: #333333;
								font-weight: bold;
								letter-spacing: 1px;
							}
						}
						.speciality-main {
							margin-top: 20px;
							border: 1px solid #fcd3d3;
							padding: 18px 15px;
							font-size: 1rem;
							color: #666666;
							line-height: 23px;
							border-radius: 5px;
						}
					}
					.botton-icon {
						position: absolute;
						left: 158px;
						bottom: -28px;
					}
				}
			}
		}
		.haspital {
			margin-top: 45px;
			display: block;
			margin-left: 37%;
			font-size: 13px;
			color: #666666;
		}
	}
}
</style>
