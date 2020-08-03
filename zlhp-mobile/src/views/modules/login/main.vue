<template>
	<div :class="classRoot"></div>
</template>
<script>
import { getSession } from '../../../commons/session';
import types from '../../../commons/types';
import * as weixin from '../../../commons/weixin';

export default {
	name: 'login',
	computed: {
		classRoot() {
			return `${process.env.VUE_APP_PREFIX}-${this.$options.name}`;
		},
		token() {
			return this.$route.query.token;
		}
	},
	created() {
		this.handleCheckToken();
	},
	methods: {
		/**
		 * 页面跳转
		 */
		handleSkip() {
			const prevRoute = JSON.parse(getSession(types.PREV_ROUTE));
			this.$router.push(prevRoute || { path: '/home' });
		},
		/**
		 * 验证Token
		 */
		handleCheckToken() {
			if (this.token) {
				this.$store.dispatch(types.TOKEN, this.token).then(this.handleSkip);
			} else {
				weixin.Login();
			}
		}
	}
};
</script>
<style lang="less">
@import '../../../style/variable.less';
@inner-prefix: ~'@{prefix}-login';
.@{inner-prefix} {
}
</style>
