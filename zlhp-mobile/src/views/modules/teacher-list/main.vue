<template>
	<div :class="classRoot">
		<van-nav-bar
			title="讲师列表"
			left-arrow
			@click-left="$router.back()"
		></van-nav-bar>
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
				@load="getAllTeacher"
			>
				<div v-if="teacherList && teacherList.length">
					<van-card
						v-for="item in teacherList"
						:key="item.MedicalStaffOfTypeID"
						@click="teacherInfo(item.MedicalStaffID)"
					>
						<div slot="thumb">
							<van-image
								v-if="item.Avatar"
								round
								width="5rem"
								height="5rem"
								:src="item.Avatar"
								fit="cover"
							/>
							<svg-icon
								v-else
								value="icon-Headportrait"
								:size="5"
								class="doctor-pic"
							/>
						</div>
						<div slot="title" class="teacher-name">
							{{ item.Name }}
							<van-tag
								v-for="(type, index) in item.MedicalStaffOfType"
								:key="index"
								plain
								type="danger"
								color="#FCD3D3"
								text-color="#FCA4A4"
								>{{ type.MedicalStaffType.MedicalStaffTypeName }}</van-tag
							>
						</div>
						<div slot="desc" class="department">
							<span
								>{{ item.Departments.Hospitals.HName }}
								{{ item.Departments.DName }}</span
							>
							<div class="speciality">
								擅长：{{
									item.Introduction
										? item.Introduction.replace(/&lt;.+?&gt;/g, '')
										: '暂无介绍'
								}}
							</div>
						</div>
					</van-card>
				</div>
				<hint v-else-if="!loading" message="这里好冷清，没有任何讲师" />
			</van-list>
		</van-pull-refresh>
	</div>
</template>
<script>
import * as MedicalStaffApi from '../../../apis/MedicalStaffApi';

export default {
	name: 'teacher-list',
	data() {
		return {
			loading: false,
			finished: false,
			error: false,
			refreshing: false,
			teacherList: [], // 讲师列表
			page: 0,
			limit: 10
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {},
	methods: {
		/**
		 * 刷新
		 */
		onRefresh() {
			this.teacherList = [];
			this.finished = false;
			this.loading = true;
			this.getAllTeacher();
		},
		/**
		 * 获取讲师列表
		 */
		getAllTeacher() {
			if (this.refreshing) {
				this.teacherList = [];
				this.refreshing = false;
			}
			this.page = Math.floor(this.teacherList.length / this.limit) + 1;
			MedicalStaffApi.All(this.page, this.limit)
				.then(res => {
					if (res.Code === 0) {
						this.teacherList.push(...res.Body);
						if (res.Body.length !== this.limit) {
							this.finished = true;
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
		 * 讲师详情
		 */
		teacherInfo(id) {
			this.$router.push({
				path: '/mother/teacher-introduction',
				query: {
					teacher_id: id
				}
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-teacher-list';
.@{inner-prefix} {
	height: 100%;
	&-body {
		height: calc(100% - 70px);
		overflow: scroll;
		background: #f8f8f8;
		padding: 10px 5px;
		.van-card {
			background: #ffffff;
			padding: 12px 22px 15px 20px;
			.teacher-name {
				font-size: 17px;
				display: flex;
				align-items: center;
				color: #000000;
				.van-tag {
					margin-left: 10px;
					font-size: 10px;
					border-radius: 3px;
				}
			}
			.department {
				margin-top: 8px;
				span {
					font-size: 13px;
					color: #bbbbbb;
				}
				.speciality {
					font-size: 13px;
					color: #888888;
					margin-top: 8px;
					line-height: 20px;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					overflow: hidden;
					text-overflow: ellipsis;
					-webkit-box-orient: vertical;
				}
			}
		}

		.van-card:not(:first-child) {
			margin-top: 5px;
		}
	}
}
</style>
