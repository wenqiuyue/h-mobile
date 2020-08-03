<template>
	<div>
		<van-button @click="buildClick">支付</van-button>
		<ul>
			<li v-for="(item, index) in results" :key="index">
				<pre>{{ JSON.stringify(item) }}</pre>
			</li>
		</ul>
	</div>
</template>
<script>
import { wxPayment } from '../../../commons/weixin';
import { JsPay } from '../../../apis/PaymentApi';
import { Post } from '../../../apis/InquiryRecordApi';

export default {
	name: 'test-pay',
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	},
	data() {
		return {
			results: []
		};
	},
	methods: {
		buildClick() {
			Post({
				CUserID: 178, // 咨询者 UserID
				DUserID: 178, // 医生 UserID
				ConsultType: 0, // 咨询类型
				Content: '测试'
			})
				.then(this.payHandler)
				.catch(error => {
					// eslint-disable-next-line no-console
					console.log(error);
				})
				.then(data => {
					// eslint-disable-next-line no-console
					console.log(data);
				});
		},
		payHandler(data) {
			this.results.push(data);
			return new Promise((resolve, reject) => {
				if (data.Code === 0 && data.Body != null) {
					JsPay(data.Body.OrderNo)
						.then(this.disposeResult)
						.catch(reject);
				} else {
					reject();
				}
			});
		},
		disposeResult(data) {
			this.results.push(data);
			return new Promise((resolve, reject) => {
				if (data.Code === 0) {
					wxPayment(data.Body)
						.then(payData => {
							this.results.push(payData);
							const payMsg = JSON.parse(payData);
							if (payMsg.err_msg === 'get_brand_wcpay_request:ok') {
								alert('成功');
								resolve();
							} else {
								alert('失败');
								reject();
							}
						})
						.catch(reject);
				}
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable';

@inner-prefix: ~'@{prefix}-test-pay';
.@{inner-prefix} {
	margin: unset;
	font-size: 1rem;
}
</style>
