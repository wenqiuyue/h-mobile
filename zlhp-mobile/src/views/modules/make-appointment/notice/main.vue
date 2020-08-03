<template>
	<div :class="classRoot" v-if="reservationsData">
		<van-nav-bar
			:title="reservationsData.Title"
			left-arrow
			@click-left="$router.back()"
		></van-nav-bar>
		<div :class="`${classRoot}-body`">
			<van-panel class="header-panel">
				<template #header>
					<div class="title">
						<svg-icon value="icon-decorate_tips" :size="1.3" />预约须知
					</div>
					<div class="division">
						<span></span>
						<span></span>
					</div>
					<div class="content" v-html="reservationsData.Notice"></div>
				</template>
			</van-panel>
			<div class="agreement">
				<van-checkbox
					v-model="agreementChecked"
					checked-color="#f59fb0"
					icon-size="18px"
				></van-checkbox>
				<label @click="agreementChecked = !agreementChecked"
					>我已同意相关服务条款</label
				>
			</div>
			<div class="agreement-button">
				<van-button
					:class="agreementChecked ? 'pink_button' : 'gray_button'"
					@click="handleAgree"
					>确认</van-button
				>
			</div>
		</div>
	</div>
</template>
<script>
import * as ReservationsApi from '../../../../apis/ReservationsApi';

export default {
	name: 'notice',
	data() {
		return {
			ReservationId: this.$route.query.reservation_id,
			agreementChecked: false,
			reservationsData: null
		};
	},
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX_MOTHER}-${this.$options.name}`;
		}
	},
	created() {
		this.getNotice();
	},
	methods: {
		/**
		 * 获取须知内容
		 */
		getNotice() {
			this.$toast.loading('加载中...');
			ReservationsApi.getReservationsById(this.ReservationId)
				.then(res => {
					if (res.Code === 0) {
						this.reservationsData = res.Body;
					} else {
						this.$toast.fail(res.Message);
					}
				})
				.finally(this.$toast.clear);
		},
		/**
		 * 确认
		 */
		handleAgree() {
			if (this.agreementChecked) {
				this.$router.push({
					path: '/mother/select-time',
					query: {
						reservation_id: this.reservationsData.ReservationID,
						medical_card_id: this.$route.query.medical_card_id
					}
				});
			} else {
				this.$dialog.alert({
					title: '标题',
					message: '请先同意相关服务条款'
				});
			}
		}
	}
};
</script>
<style lang="less" scoped>
@import '../../../../style/variable.less';

@inner-prefix: ~'@{prefix-mother}-notice';
.@{inner-prefix} {
	height: 100%;
	background: #fff5f5;
	&-body {
		height: calc(100% - 67px);
		overflow: scroll;
		padding: 10px;
		.header-panel {
			border-radius: 5px;
			padding: 12px 15px;
			min-height: 390px;
			.title {
				font-size: 16px;
				color: #000000;
				display: flex;
				align-items: center;
				svg {
					margin-right: 5px;
				}
			}
			.division {
				margin-top: 15px;
				display: flex;
				flex-direction: row;
				align-items: center;

				border: 1.3px dashed #ff7979;
				span {
					background: #fff5f5;
					height: 16px;
					width: 16px;
					border-radius: 50%;
					position: absolute;
				}
				span:first-child {
					left: -8px;
				}
				span:last-child {
					right: -8px;
				}
			}
			.content {
				padding-top: 10px;
				color: #666666;
				font-size: 14px;
				line-height: 30px;
			}
		}
		.agreement {
			padding-left: 15px;
			display: flex;
			align-items: center;
			margin-top: 13px;
			label {
				font-size: 14px;
				color: #000000;
				margin-left: 8px;
			}
		}
		.agreement-button {
			margin-top: 20px;
			text-align: center;
			.van-button {
				width: 325px;
				height: 45px;
				font-size: 16px;
				color: #ffffff;
				box-shadow: @box-shadow;
				border-radius: 5px;
			}
			.pink_button {
				background: @next-button-color;
				border-color: @next-button-color;
			}
			.gray_button {
				border-color: #dddddd;
				background: #dddddd;
			}
		}
	}
}
</style>
