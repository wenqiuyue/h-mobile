<template>
	<div>
		<van-nav-bar title="授权测试" />
		<van-button type="default" block @click="authHandler">关联微信</van-button>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { Auth } from '../../../commons/weixin';
import types from '../../../commons/types';

export default {
	name: 'auth-test',
	computed: {
		...mapState({
			token: state => state[types.TOKEN]
		})
	},
	methods: {
		authHandler() {
			Auth(this.token, '/auth-test');
		}
	}
};
</script>

<style scoped></style>
