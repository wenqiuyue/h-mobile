<template>
	<div>
		<h1>Promise Test</h1>
		<h2>{{ error }}</h2>
	</div>
</template>
<script>
export default {
	name: 'test-promise',
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		}
	},
	data() {
		return {
			error: null
		};
	},
	created() {
		this.p1(2)
			.catch(error => {
				this.error = error;
			})
			.then(this.p2)
			.then(this.p3)
			.then(res => {
				console.log(res);
			});
	},
	methods: {
		p1(num) {
			// eslint-disable-next-line no-unused-vars
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve(num * 2);
				}, 1000);
				reject(new Error('reject p1'));
			});
		},
		p2(num) {
			// eslint-disable-next-line no-unused-vars
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve(num * 2);
				}, 1000);
			});
		},
		p3(num) {
			// eslint-disable-next-line no-unused-vars
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve(num * 2);
				}, 1000);
			});
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable';

@inner-prefix: ~'@{prefix}-test-chat';
.@{inner-prefix} {
}
</style>
