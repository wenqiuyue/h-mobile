<template>
	<div></div>
</template>
<script>
import { wxPayment } from '../../../commons/weixin';
import { JsPay } from '../../../apis/PaymentApi';
import { Post } from '../../../apis/InquiryRecordApi';

export default {
	name: 'interrogation-pay-page',
	data() {
		return {
			sourceId: null,
			param: {
				DUserID: null
			},
			typeData: this.$route.query.type
		};
	},
	created() {
		this.interrogationPay();
	},
	methods: {
		/**
		 * 支付
		 */
		interrogationPay() {
			let type = null;
			if (this.typeData === 0 || parseInt(this.typeData, 0) === 0) {
				this.param.DUserID = this.$route.query.duser_id;
				type = 0;
			} else {
				type = 1;
			}
			Post(type, this.param)
				.then(this.payHandler)
				.then(this.disposeResult)
				.then(res => {
					console.log(res);
					// 判断问诊类型跳转相应页面
					if (this.typeData === 0) {
						this.$router.push({
							path: '/mother/interrogation-teletext',
							query: {
								source_id: this.sourceId
							}
						});
					} else {
						this.$router.push({
							path: '/mother/interrogation-rapid-interrogation',
							query: {
								source_id: this.sourceId,
								steps: 2,
								consult_type: 1
							}
						});
					}
				})
				.catch(error => {
					alert(error);
					console.log(error);
					this.$router.back();
				});
		},
		payHandler(data) {
			return new Promise((resolve, reject) => {
				if (data.Code === 0 && data.Body != null) {
					this.sourceId = data.Body.SourceID;
					JsPay(data.Body.OrderNo)
						.then(resolve)
						.catch(reject);
				} else {
					reject(new Error(data.Message));
				}
			});
		},
		disposeResult(data) {
			return new Promise((resolve, reject) => {
				if (data.Code === 0) {
					wxPayment(data.Body)
						.then(payData => {
							const payMsg = JSON.parse(payData);
							if (payMsg.err_msg === 'get_brand_wcpay_request:ok') {
								resolve(payData);
							} else {
								reject(new Error(payMsg.errMsg));
							}
						})
						.catch(reject);
				} else {
					reject(new Error('支付失败！'));
				}
			});
		}
	}
};
</script>
