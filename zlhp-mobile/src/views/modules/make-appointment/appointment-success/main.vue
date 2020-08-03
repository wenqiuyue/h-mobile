<template>
	<div :class="classRoot">
		<div :class="`${classRoot}-top`">
			<van-image
				fit="cover"
				:src="
					require(`../../../../assets/${
						registerRecordId
							? 'rocket_launch__monochromatic.svg'
							: 'Appointment-Failed.svg'
					}`)
				"
			/>
			<div class="success_text">
				{{ registerRecordId ? '预约成功' : failTipsData.fail_tips }}
			</div>
			<div class="success_select">
				<span @click="$router.push({ path: '/home' })">返回首页</span
				><span @click="handleInfo">{{
					registerRecordId
						? '查看详情'
						: isCancelData === 1
						? '查看预约'
						: '重新预约'
				}}</span>
			</div>
		</div>
		<div :class="`${classRoot}-tips`">
			<p class="tips_title">
				<svg-icon value="icon-sign_Tips" :size="1.4" />温馨提示：
			</p>
			<p
				v-if="registerRecordId && registerRecordsData"
				v-html="registerRecordsData.Reservations.Guide"
			></p>
			<p v-else-if="failTipsData" v-html="failTipsData.guide"></p>
		</div>
	</div>
</template>
<script>
import * as RegisterRecordsApi from '../../../../apis/RegisterRecordsApi';
import { getSession, removeSession } from '../../../../commons/session';
import types from '../../../../commons/types';

export default {
	name: 'appointment-success',
	data() {
		return {
			registerRecordsData: null, // 预约详情数据
			registerRecordId: this.$route.query.register_record_id,
			isCancelData: this.$route.query.isCancel,
			failTipsData: null // 预约失败的提示数据
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		if (this.registerRecordId) {
			this.getregisterRecordsData();
		} else {
			this.failTipsData = JSON.parse(getSession(types.REGISTER_FAIL_TIPS));
		}
	},
	destroyed() {
		if (this.failTipsData) {
			removeSession(types.REGISTER_FAIL_TIPS);
		}
	},
	methods: {
		/**
		 * 获取预约数据
		 */
		getregisterRecordsData() {
			RegisterRecordsApi.getRegisterRecordsById(this.registerRecordId).then(
				res => {
					if (res.Code === 0) {
						this.registerRecordsData = res.Body;
					} else {
						this.$toast.fail(res.Message);
					}
				}
			);
		},
		/**
		 * 查看详情
		 */
		handleInfo() {
			if (this.registerRecordId) {
				this.$router.push({
					path: '/mother/information-confirmation',
					query: {
						register_record_id: this.registerRecordsData.RegisterRecordID
					}
				});
			} else if (this.isCancelData === 1) {
				this.$router.push({
					path: '/mother/registration-record'
				});
			} else {
				this.$router.back();
			}
		}
	}
};
</script>
<style lang="less" scoped>
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-appointment-success';
.@{inner-prefix} {
	background: #f8f8f8;
	height: 100%;
	&-top {
		text-align: center;
		padding: 37px 0 40px 0;
		background: #ffffff;
		.van-image {
			width: 140px;
			height: 119px;
		}
		.success_text {
			font-size: 18px;
			color: #000000;
			margin: 17px 0 33px 0;
		}
		.success_select {
			display: flex;
			justify-content: space-around;
			font-size: 16px;
			span:first-child {
				color: #999999;
			}
			span:last-child {
				color: #f27198;
			}
		}
	}
	&-tips {
		padding: 30px 25px;
		p {
			margin: 0;
			font-size: 14px;
			color: #666666;
			line-height: 23px;
			margin-top: 7px;
		}
		.tips_title {
			font-size: 16px;
			color: #333333;
			display: flex;
			align-items: center;
			margin-bottom: 15px;
			svg {
				margin-right: 8px;
			}
		}
	}
}
</style>
